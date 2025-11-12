"use client";

import { useState, useEffect, useRef } from "react";

interface UpwardLine {
  startY: number; // Starting Y position on the left side
  endY: number;   // Ending Y position (going upward)
}

interface BranchLine {
  startX: number; // Starting X (left side)
  startY: number; // Starting Y (on the upward line)
  endX: number;    // Ending X (branching to the right)
}

// 7 upward lines starting from left side (including the middle one)
// Original spacing for desktop (116.67 units apart)
const upwardLinesDesktop: UpwardLine[] = [
  { startY: 500, endY: 150 },   // Top
  { startY: 500, endY: 267 },   // Upper-mid
  { startY: 500, endY: 383 },   // Mid-upper
  { startY: 500, endY: 500 },   // Middle (the dot that moved from center)
  { startY: 500, endY: 617 },   // Mid-lower
  { startY: 500, endY: 733 },   // Lower-mid
  { startY: 500, endY: 850 },   // Bottom
];

// Increased spacing for mobile (133 units apart)
const upwardLinesMobile: UpwardLine[] = [
  { startY: 500, endY: 100 },   // Top - increased spacing
  { startY: 500, endY: 233 },   // Upper-mid - increased spacing
  { startY: 500, endY: 366 },   // Mid-upper - increased spacing
  { startY: 500, endY: 500 },   // Middle (the dot that moved from center)
  { startY: 500, endY: 634 },   // Mid-lower - increased spacing
  { startY: 500, endY: 767 },   // Lower-mid - increased spacing
  { startY: 500, endY: 900 },   // Bottom - increased spacing
];

// Bonus content text for each dot
const bonusTexts: string[] = [
  "Goal setting workbook",
  "Instinctive breathwork",
  "Purpose clarity journal",
  "Book on how to make progress",
  "Daily reflection prompts",
  "Values alignment guide",
  "Action planning template",
];

// Branch lines going to the right from each upward line endpoint
// End position is where dots appear and where text will start
const LEFT_POSITION = 100; // Moved further left from 200
const BRANCH_END_X = 350; // Moved further left from 450

