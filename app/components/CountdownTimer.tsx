'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    // Calculate time remaining from now until 24 hours from now
    const endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        // Timer expired, reset to 24 hours
        setTimeRemaining({ hours: 24, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Button size: 120% increase on mobile, 150% on desktop (64px * 1.2 = 77px mobile, 96px * 1.5 = 144px desktop)
  const buttonSizeMobile = 77;
  const buttonSizeDesktop = 144; // 96px * 1.5 = 144px
  const currentButtonSize = isDesktop ? buttonSizeDesktop : buttonSizeMobile;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-12 lg:right-16 z-50">
      <div 
        className="bg-orange-red text-white rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden" 
        style={{ 
          width: `${currentButtonSize}px`, 
          height: `${currentButtonSize}px`, 
          minWidth: `${currentButtonSize}px`, 
          minHeight: `${currentButtonSize}px`,
        }}
      >
        {/* Tree logo background with shine effect */}
        <div className="absolute inset-0 opacity-30 z-0 overflow-hidden rounded-full">
          <Image
            src="/Tree of life.png"
            alt=""
            width={144}
            height={144}
            className="w-full h-full object-contain relative z-0"
            style={{ objectFit: 'contain' }}
          />
          {/* Shine effect overlay - sweeps from bottom to top, only on tree logo */}
          <div 
            className="absolute shine-overlay pointer-events-none z-[1]"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.4) 70%, transparent 100%)',
              width: '100%',
              height: '50%',
              left: 0,
              top: 0,
              borderRadius: '50%',
              animation: 'shine 3s ease-in-out infinite',
            }}
          />
        </div>
        
        {/* Text content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-1">
          <div className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-tight mb-0.5 text-center font-handwritten leading-tight">
            Black Friday
          </div>
          <div className="text-center font-handwritten font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
            <span className="tabular-nums">
              {String(timeRemaining.hours).padStart(2, '0')}:
              {String(timeRemaining.minutes).padStart(2, '0')}:
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-center mt-0.5 text-white/80 font-handwritten leading-tight">
            Remaining
          </div>
        </div>
      </div>
    </div>
  );
}

