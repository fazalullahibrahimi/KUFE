import { useState, useEffect } from "react";

/**
 * Custom hook for creating count-up animations
 * @param {Object} options - Configuration options
 * @param {number} options.start - Starting value (default: 0)
 * @param {number} options.end - Ending value
 * @param {number} options.duration - Animation duration in ms (default: 2000)
 * @param {number} options.delay - Delay before animation starts in ms (default: 0)
 * @param {boolean} options.enabled - Whether the animation should run (default: true)
 * @returns {Object} - The current count value
 */
const useCountUp = ({
  start = 0,
  end = 100,
  duration = 2000,
  delay = 0,
  enabled = true,
}) => {
  const [countUp, setCountUp] = useState(enabled ? start : end);

  useEffect(() => {
    let animationFrameId;
    let startTime;

    // Don't run the animation if not enabled
    if (!enabled) {
      setCountUp(end);
      return;
    }

    // Delay the start of the animation if needed
    const timeoutId = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smoother animation (ease-out)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        // Calculate the current value
        const currentValue = start + (end - start) * easedProgress;
        setCountUp(currentValue);

        // Continue the animation if not complete
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, delay);

    // Clean up
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [start, end, duration, delay, enabled]);

  return { countUp };
};

export default useCountUp;
