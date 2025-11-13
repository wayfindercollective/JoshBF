'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

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

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-12 lg:right-16 z-50">
      <div className="bg-orange-red text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded shadow-lg border-2 border-white/20 backdrop-blur-sm">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-1.5 sm:mb-2 text-center font-mono">
          Black Friday Special
        </div>
        <div className="text-center font-mono font-bold text-xl sm:text-2xl md:text-3xl">
          <span className="tabular-nums">
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-center mt-1.5 sm:mt-2 text-white/80 font-mono">
          Time Remaining
        </div>
      </div>
    </div>
  );
}

