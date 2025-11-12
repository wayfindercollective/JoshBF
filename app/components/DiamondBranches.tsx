"use client";

import { useState, useEffect, useRef } from "react";

interface WeekItem {
  label: string;
  angle: number; // Angle in degrees from center
  distance: number; // Distance from center
  description: string;
}

const weeks: WeekItem[] = [
  { 
    label: "Clarity", 
    angle: 270, 
    distance: 300,
    description: "Map your current position, constraints, and assumptions. Define success criteria and a small set of baseline measures you will track."
  },
  { 
    label: "Desire", 
    angle: 315, 
    distance: 300,
    description: "Identify what you actually want and how you know. Separate short term impulse from longer term values using simple prompts and a quick daily check."
  },
  { 
    label: "Boundaries", 
    angle: 0, 
    distance: 300,
    description: "Inventory commitments and set rules for time, attention, and energy. Create allow and deny lists and a straightforward plan for saying no."
  },
  { 
    label: "Perspective", 
    angle: 45, 
    distance: 300,
    description: "Connect direction with present facts. Write a brief statement that links where you intend to go with what is true right now, then create two or three decision filters."
  },
  { 
    label: "Action", 
    angle: 90, 
    distance: 300,
    description: "Translate direction into objectives and simple metrics. Break work into small experiments and select the first task that will move a visible number."
  },
  { 
    label: "Productivity", 
    angle: 135, 
    distance: 300,
    description: "Design an environment that reduces drag. Add containers for focus work and for leisure, a short daily checklist, and a weekly review loop."
  },
  { 
    label: "Identifying Purpose", 
    angle: 180, 
    distance: 300,
    description: "Test your hypothesis in real situations. Collect evidence, refine the purpose statement, and note both performance markers and emotional signals."
  },
  { 
    label: "Living Your Purpose", 
    angle: 225, 
    distance: 300,
    description: "Consolidate what works into a repeatable routine. Build a maintenance plan, a simple risk list with responses, and a clear roadmap for the next quarter."
  },
];

