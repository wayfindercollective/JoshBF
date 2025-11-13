"use client"; // TypeScript fix deployed - commit 0e3c738

import React, { useState, useEffect, useRef, useMemo, useCallback, startTransition } from "react";
import Image from "next/image";

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

interface UpwardLine {
  startY: number; // Starting Y position on the left side
  endY: number;   // Ending Y position (going upward)
}

interface BranchLine {
  startX: number; // Starting X (left side)
  startY: number; // Starting Y (on the upward line)
  endX: number;    // Ending X (branching to the right)
}

// 8 upward lines starting from left side
// Very tight spacing to fit everything on one page - columns tightly wrapped around text
const upwardLinesDesktop: UpwardLine[] = [
  { startY: 500, endY: 200 },   // Top (Purpose Transformation - no subtitle)
  { startY: 500, endY: 270 },   // Upper-top (Goal Setting Workbook - no subtitle)
  { startY: 500, endY: 340 },   // Upper-mid (Instinctive Breathwork - no subtitle)
  { startY: 500, endY: 410 },   // Mid-upper (Book On How To Make Progress)
  { startY: 500, endY: 490 },   // Middle (The Purpose Paradox - HAS subtitle)
  { startY: 500, endY: 570 },   // Mid-lower (Set Fail-Resistant Goals - HAS subtitle)
  { startY: 500, endY: 650 },   // Lower-mid (Get Moving Make It Happen Now - HAS subtitle)
  { startY: 500, endY: 730 },   // Bottom
];

// Increased spacing for mobile - last three columns spread out more evenly
const upwardLinesMobile: UpwardLine[] = [
  { startY: 500, endY: 60 },    // Top (new)
  { startY: 500, endY: 120 },   // Upper-top
  { startY: 500, endY: 246 },   // Upper-mid
  { startY: 500, endY: 373 },   // Mid-upper
  { startY: 500, endY: 500 },   // Middle
  { startY: 500, endY: 635 },   // Mid-lower (spread out more)
  { startY: 500, endY: 770 },   // Lower-mid (spread out more)
  { startY: 500, endY: 905 },   // Bottom (spread out more)
];

// Bonus content text for each column - split into title and subtitle
const bonusTexts: { title: string; subtitle?: string }[] = [
  { title: "Purpose Transformation" },  // New top column
  { title: "Goal Setting Workbook" },
  { title: "Instinctive Breathwork" },
  { title: "Book On How To Make Progress" },
  { title: "The Purpose Paradox", subtitle: "Understand The Truth Of Living With Purpose" },
  { title: "Set Fail-Resistant Goals", subtitle: "A Step-By-Step Framework" },
  { title: "Get Moving Make It Happen Now", subtitle: "Building The Life You Want" },
];

// Detailed descriptions for each bonus item
const bonusDescriptions: { title: string; description: string[] }[] = [
  {
    title: "Purpose Transformation",
    description: [
      "8 weeks of self guided training that moves you from uncertainty to clarity with a simple plan you can apply on your own.",
      "Self paced and flexible."
    ]
  },
  {
    title: "Goal Setting Workbook",
    description: [
      "Build goals that match how you live and think.",
      "Pair vision with awareness so direction is realistic and repeatable.",
      "Small steps. Clear metrics. A plan you can sustain tomorrow and next month."
    ]
  },
  {
    title: "Instinctive breathwork: Deeper Awareness",
    description: [
      "Learn a simple discovery method that unlocks the full range of your breathing.",
      "Use it to reach the state you need in the moment. Calm. Focus. Endurance. Recovery.",
      "Not a single technique. A way to find the right technique on demand."
    ]
  },
  {
    title: "Book On How To Make Progress",
    description: [
      "Three mental models and three short exercises that break inertia fast.",
      "Clarify what actually matters. Stop looping the same problems. Start moving today.",
      "Designed for functionality, performance, and purpose."
    ]
  },
  {
    title: "The Purpose Paradox",
    description: [
      "Understand the truth of living with purpose. (FYI: It isn't a discovery. It's a skill set.)",
      "So you can create on a larger scale in your life, and in the smallest moments every day."
    ]
  },
  {
    title: "Set \"Fail-Resistant\" Goals",
    description: [
      "Most goal-setting exercises leave out core components needed to make sure you actually cross the finish line.",
      "This video training + workbook will make winning at the goals you set inevitable…",
      "Broken down in a step-by-step framework so that you start setting goals that actually get done!"
    ]
  },
  {
    title: "Get Moving & Make It Happen Now",
    description: [
      "Discover the unfamiliar strategies you need to start taking action today (and every day) toward building the life you want.",
      "Based on the true fundamentals of how to change human behavior. (Probably the opposite of what you're trying now.)"
    ]
  }
];

