/**
 * Bottom-nav glyphs: Home, Categories, Reorder, Print.
 *
 * Each icon supplies an outline layer and a solid layer drawn on the shared
 * 24-unit grid from `iconSystem`, plus one short micro-gesture that carries the
 * meaning of the tab. Knockouts use compound `fillRule="evenodd"` paths so they
 * stay transparent over any background.
 */

import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import {
  BLEED,
  CAP,
  Crossfade,
  GAP,
  ICON_COLORS,
  IconFrame,
  IconSvg,
  JOIN,
  STROKE,
  u,
  useTabIconMotion,
} from "./iconSystem";

/* ------------------------------------------------------------------ Home --- */

const HOME_ROOF = "M3.1 11.5 L12 4.0 L20.9 11.5";
const HOME_BODY =
  "M5.4 10.4 V18.1 A1.8 1.8 0 0 0 7.2 19.9 H16.8 A1.8 1.8 0 0 0 18.6 18.1 V10.4";

/**
 * Merged roof + body silhouette with the window knocked out (evenodd).
 * Edges are pulled in by the outline layer's half stroke (0.875) so both
 * layers share the same outer silhouette and the crossfade doesn't shift.
 */
const HOME_SOLID =
  "M12 3.45 L21.2 11.5 L19.0 11.5 L19.0 18.55 A1.8 1.8 0 0 1 17.2 20.35 " +
  "L6.8 20.35 A1.8 1.8 0 0 1 5.0 18.55 L5.0 11.5 L2.8 11.5 Z " +
  "M11.2 14.4 H12.8 A1 1 0 0 1 13.8 15.4 V18.75 A1 1 0 0 1 12.8 19.75 " +
  "H11.2 A1 1 0 0 1 10.2 18.75 V15.4 A1 1 0 0 1 11.2 14.4 Z";

export function HomeTabIcon({ focused, size = 24, reduceMotion = false }) {
  const { fill, unfill, pop, lift, gesture } = useTabIconMotion(
    focused,
    reduceMotion
  );

  const solidStyle = useMemo(
    () => ({
      transform: [
        {
          scale: gesture.interpolate({
            inputRange: [0, 1],
            outputRange: [0.86, 1],
          }),
        },
      ],
    }),
    [gesture]
  );

  return (
    <IconFrame size={size} pop={pop} lift={lift}>
      <Crossfade
        size={size}
        fill={fill}
        unfill={unfill}
        solidStyle={solidStyle}
        outline={
          <>
            <Path
              d={HOME_ROOF}
              stroke={ICON_COLORS.idle}
              strokeWidth={STROKE}
              strokeLinecap={CAP}
              strokeLinejoin={JOIN}
            />
            <Path
              d={HOME_BODY}
              stroke={ICON_COLORS.idle}
              strokeWidth={STROKE}
              strokeLinecap={CAP}
              strokeLinejoin={JOIN}
            />
          </>
        }
        solid={
          <Path
            d={HOME_SOLID}
            fill={ICON_COLORS.active}
            fillRule="evenodd"
            stroke={ICON_COLORS.active}
            strokeWidth={0.9}
            strokeLinejoin={JOIN}
          />
        }
      />
    </IconFrame>
  );
}

/* ------------------------------------------------------------ Categories --- */

/* Spaced so the outline strokes clear each other, and sized so the two rows
 * fill the same outer span as the other three glyphs. */
const TILE = 7.125;
const TILE_RADIUS = 1.8;
const TILE_ORIGIN = 3.75;
const TILE_STEP = TILE + GAP;
const TILE_SOLID = TILE + BLEED * 2;
const TILE_SOLID_RADIUS = TILE_RADIUS + BLEED;

const TILES = [
  { x: TILE_ORIGIN, y: TILE_ORIGIN },
  { x: TILE_ORIGIN + TILE_STEP, y: TILE_ORIGIN },
  { x: TILE_ORIGIN, y: TILE_ORIGIN + TILE_STEP },
  { x: TILE_ORIGIN + TILE_STEP, y: TILE_ORIGIN + TILE_STEP },
];

const TILE_STAGGER = 40;

