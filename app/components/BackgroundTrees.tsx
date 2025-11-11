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
            className="drop-shadow-sm"
          >
            {/* Roots */}
            <path d="M24 32 L20 40 M24 32 L22 40 M24 32 L26 40 M24 32 L28 40" />
            {/* Trunk */}
            <line x1="24" y1="32" x2="24" y2="20" />
            {/* Branches */}
            <line x1="24" y1="20" x2="20" y2="16" />
            <line x1="24" y1="20" x2="28" y2="16" />
            <line x1="24" y1="24" x2="18" y2="20" />
            <line x1="24" y1="24" x2="30" y2="20" />
            {/* Leaves/Canopy - simple circles */}
            <circle cx="20" cy="14" r="3" fill="white" opacity="0.3" />
            <circle cx="28" cy="14" r="3" fill="white" opacity="0.3" />
            <circle cx="18" cy="18" r="2.5" fill="white" opacity="0.3" />
            <circle cx="30" cy="18" r="2.5" fill="white" opacity="0.3" />
            <circle cx="24" cy="12" r="2" fill="white" opacity="0.3" />
          </svg>
        </div>
      ))}
    </div>
  );
}

