"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

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

interface GeometryShape {
  type: 'triangle' | 'square' | 'circle' | 'line';
  x: number;
  y: number;
  size: number;
  rotation: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export default function DiamondBranches() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState<number | null>(null);
  const [clickedWeekIndex, setClickedWeekIndex] = useState<number | null>(null);
  const [branchProgress, setBranchProgress] = useState<number[]>(new Array(weeks.length).fill(0));
  const [labelVisible, setLabelVisible] = useState<boolean[]>(new Array(weeks.length).fill(false));
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const branchAnimationRef = useRef<number>();
  const modalGeometryCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalAnimationRef = useRef<number>();
  const modalShapesRef = useRef<GeometryShape[]>([]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const getLineEndPosition = (angle: number, distance: number, logoRadius: number, isMobile: boolean) => {
    const rad = (angle * Math.PI) / 180;
    // Adjust offset based on angle - weeks 1, 2, 3 (270, 315, 0) need more offset
    // Other angles need less to avoid going into the logo
    // Mobile: scaled by 1.3 (130%), Desktop: original sizes
    const scaleFactor = isMobile ? 1.3 : 1.0;
    let offset = 55 * scaleFactor;
    if (angle === 270) {
      offset = 56 * scaleFactor; // Week One - top
    } else if (angle === 315 || angle === 0) {
      offset = 55 * scaleFactor; // Week Two and Three - top-right and right
    } else {
      // Week Four through Eight - reduce offset to prevent overlap
      offset = 50 * scaleFactor;
    }
    const lineDistance = distance - logoRadius + offset;
    const x = Math.cos(rad) * lineDistance;
    const y = Math.sin(rad) * lineDistance;
    return { x: 500 + x, y: 500 + y };
  };

  // Geometry animation for modal background
  useEffect(() => {
    if (clickedWeekIndex === null || !modalGeometryCanvasRef.current) {
      if (modalAnimationRef.current) {
        cancelAnimationFrame(modalAnimationRef.current);
      }
      return;
    }

    const canvas = modalGeometryCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match modal
    const resizeCanvas = () => {
      const modal = canvas.parentElement;
      if (modal) {
        canvas.width = modal.clientWidth;
        canvas.height = modal.clientHeight;
      }
    };
    resizeCanvas();

    // Generate shapes for modal
    const generateShapes = (): GeometryShape[] => {
      const shapes: GeometryShape[] = [];
      const types: GeometryShape['type'][] = ['triangle', 'square', 'circle', 'line'];
      const cols = Math.ceil(canvas.width / 100);
      const rows = Math.ceil(canvas.height / 100);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * 100 + 50 + (Math.random() - 0.5) * 30;
          const y = row * 100 + 50 + (Math.random() - 0.5) * 30;
          const type = types[Math.floor(Math.random() * types.length)];

          shapes.push({
            type,
            x,
            y,
            size: 4 + Math.random() * 6,
            rotation: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.15,
            speedY: (Math.random() - 0.5) * 0.15,
            rotationSpeed: (Math.random() - 0.5) * 0.008,
            opacity: 0.4 + Math.random() * 0.4,
            color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.4})`,
          });
        }
      }

      return shapes;
    };

    modalShapesRef.current = generateShapes();

    const drawTriangle = (shape: GeometryShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.beginPath();
      ctx.moveTo(0, -shape.size / 2);
      ctx.lineTo(-shape.size / 2, shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    const drawSquare = (shape: GeometryShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = shape.opacity;
      ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      ctx.restore();
    };

    const drawCircle = (shape: GeometryShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    const drawLine = (shape: GeometryShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.beginPath();
      ctx.moveTo(-shape.size / 2, 0);
      ctx.lineTo(shape.size / 2, 0);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = shape.opacity;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      modalShapesRef.current.forEach((shape) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        switch (shape.type) {
          case 'triangle':
            drawTriangle(shape);
            break;
          case 'square':
            drawSquare(shape);
            break;
          case 'circle':
            drawCircle(shape);
            break;
          case 'line':
            drawLine(shape);
            break;
        }
      });

      modalAnimationRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (modalAnimationRef.current) {
        cancelAnimationFrame(modalAnimationRef.current);
      }
    };
  }, [clickedWeekIndex]);

  // Scroll-triggered visibility observer - triggers when diamond is visible in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible in viewport
            setIsVisible(true);
          } else {
            // Element scrolled away - reset animation
            setIsVisible(false);
            setHasAnimated(false);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible (more lenient)
        rootMargin: '0px', // No margin restrictions - trigger anywhere in viewport
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
            className="bg-black border border-white/10 rounded-sm p-4 sm:p-6 md:p-10 mx-auto flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '600px',
              maxHeight: '700px',
              minHeight: 'clamp(400px, 70vh, 500px)',
            }}
          >
            {/* Geometry background canvas */}
            <canvas
              ref={modalGeometryCanvasRef}
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{ opacity: 0.6 }}
            />
            
             <div className="flex justify-between items-start mb-8 flex-shrink-0 relative z-10">
               <div className="flex-1 pr-4">
                 <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2">
                   {getWeekNumber(clickedWeekIndex)}
                 </h3>
                 <h4 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
                   {weeks[clickedWeekIndex].label}
                 </h4>
               </div>
              <button
                onClick={() => setClickedWeekIndex(null)}
                className="text-white/50 hover:text-white/80 text-3xl font-light flex-shrink-0 transition-colors leading-none"
                aria-label="Close"
                style={{ lineHeight: '1' }}
              >
                ×
              </button>
            </div>
             <div className="space-y-5 overflow-y-auto flex-1 relative z-10" style={{ maxHeight: 'calc(700px - 120px)', paddingRight: 'clamp(20px, 8vw, 100px)', paddingBottom: 'clamp(20px, 8vw, 100px)' }}>
               <p className="text-white/70 text-xl md:text-2xl lg:text-3xl font-sans leading-relaxed">
                 {weeks[clickedWeekIndex].description}
               </p>
             </div>
            
            {/* Tree logo in bottom-right corner */}
            <div 
              className="absolute bottom-4 right-4 z-20 opacity-50 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
            >
              <Image
                src="/Tree of life.png"
                alt="Tree Logo"
                width={80}
                height={80}
                className="drop-shadow-sm w-full h-full"
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[640px] pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 px-4 md:px-0 overflow-hidden"
      >
        <div className="relative w-full max-w-5xl scale-[1.105] sm:scale-[1.3] md:scale-[1.2] mx-auto flex justify-center overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="-200 -50 1400 1100"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "clamp(400px, 50vw, 640px)", maxWidth: "100%", overflow: "hidden" }}
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
            // Mobile: 156px (78 radius), Desktop: 120px (60 radius)
            const logoSize = isMobile ? 156 : 120;
            const logoRadius = isMobile ? 78 : 60;
            const lineEndPos = getLineEndPosition(week.angle, week.distance, logoRadius, isMobile);
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
                  strokeWidth={isHoveredDot ? (isMobile ? 4 : 3) : (isMobile ? 3 : 2)}
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
                      // Mobile: scaled by 1.3, Desktop: original
                      const scaleFactor = isMobile ? 1.3 : 1.0;
                      const logoRadius = isMobile ? 78 : 60;
                      const baseTextDistance = week.distance + logoRadius + (40 * scaleFactor);
                      const textDistance = week.angle === 180 ? baseTextDistance - (20 * scaleFactor) : baseTextDistance;
                      const textRad = (week.angle * Math.PI) / 180;
                      let textX = 500 + Math.cos(textRad) * textDistance;
                      const textY = 500 + Math.sin(textRad) * textDistance;
                      
                      // Move Week 7 text to the left to avoid logo overlap
                      if (week.angle === 180) {
                        textX -= (20 * scaleFactor);
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
                            cursor: 'pointer',
                          }}
                          onClick={() => setClickedWeekIndex(index)}
                          onMouseEnter={() => setHoveredWeekIndex(index)}
                          onMouseLeave={() => setHoveredWeekIndex(null)}
                          className="transition-opacity duration-200"
                          opacity={hoveredWeekIndex === index ? 1 : 0.9}
                        >
                          <text
                            x={textX}
                            y={textY}
                            fill="#ffffff"
                            fontSize={isMobile ? "37.44" : "28.8"}
                            fontWeight="bold"
                            textAnchor={textAnchor}
                            className="font-heading"
                            dominantBaseline="middle"
                            transform={textAngle !== 0 ? `rotate(${textAngle} ${textX} ${textY})` : ""}
                            style={{ 
                              cursor: 'pointer',
                              filter: hoveredWeekIndex === index ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
                              transition: 'filter 0.2s ease',
                            }}
                          >
                            <tspan x={textX} dy="0">{getWeekNumber(index)}</tspan>
                            <tspan x={textX} dy={isMobile ? "44.2" : "34"}>{week.label}</tspan>
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
                        x={-logoRadius}
                        y={-logoRadius}
                        width={logoSize}
                        height={logoSize}
                        className="yin-yang-clickable"
                        style={{
                          transition: "all 0.3s ease",
                          transformOrigin: "center",
                        }}
                      />
                      {/* Shiny overlay effect - masked to only show on visible logo content */}
                      <g transform={`translate(-${logoRadius}, -${logoRadius})`}>
                        <rect
                          x="0"
                          y="0"
                          width={logoSize}
                          height={logoSize}
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
                      r={isMobile ? 91 : 70}
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
            strokeWidth={isVisible ? (isMobile ? 7 : 5) : (isMobile ? 5 : 4)}
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

