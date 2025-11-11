"use client";

import React, { useEffect, useRef } from "react";



export default function WriteTree({

  size = 720,

  stroke = "#ffffff",

  bg = "#000000",

  width = 18,

  perPathMs = 420,

  gapMs = 70,

}: {

  size?: number;

  stroke?: string;

  bg?: string;

  width?: number;

  perPathMs?: number;

  gapMs?: number;

}) {

  const svgRef = useRef<SVGSVGElement | null>(null);



  useEffect(() => {

    const svg = svgRef.current!;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));



    if (paths.length !== 20) {

      console.error("Tree geometry changed. Expected 20 paths.");

      return;

    }



    for (const p of paths) {

      const L = p.getTotalLength();

      p.style.strokeDasharray = `${L}`;

      p.style.strokeDashoffset = `${L}`;

    }



    let stop = false;



    const drawOne = (p: SVGPathElement) =>

      new Promise<void>((resolve) => {

        const L = p.getTotalLength();

        const t0 = performance.now();

        const tick = (t: number) => {

          if (stop) return resolve();

          const k = Math.min(1, (t - t0) / perPathMs);

          p.style.strokeDashoffset = `${L * (1 - k)}`;

          if (k < 1) requestAnimationFrame(tick);

          else resolve();

        };

        requestAnimationFrame(tick);

      });



    (async () => {

      for (const p of paths) {

        await drawOne(p);

        await new Promise((r) => setTimeout(r, gapMs));

      }

    })();



    return () => {

      stop = true;

    };

  }, [perPathMs, gapMs]);



  return (

    <div style={{ background: bg, display: "grid", placeItems: "center", width: "100%", height: "100%" }}>

      <svg

        ref={svgRef}

        viewBox="0 0 1000 1000"

        width={size}

        height={size}

        fill="none"

        stroke={stroke}

        strokeWidth={width}

        strokeLinecap="round"

        strokeLinejoin="round"

        dangerouslySetInnerHTML={{ __html: svgInner }}

      />

    </div>

  );

}



const svgInner = `

  <path id="p01" d="M120 650 H880"/>

  <path id="p02" d="M500 530 L540 570 L500 610 L460 570 Z"/>

  <path id="p03" d="M500 610 C500 670 500 700 520 720 C560 760 620 800 620 860"/>

  <path id="p04" d="M500 610 C500 670 500 700 480 720 C440 760 380 800 380 860"/>

  <path id="p05" d="M380 860 C380 820 340 800 300 800"/>

  <path id="p06" d="M420 860 C420 820 420 800 400 780"/>

  <path id="p07" d="M500 860 C500 800 500 780 500 740"/>

  <path id="p08" d="M580 860 C580 820 580 800 600 780"/>

  <path id="p09" d="M620 860 C620 820 660 800 700 800"/>

  <path id="p10" d="M260 430 C260 330 360 270 470 270 C520 240 640 250 700 300 C770 290 860 360 840 470 C830 540 770 590 690 590 C640 620 560 630 500 610 C440 630 360 620 310 590 C240 560 220 500 240 460 Z"/>

  <path id="p11" d="M500 530 C470 500 450 470 450 430"/>

  <path id="p12" d="M500 530 C530 500 550 470 550 430"/>

  <path id="p13" d="M500 540 C440 520 410 490 390 450"/>

  <path id="p14" d="M500 540 C560 520 590 490 610 450"/>

  <path id="p15" d="M500 550 C430 560 380 580 340 610"/>

  <path id="p16" d="M500 550 C570 560 620 580 660 610"/>

  <path id="p17" d="M340 610 C300 610 260 580 260 540"/>

  <path id="p18" d="M660 610 C700 610 740 580 740 540"/>

  <path id="p19" d="M390 450 C360 420 360 380 380 350"/>

  <path id="p20" d="M610 450 C640 420 640 380 620 350"/>

`;

