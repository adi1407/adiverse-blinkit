import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll → collapse chrome / glass without flooding React renders.
 * Hysteresis: hide upper chrome past `threshold`, restore only near top.
 */
export default function useScrollGlass({
  threshold = 28,
  restoreBelow = 8,
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const rafRef = useRef(null);
  const pendingRef = useRef(null);

  const flush = useCallback(() => {
    rafRef.current = null;
    const next = pendingRef.current;
    if (next == null) return;
    if (next === scrolledRef.current) return;
    scrolledRef.current = next;
    setScrolled(next);
  }, []);

  const onScroll = useCallback(
    (event) => {
      const y = event?.nativeEvent?.contentOffset?.y ?? 0;
      let next = scrolledRef.current;
      if (!scrolledRef.current && y > threshold) next = true;
      else if (scrolledRef.current && y <= restoreBelow) next = false;

      pendingRef.current = next;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(flush);
    },
    [flush, threshold, restoreBelow]
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return { scrolled, onScroll };
}
