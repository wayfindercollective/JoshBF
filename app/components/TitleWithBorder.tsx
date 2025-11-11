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
  const [isHovered, setIsHovered] = useState(false);
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
      // Measure the content container directly
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const scrollWidth = contentRef.current.scrollWidth;
        const scrollHeight = contentRef.current.scrollHeight;
        
        // Use the larger of bounding rect or scroll dimensions
        const width = Math.max(rect.width, scrollWidth);
        const height = Math.max(rect.height, scrollHeight);
        
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
    const timeoutId1 = setTimeout(updateDimensions, 200);
    const timeoutId2 = setTimeout(updateDimensions, 600);
    const timeoutId3 = setTimeout(updateDimensions, 1000);
    const timeoutId4 = setTimeout(updateDimensions, 1500); // Extra delay for CharacterPopIn animations
    
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

  // Use consistent border width for path calculation (always use hover width)
  const pathBorderWidth = 5;
  const displayBorderWidth = isHovered ? 5 : 4;
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
    
    // Force reset: remove transition, set to hidden, force reflow
    path.style.transition = 'none';
    path.style.strokeDashoffset = `${pathLength}`;
    
    // Force a reflow to ensure the reset is applied
    // Use requestAnimationFrame instead of offsetHeight for SVG elements
    requestAnimationFrame(() => {
      // Small delay to ensure the reset is fully applied before animating
      animationTimeoutRef.current = setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = 'stroke-dashoffset 2.5s ease-in-out, stroke-width 0.3s ease, filter 0.3s ease';
          pathRef.current.style.strokeDashoffset = '0';
        }
      }, 10);
    });
  }, [pathLength]);

  // Handle hover state changes
  useEffect(() => {
    if (!isReady || pathLength === 0 || !pathRef.current) return;
    
    if (isHovered) {
      resetAnimation();
    } else {
      // Clear any pending animation
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      if (pathRef.current) {
        pathRef.current.style.transition = 'stroke-dashoffset 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease';
        pathRef.current.style.strokeDashoffset = `${pathLength}`;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [isHovered, isReady, pathLength, resetAnimation]);

  return (
    <div
      ref={containerRef}
      className={`inline-block relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={contentRef} className={`relative ${padding}`}>
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
                filter: isHovered ? "drop-shadow(0 0 20px rgba(255,255,255,0.7))" : "none",
              }}
            />
          </svg>
        )}
        {children}
      </div>
    </div>
  );
}
