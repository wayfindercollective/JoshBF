'use client';

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';

type RandomDirection = 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface RandomScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  randomDelay?: boolean; // Add random delay to each element
  forceDirection?: RandomDirection; // Force a specific direction, otherwise random
}

// Generate random direction
const getRandomDirection = (): RandomDirection => {
  const directions: RandomDirection[] = ['left', 'right', 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  return directions[Math.floor(Math.random() * directions.length)];
};

// Get transform values for direction
const getDirectionTransform = (direction: RandomDirection): { x: number; y: number } => {
  const distance = 80 + Math.random() * 40; // Random distance between 80-120px
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'top':
      return { x: 0, y: -distance };
    case 'bottom':
      return { x: 0, y: distance };
    case 'top-left':
      return { x: -distance * 0.7, y: -distance * 0.7 };
    case 'top-right':
      return { x: distance * 0.7, y: -distance * 0.7 };
    case 'bottom-left':
      return { x: -distance * 0.7, y: distance * 0.7 };
    case 'bottom-right':
      return { x: distance * 0.7, y: distance * 0.7 };
    default:
      return { x: 0, y: 0 };
  }
};

export default function RandomScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  randomDelay = true,
  forceDirection,
}: RandomScrollRevealProps) {
  // Initialize with default values to avoid hydration mismatch
  // Random values will be set in useEffect on client side
  const [direction, setDirection] = useState<RandomDirection>(forceDirection || 'bottom');
  const [transform, setTransform] = useState(() => ({ x: 0, y: 100 }));
  const [rotation, setRotation] = useState(() => 0);
  const [scale, setScale] = useState(() => 0.65);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const triggerAnimation = useCallback(() => {
    const randomDir = forceDirection || getRandomDirection();
    const transformValues = getDirectionTransform(randomDir);
    const randomRotation = (Math.random() - 0.5) * 20; // -10 to 10 degrees
    const randomScale = 0.5 + Math.random() * 0.3; // 0.5 to 0.8
    
    setDirection(randomDir);
    setTransform(transformValues);
    setRotation(randomRotation);
    setScale(randomScale);
    
    // Reset animation state
    setIsVisible(false);
    hasAnimatedRef.current = false;
    
    // Trigger animation with random delay
    const animDelay = randomDelay ? delay + Math.random() * 300 : delay;
    setTimeout(() => {
      setIsVisible(true);
      hasAnimatedRef.current = true;
    }, animDelay);
  }, [delay, randomDelay, forceDirection]);

  // Initialize random values on client side only
  useEffect(() => {
    if (!isMounted) {
      const initialDir = forceDirection || getRandomDirection();
      setDirection(initialDir);
      setTransform(getDirectionTransform(initialDir));
      setRotation((Math.random() - 0.5) * 20);
      setScale(0.5 + Math.random() * 0.3);
      setIsMounted(true);
    }
  }, [isMounted, forceDirection]);

  useEffect(() => {
    if (!isMounted) return;
    
    const checkVisibility = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Check if element is completely out of viewport (above or below)
      const isCompletelyAbove = rect.bottom < 0;
      const isCompletelyBelow = rect.top > windowHeight;
      const isInViewport = rect.top < windowHeight && rect.bottom > 0;
      
      if (isInViewport && !hasAnimatedRef.current) {
        // Element is in viewport and hasn't animated yet
        triggerAnimation();
      } else if ((isCompletelyAbove || isCompletelyBelow) && hasAnimatedRef.current) {
        // Element has completely left the viewport - reset for next time
        setIsVisible(false);
        hasAnimatedRef.current = false;
        // Generate new random values for next animation
        const randomDir = forceDirection || getRandomDirection();
        const transformValues = getDirectionTransform(randomDir);
        const randomRotation = (Math.random() - 0.5) * 20;
        const randomScale = 0.5 + Math.random() * 0.3;
        setDirection(randomDir);
        setTransform(transformValues);
        setRotation(randomRotation);
        setScale(randomScale);
      }
    };

    // Check on scroll - throttled for performance
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        checkVisibility();
        scrollTimeout = null;
      }, 100); // Throttle to 100ms
    };

    // Initial check
    checkVisibility();

    // Use IntersectionObserver for efficiency - this is the primary method
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          checkVisibility();
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '100px', // Add margin to trigger slightly before viewport
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    // Only add scroll listener as fallback - IntersectionObserver should handle most cases
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [triggerAnimation, forceDirection, isMounted]);

  return (
    <div
      ref={containerRef}
      className={`random-scroll-reveal ${className}`}
      style={{
        '--animation-duration': `${duration}s`,
        '--translate-x': `${transform.x}px`,
        '--translate-y': `${transform.y}px`,
        '--rotation': `${rotation}deg`,
        '--scale': scale,
        opacity: isVisible || !isMounted ? 1 : 0,
        transform: isVisible || !isMounted
          ? 'translate(0, 0) rotate(0deg) scale(1)' 
          : `translate(${transform.x}px, ${transform.y}px) rotate(${rotation}deg) scale(${scale})`,
        transition: isMounted 
          ? `opacity var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1), transform var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1)`
          : 'none',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

