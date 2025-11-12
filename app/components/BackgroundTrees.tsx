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

  const treeSize = 96; // Tree size

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="absolute opacity-40"
          style={{
            left: `${tree.x}%`,
            top: '1.5rem', // Match CountdownTimer's top-6 (24px)
            width: `${treeSize}px`,
            height: `${treeSize}px`,
            transform: `translate(-50%, 0) rotate(${tree.rotation}deg) scale(${tree.scale})`,
          }}
        >
          <div className="tree-reveal" style={{ width: `${treeSize}px`, height: `${treeSize}px` }}>
            <Image
              src="/Tree of life.png"
              alt="Tree"
              width={treeSize}
              height={treeSize}
              className="drop-shadow-sm tree-image"
              style={{ width: `${treeSize}px`, height: `${treeSize}px`, objectFit: 'contain' }}
            />
            <div className="tree-brightness-overlay"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

