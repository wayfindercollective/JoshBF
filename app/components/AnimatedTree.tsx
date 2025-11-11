'use client';

import React, { useEffect, useRef } from "react";

type AnimatedTreeOpts = {
  lineWidth?: number;
  totalDuration?: number;
  pauseMs?: number;
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function AnimatedTree({
  lineWidth = 8,
  totalDuration = 4000,
  pauseMs = 50,
  stroke = "#ffffff",
  width = 96,
  height = 96,
  className = "",
  style = {},
}: AnimatedTreeOpts) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Helper to create path with initial hidden state
  const createPath = (d: string) => (
    <path 
      d={d} 
      style={{ 
        strokeDasharray: '1000', 
        strokeDashoffset: '1000',
        transition: 'none'
      }} 
    />
  );

  useEffect(() => {
    const svg = svgRef.current!;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));

    // Update paths with correct lengths (override initial placeholder values)
    for (const p of paths) {
      const L = p.getTotalLength();
      p.style.strokeDasharray = `${L}`;
      p.style.strokeDashoffset = `${L}`;
    }

    // Calculate timing: total duration minus pauses
    const numPauses = paths.length - 1;
    const totalPauseTime = numPauses * pauseMs;
    const totalDrawTime = totalDuration - totalPauseTime;
    const drawMsPerPath = totalDrawTime / paths.length;

    let stop = false;
    let i = 0;

    const animatePath = async (p: SVGPathElement) => {
      const L = p.getTotalLength();
      const start = performance.now();
      return new Promise<void>((resolve) => {
        const step = (t: number) => {
          if (stop) return resolve();

          const elapsed = t - start;
          const k = Math.min(1, elapsed / drawMsPerPath);

          const offset = L * (1 - k);

          p.style.strokeDashoffset = `${offset}`;

          if (k < 1) requestAnimationFrame(step);
          else resolve();
        };

        requestAnimationFrame(step);
      });
    };

    const run = async () => {
      // Small delay to ensure paths are hidden before starting
      await new Promise(r => setTimeout(r, 50));
      
      for (; i < paths.length; i++) {
        await animatePath(paths[i]);
        if (i < paths.length - 1) {
          await new Promise(r => setTimeout(r, pauseMs));
        }
      }
    };

    run();

    return () => { stop = true; };
  }, [totalDuration, pauseMs]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 1000"
      width={width}
      height={height}
      fill="none"
      stroke={stroke}
      strokeWidth={lineWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Ground line - horizontal line below trunk and roots */}
      {createPath("M100 800 L900 800")}

      {/* Trunk - single straight vertical line from ground up to branches */}
      {createPath("M500 800 L500 500")}

      {/* Central diamond - at junction of trunk and branches */}
      {createPath("M500 500 L520 520 L500 540 L480 520 Z")}

      {/* Branches - curved lines fanning out from center point */}
      {createPath("M500 500 Q450 480 400 450")}
      {createPath("M500 500 Q550 480 600 450")}
      {createPath("M500 500 Q430 490 360 480")}
      {createPath("M500 500 Q570 490 640 480")}
      {createPath("M500 500 Q420 500 350 510")}
      {createPath("M500 500 Q580 500 650 510")}

      {/* Canopy - single continuous cloud-like outline */}
      {createPath("M250 450 C200 450 150 400 200 350 C250 300 350 280 450 300 C550 280 650 300 750 350 C800 400 800 450 750 480 C700 520 600 540 500 520 C400 540 300 520 250 480 C200 450 250 450 250 450 Z")}

      {/* Roots - curved lines below ground mirroring branches */}
      {createPath("M500 800 Q450 820 400 850")}
      {createPath("M500 800 Q550 820 600 850")}
      {createPath("M500 800 Q430 810 360 820")}
      {createPath("M500 800 Q570 810 640 820")}
      {createPath("M500 800 Q420 800 350 800")}
      {createPath("M500 800 Q580 800 650 800")}
    </svg>
  );
}

