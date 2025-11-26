'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Helper function to create a date in CST (Central Standard Time, UTC-6)
// CST is UTC-6, so 9am CST = 3pm UTC (15:00 UTC)
// For November dates, we're in CST (not CDT) since DST ends in early November
function createCSTDate(year: number, month: number, day: number, hour: number, minute: number = 0): number {
  // Convert CST to UTC: CST is UTC-6, so we add 6 hours
  // Date.UTC uses 0-indexed months (0=January, 10=November)
  const utcHour = hour + 6; // 9am CST = 15:00 UTC (3pm)
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute));
  return utcDate.getTime();
}

// Phase definitions
const PHASES = [
  {
    name: 'Phase I',
    targetDate: createCSTDate(2025, 11, 20, 9), // November 20, 2025, 9am CST
  },
  {
    name: 'Phase II',
    targetDate: createCSTDate(2025, 11, 23, 9), // November 23, 2025, 9am CST
  },
  {
    name: 'Phase III',
    targetDate: createCSTDate(2025, 11, 26, 9), // November 26, 2025, 9am CST
  },
  {
    name: 'Phase IV',
    targetDate: createCSTDate(2025, 11, 28, 18), // November 28, 2025, 6pm CST
  },
];

// Determine current phase based on current time
function getCurrentPhase(): { phase: typeof PHASES[number] | null; timeRemaining: number } {
  const now = Date.now();
  
  // Check each phase in order
  for (let i = 0; i < PHASES.length; i++) {
    const phase = PHASES[i];
    if (now < phase.targetDate) {
      return { phase, timeRemaining: phase.targetDate - now };
    }
  }
  
  // All phases have passed
  return { phase: null, timeRemaining: 0 };
}

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [currentPhase, setCurrentPhase] = useState<typeof PHASES[number] | null>(PHASES[0]);
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
    const timer = setInterval(() => {
      const { phase, timeRemaining: remaining } = getCurrentPhase();
      
      setCurrentPhase(phase);

      if (remaining <= 0 || !phase) {
        // All phases have passed
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    }, 1000);

    // Initial calculation
    const { phase, timeRemaining: remaining } = getCurrentPhase();
    setCurrentPhase(phase);
    if (remaining > 0 && phase) {
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeRemaining({ hours, minutes, seconds });
    }

    return () => clearInterval(timer);
  }, []);

  // Button size: 120% increase on mobile, 150% on desktop, then 120% overall increase
  const buttonSizeMobile = 92; // 77px * 1.2 = 92.4px
  const buttonSizeDesktop = 208; // 173px * 1.2 = 207.6px
  const currentButtonSize = isDesktop ? buttonSizeDesktop : buttonSizeMobile;
  
  // Text sizes - larger for desktop
  const phase1TextSize = isDesktop 
    ? 'text-base md:text-lg lg:text-xl' 
    : 'text-xs sm:text-sm md:text-base lg:text-base';
  const blackFridayTextSize = isDesktop 
    ? 'text-sm md:text-base lg:text-lg' 
    : 'text-[11px] sm:text-xs md:text-sm lg:text-sm';
  const timeTextSize = isDesktop 
    ? 'text-xl md:text-2xl lg:text-3xl' 
    : 'text-base sm:text-lg md:text-xl lg:text-2xl';
  const remainingTextSize = isDesktop 
    ? 'text-xl md:text-2xl lg:text-3xl' 
    : 'text-base sm:text-lg md:text-xl lg:text-2xl';

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-12 lg:right-16 z-50">
      <div 
        className="text-white rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden" 
        style={{ 
          width: `${currentButtonSize}px`, 
          height: `${currentButtonSize}px`, 
          minWidth: `${currentButtonSize}px`, 
          minHeight: `${currentButtonSize}px`,
        }}
      >
        {/* Orange background with reduced opacity - subtle background */}
        <div className="absolute inset-0 bg-orange-red opacity-10 rounded-full z-0"></div>
        
        {/* Tree logo background with shine effect */}
        <div className="absolute inset-0 opacity-20 z-0 overflow-hidden rounded-full">
          <div className="relative w-full h-full">
            <Image
              src="/Tree of life.png"
              alt=""
              width={144}
              height={144}
              className="w-full h-full object-contain relative z-0"
              style={{ 
                objectFit: 'contain',
                filter: 'brightness(0) saturate(100%) invert(48%) sepia(96%) saturate(1352%) hue-rotate(350deg) brightness(1.1) contrast(1)',
              }}
            />
          </div>
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ textAlign: 'center', padding: 0, margin: 0, left: 0, right: 0 }}>
          <div className={`${phase1TextSize} font-bold uppercase tracking-tight mb-0.5 font-handwritten leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: 0, display: 'block' }}>
            {currentPhase ? currentPhase.name : 'Phase IV'}
          </div>
          <div className={`${blackFridayTextSize} font-bold uppercase tracking-tight mb-0.5 font-handwritten leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: 0, display: 'block' }}>
            Black Friday
          </div>
          <div className={`font-handwritten font-bold ${timeTextSize} leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: 0, display: 'block' }}>
            <span className="tabular-nums" style={{ display: 'inline-block', textAlign: 'center' }}>
              {String(timeRemaining.hours).padStart(2, '0')}:
              {String(timeRemaining.minutes).padStart(2, '0')}:
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
          </div>
          <div className={`${remainingTextSize} mt-0.5 text-white/80 font-handwritten leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: 0, display: 'block' }}>
            Remaining
          </div>
        </div>
      </div>
    </div>
  );
}