export function CategoriesTabIcon({
  focused,
  size = 24,
  reduceMotion = false,
}) {
  const { fill, unfill, pop, lift } = useTabIconMotion(focused, reduceMotion);

  const tiles = useRef(
    TILES.map(() => new Animated.Value(focused ? 1 : 0))
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      tiles.forEach((v) => v.setValue(focused ? 1 : 0));
      return undefined;
    }

    const running = focused
      ? Animated.stagger(
          TILE_STAGGER,
          tiles.map((v) =>
            Animated.spring(v, {
              toValue: 1,
              friction: 5,
              tension: 220,
              useNativeDriver: true,
            })
          )
        )
      : Animated.parallel(
          tiles.map((v) =>
            Animated.timing(v, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            })
          )
        );

    running.start();
    return () => running.stop();
  }, [focused, tiles, reduceMotion]);

  const tilePx = u(size, TILE_SOLID);

  /* Animated nodes are derived once so re-renders never rebuild the graph. */
  const tileStyles = useMemo(
    () =>
      TILES.map((tile, i) => ({
        position: "absolute",
        left: u(size, tile.x - BLEED),
        top: u(size, tile.y - BLEED),
        width: tilePx,
        height: tilePx,
        opacity: Animated.multiply(fill, tiles[i]),
        transform: [
          {
            scale: tiles[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 1],
            }),
          },
        ],
      })),
    [fill, tiles, size, tilePx]
  );

  return (
    <IconFrame size={size} pop={pop} lift={lift}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: unfill }]}>
        <IconSvg size={size}>
          {TILES.map((tile, i) => (
            <Rect
              key={i}
              x={tile.x}
              y={tile.y}
              width={TILE}
              height={TILE}
              rx={TILE_RADIUS}
              stroke={ICON_COLORS.idle}
              strokeWidth={STROKE}
            />
          ))}
        </IconSvg>
      </Animated.View>

      {TILES.map((tile, i) => (
        <Animated.View key={i} pointerEvents="none" style={tileStyles[i]}>
          <Svg
            width={tilePx}
            height={tilePx}
            viewBox={`0 0 ${TILE_SOLID} ${TILE_SOLID}`}
            fill="none"
          >
            <Rect
              x={0}
              y={0}
              width={TILE_SOLID}
              height={TILE_SOLID}
              rx={TILE_SOLID_RADIUS}
              fill={ICON_COLORS.active}
            />
          </Svg>
        </Animated.View>
      ))}
    </IconFrame>
  );
}

/* --------------------------------------------------------------- Reorder --- */

/*
 * A clock face reads instantly at 24px and pairs cleanly with the outline /
 * solid system, unlike a circular arrow — a stroked arc and a filled arc are
 * the same shape, so there would be no state to fade to. The dial is
 * rotationally symmetric, which lets the sweep gesture rotate the whole glyph
 * and animate only the hands.
 */
const DIAL_RADIUS = 7.325;
const REORDER_HANDS = "M12 7.6 V12 H15.3";
const REORDER_SWEEP = "-150deg";

/*
 * Filled dial with the hands knocked out. The hands are expressed as the
 * outline of the stroked polyline above — a single closed, non-self-crossing
 * subpath — so `evenodd` can subtract them without needing an SVG mask.
 */
const REORDER_SOLID =
  "M12 3.8 A8.2 8.2 0 1 1 12 20.2 A8.2 8.2 0 1 1 12 3.8 Z " +
  "M11.125 7.6 A0.875 0.875 0 0 1 12.875 7.6 L12.875 11.125 L15.3 11.125 " +
  "A0.875 0.875 0 0 1 15.3 12.875 L12 12.875 " +
  "A0.875 0.875 0 0 1 11.125 12 Z";

export function ReorderTabIcon({ focused, size = 24, reduceMotion = false }) {
  const { fill, unfill, pop, lift, gesture } = useTabIconMotion(
    focused,
    reduceMotion
  );

  const sweepStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: gesture.interpolate({
            inputRange: [0, 1],
            outputRange: [REORDER_SWEEP, "0deg"],
          }),
        },
      ],
    }),
    [gesture]
  );

  return (
    <IconFrame size={size} pop={pop} lift={lift}>
      <Animated.View style={[StyleSheet.absoluteFill, sweepStyle]}>
        <Crossfade
          size={size}
          fill={fill}
          unfill={unfill}
          outline={
            <>
              <Circle
                cx={12}
                cy={12}
                r={DIAL_RADIUS}
                stroke={ICON_COLORS.idle}
                strokeWidth={STROKE}
              />
              <Path
                d={REORDER_HANDS}
                stroke={ICON_COLORS.idle}
                strokeWidth={STROKE}
                strokeLinecap={CAP}
                strokeLinejoin={JOIN}
              />
            </>
          }
          solid={
            <Path
              d={REORDER_SOLID}
              fill={ICON_COLORS.active}
              fillRule="evenodd"
            />
          }
        />
      </Animated.View>
    </IconFrame>
  );
}

/* ----------------------------------------------------------------- Print --- */

/*
 * A wide body flanked by two half-width pages. The width hierarchy is what
 * makes this read as a printer rather than three stacked bars, so the body
 * spans the full safe box and stays only lightly rounded.
 */
