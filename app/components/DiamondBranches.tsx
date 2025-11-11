"use client";

import { useState, useEffect, useRef } from "react";

interface WeekItem {
  label: string;
  angle: number; // Angle in degrees from center
  distance: number; // Distance from center
}

const weeks: WeekItem[] = [
  { label: "Clarity", angle: 270, distance: 300 },      // Week One - Top
  { label: "Desire", angle: 315, distance: 300 },       // Week Two - Top-right
  { label: "Boundaries", angle: 0, distance: 300 },     // Week Three - Right
  { label: "Perspective", angle: 45, distance: 300 },  // Week Four - Bottom-right
  { label: "Action", angle: 90, distance: 300 },        // Week Five - Bottom
  { label: "Productivity", angle: 135, distance: 300 }, // Week Six - Bottom-left
  { label: "Identifying Purpose", angle: 180, distance: 300 },   // Week Seven - Left
  { label: "Living Your Purpose", angle: 225, distance: 300 },  // Week Eight - Top-left
];

export default function DiamondBranches() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState<number | null>(null);
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(weeks.length).fill(0));
  const svgRef = useRef<SVGSVGElement>(null);
  const branchAnimationRef = useRef<number>();

  // Animate branches extending out
  useEffect(() => {
    if (!isHovered) {
      setBranchProgress(new Array(weeks.length).fill(0));
      return;
    }

    let currentBranch = 0;
    const animateBranch = () => {
      if (currentBranch >= weeks.length) return;

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
          currentBranch++;
          if (currentBranch < weeks.length) {
            setTimeout(() => {
              branchAnimationRef.current = requestAnimationFrame(animate);
            }, 100); // Small delay between branches
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
  }, [isHovered]);

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
    // Line should reach the edge of the logo (logo center - radius toward center)
    // Extend significantly to ensure visual connection with the logo edge
    // Week One (angle 270) needs one extra pixel
    const extraOffset = angle === 270 ? 1 : 0;
    const lineDistance = distance - logoRadius + 18 + extraOffset;
    const x = Math.cos(rad) * lineDistance;
    const y = Math.sin(rad) * lineDistance;
    return { x: 500 + x, y: 500 + y };
  };

  return (
    <div className="flex items-center justify-center min-h-[640px] pt-8 pb-24">
      <div
        className="relative cursor-pointer w-full max-w-5xl"
        style={{ transform: 'scale(0.8)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 1000"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "640px" }}
        >
          {/* Animated branches */}
          {weeks.map((week, index) => {
            const endPos = getPosition(week.angle, week.distance);
            const logoRadius = 30; // Half of logo width/height (60px / 2)
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
                {/* Week label - only show if hovered */}
                {progress > 0.8 && isHoveredDot && (
                  <g>
                    {/* Calculate text offset based on angle to position it nicely relative to the dot */}
                    {(() => {
                      // Position text at the end of the line, extending beyond the logo
                      const logoRadius = 30;
                      const textDistance = week.distance + logoRadius + 40; // Extend beyond logo
                      const textRad = (week.angle * Math.PI) / 180;
                      const textX = 500 + Math.cos(textRad) * textDistance;
                      const textY = 500 + Math.sin(textRad) * textDistance;
                      
                      // Determine text rotation based on angle
                      let textAngle = 0;
                      if (week.angle === 315 || week.angle === 135) {
                        textAngle = 45;
                      } else if (week.angle === 45 || week.angle === 225) {
                        textAngle = -45;
                      }
                      
                      return (
                        <text
                          x={textX}
                          y={textY}
                          fill="#ffffff"
                          fontSize="24"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="font-heading transition-all duration-300"
                          opacity={progress}
                          dominantBaseline="middle"
                          transform={textAngle !== 0 ? `rotate(${textAngle} ${textX} ${textY})` : ""}
                        >
                          <tspan x={textX} dy="0">{getWeekNumber(index)}</tspan>
                          <tspan x={textX} dy="28">{week.label}</tspan>
                        </text>
                      );
                    })()}
                  </g>
                )}
                {/* Week number indicator - the hoverable dot */}
                {progress > 0.8 && (
                  <g>
                    <g
                      transform={`translate(${endPos.x}, ${endPos.y})`}
                      className="transition-all duration-300 cursor-pointer"
                      opacity={progress}
                      onMouseEnter={() => setHoveredWeekIndex(index)}
                      onMouseLeave={() => setHoveredWeekIndex(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <image
                        href="/YingYangLogo.png"
                        x={-30}
                        y={-30}
                        width={60}
                        height={60}
                      />
                    </g>
                    {/* Invisible larger hoverable area */}
                    <circle
                      cx={endPos.x}
                      cy={endPos.y}
                      r={35}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredWeekIndex(index)}
                      onMouseLeave={() => setHoveredWeekIndex(null)}
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
            strokeWidth={isHovered ? 5 : 4}
            className="transition-all duration-300"
            style={{
              filter: isHovered ? "drop-shadow(0 0 20px rgba(255,255,255,0.7))" : "none",
            }}
          />
        </svg>
      </div>
    </div>
  );
}

