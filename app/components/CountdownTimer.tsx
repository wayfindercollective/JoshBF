'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Helper function to create a date in PST (Pacific Standard Time, UTC-8)
// PST is UTC-8, so 11:59pm PST = 7:59am UTC the next day
// For November dates, we're in PST (not PDT) since DST ends in early November
function createPSTDate(year: number, month: number, day: number, hour: number, minute: number = 0): number {
  // Convert PST to UTC: PST is UTC-8, so we add 8 hours
  // Date.UTC uses 0-indexed months (0=January, 10=November)
  // Date.UTC automatically handles day/month overflow
  const utcHour = hour + 8; // 11:59pm PST = 07:59 UTC next day
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHour, minute));
  return utcDate.getTime();
}

// Phase definitions
const FINAL_PHASE_DATE = createPSTDate(2025, 11, 30, 23, 59); // Sunday, November 30, 2025, 11:59 PM PST

// Determine current phase and target date
function getCurrentPhase(): { title: string; subtitle: string; targetDate: number } {
  return {
    title: 'Final Phase',
    subtitle: 'Black Friday',
    targetDate: FINAL_PHASE_DATE,
  };
}

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [currentPhase, setCurrentPhase] = useState(() => {
    // Use a default phase to avoid hydration mismatch
    return { title: 'Final Phase', subtitle: 'Black Friday', targetDate: FINAL_PHASE_DATE };
  });
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setInterval(() => {
      const phase = getCurrentPhase();
      setCurrentPhase(phase);
      
      const now = Date.now();
      const remaining = phase.targetDate - now;

      if (remaining <= 0) {
        // Target date has passed
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    }, 1000);

    // Initial calculation
    const phase = getCurrentPhase();
    setCurrentPhase(phase);
    const now = Date.now();
    const remaining = phase.targetDate - now;
    if (remaining > 0) {
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeRemaining({ hours, minutes, seconds });
    }

    return () => clearInterval(timer);
  }, [isMounted]);

  // Button size: 120% increase on mobile, 150% on desktop, then 120% overall increase
  // Desktop size reduced to 75% of original (208px * 0.75 = 156px)
  const buttonSizeMobile = 92; // 77px * 1.2 = 92.4px
  const buttonSizeDesktop = 156; // 208px * 0.75 = 156px
  const currentButtonSize = isDesktop ? buttonSizeDesktop : buttonSizeMobile;
  
  // Text sizes - larger for desktop, reduced to fit properly
  const phase1TextSize = isDesktop 
    ? 'text-xs md:text-sm lg:text-sm' 
    : 'text-xs sm:text-sm md:text-base lg:text-base';
  const blackFridayTextSize = isDesktop 
    ? 'text-xs md:text-sm lg:text-base' 
    : 'text-[11px] sm:text-xs md:text-sm lg:text-sm';
  const timeTextSize = isDesktop 
    ? 'text-lg md:text-xl lg:text-2xl' 
    : 'text-base sm:text-lg md:text-xl lg:text-2xl';
  const remainingTextSize = isDesktop 
    ? 'text-lg md:text-xl lg:text-2xl' 
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center" style={{ textAlign: 'center', padding: isDesktop ? '8px' : '4px', margin: 0, left: 0, right: 0 }}>
          <div className={`${phase1TextSize} font-bold uppercase tracking-tight mb-0.5 font-handwritten leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: '0 4px', display: 'block', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {currentPhase.title}
          </div>
          {currentPhase.subtitle && (
            <div className={`${blackFridayTextSize} font-bold uppercase tracking-tight mb-0.5 font-handwritten leading-tight`} style={{ textAlign: 'center', width: '100%', margin: '0 auto', padding: 0, display: 'block' }}>
              {currentPhase.subtitle}
            </div>
          )}
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

