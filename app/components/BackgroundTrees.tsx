'use client';

import Image from 'next/image';

export default function BackgroundTrees() {
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

  // Responsive tree size - scales proportionally with screen size
  const treeSizeMobile = 64; // Smaller on mobile
  const treeSizeDesktop = 96; // Desktop size

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
              width: `${treeSizeMobile}px`, 
              height: `${treeSizeMobile}px`,
            }}
          >
            <Image
              src="/Tree of life.png"
              alt="Tree"
              width={96}
              height={96}
              className="drop-shadow-sm tree-image w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
              style={{ objectFit: 'contain' }}
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


