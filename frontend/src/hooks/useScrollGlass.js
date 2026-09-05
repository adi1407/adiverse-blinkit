import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll → glass navbar without flooding React renders.
 * Uses a boolean threshold + rAF; ignores noisy in-between offsets.
 */
export default function useScrollGlass({ threshold = 28 } = {}) {
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
      const next = y > threshold;
      pendingRef.current = next;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(flush);
    },
    [flush, threshold]
  );

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return { scrolled, onScroll };
}
