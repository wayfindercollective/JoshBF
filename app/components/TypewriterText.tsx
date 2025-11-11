'use client';

import { useState, useEffect } from 'react';

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
      // Count only visible characters (exclude newlines from duration calculation)
      const visibleChars = text.replace(/\n/g, '').length;
      const baseSpeed = totalDuration / visibleChars;
      
      // Add natural variation: faster for spaces, slower for punctuation, random variation
      let delay = baseSpeed;
      const currentChar = text[currentIndex];
      
      if (currentChar === ' ') {
        delay = baseSpeed * 0.3; // Faster for spaces
      } else if (currentChar === '.' || currentChar === ',' || currentChar === '!') {
        delay = baseSpeed * 1.8; // Slower for punctuation (like pausing)
      } else if (currentChar === '\n') {
        delay = baseSpeed * 0.3; // Quick line breaks - don't display the character
      } else {
        // Random variation between 0.7x and 1.3x for natural feel
        delay = baseSpeed * (0.7 + Math.random() * 0.6);
      }
      
      const timer = setTimeout(() => {
        // Build displayed text, replacing newlines with empty string for display
        const textToDisplay = text.slice(0, currentIndex + 1);
        setDisplayedText(textToDisplay);
        setCurrentIndex(currentIndex + 1);
        
        if (currentIndex + 1 >= text.length) {
          setIsComplete(true);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, totalDuration, hasStarted, startDelay]);

  const fontClass = fontStyle === 'mono' ? 'font-mono' : 'font-handwritten';
  
  // Render text with line breaks preserved - filter out newline characters from display
  const renderText = () => {
    // Remove any newline characters and split by them to create line breaks
    // Also handle any literal backslash-n sequences just in case
    let processedText = displayedText.replace(/\\n/g, '\n'); // Convert literal \n to newline
    processedText = processedText.replace(/\n/g, '|NEWLINE|'); // Replace newlines with marker
    const parts = processedText.split('|NEWLINE|');
    
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && <br />}
      </span>
    ));
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

