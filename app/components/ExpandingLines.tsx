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

// 7 upward lines starting from left side
// Reduced spacing by 20% for tighter animation
const upwardLinesDesktop: UpwardLine[] = [
  { startY: 500, endY: 180 },   // Top (reduced from 150)
  { startY: 500, endY: 284 },   // Upper-mid (reduced from 267)
  { startY: 500, endY: 388 },   // Mid-upper (reduced from 383)
  { startY: 500, endY: 500 },   // Middle (unchanged)
  { startY: 500, endY: 612 },   // Mid-lower (reduced from 617)
  { startY: 500, endY: 724 },   // Lower-mid (reduced from 733)
  { startY: 500, endY: 836 },   // Bottom (reduced from 850)
];

// Increased spacing for mobile (reduced by 20%)
const upwardLinesMobile: UpwardLine[] = [
  { startY: 500, endY: 120 },   // Top (reduced from 100)
  { startY: 500, endY: 246 },   // Upper-mid (reduced from 233)
  { startY: 500, endY: 373 },   // Mid-upper (reduced from 366)
  { startY: 500, endY: 500 },   // Middle (unchanged)
  { startY: 500, endY: 627 },   // Mid-lower (reduced from 634)
  { startY: 500, endY: 754 },   // Lower-mid (reduced from 767)
  { startY: 500, endY: 880 },   // Bottom (reduced from 900)
];

// Bonus content text for each column
const bonusTexts: string[] = [
  "Goal setting workbook",
  "Instinctive breathwork",
  "Purpose clarity journal",
  "Book on how to make progress",
  "Daily reflection prompts",
  "Values alignment guide",
];

// Branch lines going from left to right and right to left, meeting in the middle to create columns
// Reduced horizontal spread by 20% for tighter animation
const LEFT_POSITION = 180; // Left side position (moved in from 100)
const RIGHT_POSITION = 820; // Right side position (moved in from 900)
const CENTER_X = 500; // Center where lines meet, creating columns (unchanged)

