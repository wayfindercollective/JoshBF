'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimatedIconProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollAnimatedIcon({ children, delay = 0 }: ScrollAnimatedIconProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              
              // Animate SVG paths - calculate actual path lengths
              const svgPaths = entry.target.querySelectorAll('.icon-path[stroke]');
              svgPaths.forEach((path, index) => {
                const svgPath = path as SVGPathElement | SVGCircleElement | SVGRectElement | SVGLineElement;
                let length = 0;
                
                // Create a temporary SVG to measure path length accurately
                const svg = svgPath.ownerSVGElement;
                if (svg) {
                  if (svgPath instanceof SVGPathElement) {
                    length = svgPath.getTotalLength();
                  } else if (svgPath instanceof SVGCircleElement) {
                    // Convert circle to path for accurate length calculation
                    const cx = parseFloat(svgPath.getAttribute('cx') || '12');
                    const cy = parseFloat(svgPath.getAttribute('cy') || '12');
                    const r = parseFloat(svgPath.getAttribute('r') || '10');
                    
                    // Create a temporary path element to measure
                    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const pathData = `M ${cx - r},${cy} A ${r},${r} 0 1,0 ${cx + r},${cy} A ${r},${r} 0 1,0 ${cx - r},${cy}`;
                    tempPath.setAttribute('d', pathData);
                    svg.appendChild(tempPath);
                    length = tempPath.getTotalLength();
                    svg.removeChild(tempPath);
                  } else if (svgPath instanceof SVGRectElement) {
                    // Convert rectangle to path for accurate length calculation
                    const x = parseFloat(svgPath.getAttribute('x') || '0');
                    const y = parseFloat(svgPath.getAttribute('y') || '0');
                    const width = parseFloat(svgPath.getAttribute('width') || '0');
                    const height = parseFloat(svgPath.getAttribute('height') || '0');
                    
                    // Create a temporary path element to measure perimeter
                    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const pathData = `M ${x},${y} L ${x + width},${y} L ${x + width},${y + height} L ${x},${y + height} Z`;
                    tempPath.setAttribute('d', pathData);
                    svg.appendChild(tempPath);
                    length = tempPath.getTotalLength();
                    svg.removeChild(tempPath);
                  } else if (svgPath instanceof SVGLineElement) {
                    // For lines, calculate distance
                    const x1 = parseFloat(svgPath.getAttribute('x1') || '0');
                    const y1 = parseFloat(svgPath.getAttribute('y1') || '0');
                    const x2 = parseFloat(svgPath.getAttribute('x2') || '0');
                    const y2 = parseFloat(svgPath.getAttribute('y2') || '0');
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                  }
                  
                  if (length > 0) {
                    // Set initial state
                    svgPath.style.strokeDasharray = `${length}`;
                    svgPath.style.strokeDashoffset = `${length}`;
                    
                    // Trigger animation with slight delay for stagger
                    setTimeout(() => {
                      requestAnimationFrame(() => {
                        svgPath.style.transition = `stroke-dashoffset 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                        svgPath.style.strokeDashoffset = '0';
                      });
                    }, index * 50);
                  }
                }
              });
              
              // Animate border
              const borderWrapper = entry.target.querySelector('.icon-wrapper') as HTMLElement;
              if (borderWrapper) {
                requestAnimationFrame(() => {
                  borderWrapper.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
                  borderWrapper.style.transition = 'clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                  setTimeout(() => {
                    borderWrapper.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                  }, 50);
                });
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [delay]);

  return (
    <div ref={containerRef} className={`icon-container ${isVisible ? 'animate' : ''}`}>
      {children}
    </div>
  );
}

