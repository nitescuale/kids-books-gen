import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

const SwipeNavigator = ({ 
  children, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  onGoToStep,
  canGoNext, 
  canGoPrev,
  className = '' 
}) => {
  const containerRef = useRef(null);
  const [showProgressDots, setShowProgressDots] = useState(true);

  const { swipeHandlers, isDragging, dragOffset } = useSwipeGesture({
    onSwipeLeft: canGoNext ? onNext : undefined,
    onSwipeRight: canGoPrev ? onPrev : undefined,
    threshold: 80,
    resistance: 0.2,
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (canGoPrev) onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (canGoNext) onNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoNext, canGoPrev, onNext, onPrev]);

  // Handle scroll-based progress dots visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.7; // Hide dots when scrolled down 70% of viewport height

      setShowProgressDots(scrollTop < threshold);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Calculate transform for current screen and drag
  // Container is 400% wide, so each step moves 25% of the container (100% of viewport)
  const baseTranslateX = -currentStep * 25; 
  const dragTranslateX = isDragging && containerRef.current ? 
    (dragOffset / (containerRef.current.offsetWidth / 4)) * 25 : 0;
  const totalTranslateX = baseTranslateX + dragTranslateX;

  return (
    <div className={`swipe-navigator ${className}`}>
      {/* Navigation Arrows */}
      {canGoPrev && (
        <button
          className="nav-arrow nav-arrow-left"
          onClick={onPrev}
          aria-label="Previous step"
          type="button"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {canGoNext && (
        <button
          className="nav-arrow nav-arrow-right"
          onClick={onNext}
          aria-label="Next step"
          type="button"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Progress Dots */}
      <div
        className={`progress-dots ${showProgressDots ? 'visible' : 'hidden'}`}
        style={{
          opacity: showProgressDots ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: showProgressDots ? 'auto' : 'none'
        }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const getThemeClass = () => {
            switch (index) {
              case 0: return 'character';
              case 1: return 'setting';
              case 2: return 'lesson';
              case 3: return 'confirmation';
              default: return '';
            }
          };

          return (
            <button
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''} ${getThemeClass()}`}
              onClick={() => onGoToStep && onGoToStep(index)}
              aria-label={`Go to step ${index + 1}`}
              type="button"
            />
          );
        })}
      </div>

      {/* Screens Container */}
      <div
        ref={containerRef}
        className="screens-container"
        data-current-step={currentStep}
        {...swipeHandlers}
        style={{
          transform: `translateX(${totalTranslateX}%)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeNavigator;