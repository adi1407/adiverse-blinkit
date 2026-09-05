import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** Respect OS “Reduce Motion” preference for navbar transitions. */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (alive) setReduced(!!v);
      })
      .catch(() => {});

    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (v) => setReduced(!!v)
    );

    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}
