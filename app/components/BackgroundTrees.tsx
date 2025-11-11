'use client';

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
          <svg
            width="96"
            height="96"
            viewBox="0 0 48 48"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          >
            {/* Roots - simple lines spreading outward */}
            <line x1="24" y1="32" x2="20" y2="40" />
            <line x1="24" y1="32" x2="22" y2="42" />
            <line x1="24" y1="32" x2="24" y2="43" />
            <line x1="24" y1="32" x2="26" y2="42" />
            <line x1="24" y1="32" x2="28" y2="40" />
            
            {/* Trunk - simple vertical line */}
            <line x1="24" y1="32" x2="24" y2="16" />
            
            {/* Branches - simple horizontal/angled lines */}
            <line x1="24" y1="16" x2="18" y2="12" />
            <line x1="24" y1="16" x2="30" y2="12" />
            <line x1="24" y1="20" x2="16" y2="14" />
            <line x1="24" y1="20" x2="32" y2="14" />
            
            {/* Canopy - simple triangle shape made of lines */}
            <line x1="16" y1="12" x2="12" y2="8" />
            <line x1="12" y1="8" x2="24" y2="6" />
            <line x1="24" y1="6" x2="36" y2="8" />
            <line x1="36" y1="8" x2="32" y2="12" />
          </svg>
        </div>
      ))}
    </div>
  );
}

