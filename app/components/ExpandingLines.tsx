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
// Evenly spaced with equal gaps between all dots (116.67 units apart)
const upwardLines: UpwardLine[] = [
  { startY: 500, endY: 150 },   // Top
  { startY: 500, endY: 267 },   // Upper-mid
  { startY: 500, endY: 383 },   // Mid-upper
  { startY: 500, endY: 500 },   // Middle (the dot that moved from center)
  { startY: 500, endY: 617 },   // Mid-lower
  { startY: 500, endY: 733 },   // Lower-mid
  { startY: 500, endY: 850 },   // Bottom
];

// Bonus content text for each dot
const bonusTexts: string[] = [
  "Goal setting workbook",
  "Instinctive breathwork",
  "Life reboot bundle",
  "10-minute book on how to make progress",
  "", // Placeholder for 5th bonus
  "", // Placeholder for 6th bonus
  "", // Placeholder for 7th bonus
];

// Branch lines going to the right from each upward line endpoint
// End position is where dots appear and where text will start
const LEFT_POSITION = 100; // Moved further left from 200
const BRANCH_END_X = 350; // Moved further left from 450
const branchLines: BranchLine[] = upwardLines.map((line, index) => ({
  startX: LEFT_POSITION,  // Left side position - moved further left
  startY: line.endY,
  endX: BRANCH_END_X,     // Position where dots appear - text starts here
}));

export default function ExpandingLines() {
  const [isVisible, setIsVisible] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 500, y: 500 });
  const [dotRadius, setDotRadius] = useState(18); // Start at three times the size (18 instead of 6)
  const [upwardProgress, setUpwardProgress] = useState<number[]>(new Array(upwardLines.length).fill(0));
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(branchLines.length).fill(0));
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            // Clear any ongoing animations
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
            }
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
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
      const duration = 625; // 250% slower: 250ms * 2.5 = 625ms
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
          }, 100); // Back to original speed
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
        }, 100); // Halved from 200
        return;
      }

      const startTime = performance.now();
      const duration = 200; // Back to original speed

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

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
            timeoutRef.current = setTimeout(() => {
              animateUpwardLines();
            }, 30); // Back to original speed
          } else {
            phase = 2;
            currentLine = 0;
            timeoutRef.current = setTimeout(() => {
              animateBranchLines();
            }, 100); // Halved from 200
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Phase 2: Animate branch lines to the right
    const animateBranchLines = () => {
      if (currentLine >= branchLines.length) return;

      const startTime = performance.now();
      const duration = 250; // Halved from 500

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
            }, 30); // Halved from 60
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation sequence
    timeoutRef.current = setTimeout(() => {
      moveDotLeft();
    }, 150); // Halved from 300

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className="flex items-center justify-start min-h-[600px] py-12 px-4 md:px-6">
      <div className="relative w-full max-w-6xl">
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "600px", maxWidth: "100%" }}
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
                <div className="w-48 md:w-80 lg:w-96 h-auto flex items-center justify-start pl-6">
                  {bonusTexts[index] && (
                    <p 
                      className="text-white text-lg md:text-2xl lg:text-3xl leading-relaxed"
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                        fontWeight: 900,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {bonusTexts[index]}
                    </p>
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
