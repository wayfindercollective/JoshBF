'use client';

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';

type AnimationType = 
  | 'fade-up' 
  | 'fade-in' 
  | 'scale-in' 
  | 'slide-left' 
  | 'slide-right'
  | 'typewriter'
  | 'build-up'
  | 'stagger-children';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  staggerDelay?: number; // For stagger-children animation
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  className = '',
  staggerDelay = 100,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerAnimation = useCallback(() => {
    if (hasAnimated) return;
    
    setIsVisible(true);
    setHasAnimated(true);
    
    // Handle stagger-children animation
    if (animation === 'stagger-children' && containerRef.current) {
      const childElements = containerRef.current.children;
      Array.from(childElements).forEach((child, index) => {
        const element = child as HTMLElement;
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * staggerDelay);
      });
    }
    
    // Handle typewriter animation
    if (animation === 'typewriter' && containerRef.current) {
      const textElements = containerRef.current.querySelectorAll('.typewriter-text');
      textElements.forEach((element, index) => {
        const text = element.textContent || '';
        element.textContent = '';
        element.classList.add('typing');
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex < text.length) {
            element.textContent += text[charIndex];
            charIndex++;
          } else {
            clearInterval(typeInterval);
            element.classList.remove('typing');
            element.classList.add('typed');
          }
        }, 50 + (index * 20));
      });
    }
  }, [animation, hasAnimated, staggerDelay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              triggerAnimation();
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px -50px 0px',
      }
    );

    // Check initial visibility after DOM is ready
    const checkAndObserve = () => {
      if (!containerRef.current || hasAnimated) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isInViewport = rect.top < windowHeight + 200 && rect.bottom > -200;
      
      if (isInViewport) {
        // Element is already visible, animate immediately
        setTimeout(() => {
          triggerAnimation();
        }, delay);
      } else {
        // Element is not visible yet, observe it
        observer.observe(containerRef.current);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      setTimeout(checkAndObserve, 50);
    });

    const currentContainer = containerRef.current;

    return () => {
      cancelAnimationFrame(rafId);
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [delay, triggerAnimation, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal reveal-${animation} ${isVisible ? 'visible' : ''} ${className}`}
      style={{
        '--animation-duration': `${duration}s`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
