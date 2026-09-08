/**
 * Shared foundation for the bottom-nav icon set.
 *
 * Every glyph is drawn on a 24-unit grid, with all artwork kept inside a
 * centred 20-unit safe box so the four icons read at identical optical size.
 * Selection is a crossfade between an outline layer and a solid layer at a
 * constant stroke weight — never a stroke-width change, which reads as jitter.
 *
 * All animation stays on view-level opacity/transform so it can run on the
 * native driver; animating react-native-svg props would force it off.
 */

import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg from "react-native-svg";
import { colors } from "../../theme/colors";

export const GRID = 24;
export const SAFE = 20;
export const VIEW_BOX = `0 0 ${GRID} ${GRID}`;

export const STROKE = 1.75;
export const CAP = "round";
export const JOIN = "round";

/**
 * A stroke straddles its path, so an outline shape reads half a stroke larger
 * than the same shape filled. Solid layers grow by this much to keep both
 * layers on one silhouette — otherwise selecting a tab visibly shrinks the icon.
 */
export const BLEED = STROKE / 2;

/**
 * Minimum distance between the paths of two stacked shapes. Anything below a
 * full stroke width fuses their edges into a single thick bar at 24px.
 */
export const GAP = STROKE + 0.55;

export const ICON_COLORS = {
  idle: colors.textMuted,
  active: colors.accent,
};

export const MOTION = {
  fillIn: 180,
  fillOut: 130,
  easing: Easing.out(Easing.cubic),
  pop: { friction: 5, tension: 220 },
  popFrom: 0.86,
  lift: -1.5,
  gesture: 420,
};

/** Grid units -> pixels for the current render size. */
export function u(size, units) {
  return (units / GRID) * size;
}

/**
 * Single source of timing for every tab icon.
 *
 * `fill`    0 -> 1 outline-to-solid crossfade
 * `unfill`  inverse of `fill`, for the outline layer
 * `pop`     spring scale on select
 * `lift`    small upward nudge tied to `fill`
 * `gesture` 0 -> 1 icon-specific micro-gesture; rests at 1 when unfocused so
 *           the idle frame is always the settled pose
 */
export function useTabIconMotion(focused, reduceMotion) {
  const fill = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const gesture = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      fill.setValue(focused ? 1 : 0);
      pop.setValue(1);
      gesture.setValue(1);
      return undefined;
    }

    const anims = [
      Animated.timing(fill, {
        toValue: focused ? 1 : 0,
        duration: focused ? MOTION.fillIn : MOTION.fillOut,
        easing: MOTION.easing,
        useNativeDriver: true,
      }),
    ];

    if (focused) {
      pop.setValue(MOTION.popFrom);
      gesture.setValue(0);
      anims.push(
        Animated.spring(pop, {
          toValue: 1,
          ...MOTION.pop,
          useNativeDriver: true,
        }),
        Animated.timing(gesture, {
          toValue: 1,
          duration: MOTION.gesture,
          easing: MOTION.easing,
          useNativeDriver: true,
        })
      );
    } else {
      gesture.setValue(1);
    }

    const running = Animated.parallel(anims);
    running.start();
    return () => running.stop();
  }, [focused, fill, pop, gesture, reduceMotion]);

  const unfill = useMemo(() => Animated.subtract(1, fill), [fill]);
  const lift = useMemo(
    () =>
      fill.interpolate({
        inputRange: [0, 1],
        outputRange: [0, MOTION.lift],
      }),
    [fill]
  );

  return { fill, unfill, pop, lift, gesture };
}

/** A grid-aligned SVG canvas at the requested pixel size. */
export function IconSvg({ size, children }) {
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
      {children}
    </Svg>
  );
}

/** Outer wrapper carrying the shared select pop and lift. */
export function IconFrame({ size, pop, lift, children }) {
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ scale: pop }, { translateY: lift }],
      }}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Two co-registered SVG layers crossfaded by `fill`. Because both layers share
 * the same grid and stroke weight, the transition reads as the glyph filling in
 * rather than as two different icons swapping.
 */
export function Crossfade({ size, fill, unfill, outline, solid, solidStyle }) {
  return (
    <Animated.View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: unfill }]}>
        <IconSvg size={size}>{outline}</IconSvg>
      </Animated.View>
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: fill }, solidStyle]}
      >
        <IconSvg size={size}>{solid}</IconSvg>
      </Animated.View>
    </Animated.View>
  );
}