// Prices for each bonus item (matching order of bonusTexts)
const bonusPrices: string[] = [
  "$1,000", // Purpose Transformation
  "$200",   // Goal Setting Workbook
  "$497",   // Instinctive Breathwork
  "$89",    // How To Make Progress Book (10-minute workbook)
  "$297",   // The Purpose Paradox
  "$297",   // Set Fail-Resistant Goals
  "$297",   // Get Moving Make It Happen Now
];

// Branch lines going from left to right and right to left, meeting in the middle to create columns
// Reduced horizontal spread by 20% for tighter animation
const LEFT_POSITION = 180; // Left side position (moved in from 100)
const RIGHT_POSITION = 820; // Right side position (moved in from 900)
const CENTER_X = 500; // Center where lines meet, creating columns (unchanged)

export default function ExpandingLines() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use responsive spacing based on screen size - memoized to prevent recalculation
  const upwardLines = useMemo(() => 
    isMobile ? upwardLinesMobile : upwardLinesDesktop,
    [isMobile]
  );
  
  // Left side branch lines - going from left towards center - memoized
  const branchLines = useMemo(() => 
    upwardLines.map((line) => ({
      startX: LEFT_POSITION,  // Start at left side
      startY: line.endY,
      endX: CENTER_X,         // End at center, meeting right side lines
    })),
    [upwardLines]
  );
  
  // Right side branch lines - going from right towards center - memoized
  const branchLinesRight = useMemo(() => 
    upwardLines.map((line) => ({
      startX: RIGHT_POSITION,  // Start at right side
      startY: line.endY,
      endX: CENTER_X,         // End at center, meeting left side lines
    })),
    [upwardLines]
  );
  
  // Lines are always fully drawn when visible (no animation)
  const upwardProgress = isVisible ? new Array(8).fill(1) : new Array(8).fill(0);
  const upwardProgressRight = isVisible ? new Array(8).fill(1) : new Array(8).fill(0);
  const branchProgress = isVisible ? new Array(8).fill(1) : new Array(8).fill(0);
  const branchProgressRight = isVisible ? new Array(8).fill(1) : new Array(8).fill(0);
  const [textVisible, setTextVisible] = useState<boolean[]>(new Array(8).fill(false));
  const [priceVisible, setPriceVisible] = useState<boolean[]>(new Array(8).fill(false)); // Price for each column
  const [scriptComplete, setScriptComplete] = useState(false); // Track when script animation is complete
  const [verticalLineProgress, setVerticalLineProgress] = useState(0); // Track vertical line animation progress
  const [popInProgress, setPopInProgress] = useState<number[]>(new Array(8).fill(0)); // Track pop-in animation for each item (0-1)
  const [selectedBonus, setSelectedBonus] = useState<number | null>(null); // Track which bonus is clicked
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const priceTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const lastUpdateTime = useRef<number>(0);
  const updateThrottle = 16; // ~60fps max update rate (16ms = 1 frame at 60fps)
  const modalGeometryCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalShapesRef = useRef<GeometryShape[]>([]);
  const modalAnimationRef = useRef<number>();
  const mobileListRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll observer for mobile card list
  useEffect(() => {
    if (!mobileListRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMobile) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(mobileListRef.current);

    return () => {
      if (mobileListRef.current) {
        observer.unobserve(mobileListRef.current);
      }
    };
  }, [isMobile]);

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
            setTextVisible(new Array(8).fill(false));
            setPriceVisible(new Array(8).fill(false));
            setScriptComplete(false);
            setVerticalLineProgress(0);
            setPopInProgress(new Array(8).fill(0));
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

  // Animation sequence: lines appear instantly, then vertical line and pop-in
  useEffect(() => {
    if (!isVisible) {
      // Reset all states when not visible
      setTextVisible(new Array(8).fill(false));
      setPriceVisible(new Array(8).fill(false));
      setScriptComplete(false);
      setVerticalLineProgress(0);
      setPopInProgress(new Array(8).fill(0));
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

    // Reset throttle timer for smooth animation start
    lastUpdateTime.current = performance.now();

    // Lines appear instantly, then animate vertical line and pop-in
    const startAnimations = () => {
      // Mark script as complete immediately (lines are already visible)
      setScriptComplete(true);
      
      // Animate vertical line from top to bottom
      const startTime = performance.now();
      const duration = 200; // Smooth vertical line animation
      
      const animateLine = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 2); // Smooth ease-out
        
        // Throttle updates to prevent excessive re-renders
        if (currentTime - lastUpdateTime.current >= updateThrottle || progress >= 1) {
          lastUpdateTime.current = currentTime;
          
          // Use startTransition for non-blocking state update
          startTransition(() => {
            setVerticalLineProgress(easedProgress);
          });
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          // After vertical line completes, start pop-in animation
          setTimeout(() => {
            animatePopIn();
          }, 50); // Small delay before pop-in
        }
      };
      requestAnimationFrame(animateLine);
    };

    // Pop-in animation: items pop up in order 0, 1, 2, 3, 4, 5, 6
    const animatePopIn = () => {
      // Animate all indices: 0, 1, 2, 3, 4, 5, 6 (all bonus items)
      const indices = [0, 1, 2, 3, 4, 5, 6];
      const delayBetweenItems = 30; // Smooth cascading
      const popDuration = 120; // 120ms for each pop animation - smooth and fast
      
      indices.forEach((index, arrayIndex) => {
        setTimeout(() => {
          const startTime = performance.now();
          
          const animateItem = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / popDuration, 1);
            // Smooth ease-out for faster, smoother animation
            const easedProgress = 1 - Math.pow(1 - progress, 2);
            
            // Throttle updates to prevent excessive re-renders
            if (currentTime - lastUpdateTime.current >= updateThrottle || progress >= 1) {
              lastUpdateTime.current = currentTime;
              
              // Use startTransition for non-blocking state update
              startTransition(() => {
                setPopInProgress((prev) => {
                  const newProgress = [...prev];
                  newProgress[index] = Math.min(easedProgress, 1);
                  return newProgress;
                });
              });
            }
            
            if (progress < 1) {
              requestAnimationFrame(animateItem);
            }
          };
          requestAnimationFrame(animateItem);
        }, arrayIndex * delayBetweenItems);
      });
    };

    // Start animation sequence immediately
    timeoutRef.current = setTimeout(() => {
      startAnimations();
    }, 0);

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
  }, [isVisible, isMobile, branchLines.length, upwardLines.length, textVisible]);

  // Geometry animation for modal background
  useEffect(() => {
    if (!selectedBonus || !modalGeometryCanvasRef.current) {
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
  }, [selectedBonus]);

  return (
    <React.Fragment>
      {/* Mobile card layout - only visible on mobile */}
      <div ref={mobileListRef} data-bonus-list="true" className="md:hidden mt-1 mb-4">
        {bonusTexts.map((bonus, index) => (
          <button
            key={`mobile-card-${index}`}
            data-bonus-card="true"
            onClick={() => {
              if (index === 0) {
                // Scroll to Purpose Transformation section
                const element = document.getElementById('purpose-transformation');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              } else {
                setSelectedBonus(index);
              }
            }}
            style={{
              opacity: isVisible && popInProgress[index] > 0 ? 1 : 0,
              transition: 'opacity 0.3s ease-out',
              transform: `translateY(${(1 - popInProgress[index]) * 10}px)`,
            }}
          >
            <div className="bonus-title">
              <div className="bonus-title-text" style={{ color: index === 0 ? '#bc4500' : '#ffffff' }}>
                {bonus.title}
              </div>
              {bonus.subtitle && (
                <div className="bonus-subtitle">
                  {bonus.subtitle}
                </div>
              )}
            </div>
            <div className="bonus-price">
              <span style={{ 
                position: 'relative',
                display: 'inline-block',
              }}>
                {bonusPrices[index] || "$297"}
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
            </div>
          </button>
        ))}
        
        {/* Total Value for mobile - positioned after last card, centered */}
        <div 
          className="md:hidden flex flex-col items-center"
          style={{
            opacity: isVisible && popInProgress[bonusTexts.length - 1] > 0 ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <div className="bonus-title text-center">
            <div 
              className="bonus-title-text text-sm"
              style={{ 
                color: '#ffffff',
                fontSize: '0.9rem',
              }}
            >
              Total Value
            </div>
          </div>
          <div className="bonus-price text-center" style={{ fontSize: '13px' }}>
            <span style={{ 
              position: 'relative',
              display: 'inline-block',
            }}>
              $2,677
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
          </div>
        </div>
      </div>

      {/* Desktop layout - hidden on mobile */}
      <div ref={containerRef} className="bonus-desktop-layout flex items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[450px] pt-1 sm:pt-1 md:pt-1 pb-2 sm:pb-3 md:pb-4 px-2 sm:px-4 md:px-6 overflow-x-hidden">
        <div className="relative w-full max-w-6xl overflow-x-hidden">
        <svg
          viewBox="0 0 1000 1000"
          width="100%"
          height="auto"
          className="transition-all duration-300"
          style={{ minHeight: "400px", maxWidth: "100%", overflow: "hidden" }}
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
                  strokeWidth="2.5"
                  strokeOpacity={progress > 0 ? 0.8 : 0}
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
                  strokeWidth="2.5"
                  strokeOpacity={progress > 0 ? 0.8 : 0}
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
                  strokeWidth="2.5"
                  strokeOpacity={progress > 0 ? 0.8 : 0}
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

          {/* Curved arrow from Bonuses box to Purpose Transformation row */}
          {isVisible && scriptComplete && popInProgress[0] > 0 && (() => {
            // Calculate positions for the arrow
            // Start point: At the level of "Click to learn more" text, well outside the Bonuses box
            const startX = CENTER_X - 200; // Far to the left, outside the Bonuses box
            const startY = 140; // At the level of "Click to learn more" text, below the Bonuses title
            
            // End point: Purpose Transformation row (first column, index 0)
            const columnLeftX = isMobile 
              ? LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.1)
              : LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.2);
            const currentY = branchLines[0].startY;
            const nextY = branchLines[1].startY;
            const columnCenterY = currentY + ((nextY - currentY) * 0.25); // Use same calculation as text positioning (0.25 for first row)
            
            // End point is well to the left of the column (outside the column structure)
            // LEFT_POSITION is 180, so we want to stay well to the left of that
            const endX = LEFT_POSITION - 8; // Position to the left of the leftmost line, moved more to the right
            const endY = columnCenterY;
            
            // Control points for a curved path that goes around the columns and Bonuses box
            // First control point: sharp curve down and far to the left (outside column area and Bonuses box)
            const controlX1 = LEFT_POSITION - 120; // Curve far left, well outside columns and box
            const controlY1 = startY + 60; // Curve down from the start point
            // Second control point: gentle curve back right toward the target, staying outside
            const controlX2 = LEFT_POSITION - 40; // Curve around, still outside columns
            const controlY2 = endY - 15; // Approach from slightly above
            
            // Arrow head size and angle calculation
            // Arrow should point toward the Purpose Transformation text (to the right)
            const arrowSize = 12;
            // Calculate angle pointing from end point toward the Purpose Transformation text
            // Purpose Transformation text is at columnLeftX, columnCenterY
            const targetX = columnLeftX;
            const targetY = columnCenterY;
            const arrowAngle = Math.atan2(targetY - endY, targetX - endX);
            
            // Only show arrow if popInProgress[0] is greater than 0
            const arrowOpacity = popInProgress[0] > 0 ? 1 : 0;
            
            return (
              <g style={{ opacity: arrowOpacity, transition: 'opacity 0.3s ease-out' }}>
                {/* Curved arrow path */}
                <path
                  d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
                  }}
                />
                {/* Arrow head - pointing toward Purpose Transformation */}
                <path
                  d={`M ${endX + 3} ${endY} L ${endX + 3 - arrowSize * Math.cos(arrowAngle - Math.PI / 6)} ${endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)} M ${endX + 3} ${endY} L ${endX + 3 - arrowSize * Math.cos(arrowAngle + Math.PI / 6)} ${endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)}`}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.6))",
                  }}
                />
              </g>
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
              // Last column: tighter spacing - use smaller offset
              const prevY = branchLines[index - 1].startY;
              const spacing = currentY - prevY;
              columnCenterY = currentY + (spacing * 0.3); // Reduced from 0.5 to 0.3 for tighter wrapping
            } else {
              // All other columns: tighter center positioning
              const nextY = branchLines[index + 1].startY;
              columnCenterY = currentY + ((nextY - currentY) * 0.45); // Slightly above center for tighter wrapping
            }
            
            const yPercent = (columnCenterY / 1000) * 100;
            const columnCenterX = CENTER_X; // Center of the column where lines meet
            
            // Position titles on the left side but within the column area
            // Calculate left edge of column (between LEFT_POSITION and CENTER_X)
            // On mobile, adjust positioning to keep text within viewport
            const columnLeftX = isMobile 
              ? LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.1) // 10% from left on mobile
              : LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.2); // 20% from left on desktop
            const maxTextWidth = isMobile ? 'calc(100vw - 2rem)' : '320px';

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
                  maxWidth: maxTextWidth,
                }}
              >
                {/* Text appears on the left side within the column with pop-in animation */}
                  {bonusTexts[index] && bonusTexts[index].title && (
                      <button
                        onClick={() => {
                          if (index === 0) {
                            // Scroll to Purpose Transformation section
                            const element = document.getElementById('purpose-transformation');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          } else {
                            setSelectedBonus(index);
                          }
                        }}
                        className={`text-white ${index === 4 ? 'text-xs sm:text-xs md:text-xs lg:text-sm xl:text-base' : (bonusTexts[index].subtitle ? 'text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg' : 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl')} leading-tight whitespace-normal text-left flex-shrink-0 block cursor-pointer group relative`}
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          textShadow: index === 0 
                            ? '0 0 8px rgba(188,69,0,0.8), 0 0 12px rgba(188,69,0,0.6), 0 0 16px rgba(188,69,0,0.4)'
                            : '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                          filter: index === 0
                            ? 'drop-shadow(0 0 4px rgba(188,69,0,0.7))'
                            : 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                          fontWeight: 900,
                          letterSpacing: '0.02em',
                          wordBreak: 'break-word',
                          transform: `scale(${0.3 + popInProgress[index] * 0.7}) translateY(${(1 - popInProgress[index]) * 20}px)`,
                          opacity: popInProgress[index] > 0 ? 1 : 0,
                          transition: popInProgress[index] === 0 ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          paddingLeft: '0',
                          width: isMobile ? 'min(100%, calc(100vw - 3rem))' : '100%',
                          maxWidth: isMobile ? 'calc(100vw - 3rem)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          const baseScale = 0.3 + popInProgress[index] * 0.7;
                          if (index === 0) {
                            e.currentTarget.style.textShadow = '0 0 16px rgba(188,69,0,1), 0 0 24px rgba(188,69,0,0.9), 0 0 32px rgba(188,69,0,0.7)';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(188,69,0,0.9))';
                          } else {
                            e.currentTarget.style.textShadow = '0 0 16px rgba(255,255,255,1), 0 0 24px rgba(99,157,240,0.8), 0 0 32px rgba(99,157,240,0.6)';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))';
                          }
                          e.currentTarget.style.transform = `scale(${baseScale * 1.08}) translateY(${(1 - popInProgress[index]) * 20}px)`;
                        }}
                        onMouseLeave={(e) => {
                          const baseScale = 0.3 + popInProgress[index] * 0.7;
                          if (index === 0) {
                            e.currentTarget.style.textShadow = '0 0 8px rgba(188,69,0,0.8), 0 0 12px rgba(188,69,0,0.6), 0 0 16px rgba(188,69,0,0.4)';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(188,69,0,0.7))';
                          } else {
                            e.currentTarget.style.textShadow = '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)';
                            e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.5))';
                          }
                          e.currentTarget.style.transform = `scale(${baseScale}) translateY(${(1 - popInProgress[index]) * 20}px)`;
                        }}
                      >
                        <div className="block relative" style={{ lineHeight: '1.2' }}>
                          {/* Always-visible clickable indicator - subtle underline with animation */}
                          <div 
                            className="group-hover:opacity-100 transition-all duration-300"
                            style={{ 
                              whiteSpace: 'normal', 
                              wordBreak: 'break-word',
                              borderBottom: index === 0 
                                ? '2px solid rgba(188, 69, 0, 0.5)'
                                : '2px solid rgba(255, 255, 255, 0.3)',
                              paddingBottom: '2px',
                              display: 'inline-block',
                              width: 'fit-content',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              animation: popInProgress[index] > 0.9 ? 'bonusDesktopTitlePulse 2.5s ease-in-out infinite' : 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderBottomColor = index === 0 
                                ? 'rgba(188, 69, 0, 0.9)'
                                : 'rgba(255, 255, 255, 0.8)';
                              e.currentTarget.style.borderBottomWidth = '3px';
                              e.currentTarget.style.paddingBottom = '3px';
                              e.currentTarget.style.animation = 'none';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderBottomColor = index === 0 
                                ? 'rgba(188, 69, 0, 0.5)'
                                : 'rgba(255, 255, 255, 0.3)';
                              e.currentTarget.style.borderBottomWidth = '2px';
                              e.currentTarget.style.paddingBottom = '2px';
                              if (popInProgress[index] > 0.9) {
                                e.currentTarget.style.animation = 'bonusDesktopTitlePulse 2.5s ease-in-out infinite';
                              }
                            }}
                          >
                            {/* Special formatting for Book On How To Make Progress title */}
                            {index === 3 ? (
                              <>
                                <span style={{ color: 'inherit', display: 'block' }}>
                                  Book On How To Make
                                </span>
                                <span style={{ color: 'inherit', display: 'inline-block', verticalAlign: 'baseline' }}>
                                  Progress
                                </span>
                              </>
                            ) : (
                              <span style={{ color: index === 0 ? '#bc4500' : 'inherit' }}>
                                {bonusTexts[index].title}
                              </span>
                            )}
                            {/* Click indicator icon with bounce animation */}
                            <span 
                              className="inline-block ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300"
                              style={{ 
                                fontSize: '0.7em',
                                animation: 'bonusArrowBounceDesktop 2s ease-in-out infinite',
                                color: index === 0 ? '#bc4500' : 'inherit',
                                textShadow: index === 0 
                                  ? '0 0 4px rgba(188,69,0,0.8), 0 0 8px rgba(188,69,0,0.6)'
                                  : '0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(99,157,240,0.4)',
                                filter: index === 0
                                  ? 'drop-shadow(0 0 2px rgba(188,69,0,0.7))'
                                  : 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
                                verticalAlign: 'baseline',
                              }}
                              onMouseEnter={(e) => {
                                if (index === 0) {
                                  e.currentTarget.style.textShadow = '0 0 8px rgba(188,69,0,1), 0 0 12px rgba(188,69,0,0.8)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(188,69,0,0.9))';
                                } else {
                                  e.currentTarget.style.textShadow = '0 0 8px rgba(255,255,255,1), 0 0 12px rgba(99,157,240,0.8)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.8))';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (index === 0) {
                                  e.currentTarget.style.textShadow = '0 0 4px rgba(188,69,0,0.8), 0 0 8px rgba(188,69,0,0.6)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 0 2px rgba(188,69,0,0.7))';
                                } else {
                                  e.currentTarget.style.textShadow = '0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(99,157,240,0.4)';
                                  e.currentTarget.style.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.5))';
                                }
                              }}
                            >
                              →
                            </span>
                          </div>
                          {bonusTexts[index].subtitle && (
                            <div 
                              className={`${index === 4 ? 'text-[10px] sm:text-[10px] md:text-xs lg:text-xs xl:text-sm' : 'text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg'} mt-1 group-hover:text-white/90 transition-colors duration-200`}
                              style={{ fontWeight: 600, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2' }}
                            >
                              {bonusTexts[index].subtitle}
                            </div>
                          )}
                        </div>
                      </button>
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
              // Last column: tighter spacing for prices
              const prevY = branchLines[index - 1].startY;
              const spacing = currentY - prevY;
              columnCenterY = currentY + (spacing * 0.3); // Reduced from 0.5 to 0.3
            } else {
              // All other columns: tighter center positioning for prices
              const nextY = branchLines[index + 1].startY;
              columnCenterY = currentY + ((nextY - currentY) * 0.45); // Slightly above center
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
                  className="text-white font-mono text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold inline-block relative flex-shrink-0 whitespace-nowrap"
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
                          {bonusPrices[index] || "$297"}
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

        {/* Total Value section - positioned below the last column */}
        <div className="absolute inset-0 pointer-events-none">
          {(() => {
            // Find the last column index (Get Moving Make It Happen Now)
            const lastIndex = bonusTexts.length - 1;
            if (lastIndex < 0) return null;
            
            const branch = branchLines[lastIndex];
            if (!branch) return null;
            
            const currentY = branch.startY;
            // Position below the last column - use spacing similar to column positioning
            const prevY = lastIndex > 0 ? branchLines[lastIndex - 1].startY : currentY;
            const spacing = currentY - prevY;
            // Position below the last column with extra spacing (1.5x spacing for more distance)
            const totalValueY = currentY + (spacing * 1.5);
            const totalValueYPercent = (totalValueY / 1000) * 100;
            
            // Position on the left side, aligned with other titles
            const columnLeftX = isMobile 
              ? LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.1)
              : LEFT_POSITION + ((CENTER_X - LEFT_POSITION) * 0.2);
            
            // Position price on the right side, aligned with other prices
            const verticalLineX = CENTER_X + 170;
            const priceCenterX = (verticalLineX + RIGHT_POSITION) / 2;
            
            return (
              <>
                {/* Total Value Title */}
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${(columnLeftX / 1000) * 100}%`,
                    top: `${totalValueYPercent}%`,
                    transform: 'translate(0%, -50%)',
                    opacity: popInProgress[lastIndex] > 0 ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                    width: 'max-content',
                    maxWidth: isMobile ? 'calc(100vw - 2rem)' : '320px',
                  }}
                >
                  <p 
                    className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Total Value
                  </p>
                </div>
                
                {/* Total Value Price */}
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${(priceCenterX / 1000) * 100}%`,
                    top: `${totalValueYPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: popInProgress[lastIndex] > 0 ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }}
                >
                  <span
                    className="text-white font-mono text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold inline-block relative flex-shrink-0 whitespace-nowrap"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                      opacity: popInProgress[lastIndex] > 0 ? 1 : 0,
                      transform: `scale(${0.3 + popInProgress[lastIndex] * 0.7}) translateY(${(1 - popInProgress[lastIndex]) * 20}px)`,
                      transition: popInProgress[lastIndex] === 0 ? 'none' : 'transform 0.1s ease-out',
                    }}
                  >
                    <span style={{ 
                      position: 'relative',
                      display: 'inline-block',
                    }}>
                      $2,677
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
              </>
            );
          })()}
        </div>
      </div>
      </div>

      {/* Modal for bonus details */}
      {selectedBonus !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedBonus(null)}
        >
          <div 
            className="bg-black border border-white/10 rounded-sm p-4 sm:p-6 md:p-10 mx-auto flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '600px',
            }}
          >
            {/* Geometry background canvas */}
            <canvas
              ref={modalGeometryCanvasRef}
              className="absolute inset-0 pointer-events-none rounded-sm"
              style={{ opacity: 0.6 }}
            />
            
             <div className="flex justify-between items-start mb-6 flex-shrink-0 relative z-10">
               <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white flex-1 pr-4">
                 {bonusDescriptions[selectedBonus]?.title}
               </h3>
              <button
                onClick={() => setSelectedBonus(null)}
                className="text-white/50 hover:text-white/80 text-6xl font-light flex-shrink-0 transition-colors leading-none"
                aria-label="Close"
                style={{ lineHeight: '1' }}
              >
                ×
              </button>
            </div>
             <div className="space-y-5 flex-1 relative z-10" style={{ paddingRight: 'clamp(20px, 8vw, 100px)', paddingBottom: 'clamp(20px, 8vw, 100px)' }}>
               {bonusDescriptions[selectedBonus]?.description.map((paragraph, idx) => (
                 <p 
                   key={idx}
                   className="text-white/70 text-base md:text-lg lg:text-xl font-sans leading-relaxed"
                 >
                   {paragraph}
                 </p>
               ))}
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
    </React.Fragment>
  );
}
