import { useCallback, useRef, useState } from 'react';

export const useSwipeGesture = ({ onSwipeLeft, onSwipeRight, threshold = 50, resistance = 0.3 }) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !touchStartX.current || !touchStartY.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Prevent vertical scrolling if horizontal gesture is detected
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
    }

    // Apply resistance when dragging beyond threshold
    let adjustedDiffX = diffX;
    if (Math.abs(diffX) > threshold) {
      const excess = Math.abs(diffX) - threshold;
      const resistedExcess = excess * resistance;
      adjustedDiffX = (diffX > 0 ? 1 : -1) * (threshold + resistedExcess);
    }

    setDragOffset(adjustedDiffX);
  }, [isDragging, threshold, resistance]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || touchStartX.current === null) return;

    const finalOffset = dragOffset;
    
    if (Math.abs(finalOffset) > threshold) {
      if (finalOffset > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (finalOffset < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset state
    touchStartX.current = null;
    touchStartY.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, threshold, onSwipeLeft, onSwipeRight]);

  const handleMouseDown = useCallback((e) => {
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    setIsDragging(true);
    setDragOffset(0);
    
    // Prevent text selection during drag
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || touchStartX.current === null) return;

    const diffX = e.clientX - touchStartX.current;
    const diffY = e.clientY - touchStartY.current;

    // Only handle horizontal gestures
    if (Math.abs(diffX) < Math.abs(diffY)) return;

    // Apply resistance when dragging beyond threshold
    let adjustedDiffX = diffX;
    if (Math.abs(diffX) > threshold) {
      const excess = Math.abs(diffX) - threshold;
      const resistedExcess = excess * resistance;
      adjustedDiffX = (diffX > 0 ? 1 : -1) * (threshold + resistedExcess);
    }

    setDragOffset(adjustedDiffX);
  }, [isDragging, threshold, resistance]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || touchStartX.current === null) return;

    const finalOffset = dragOffset;
    
    if (Math.abs(finalOffset) > threshold) {
      if (finalOffset > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (finalOffset < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset state
    touchStartX.current = null;
    touchStartY.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, threshold, onSwipeLeft, onSwipeRight]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: isDragging ? handleMouseMove : undefined,
    onMouseUp: isDragging ? handleMouseUp : undefined,
    onMouseLeave: isDragging ? handleMouseUp : undefined,
  };

  return {
    swipeHandlers,
    isDragging,
    dragOffset,
  };
};