"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TitleWithBorderProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export default function TitleWithBorder({ 
  children, 
  className = "",
  padding = "px-6 py-4"
}: TitleWithBorderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dimensionsLockedRef = useRef(false);

  useEffect(() => {
    const updateDimensions = () => {
      // Measure the content container directly - wrap tightly around text content
      if (contentRef.current) {
        // Find the actual text content element (the div with text-center)
        const textElement = contentRef.current.querySelector('div');
        if (textElement) {
          // Measure the actual text content dimensions
          const textRect = textElement.getBoundingClientRect();
          const textScrollWidth = textElement.scrollWidth;
          const textScrollHeight = textElement.scrollHeight;
          
          // Get padding values from the container
          const containerStyles = window.getComputedStyle(contentRef.current);
          const paddingLeft = parseFloat(containerStyles.paddingLeft) || 0;
          const paddingRight = parseFloat(containerStyles.paddingRight) || 0;
          const paddingTop = parseFloat(containerStyles.paddingTop) || 0;
          const paddingBottom = parseFloat(containerStyles.paddingBottom) || 0;
          
          // Use the actual text dimensions, add padding, and minimal buffer for tight wrapping
          const borderBuffer = 2; // Small buffer to prevent text from touching border
          const textWidth = Math.max(textRect.width, textScrollWidth);
          const textHeight = Math.max(textRect.height, textScrollHeight);
          
          // Calculate dimensions: text size + padding + minimal buffer
          const width = textWidth + paddingLeft + paddingRight + borderBuffer;
          const height = textHeight + paddingTop + paddingBottom + borderBuffer;
          
          if (width > 0 && height > 0) {
            setDimensions({ width, height });
            setIsReady(true);
            if (!dimensionsLockedRef.current && width > 10 && height > 10) {
              dimensionsLockedRef.current = true;
            }
          }
          return;
        }
        
        // Fallback: measure container directly if text element not found
        const rect = contentRef.current.getBoundingClientRect();
        const scrollWidth = contentRef.current.scrollWidth;
        const scrollHeight = contentRef.current.scrollHeight;
        
        const containerStyles = window.getComputedStyle(contentRef.current);
        const paddingLeft = parseFloat(containerStyles.paddingLeft) || 0;
        const paddingRight = parseFloat(containerStyles.paddingRight) || 0;
        const paddingTop = parseFloat(containerStyles.paddingTop) || 0;
        const paddingBottom = parseFloat(containerStyles.paddingBottom) || 0;
        
        const borderBuffer = 2;
        const width = Math.max(rect.width, scrollWidth) + borderBuffer;
        const height = Math.max(rect.height, scrollHeight) + borderBuffer;
        
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          setIsReady(true);
          if (!dimensionsLockedRef.current && width > 10 && height > 10) {
            dimensionsLockedRef.current = true;
          }
        }
      }
    };

    // Multiple attempts to ensure content is fully rendered (including animations)
    // Wait longer to ensure CharacterPopIn animations complete
    const timeoutId1 = setTimeout(updateDimensions, 200);
    const timeoutId2 = setTimeout(updateDimensions, 800);
    const timeoutId3 = setTimeout(updateDimensions, 1500);
    const timeoutId4 = setTimeout(updateDimensions, 2000); // Extra delay for CharacterPopIn animations
    
    // Use ResizeObserver to catch any late content changes
    const resizeObserver = new ResizeObserver(() => {
      if (!dimensionsLockedRef.current) {
        updateDimensions();
      }
    });
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    // Only observe window resize for locked dimensions
    const handleResize = () => {
      dimensionsLockedRef.current = false;
      updateDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  // Use consistent border width for path calculation (always use visible width)
  const pathBorderWidth = 5;
  const displayBorderWidth = isVisible ? 5 : 4;
  const halfBorder = pathBorderWidth / 2;
  const w = dimensions.width;
  const h = dimensions.height;
  
  // Create path that goes clockwise: top → right → bottom → left
  const pathData = w > 0 && h > 0
    ? `M ${halfBorder},${halfBorder} L ${w - halfBorder},${halfBorder} L ${w - halfBorder},${h - halfBorder} L ${halfBorder},${h - halfBorder} Z`
    : '';
  
  // Calculate total path length using consistent border width
  const pathLength = w > 0 && h > 0 
    ? (w - pathBorderWidth) + (h - pathBorderWidth) + (w - pathBorderWidth) + (h - pathBorderWidth)
    : 0;

  // Update path and SVG when dimensions change
  useEffect(() => {
    if (!isReady || pathLength === 0) return;
    
    if (pathRef.current && pathData) {
      pathRef.current.setAttribute('d', pathData);
      pathRef.current.setAttribute('stroke-dasharray', `${pathLength}`);
    }
    
    if (svgRef.current) {
      svgRef.current.setAttribute('width', `${dimensions.width}`);
      svgRef.current.setAttribute('height', `${dimensions.height}`);
    }
  }, [pathData, pathLength, isReady, dimensions]);

  // Reset animation function
  const resetAnimation = useCallback(() => {
    if (!pathRef.current || pathLength === 0) return;
    
    const path = pathRef.current;
    
    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // Recalculate dimensions one more time before animating to ensure accuracy
    if (contentRef.current) {
      // Measure text content precisely for tight wrapping
      const textElement = contentRef.current.querySelector('div');
      if (textElement) {
        const textRect = textElement.getBoundingClientRect();
        const textScrollWidth = textElement.scrollWidth;
        const textScrollHeight = textElement.scrollHeight;
        
        const containerStyles = window.getComputedStyle(contentRef.current);
        const paddingLeft = parseFloat(containerStyles.paddingLeft) || 0;
        const paddingRight = parseFloat(containerStyles.paddingRight) || 0;
        const paddingTop = parseFloat(containerStyles.paddingTop) || 0;
        const paddingBottom = parseFloat(containerStyles.paddingBottom) || 0;
        
        const borderBuffer = 2;
        const textWidth = Math.max(textRect.width, textScrollWidth);
        const textHeight = Math.max(textRect.height, textScrollHeight);
        const width = textWidth + paddingLeft + paddingRight + borderBuffer;
        const height = textHeight + paddingTop + paddingBottom + borderBuffer;
        
        if (width > 0 && height > 0 && (width !== dimensions.width || height !== dimensions.height)) {
          setDimensions({ width, height });
        }
        return;
      }
      
      // Fallback: measure container directly
      const rect = contentRef.current.getBoundingClientRect();
      const scrollWidth = contentRef.current.scrollWidth;
      const scrollHeight = contentRef.current.scrollHeight;
      
      const borderBuffer = 2;
      const width = Math.max(rect.width, scrollWidth) + borderBuffer;
      const height = Math.max(rect.height, scrollHeight) + borderBuffer;
      
      if (width > 0 && height > 0 && (width !== dimensions.width || height !== dimensions.height)) {
        setDimensions({ width, height });
      }
    }
    
    // Force reset: remove transition, set to hidden, force reflow
    path.style.transition = 'none';
    path.style.strokeDashoffset = `${pathLength}`;
    
    // Force a reflow to ensure the reset is applied
    requestAnimationFrame(() => {
      // Small delay to ensure the reset is fully applied before animating
      animationTimeoutRef.current = setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = 'stroke-dashoffset 2.5s ease-in-out, stroke-width 0.3s ease, filter 0.3s ease';
          pathRef.current.style.strokeDashoffset = '0';
        }
      }, 10);
    });
  }, [pathLength, dimensions]);

  // Handle scroll-triggered visibility - track both entering and leaving viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element entered viewport - reset hasAnimated so animation can play again
            setIsVisible(true);
            // Reset hasAnimated when entering viewport so animation can play
            setHasAnimated(false);
          } else {
            // Element left viewport - reset animation state and visual
            setIsVisible(false);
            setHasAnimated(false);
            // Reset the animation visually
            if (pathRef.current && pathLength > 0) {
              pathRef.current.style.transition = 'none';
              pathRef.current.style.strokeDashoffset = `${pathLength}`;
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentContainer = containerRef.current;
    observer.observe(currentContainer);

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [pathLength]);

  // Handle visibility state changes - trigger animation when visible
  useEffect(() => {
    if (!isReady || pathLength === 0 || !pathRef.current) return;
    
    if (isVisible && !hasAnimated) {
      // Wait for CharacterPopIn animation to complete before starting border animation
      // CharacterPopIn typically takes ~1-2 seconds depending on text length
      const delay = setTimeout(() => {
        // Ensure animation is reset before playing
        if (pathRef.current) {
          pathRef.current.style.transition = 'none';
          pathRef.current.style.strokeDashoffset = `${pathLength}`;
          
          // Force reflow
          requestAnimationFrame(() => {
            if (pathRef.current) {
              pathRef.current.style.transition = 'stroke-dashoffset 2.5s ease-in-out, stroke-width 0.3s ease, filter 0.3s ease';
              pathRef.current.style.strokeDashoffset = '0';
              setHasAnimated(true);
            }
          });
        }
      }, 1500); // Wait for CharacterPopIn to complete
      
      return () => {
        clearTimeout(delay);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [isVisible, isReady, pathLength, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className={`inline-block relative ${className} w-auto`}
    >
      <div ref={contentRef} className={`relative inline-block ${padding} w-auto`}>
        {/* Animated SVG border - positioned to match content area */}
        {isReady && dimensions.width > 0 && dimensions.height > 0 && pathData && (
          <svg
            ref={svgRef}
            className="absolute pointer-events-none"
            width={dimensions.width}
            height={dimensions.height}
            style={{ 
              overflow: 'visible',
              top: 0,
              left: 0,
            }}
          >
            <path
              ref={pathRef}
              d={pathData}
              fill="none"
              stroke="#ffffff"
              strokeWidth={displayBorderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              style={{
                filter: isVisible ? "drop-shadow(0 0 20px rgba(255,255,255,0.7))" : "none",
              }}
            />
          </svg>
        )}
        {children}
      </div>
    </div>
  );
}
