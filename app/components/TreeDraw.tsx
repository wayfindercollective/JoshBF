'use client';

import React from "react";
import AnimatedTree from './AnimatedTree';

type DrawOpts = {
  lineWidth?: number;
  totalDuration?: number;
  pauseMs?: number;
  stroke?: string;
  bg?: string;
};

export default function TreeDraw({
  lineWidth = 8,
  totalDuration = 4000,
  pauseMs = 50,
  stroke = "#ffffff",
  bg = "#000000",
}: DrawOpts) {
  return (
    <div style={{ background: bg, width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <AnimatedTree
        lineWidth={lineWidth}
        totalDuration={totalDuration}
        pauseMs={pauseMs}
        stroke={stroke}
        width={700}
        height={700}
      />
    </div>
  );
}

