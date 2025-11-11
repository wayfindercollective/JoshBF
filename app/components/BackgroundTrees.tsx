'use client';

import Image from 'next/image';

export default function BackgroundTrees() {
  // Two trees positioned strategically
  const trees = [
    {
      id: 1,
      x: 5, // Left corner near hero
      y: 15, // Near top/hero section
      rotation: 0, // Upright
      scale: 1, // Full size
    },
    {
      id: 2,
      x: 85, // Right side
      y: 60, // Middle area
      rotation: 0, // Upright
      scale: 1, // Full size
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="absolute opacity-20"
          style={{
            left: `${tree.x}%`,
            top: `${tree.y}%`,
            transform: `translate(-50%, -50%) rotate(${tree.rotation}deg) scale(${tree.scale})`,
          }}
        >
          <div className="tree-reveal">
            <Image
              src="/Tree.png"
              alt="Tree"
              width={96}
              height={96}
              className="drop-shadow-sm tree-image"
            />
            <div className="tree-brightness-overlay"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