const PRINT_PAPER = { x: 7.6, y: 2.9, w: 8.8, h: 4.2, r: 1.2 };
const PRINT_BODY = { x: 2.9, y: 9.4, w: 18.2, h: 6.4, r: 1.9 };
const PRINT_PAGE = { x: 7.6, y: 18.1, w: 8.8, h: 3.0, r: 1.1 };

/* The printed page is revealed by a clip just under the solid body. */
const PAGE_CLIP_TOP = 17.0;
const PAGE_CLIP_BOTTOM = PRINT_PAGE.y + PRINT_PAGE.h + BLEED;
const PAGE_TRAVEL = PAGE_CLIP_BOTTOM - PAGE_CLIP_TOP;

/** Loaded paper grown by BLEED, with two text lines knocked out (evenodd). */
const PRINT_PAPER_SOLID =
  "M8.8 2.025 H15.2 A2.075 2.075 0 0 1 17.275 4.1 V5.9 " +
  "A2.075 2.075 0 0 1 15.2 7.975 H8.8 A2.075 2.075 0 0 1 6.725 5.9 " +
  "V4.1 A2.075 2.075 0 0 1 8.8 2.025 Z " +
  "M9.25 3.6 H14.35 A0.45 0.45 0 0 1 14.35 4.5 H9.25 A0.45 0.45 0 0 1 9.25 3.6 Z " +
  "M9.25 5.5 H12.35 A0.45 0.45 0 0 1 12.35 6.4 H9.25 A0.45 0.45 0 0 1 9.25 5.5 Z";

/** Body grown by BLEED, with the status light knocked out (evenodd). */
const PRINT_BODY_SOLID =
  "M4.8 8.525 H19.2 A2.775 2.775 0 0 1 21.975 11.3 V13.9 " +
  "A2.775 2.775 0 0 1 19.2 16.675 H4.8 A2.775 2.775 0 0 1 2.025 13.9 " +
  "V11.3 A2.775 2.775 0 0 1 4.8 8.525 Z " +
  "M6.0 11.75 A0.85 0.85 0 1 1 6.0 13.45 A0.85 0.85 0 1 1 6.0 11.75 Z";

/** Printed page grown by BLEED. */
const PRINT_PAGE_SOLID =
  "M8.7 17.225 H15.3 A1.975 1.975 0 0 1 17.275 19.2 V20.0 " +
  "A1.975 1.975 0 0 1 15.3 21.975 H8.7 A1.975 1.975 0 0 1 6.725 20.0 " +
  "V19.2 A1.975 1.975 0 0 1 8.7 17.225 Z";

export function PrintTabIcon({ focused, size = 24, reduceMotion = false }) {
  const { fill, unfill, pop, lift, gesture } = useTabIconMotion(
    focused,
    reduceMotion
  );

  /* Grid coords are kept aligned inside the clip by offsetting the canvas. */
  const pageStyle = useMemo(
    () => ({
      marginTop: -u(size, PAGE_CLIP_TOP),
      transform: [
        {
          translateY: gesture.interpolate({
            inputRange: [0, 1],
            outputRange: [-u(size, PAGE_TRAVEL), 0],
          }),
        },
      ],
    }),
    [gesture, size]
  );

  return (
    <IconFrame size={size} pop={pop} lift={lift}>
      <Crossfade
        size={size}
        fill={fill}
        unfill={unfill}
        outline={
          <>
            {[PRINT_PAPER, PRINT_BODY, PRINT_PAGE].map((s, i) => (
              <Rect
                key={i}
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                rx={s.r}
                stroke={ICON_COLORS.idle}
                strokeWidth={STROKE}
              />
            ))}
          </>
        }
        solid={
          <>
            <Path
              d={PRINT_PAPER_SOLID}
              fill={ICON_COLORS.active}
              fillRule="evenodd"
            />
            <Path
              d={PRINT_BODY_SOLID}
              fill={ICON_COLORS.active}
              fillRule="evenodd"
            />
          </>
        }
      />

      {/* The printed page slides down out of the body, clipped by its edge. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          top: u(size, PAGE_CLIP_TOP),
          width: size,
          height: u(size, PAGE_TRAVEL),
          overflow: "hidden",
          opacity: fill,
        }}
      >
        <Animated.View style={pageStyle}>
          <IconSvg size={size}>
            <Path d={PRINT_PAGE_SOLID} fill={ICON_COLORS.active} />
          </IconSvg>
        </Animated.View>
      </Animated.View>
    </IconFrame>
  );
}

/* ------------------------------------------------------------------------- */

export const TAB_ICONS = {
  Home: HomeTabIcon,
  Categories: CategoriesTabIcon,
  OrderAgain: ReorderTabIcon,
  Print: PrintTabIcon,
};