export default function DiamondBranches() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState<number | null>(null);
  const [clickedWeekIndex, setClickedWeekIndex] = useState<number | null>(null);
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(weeks.length).fill(0));
  const [labelVisible, setLabelVisible] = useState<boolean[]>(new Array(weeks.length).fill(false));
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const branchAnimationRef = useRef<number>();

  // Animate branches extending out
  useEffect(() => {
    if (!isVisible || hasAnimated) {
      if (!isVisible) {
        // Reset when scrolled away
        setBranchProgress(new Array(weeks.length).fill(0));
        setLabelVisible(new Array(weeks.length).fill(false));
        setHasAnimated(false);
      }
      return;
    }

    let currentBranch = 0;
    const animateBranch = () => {
      if (currentBranch >= weeks.length) {
        setHasAnimated(true);
        return;
      }

      const startTime = performance.now();
      const duration = 400; // 400ms per branch

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setBranchProgress((prev) => {
          const newProgress = [...prev];
          newProgress[currentBranch] = progress;
          return newProgress;
        });

        if (progress < 1) {
          branchAnimationRef.current = requestAnimationFrame(animate);
        } else {
          // Branch animation complete - show label after a short delay
          // Capture the current branch index before incrementing
          const completedBranchIndex = currentBranch;
          setTimeout(() => {
            setLabelVisible((prev) => {
              const newVisible = [...prev];
              newVisible[completedBranchIndex] = true;
              return newVisible;
            });
          }, 100); // 100ms delay after line completes
          
          currentBranch++;
          if (currentBranch < weeks.length) {
            setTimeout(() => {
              branchAnimationRef.current = requestAnimationFrame(animate);
            }, 100); // Small delay between branches
          } else {
            setHasAnimated(true);
          }
        }
      };

      branchAnimationRef.current = requestAnimationFrame(animate);
    };

    animateBranch();

    return () => {
      if (branchAnimationRef.current) {
        cancelAnimationFrame(branchAnimationRef.current);
      }
    };
  }, [isVisible, hasAnimated]);

  const getWeekNumber = (index: number): string => {
    return `Week ${index + 1}`;
  };

  const getPosition = (angle: number, distance: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    return { x: 500 + x, y: 500 + y };
  };

  const getLineEndPosition = (angle: number, distance: number, logoRadius: number) => {
    const rad = (angle * Math.PI) / 180;
    // Adjust offset based on angle - weeks 1, 2, 3 (270, 315, 0) need more offset
    // Other angles need less to avoid going into the logo
    let offset = 55;
    if (angle === 270) {
      offset = 56; // Week One - top
    } else if (angle === 315 || angle === 0) {
      offset = 55; // Week Two and Three - top-right and right
    } else {
      // Week Four through Eight - reduce offset to prevent overlap
      offset = 50;
    }
    const lineDistance = distance - logoRadius + offset;
    const x = Math.cos(rad) * lineDistance;
    const y = Math.sin(rad) * lineDistance;
    return { x: 500 + x, y: 500 + y };
  };

  // Scroll-triggered visibility observer - triggers when diamond is almost in middle of screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible and near center of screen
            setIsVisible(true);
          } else {
            // Element scrolled away - reset animation
            setIsVisible(false);
            setHasAnimated(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of element is visible
        rootMargin: '0px 0px -30% 0px', // Trigger when element is in upper-middle portion of screen
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Modal for week context */}
      {clickedWeekIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setClickedWeekIndex(null)}
        >
          <div
            className="bg-warm-beige border-2 border-orange-red/30 rounded-lg p-8 max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <button
              onClick={() => setClickedWeekIndex(null)}
              className="absolute top-4 right-4 text-orange-red/80 hover:text-orange-red text-4xl font-bold transition-colors"
              style={{ cursor: "pointer" }}
            >
              ×
            </button>
            <h3 className="text-3xl md:text-4xl font-heading font-black text-orange-red mb-2">
              {getWeekNumber(clickedWeekIndex)}
            </h3>
            <h4 className="text-2xl md:text-3xl font-heading font-bold text-orange-red mb-6">
              {weeks[clickedWeekIndex].label}
            </h4>
            <p className="text-orange-red/90 text-lg md:text-xl leading-relaxed font-sans">
              {weeks[clickedWeekIndex].description}
            </p>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex items-center justify-center min-h-[640px] pt-8 pb-24 px-4 md:px-0 overflow-hidden"
      >
        <div className="relative w-full max-w-5xl scale-[1.2] md:scale-[1.2] mx-auto flex justify-center">
        <svg
          ref={svgRef}
          viewBox="-200 -50 1400 1100"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "640px", maxWidth: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="shinyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* Mask using logo image alpha - this ensures shiny only shows on visible logo content */}
            <mask id="logoAlphaMask" maskUnits="objectBoundingBox">
              <image href="/YingYangLogo.png" x="0" y="0" width="1" height="1" preserveAspectRatio="none" />
            </mask>
          </defs>
          {/* Animated branches */}
          {weeks.map((week, index) => {
            const endPos = getPosition(week.angle, week.distance);
            const logoRadius = 60; // Half of logo width/height (120px / 2) - doubled from 30
            const lineEndPos = getLineEndPosition(week.angle, week.distance, logoRadius);
            const progress = branchProgress[index] || 0;
            const isHoveredDot = hoveredWeekIndex === index;

            return (
              <g key={index}>
                {/* Branch line */}
                <line
                  x1="500"
                  y1="500"
                  x2={500 + (lineEndPos.x - 500) * progress}
                  y2={500 + (lineEndPos.y - 500) * progress}
                  stroke="#ffffff"
                  strokeWidth={isHoveredDot ? 3 : 2}
                  strokeOpacity={progress > 0 ? (isHoveredDot ? 1 : 0.6) : 0}
                  className="transition-all duration-300 ease-out"
                  strokeLinecap="round"
                />
                {/* Week label - show automatically when animation completes */}
                {labelVisible[index] && (
                  <g>
                    {/* Calculate text offset based on angle to position it nicely relative to the dot */}
                    {(() => {
                      // Position text at the end of the line, extending beyond the logo
                      const logoRadius = 60;
                      // Adjust textDistance for Week Seven (left side) to ensure full visibility
                      const baseTextDistance = week.distance + logoRadius + 40;
                      const textDistance = week.angle === 180 ? baseTextDistance - 20 : baseTextDistance;
                      const textRad = (week.angle * Math.PI) / 180;
                      let textX = 500 + Math.cos(textRad) * textDistance;
                      const textY = 500 + Math.sin(textRad) * textDistance;
                      
                      // Move Week 7 text to the left to avoid logo overlap
                      if (week.angle === 180) {
                        textX -= 20; // Move left by 20 pixels to avoid logo overlap
                      }
                      
                      // Determine text rotation based on angle
                      let textAngle = 0;
                      let textAnchor: "start" | "middle" | "end" = "middle";
                      if (week.angle === 315 || week.angle === 135) {
                        textAngle = 45;
                      } else if (week.angle === 45 || week.angle === 225) {
                        textAngle = -45;
                      } else if (week.angle === 180) {
                        // Week Seven - left side, use "middle" anchor to center the text
                        textAnchor = "middle";
                      } else if (week.angle === 0) {
                        // Week Three - right side, use "start" anchor
                        textAnchor = "start";
                      }
                      
                      return (
                        <g
                          style={{
                            animation: 'popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        >
                          <text
                            x={textX}
                            y={textY}
                            fill="#ffffff"
                            fontSize="28.8"
                            fontWeight="bold"
                            textAnchor={textAnchor}
                            className="font-heading"
                            dominantBaseline="middle"
                            transform={textAngle !== 0 ? `rotate(${textAngle} ${textX} ${textY})` : ""}
                          >
                            <tspan x={textX} dy="0">{getWeekNumber(index)}</tspan>
                            <tspan x={textX} dy="34">{week.label}</tspan>
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                )}
                {/* Week number indicator - the hoverable dot */}
                {progress > 0.8 && (
                  <g>
                    <g
                      transform={`translate(${endPos.x}, ${endPos.y}) ${isHoveredDot ? "scale(1.1)" : "scale(1)"}`}
                      className="transition-all duration-300 cursor-pointer"
                      opacity={progress}
                      onMouseEnter={() => setHoveredWeekIndex(index)}
                      onMouseLeave={() => setHoveredWeekIndex(null)}
                      onClick={() => setClickedWeekIndex(index)}
                      style={{ 
                        cursor: "pointer",
                        filter: isHoveredDot ? "drop-shadow(0 0 15px rgba(255,255,255,0.8))" : "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
                      }}
                    >
                      {/* Yin Yang Logo */}
                      <image
                        href="/YingYangLogo.png"
                        x={-60}
                        y={-60}
                        width={120}
                        height={120}
                        className="yin-yang-clickable"
                        style={{
                          transition: "all 0.3s ease",
                          transformOrigin: "center",
                        }}
                      />
                      {/* Shiny overlay effect - masked to only show on visible logo content */}
                      <g transform="translate(-60, -60)">
                        <rect
                          x="0"
                          y="0"
                          width="120"
                          height="120"
                          fill="url(#shinyGradient)"
                          opacity={0.6}
                          className="yin-yang-shiny"
                          mask="url(#logoAlphaMask)"
                          style={{
                            pointerEvents: "none",
                          }}
                        />
                      </g>
                    </g>
                    {/* Invisible larger clickable area */}
                    <circle
                      cx={endPos.x}
                      cy={endPos.y}
                      r={70}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredWeekIndex(index)}
                      onMouseLeave={() => setHoveredWeekIndex(null)}
                      onClick={() => setClickedWeekIndex(index)}
                      style={{ cursor: "pointer" }}
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Central diamond */}
          <polygon
            points="500,450 550,500 500,550 450,500"
            fill="none"
            stroke="#ffffff"
            strokeWidth={isVisible ? 5 : 4}
            className="transition-all duration-300"
            style={{
              filter: isVisible ? "drop-shadow(0 0 20px rgba(255,255,255,0.7))" : "none",
            }}
          />
        </svg>
        </div>
      </div>
    </>
  );
}