export default function ExpandingLines() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use responsive spacing based on screen size
  const upwardLines = isMobile ? upwardLinesMobile : upwardLinesDesktop;
  
  // Left side branch lines - going from left towards center
  const branchLines = upwardLines.map((line) => ({
    startX: LEFT_POSITION,  // Start at left side
    startY: line.endY,
    endX: CENTER_X,         // End at center, meeting right side lines
  }));
  
  // Right side branch lines - going from right towards center
  const branchLinesRight = upwardLines.map((line) => ({
    startX: RIGHT_POSITION,  // Start at right side
    startY: line.endY,
    endX: CENTER_X,         // End at center, meeting left side lines
  }));
  
  const [upwardProgress, setUpwardProgress] = useState<number[]>(new Array(7).fill(0));
  const [upwardProgressRight, setUpwardProgressRight] = useState<number[]>(new Array(7).fill(0));
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(7).fill(0));
  const [branchProgressRight, setBranchProgressRight] = useState<number[]>(new Array(7).fill(0));
  const [textVisible, setTextVisible] = useState<boolean[]>(new Array(7).fill(false));
  const [priceVisible, setPriceVisible] = useState<boolean[]>(new Array(7).fill(false)); // Price for each column
  const [scriptComplete, setScriptComplete] = useState(false); // Track when script animation is complete
  const [verticalLineProgress, setVerticalLineProgress] = useState(0); // Track vertical line animation progress
  const [popInProgress, setPopInProgress] = useState<number[]>(new Array(7).fill(0)); // Track pop-in animation for each item (0-1)
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
            setUpwardProgress(new Array(7).fill(0));
            setUpwardProgressRight(new Array(7).fill(0));
            setBranchProgress(new Array(7).fill(0));
            setBranchProgressRight(new Array(7).fill(0));
            setTextVisible(new Array(7).fill(false));
            setPriceVisible(new Array(7).fill(false));
            setScriptComplete(false);
            setVerticalLineProgress(0);
            setPopInProgress(new Array(7).fill(0));
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

  // Animation sequence: upward lines -> branch lines -> text appears (script-like)
  useEffect(() => {
    if (!isVisible) {
      // Reset all states when not visible
      setUpwardProgress(new Array(7).fill(0));
      setUpwardProgressRight(new Array(7).fill(0));
      setBranchProgress(new Array(7).fill(0));
      setBranchProgressRight(new Array(7).fill(0));
      setTextVisible(new Array(7).fill(false));
      setPriceVisible(new Array(7).fill(false));
      setScriptComplete(false);
      setVerticalLineProgress(0);
      setPopInProgress(new Array(7).fill(0));
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

    let phase = 0; // 0: upward lines, 1: branch lines
    let currentLine = 0;

    // Phase 0: Animate upward lines (both left and right simultaneously)
    const animateUpwardLines = () => {
      if (currentLine >= upwardLines.length) {
        phase = 2;
        currentLine = 0;
        timeoutRef.current = setTimeout(() => {
          animateBranchLines();
        }, 10); // Very fast for 2.5s total animation
        return;
      }

      const startTime = performance.now();
      const duration = 50; // Faster for 2.5s total animation

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
        
        setUpwardProgressRight((prev) => {
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
            }, 5); // Very fast for 2.5s total animation
          } else {
            phase = 1;
            currentLine = 0;
            timeoutRef.current = setTimeout(() => {
              animateBranchLines();
            }, 10); // Very fast for 2.5s total animation
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 1: Animate branch lines (left to right, and right to left simultaneously)
    const animateBranchLines = () => {
      if (currentLine >= branchLines.length) {
        // All branch lines complete - trigger text and price animation
        timeoutRef.current = setTimeout(() => {
          animateTextAndPrices();
        }, 50); // Fast delay for 2.5s total animation
        return;
      }

      const startTime = performance.now();
      const duration = 100; // Faster for 2.5s total animation

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setBranchProgress((prev) => {
          const newProgress = [...prev];
          newProgress[currentLine] = easedProgress;
          return newProgress;
        });
        
        setBranchProgressRight((prev) => {
          const newProgress = [...prev];
          newProgress[currentLine] = easedProgress;
          return newProgress;
        });

        // Show text as line is being drawn (script effect) - when line is 80% complete
        if (easedProgress >= 0.8 && !textVisible[currentLine]) {
          setTextVisible((prev) => {
            const newText = [...prev];
            newText[currentLine] = true;
            return newText;
          });
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          currentLine++;
          if (currentLine < branchLines.length) {
            timeoutRef.current = setTimeout(() => {
              animateBranchLines();
            }, 10); // Very fast for 2.5s total animation
          } else {
            // All branch lines complete - trigger text and price animation
            timeoutRef.current = setTimeout(() => {
              animateTextAndPrices();
            }, 50); // Fast delay for 2.5s total animation
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 2: Mark script as complete and animate vertical line, then pop-in items
    const animateTextAndPrices = () => {
      // Clear any existing price timeouts
      priceTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      priceTimeoutRef.current = [];
      
      // Keep text and prices hidden initially - they will appear with pop-in animation
      // Don't set textVisible or priceVisible here
      
      // After script lines complete, mark script as complete and animate vertical line
      setTimeout(() => {
        setScriptComplete(true);
        // Animate vertical line from top to bottom
        const startTime = performance.now();
        const duration = 150; // Faster for 2.5s total animation
        
        const animateLine = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 2); // Ease-out
          
          setVerticalLineProgress(easedProgress);
          
          if (progress < 1) {
            requestAnimationFrame(animateLine);
          } else {
            // After vertical line completes, start pop-in animation
            setTimeout(() => {
              animatePopIn();
            }, 50); // Fast delay for 2.5s total animation
          }
        };
        
        requestAnimationFrame(animateLine);
      }, 50); // Fast delay for 2.5s total animation
    };

    // Pop-in animation: items pop up in order 0, 1, 2, 3, 4, 5
    const animatePopIn = () => {
      // Animate all indices: 0, 1, 2, 3, 4, 5
      const indices = [0, 1, 2, 3, 4, 5];
      const delayBetweenItems = 20; // Very fast - 20ms between each for 2.5s total
      const popDuration = 100; // 100ms for each pop animation
      
      indices.forEach((index, arrayIndex) => {
        setTimeout(() => {
          const startTime = performance.now();
          
          const animateItem = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / popDuration, 1);
            // Bounce effect: ease-out with slight overshoot
            const easedProgress = progress < 0.6 
              ? 1 - Math.pow(1 - progress / 0.6, 3)
              : 1 + 0.1 * Math.sin((progress - 0.6) * Math.PI / 0.4);
            
            setPopInProgress((prev) => {
              const newProgress = [...prev];
              newProgress[index] = Math.min(easedProgress, 1);
              return newProgress;
            });
            
            if (progress < 1) {
              requestAnimationFrame(animateItem);
            }
          };
          
          requestAnimationFrame(animateItem);
        }, arrayIndex * delayBetweenItems);
      });
    };

    // Start animation sequence
    timeoutRef.current = setTimeout(() => {
      animateUpwardLines();
    }, 50); // Fast initial delay for 2.5s total animation

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
    <div ref={containerRef} className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px] py-8 sm:py-10 md:py-12 px-2 sm:px-4 md:px-6">
      <div className="relative w-full max-w-6xl">
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "400px", maxWidth: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Upward lines from left side */}
          {upwardLines.map((line, index) => {
            const progress = upwardProgress[index] || 0;
            const currentEndY = line.startY + (line.endY - line.startY) * progress;
            // Upward line must extend to exactly where branch line starts for perfect connection
            // All lines extend 1px past line.endY to ensure connection with branch lines
            const upwardEndY = progress >= 1 ? line.endY + 1 : currentEndY;
            const upwardX = LEFT_POSITION;

            return (
              <g key={`upward-left-${index}`}>
                {/* Main upward line */}
                <line
                  x1={upwardX}
                  y1={line.startY}
                  x2={upwardX}
                  y2={upwardEndY}
                  stroke="#ffffff"
                  strokeWidth={progress >= 1 ? 2.5 : (progress > 0 ? 2.5 : 0)}
                  strokeOpacity={progress >= 1 ? 0.8 : (progress > 0 ? 0.8 : 0)}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="butt"
                  style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={upwardX}
                    y1={line.startY}
                    x2={upwardX}
                    y2={upwardEndY}
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

          {/* Upward lines from right side */}
          {upwardLines.map((line, index) => {
            const progress = upwardProgressRight[index] || 0;
            const currentEndY = line.startY + (line.endY - line.startY) * progress;
            // Upward line must extend to exactly where branch line starts for perfect connection
            // All lines extend 1px past line.endY to ensure connection with branch lines
            const upwardEndY = progress >= 1 ? line.endY + 1 : currentEndY;
            const upwardX = RIGHT_POSITION;

            return (
              <g key={`upward-right-${index}`}>
                {/* Main upward line */}
                <line
                  x1={upwardX}
                  y1={line.startY}
                  x2={upwardX}
                  y2={upwardEndY}
                  stroke="#ffffff"
                  strokeWidth={progress >= 1 ? 2.5 : (progress > 0 ? 2.5 : 0)}
                  strokeOpacity={progress >= 1 ? 0.8 : (progress > 0 ? 0.8 : 0)}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="butt"
                  style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={upwardX}
                    y1={line.startY}
                    x2={upwardX}
                    y2={upwardEndY}
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

          {/* Branch lines going to the right (from left side) */}
          {branchLines.map((branch, index) => {
            const progress = branchProgress[index] || 0;
            // Extend to center to ensure connection with right line
            const currentEndX = branch.startX + (branch.endX - branch.startX) * progress;
            const extendedEndX = progress >= 1 ? CENTER_X : currentEndX;
            // Branch line starts at line.endY to connect with upward line
            // Upward line extends to line.endY + 1, so branch starts at line.endY (branch.startY) for perfect connection
            // All lines use consistent connection point
            const branchStartX = branch.startX;
            const branchStartY = branch.startY; // This equals line.endY, upward line extends 1px past this

            return (
              <g key={`branch-left-${index}`}>
                {/* Main branch line */}
                <line
                  x1={branchStartX}
                  y1={branchStartY}
                  x2={extendedEndX}
                  y2={branchStartY}
                  stroke="#ffffff"
                  strokeWidth={progress >= 1 ? 2.5 : (progress > 0 ? 2.5 : 0)}
                  strokeOpacity={progress >= 1 ? 0.8 : (progress > 0 ? 0.8 : 0)}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="butt"
                  style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={branchStartX}
                    y1={branchStartY}
                    x2={extendedEndX}
                    y2={branchStartY}
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

          {/* Branch lines going to the left (from right side) */}
          {branchLinesRight.map((branch, index) => {
            const progress = branchProgressRight[index] || 0;
            // For right side, we animate from right to left, so startX > endX
            // Extend to center to ensure connection with left line
            const currentEndX = branch.startX + (branch.endX - branch.startX) * progress;
            const extendedEndX = progress >= 1 ? CENTER_X : currentEndX;
            // Branch line starts at line.endY to connect with upward line
            // Upward line extends to line.endY + 1, so branch starts at line.endY (branch.startY) for perfect connection
            // All lines use consistent connection point
            const branchStartX = branch.startX;
            const branchStartY = branch.startY; // This equals line.endY, upward line extends 1px past this

            return (
              <g key={`branch-right-${index}`}>
                {/* Main branch line */}
                <line
                  x1={branchStartX}
                  y1={branchStartY}
                  x2={extendedEndX}
                  y2={branchStartY}
                  stroke="#ffffff"
                  strokeWidth={progress >= 1 ? 2.5 : (progress > 0 ? 2.5 : 0)}
                  strokeOpacity={progress >= 1 ? 0.8 : (progress > 0 ? 0.8 : 0)}
                  className="transition-all duration-100 ease-out"
                  strokeLinecap="butt"
                    style={{
                    filter: progress > 0.5 ? "drop-shadow(0 0 8px rgba(255,255,255,0.6))" : "none",
                  }}
                />
                {/* Futuristic glow effect */}
                {progress > 0.3 && (
                  <line
                    x1={branchStartX}
                    y1={branchStartY}
                    x2={extendedEndX}
                    y2={branchStartY}
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

          {/* Distinctive vertical line to the left of prices - only show after script is complete */}
          {isVisible && scriptComplete && (() => {
            // Position vertical line just to the left of prices
            // Prices are at CENTER_X (500) + 200px offset, so line should be at ~500 + 170px
            const verticalLineX = CENTER_X + 170; // Just to the left of prices, moved more to the right
            
            // Calculate top and bottom Y positions based on branch lines (not exceeding outer lines)
            // Use the Y positions of the branch lines (which are at upwardLines.endY)
            const branchYPositions = upwardLines.map(line => line.endY);
            const topY = Math.min(...branchYPositions); // Topmost branch line
            const bottomY = Math.max(...branchYPositions); // Bottommost branch line
            
            // Animate line from top to bottom
            const currentBottomY = topY + (bottomY - topY) * verticalLineProgress;
            
            return (
              <line
                x1={verticalLineX}
                y1={topY}
                x2={verticalLineX}
                y2={currentBottomY}
                stroke="#ffffff"
                strokeWidth="2"
                strokeOpacity={verticalLineProgress > 0 ? 0.6 : 0}
                className="transition-opacity duration-300"
              style={{
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
              }}
            />
            );
          })()}
        </svg>

        {/* Content areas - text and prices centered within columns */}
        <div className="absolute inset-0 pointer-events-none">
          {branchLines.map((branch, index) => {
            const progress = branchProgress[index] || 0;
            const progressRight = branchProgressRight[index] || 0;
            
            // Position content centered vertically within the column space
            // Each column is centered between its line and the next line
            const currentY = branch.startY;
            let columnCenterY;
            
            if (index === branchLines.length - 1) {
              // Last column: center between this line and add spacing below (use a fixed offset)
              const prevY = branchLines[index - 1].startY;
              const spacing = currentY - prevY; // Use the spacing from previous column
              columnCenterY = currentY + (spacing / 2); // Position below the line with spacing
            } else {
              // All other columns: center between this line and the next line
              const nextY = branchLines[index + 1].startY;
              columnCenterY = (currentY + nextY) / 2;
            }
            
            const yPercent = (columnCenterY / 1000) * 100;
            const columnCenterX = CENTER_X; // Center of the column where lines meet
            
            // Position titles on the left side but within the column area
            // Calculate left edge of column (between LEFT_POSITION and CENTER_X)
            const columnLeftX = LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.2); // 20% from left edge of column

            return (
              <div
                key={`column-${index}`}
                className="absolute pointer-events-auto"
                style={{
                  left: `${(columnLeftX / 1000) * 100}%`, // Position on left side within column
                  top: `${yPercent}%`,
                  transform: 'translate(0%, -50%)', // Center vertically, align to left
                  opacity: popInProgress[index] > 0 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out',
                  width: 'max-content',
                  maxWidth: '250px',
                }}
              >
                {/* Text appears on the left side within the column with pop-in animation */}
                  {bonusTexts[index] && (
                      <span 
                    className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight whitespace-normal text-left flex-shrink-0 block"
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                          fontWeight: 900,
                          letterSpacing: '0.02em',
                      wordBreak: 'break-word',
                      transform: `scale(${0.3 + popInProgress[index] * 0.7}) translateY(${(1 - popInProgress[index]) * 20}px)`,
                      opacity: popInProgress[index] > 0 ? 1 : 0,
                      transition: popInProgress[index] === 0 ? 'none' : 'transform 0.1s ease-out',
                        }}
                      >
                        {bonusTexts[index]}
                      </span>
                )}
                
              </div>
            );
          })}
        </div>

        {/* Prices positioned at fixed Y level - all aligned horizontally */}
        <div className="absolute inset-0 pointer-events-none">
          {branchLines.map((branch, index) => {
            // Skip price for last column (index 6)
            if (index >= bonusTexts.length) {
              return null;
            }
            
            const progress = branchProgress[index] || 0;
            const progressRight = branchProgressRight[index] || 0;
            
            // Calculate column center Y for this column (same as text positioning)
            const currentY = branch.startY;
            let columnCenterY;
            if (index === branchLines.length - 1) {
              // Last column: use spacing below the line (matching text positioning)
              const prevY = branchLines[index - 1].startY;
              const spacing = currentY - prevY;
              columnCenterY = currentY + (spacing / 2);
            } else {
              // All other columns: center between this line and the next line
              const nextY = branchLines[index + 1].startY;
              columnCenterY = (currentY + nextY) / 2;
            }
            const columnCenterYPercent = (columnCenterY / 1000) * 100;
            
            // Center prices horizontally in the space between vertical line and right edge
            // Vertical line is at CENTER_X + 170 = 670
            // Right edge is at RIGHT_POSITION = 820
            // Center of that space is at (670 + 820) / 2 = 745
            const verticalLineX = CENTER_X + 170;
            const priceCenterX = (verticalLineX + RIGHT_POSITION) / 2;
            
            return (
              <div
                key={`price-${index}`}
                className="absolute pointer-events-auto"
                style={{
                  left: `${(priceCenterX / 1000) * 100}%`,
                  top: `${columnCenterYPercent}%`,
                  transform: 'translate(-50%, -50%)', // Center both horizontally and vertically within column space
                  opacity: popInProgress[index] > 0 ? 1 : 0,
                  transition: 'opacity 0.3s ease-out',
                }}
              >
                      <span
                  className="text-white font-mono text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold inline-block relative flex-shrink-0 whitespace-nowrap"
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                    opacity: popInProgress[index] > 0 ? 1 : 0,
                    transform: `scale(${0.3 + popInProgress[index] * 0.7}) translateY(${(1 - popInProgress[index]) * 20}px)`,
                    transition: popInProgress[index] === 0 ? 'none' : 'transform 0.1s ease-out',
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
                        backgroundColor: '#d9d7b3',
                              transform: 'translateY(-50%) rotate(-15deg)',
                              transformOrigin: 'center',
                        boxShadow: '0 0 4px rgba(217, 215, 179, 0.6)',
                              width: '120%',
                            }}
                          />
                        </span>
                      </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
