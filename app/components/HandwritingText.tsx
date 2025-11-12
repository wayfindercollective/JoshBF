'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface TypewriterTextProps {
  text: string;
  totalDuration?: number;
  className?: string;
  fontStyle?: 'mono' | 'handwritten';
  startDelay?: number;
}

export default function TypewriterText({ 
  text, 
  totalDuration = 2000,
  className = '',
  fontStyle = 'handwritten',
  startDelay = 0
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Handle start delay
    if (!hasStarted && startDelay > 0) {
      const delayTimer = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(delayTimer);
    }

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (hasStarted && currentIndex < text.length) {
      // Calculate base speed to complete in totalDuration
      const visibleChars = text.replace(/\n/g, '').length;
      const baseSpeed = totalDuration / visibleChars;
      
      // Add natural variation: faster for spaces, slower for punctuation
      let delay = baseSpeed;
      const currentChar = text[currentIndex];
      
      if (currentChar === ' ') {
        delay = baseSpeed * 0.3; // Faster for spaces
      } else if (currentChar === '.' || currentChar === ',' || currentChar === '!') {
        delay = baseSpeed * 2.0; // Slower for punctuation (like pausing)
      } else if (currentChar === '\n') {
        delay = baseSpeed * 0.5; // Quick line breaks
      } else {
        // Random variation between 0.8x and 1.2x for natural feel
        delay = baseSpeed * (0.8 + Math.random() * 0.4);
      }
      
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        if (currentIndex + 1 >= text.length) {
          setIsComplete(true);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, totalDuration, hasStarted, startDelay]);

  const fontClass = fontStyle === 'mono' ? 'font-mono' : 'font-handwritten';
  
  // Render text with line breaks preserved and replace P with logo
  const renderText = () => {
    // Remove any newline characters and split by them to create line breaks
    // Also handle any literal backslash-n sequences just in case
    let processedText = displayedText.replace(/\\n/g, '\n'); // Convert literal \n to newline
    processedText = processedText.replace(/\n/g, '|NEWLINE|'); // Replace newlines with marker
    
    // Replace only the first P in "Find Purpose" (not in other instances)
    // Match "Find Purpose" specifically and replace only that P
    processedText = processedText.replace(/Find Purpose/, (match) => {
      return 'Find |LOGO|urpose'; // Replace P with logo marker
    });
    
    const parts = processedText.split(/(\|NEWLINE\||\|LOGO\|)/);
    
    return parts.map((part, index) => {
      if (part === '|NEWLINE|') {
        return <br key={index} />;
      } else if (part === '|LOGO|') {
        return (
          <span key={index} className="inline-block align-middle -mr-1">
            <Image
              src="/polarity-systems-logo.png"
              alt="P"
              width={78}
              height={78}
              className="inline-block filter brightness-0 invert"
              style={{ verticalAlign: 'middle', height: '1.3em', width: 'auto' }}
            />
          </span>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <span className={`${fontClass} ${className}`}>
      {renderText()}
      {!isComplete && hasStarted && (
        <span className="typewriter-cursor inline-block ml-1">|</span>
      )}
    </span>
  );
}
