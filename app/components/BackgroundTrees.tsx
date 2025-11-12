'use client';

import Image from 'next/image';

export default function BackgroundTrees() {
  // Two trees positioned at top corners
  const trees = [
    {
      id: 1,
      x: 5, // Upper left corner (original position)
      y: 15, // Near top/hero section (original position)
      rotation: 0, // Upright
      scale: 1, // Same size
    },
    {
      id: 2,
      x: 95, // Upper right corner (mirroring left)
      y: 15, // Same vertical position as left
      rotation: 0, // Upright
      scale: 1, // Same size
    },
  ];

  const treeSize = 96; // Same size for both trees

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="absolute opacity-40"
          style={{
            left: `${tree.x}%`,
            top: `${tree.y}%`,
            width: `${treeSize}px`,
            height: `${treeSize}px`,
            transform: `translate(-50%, -50%) rotate(${tree.rotation}deg) scale(${tree.scale})`,
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

