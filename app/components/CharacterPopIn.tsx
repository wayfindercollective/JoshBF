'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface CharacterPopInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function CharacterPopIn({
  children,
  delay = 0,
  className = '',
}: CharacterPopInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Store original text first
    if (containerRef.current && !containerRef.current.getAttribute('data-original-text')) {
      containerRef.current.setAttribute('data-original-text', containerRef.current.textContent || '');
    }

    const animateCharacters = () => {
      if (!containerRef.current) return;
      
      const text = containerRef.current.getAttribute('data-original-text') || containerRef.current.textContent || '';
      const words = text.split(' ');
      
      containerRef.current.innerHTML = '';
      
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.marginRight = '0.25em';
        
        word.split('').forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char === ' ' ? '\u00A0' : char;
          charSpan.style.display = 'inline-block';
          charSpan.style.opacity = '0';
          
          // Random direction for each character
          const directions = ['left', 'right', 'top', 'bottom'];
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const distance = 30 + Math.random() * 20;
          
          let initialTransform = '';
          switch (direction) {
            case 'left':
              initialTransform = `translateX(-${distance}px)`;
              break;
            case 'right':
              initialTransform = `translateX(${distance}px)`;
              break;
            case 'top':
              initialTransform = `translateY(-${distance}px)`;
              break;
            case 'bottom':
              initialTransform = `translateY(${distance}px)`;
              break;
          }
          
          charSpan.style.transform = initialTransform;
          charSpan.style.transition = `opacity 0.3s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`;
          
          wordSpan.appendChild(charSpan);
          
          // Animate character with random delay
          const charDelay = (wordIndex * 50) + (charIndex * 30) + (Math.random() * 100);
          setTimeout(() => {
            charSpan.style.opacity = '1';
            charSpan.style.transform = 'translate(0, 0)';
          }, charDelay);
        });
        
        containerRef.current?.appendChild(wordSpan);
      });
    };

    const resetCharacters = () => {
      if (!containerRef.current) return;
      const originalText = containerRef.current.getAttribute('data-original-text') || '';
      containerRef.current.textContent = originalText;
    };

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
        setTimeout(() => {
          animateCharacters();
          setIsVisible(true);
          hasAnimatedRef.current = true;
        }, delay);
      } else if ((isCompletelyAbove || isCompletelyBelow) && hasAnimatedRef.current) {
        // Element has completely left the viewport - reset for next time
        resetCharacters();
        setIsVisible(false);
        hasAnimatedRef.current = false;
      }
    };

    // Check on scroll
    const handleScroll = () => {
      checkVisibility();
    };

    // Initial check
    checkVisibility();

    // Use IntersectionObserver for efficiency, but also check scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          checkVisibility();
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [delay]);

  return (
    <span
      ref={containerRef}
      className={`character-pop-in ${className}`}
    >
      {children}
    </span>
  );
}