export default function ExpandingLines() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 500, y: 500 });
  const [dotRadius, setDotRadius] = useState(18); // Start at three times the size (18 instead of 6)
  
  // Use responsive spacing based on screen size
  const upwardLines = isMobile ? upwardLinesMobile : upwardLinesDesktop;
  const branchLines = upwardLines.map((line, index) => ({
    startX: LEFT_POSITION,  // Left side position - moved further left
    startY: line.endY,
    endX: BRANCH_END_X,     // Position where dots appear - text starts here
  }));
  
  const [upwardProgress, setUpwardProgress] = useState<number[]>(new Array(upwardLines.length).fill(0));
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(branchLines.length).fill(0));
  const [priceVisible, setPriceVisible] = useState<boolean[]>(new Array(branchLines.length).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const priceTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll-triggered visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Reset animation when out of view
            setIsVisible(false);
            setDotPosition({ x: 500, y: 500 });
            setDotRadius(18); // Reset to starting size
            setUpwardProgress(new Array(upwardLines.length).fill(0));
            setBranchProgress(new Array(branchLines.length).fill(0));
            setPriceVisible(new Array(branchLines.length).fill(false));
            // Clear any ongoing animations
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            if (priceTimeoutRef.current.length > 0) {
              priceTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
              priceTimeoutRef.current = [];
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Animation sequence: dot appears -> moves left -> upward lines -> branch lines
  useEffect(() => {
    if (!isVisible) {
      // Reset all states when not visible
      setDotPosition({ x: 500, y: 500 });
      setDotRadius(12); // Reset to starting size
      setUpwardProgress(new Array(upwardLines.length).fill(0));
      setBranchProgress(new Array(branchLines.length).fill(0));
      setPriceVisible(new Array(branchLines.length).fill(false));
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    let phase = 0; // 0: dot move left, 1: upward lines, 2: branch lines
    let currentLine = 0;

    // Phase 0: Move dot from center to left
    const moveDotLeft = () => {
      const startTime = performance.now();
      const duration = 500; // Optimized for 4-second total animation
      const startX = 500;
      const endX = LEFT_POSITION; // Use the LEFT_POSITION constant

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 2); // Ease-out

        const currentX = startX + (endX - startX) * easedProgress;
        // Animate radius from 18 (three times size) to 6 (current size)
        const startRadius = 18;
        const endRadius = 6;
        const currentRadius = startRadius + (endRadius - startRadius) * easedProgress;
        
        setDotPosition({ x: currentX, y: 500 });
        setDotRadius(currentRadius);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          phase = 1;
          currentLine = 0;
          timeoutRef.current = setTimeout(() => {
            animateUpwardLines();
          }, 50); // Reduced delay
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 1: Animate upward lines
    const animateUpwardLines = () => {
      if (currentLine >= upwardLines.length) {
        phase = 2;
        currentLine = 0;
        timeoutRef.current = setTimeout(() => {
          animateBranchLines();
        }, 50); // Reduced delay
        return;
      }

      const startTime = performance.now();
      const duration = 100; // Slightly longer for smoother animation

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smoother easing function for more fluid motion
        const easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        setUpwardProgress((prev) => {
          const newProgress = [...prev];
          newProgress[currentLine] = easedProgress;
          return newProgress;
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          currentLine++;
          if (currentLine < upwardLines.length) {
            // Much shorter delay for cascading effect - lines overlap more
            timeoutRef.current = setTimeout(() => {
              animateUpwardLines();
            }, 10); // Reduced delay for more fluent cascading
          } else {
            phase = 2;
            currentLine = 0;
            timeoutRef.current = setTimeout(() => {
              animateBranchLines();
            }, 50); // Reduced delay
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 2: Animate branch lines to the right
    const animateBranchLines = () => {
      if (currentLine >= branchLines.length) {
        // All branch lines complete - trigger price animation
        timeoutRef.current = setTimeout(() => {
          animatePrices();
        }, 200); // Small delay before prices appear
        return;
      }

      const startTime = performance.now();
      const duration = 200; // Optimized for 4-second total animation

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setBranchProgress((prev) => {
          const newProgress = [...prev];
          newProgress[currentLine] = easedProgress;
          return newProgress;
        });

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          currentLine++;
          if (currentLine < branchLines.length) {
            timeoutRef.current = setTimeout(() => {
              animateBranchLines();
            }, 25); // Reduced delay between lines
          } else {
            // All branch lines complete - trigger price animation
            timeoutRef.current = setTimeout(() => {
              animatePrices();
            }, 200); // Small delay before prices appear
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 3: Animate prices appearing one after another
    const animatePrices = () => {
      // Clear any existing price timeouts
      priceTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      priceTimeoutRef.current = [];
      
      // Show first price immediately
      setPriceVisible((prev) => {
        const newPrices = [...prev];
        newPrices[0] = true;
        return newPrices;
      });
      
      // Then show the rest with delays, starting from index 1
      for (let i = 1; i < branchLines.length; i++) {
        const timeoutId = setTimeout(() => {
          setPriceVisible((prev) => {
            const newPrices = [...prev];
            newPrices[i] = true;
            return newPrices;
          });
        }, 80 * i); // 80ms delay for each subsequent price (80ms, 160ms, 240ms, etc.)
        priceTimeoutRef.current.push(timeoutId);
      }
    };

    // Start animation sequence
    timeoutRef.current = setTimeout(() => {
      moveDotLeft();
    }, 100); // Reduced initial delay

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (priceTimeoutRef.current.length > 0) {
        priceTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
        priceTimeoutRef.current = [];
      }
    };
  }, [isVisible, isMobile]);

  return (
    <div ref={containerRef} className="flex items-center justify-start min-h-[400px] sm:min-h-[500px] md:min-h-[600px] py-8 sm:py-10 md:py-12 px-2 sm:px-4 md:px-6">
      <div className="relative w-full max-w-6xl">
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "400px", maxWidth: "100%" }}
          preserveAspectRatio="xMinYMid meet"
        >
          {/* Upward lines from left side */}
          {upwardLines.map((line, index) => {
            const progress = upwardProgress[index] || 0;
            const currentEndY = line.startY + (line.endY - line.startY) * progress;

            return (
              <g key={`upward-${index}`}>
                {/* Main upward line */}
                <line
                  x1={LEFT_POSITION}
                  y1={line.startY}
                  x2={LEFT_POSITION}
                  y2={currentEndY}
                  stroke="#ffffff"
                  strokeWidth={progress > 0 ? 2.5 : 0}
                  strokeOpacity={progress > 0 ? 0.8 : 0}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="round"
                  style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={LEFT_POSITION}
                    y1={line.startY}
                    x2={LEFT_POSITION}
                    y2={currentEndY}
                    stroke="#639df0"
                    strokeWidth={progress > 0 ? 1 : 0}
                    strokeOpacity={progress * 0.4}
                    className="transition-all duration-100 ease-out"
                    strokeLinecap="round"
                    style={{
                      filter: "blur(2px)",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Branch lines going to the right */}
          {branchLines.map((branch, index) => {
            const progress = branchProgress[index] || 0;
            const currentEndX = branch.startX + (branch.endX - branch.startX) * progress;

            return (
              <g key={`branch-${index}`}>
                {/* Main branch line */}
                <line
                  x1={branch.startX}
                  y1={branch.startY}
                  x2={currentEndX}
                  y2={branch.startY}
                  stroke="#ffffff"
                  strokeWidth={progress > 0 ? 2.5 : 0}
                  strokeOpacity={progress > 0 ? 0.8 : 0}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="round"
                  style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={branch.startX}
                    y1={branch.startY}
                    x2={currentEndX}
                    y2={branch.startY}
                    stroke="#639df0"
                    strokeWidth={progress > 0 ? 1 : 0}
                    strokeOpacity={progress * 0.4}
                    className="transition-all duration-100 ease-out"
                    strokeLinecap="round"
                    style={{
                      filter: "blur(2px)",
                    }}
                  />
                )}
                {/* End point indicator */}
                {progress > 0.9 && (
                  <circle
                    cx={branch.endX}
                    cy={branch.startY}
                    r={8}
                    fill="#ffffff"
                    opacity={progress}
                    className="transition-opacity duration-300"
                    style={{
                      filter: "drop-shadow(0 0 12px rgba(255,255,255,0.8))",
                    }}
                  />
                )}
                {/* Pulsing end point */}
                {progress >= 1 && (
                  <circle
                    cx={branch.endX}
                    cy={branch.startY}
                    r={12}
                    fill="none"
                    stroke="#639df0"
                    strokeWidth={2}
                    opacity={0.6}
                    className="animate-pulse"
                    style={{
                      filter: "blur(1px)",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Moving dot */}
          {isVisible && (
            <circle
              cx={dotPosition.x}
              cy={dotPosition.y}
              r={dotRadius}
              fill="#ffffff"
              className="transition-all duration-100 ease-out"
              style={{
                filter: "drop-shadow(0 0 15px rgba(255,255,255,0.9))",
              }}
            />
          )}
        </svg>

        {/* Content areas for each branch - starting from dots, extending to the right */}
        <div className="absolute inset-0 pointer-events-none">
          {branchLines.map((branch, index) => {
            const progress = branchProgress[index] || 0;
            
            // Position content areas starting from the dot position (end of branch line)
            const xPercent = (branch.endX / 1000) * 100;
            const yPercent = (branch.startY / 1000) * 100;

            return (
              <div
                key={index}
                className="absolute pointer-events-auto"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(0%, -50%)',
                  opacity: progress >= 0.9 ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                }}
              >
                {/* Content area - text will start from the dot and extend to the right */}
                <div className="w-32 sm:w-48 md:w-80 lg:w-96 h-auto flex items-center justify-start pl-2 sm:pl-4 md:pl-6">
                  {bonusTexts[index] && (
                    <div className="flex items-center gap-0 whitespace-nowrap">
                      <span 
                        className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl leading-none"
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                          fontWeight: 900,
                          letterSpacing: '0.02em',
                          display: 'inline',
                        }}
                      >
                        {bonusTexts[index]}
                      </span>
                      <span
                        className="text-white font-mono text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold inline-block relative ml-1 sm:ml-2"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                          opacity: priceVisible[index] ? 1 : 0,
                          transform: priceVisible[index] ? 'scale(1)' : 'scale(0.3)',
                          animation: priceVisible[index] ? 'pricePopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                          transformOrigin: 'center',
                          transition: priceVisible[index] ? 'none' : 'opacity 0s, transform 0s',
                          pointerEvents: priceVisible[index] ? 'auto' : 'none',
                          minWidth: 'fit-content',
                          display: 'inline-block',
                          verticalAlign: 'baseline',
                        }}
                      >
                        <span style={{ 
                          position: 'relative',
                          display: 'inline-block',
                        }}>
                          $297
                          {/* Diagonal strikethrough line */}
                          <span
                            style={{
                              position: 'absolute',
                              left: '0%',
                              right: '0%',
                              top: '50%',
                              height: '0.1em',
                              backgroundColor: '#ff0000',
                              transform: 'translateY(-50%) rotate(-15deg)',
                              transformOrigin: 'center',
                              boxShadow: '0 0 4px rgba(255, 0, 0, 0.6)',
                              width: '120%',
                            }}
                          />
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
