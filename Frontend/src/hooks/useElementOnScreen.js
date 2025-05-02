import { useState, useEffect, useRef } from "react";

/**
 * Custom hook that detects when an element is visible in the viewport
 * using the Intersection Observer API
 *
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility needed to trigger (0-1)
 * @param {boolean} options.triggerOnce - Whether to unobserve after first detection
 * @returns {Array} - [ref, isVisible] where ref is the element reference and isVisible is a boolean
 */
const useElementOnScreen = (options = { threshold: 0, triggerOnce: false }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Update state when intersection status changes
      setIsVisible(entry.isIntersecting);

      // Unobserve after first detection if triggerOnce is true
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup function
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [containerRef, isVisible];
};

export default useElementOnScreen;
