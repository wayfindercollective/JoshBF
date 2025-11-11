'use client';

import { useState } from 'react';

export default function EnvelopeWithText() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="inline-block relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Envelope SVG - More detailed */}
      <div className="relative inline-block">
        {/* Envelope base SVG */}
        <svg
          width="320"
          height="140"
          viewBox="0 0 320 140"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className="transition-all duration-300"
        >
          {/* Envelope back/base - main body */}
          <path
            d="M20 35 L160 95 L300 35 L300 125 L20 125 Z"
            fill="rgba(255, 255, 255, 0.1)"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Left side fold detail */}
          <path
            d="M20 35 L20 125"
            stroke="white"
            strokeWidth="2"
            opacity="0.7"
          />
          
          {/* Right side fold detail */}
          <path
            d="M300 35 L300 125"
            stroke="white"
            strokeWidth="2"
            opacity="0.7"
          />
          
          {/* Bottom fold line */}
          <line
            x1="20"
            y1="125"
            x2="300"
            y2="125"
            stroke="white"
            strokeWidth="2"
            opacity="0.7"
          />
          
          {/* Envelope front outline */}
          <path
            d="M20 35 L160 95 L300 35 L300 125 L20 125 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Sealed edge detail - dashed line where flap meets envelope */}
          {!isHovered && (
            <path
              d="M20 35 L160 95 L300 35"
              stroke="white"
              strokeWidth="1"
              opacity="0.5"
              strokeDasharray="3 3"
            />
          )}
          
          {/* Inner shadow/depth lines */}
          <line
            x1="30"
            y1="45"
            x2="290"
            y2="45"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line
            x1="30"
            y1="115"
            x2="290"
            y2="115"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>

        {/* Envelope flap - opens upward uniformly from top edge */}
        <svg
          width="320"
          height="140"
          viewBox="0 0 320 140"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className="absolute top-0 left-0"
          style={{
            transformOrigin: '160px 35px',
            transform: isHovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'transform 0.5s ease-out',
            pointerEvents: 'none',
          }}
        >
          {/* Flap main shape */}
          <path
            d="M20 35 L160 95 L300 35"
            fill="rgba(255, 255, 255, 0.15)"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Flap fold line */}
          <line
            x1="20"
            y1="35"
            x2="300"
            y2="35"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Wax seal on flap */}
          <g opacity={isHovered ? 0 : 1} style={{ transition: 'opacity 0.3s' }}>
            {/* Outer seal circle */}
            <circle
              cx="160"
              cy="65"
              r="10"
              fill="rgba(255, 255, 255, 0.25)"
              stroke="white"
              strokeWidth="2"
            />
            {/* Inner seal circle */}
            <circle
              cx="160"
              cy="65"
              r="6"
              fill="rgba(255, 255, 255, 0.15)"
            />
            {/* Seal detail - cross pattern */}
            <line x1="160" y1="58" x2="160" y2="72" stroke="white" strokeWidth="1" opacity="0.6" />
            <line x1="153" y1="65" x2="167" y2="65" stroke="white" strokeWidth="1" opacity="0.6" />
            {/* Seal shine */}
            <ellipse cx="157" cy="62" rx="2" ry="1.5" fill="rgba(255, 255, 255, 0.4)" />
          </g>
        </svg>

        {/* Text - only visible when hovering and moving up */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out whitespace-nowrap ${
            isHovered 
              ? 'opacity-100 translate-y-[-100px]' 
              : 'opacity-0 translate-y-0'
          }`}
          style={{
            top: '70px', // Starting position inside envelope
          }}
        >
          <span className="font-handwritten font-bold text-white text-lg bg-black/60 px-4 py-2 rounded backdrop-blur-sm shadow-lg">
            Purpose Transformation Blueprint
          </span>
        </div>
      </div>
    </div>
  );
}

