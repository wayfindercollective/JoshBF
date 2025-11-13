'use client';

import { useState, useEffect, useCallback } from 'react';

const ACTUAL_TEXT = 'Purpose Transformation Blueprint';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface EnvelopeWithTextProps {
  onAnimationComplete?: () => void;
}

export default function EnvelopeWithText({ onAnimationComplete }: EnvelopeWithTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);

  // Generate random scrambled text
  const generateScrambled = useCallback(() => {
    return ACTUAL_TEXT
      .split('')
      .map((char) => (char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
      .join('');
  }, []);

  // Auto-trigger animation on page load - wait for typewriter to complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHovered(true);
    }, 2200); // Wait for typewriter (2000ms) + small buffer (200ms)

    return () => clearTimeout(timer);
  }, []);

  // Scrambling effect when text appears - starts when text emerges from envelope
  useEffect(() => {
    if (!isHovered) return;

    let scrambleInterval: NodeJS.Timeout;
    let revealTimer: NodeJS.Timeout;

    // Delay scrambling to start when text actually emerges (0.3s transition delay + small buffer)
    const startScrambleTimer = setTimeout(() => {
      setIsScrambling(true);
      setDisplayText(generateScrambled());

      scrambleInterval = setInterval(() => {
        setDisplayText(generateScrambled());
      }, 50); // Update every 50ms for fast scrambling

      revealTimer = setTimeout(() => {
        clearInterval(scrambleInterval);
        setIsScrambling(false);
        setDisplayText(ACTUAL_TEXT);
        // Animation complete: hover (0.3s) + scramble delay (0.35s) + scramble duration (0.5s) = ~1.15s
        setTimeout(() => {
          setAnimationComplete(true);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }, 100); // Small buffer after text reveals
      }, 500); // Scramble for 0.5 seconds
    }, 350); // Start scrambling 350ms after hover (when text emerges)

    return () => {
      clearTimeout(startScrambleTimer);
      if (scrambleInterval) clearInterval(scrambleInterval);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [isHovered, generateScrambled, onAnimationComplete]);

  const [isHoveringText, setIsHoveringText] = useState(false);

  return (
    <div 
      className="inline-block relative cursor-pointer"
    >
      {/* Envelope SVG - More detailed */}
      <div className="relative inline-block w-64 h-28 sm:w-72 sm:h-32 md:w-80 md:h-36">
        {/* Envelope base SVG */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 140"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className="transition-all duration-300"
          preserveAspectRatio="xMidYMid meet"
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
            stroke={animationComplete ? "rgba(255,255,255,1)" : "white"}
            strokeWidth={animationComplete ? "2.5" : "2"}
            className={animationComplete ? "envelope-outline-shine" : ""}
            style={{
              filter: animationComplete 
                ? 'drop-shadow(0 0 8px rgba(255,255,255,0.9)) brightness(1.15)'
                : 'none',
              transition: 'filter 0.3s ease, stroke-width 0.3s ease, stroke 0.3s ease',
            }}
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
        </svg>

        {/* Envelope flap - slides upward */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 140"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className="absolute top-0 left-0"
          style={{
            transform: isHovered ? 'translateY(-80px)' : 'translateY(0px)',
            opacity: isHovered ? 0 : 1,
            transition: 'transform 0.6s ease-out, opacity 0.5s ease-out',
            pointerEvents: 'none',
          }}
          preserveAspectRatio="xMidYMid meet"
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

        {/* Text - emerges from envelope with dramatic animation */}
        <div
          className={`absolute left-1/2 whitespace-nowrap ${
            isHovered 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
          style={{
            top: 'clamp(56px, 18vw, 70px)', // Responsive top position
            transform: isHovered ? 'translate(-50%, -140px) scale(1.25)' : 'translate(-50%, -20px) scale(0.5)',
            transition: isHovered ? 'opacity 0.4s ease-out 0.3s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s' : 'opacity 0.3s ease-out, transform 0.3s ease-out',
          }}
        >
          <div className="relative inline-block" style={{ overflow: 'visible' }}>
            <span 
              className={`font-handwritten font-bold text-white text-base sm:text-lg md:text-xl lg:text-2xl relative overflow-hidden inline-block blueprint-text ${animationComplete ? 'blueprint-text-shine' : ''}`}
              style={{
                animation: isHovered ? 'textPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards, textPulse 2s ease-in-out 1.1s infinite' : 'none',
                padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                position: 'relative',
                filter: animationComplete
                  ? 'drop-shadow(0 0 6px rgba(188,69,0,0.8))'
                  : 'none',
                transition: 'filter 0.3s ease',
              }}
            >
              {/* Blueprint grid pattern overlay */}
              <span 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(188, 69, 0, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(188, 69, 0, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0',
                }}
              />
              {/* Corner marks like blueprint annotations */}
              <span className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-orange-red ${animationComplete ? 'opacity-90' : 'opacity-60'} transition-opacity duration-300`} style={animationComplete ? { filter: 'drop-shadow(0 0 3px rgba(188,69,0,0.8))' } : {}} />
              <span className={`absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-orange-red ${animationComplete ? 'opacity-90' : 'opacity-60'} transition-opacity duration-300`} style={animationComplete ? { filter: 'drop-shadow(0 0 3px rgba(188,69,0,0.8))' } : {}} />
              <span className={`absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-orange-red ${animationComplete ? 'opacity-90' : 'opacity-60'} transition-opacity duration-300`} style={animationComplete ? { filter: 'drop-shadow(0 0 3px rgba(188,69,0,0.8))' } : {}} />
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-orange-red ${animationComplete ? 'opacity-90' : 'opacity-60'} transition-opacity duration-300`} style={animationComplete ? { filter: 'drop-shadow(0 0 3px rgba(188,69,0,0.8))' } : {}} />
              
              <span 
                className="relative z-10"
                onMouseEnter={() => setIsHoveringText(true)}
                onMouseLeave={() => setIsHoveringText(false)}
                style={{
                  display: 'inline-block',
                  animation: animationComplete && !isHoveringText ? 'envelopeTextPulse 2.5s ease-in-out infinite' : 'none',
                  transform: isHoveringText ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <span
                  style={{
                    color: animationComplete ? (isHoveringText ? '#ff6b35' : '#ff6b35') : '#bc4500', // Brighter orange once animation completes
                    filter: animationComplete
                      ? isHoveringText
                        ? 'drop-shadow(0 0 10px rgba(255,107,53,1)) brightness(1.2)'
                        : 'drop-shadow(0 0 8px rgba(255,107,53,0.9)) brightness(1.15)'
                      : 'drop-shadow(0 0 8px rgba(188,69,0,0.8))',
                    fontWeight: animationComplete ? '900' : 'bold',
                    textShadow: animationComplete
                      ? isHoveringText
                        ? '0 0 12px rgba(255,107,53,0.9), 0 0 18px rgba(255,107,53,0.7)'
                        : '0 0 10px rgba(255,107,53,0.8), 0 0 15px rgba(255,107,53,0.6)'
                      : 'none',
                    transition: 'filter 0.3s ease, color 0.3s ease, text-shadow 0.3s ease',
                    display: 'inline-block',
                  }}
                >
                  {displayText || ACTUAL_TEXT}
                </span>
              </span>
              {isHovered && (
                <span 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-red/20 to-transparent pointer-events-none"
                  style={{
                    animation: 'shimmer 2s ease-in-out infinite',
                  }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

