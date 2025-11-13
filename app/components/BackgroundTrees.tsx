'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BackgroundTrees() {
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Tree positioned at top left corner, aligned with Black Friday sticker
  const trees = [
    {
      id: 1,
      x: 5, // Upper left corner (original position)
      y: 0, // Will be positioned using top value to align with CountdownTimer
      rotation: 0, // Upright
      scale: 1, // Same size
    },
  ];

  // Responsive tree size - scales proportionally with screen size (120% increase on mobile, 150% on desktop)
  const treeSizeMobile = 77; // 64px * 1.2 = 76.8px ≈ 77px
  const treeSizeDesktop = 144; // 96px * 1.5 = 144px
  const currentTreeSize = isDesktop ? treeSizeDesktop : treeSizeMobile;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="absolute opacity-40"
          style={{
            left: `${tree.x}%`,
            top: '1rem', // Match CountdownTimer's top-4 on mobile (16px), sm:top-6 (24px)
          }}
        >
          <div 
            className="tree-reveal"
            style={{ 
              width: `${currentTreeSize}px`, 
              height: `${currentTreeSize}px`,
            }}
          >
            <Image
              src="/Tree of life.png"
              alt="Tree"
              width={144}
              height={144}
              className="drop-shadow-sm tree-image"
              style={{ 
                objectFit: 'contain', 
                maxWidth: '100%', 
                width: `${currentTreeSize}px`,
                height: `${currentTreeSize}px`,
              }}
            />
            <div 
              className="tree-brightness-overlay"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}


