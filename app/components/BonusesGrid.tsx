"use client";

import React, { useState } from "react";
import Image from "next/image";
import RandomScrollReveal from './RandomScrollReveal';

// Bonus content text for each column - split into title and subtitle
const bonusTexts: { title: string; subtitle?: string }[] = [
  { title: "Purpose Transformation" },
  { title: "Goal Setting Workbook & Book On How To Make Progress" },
  { title: "Instinctive Breathwork" },
  { title: "Purpose Profile Personality Test" },
  { title: "Set Fail-Resistant Goals", subtitle: "A Step-By-Step Framework" },
  { title: "Get Moving Make It Happen Now", subtitle: "Building The Life You Want" },
  { title: "The Purpose Paradox", subtitle: "Understand The Truth Of Living With Purpose" },
  { title: "$500 Credit Towards Josh's Mentoring" },
];

// Detailed descriptions for each bonus item
// Can have either a single description array or multiple sections
const bonusDescriptions: { 
  title: string; 
  description?: string[];
  sections?: { title: string; description: string[] }[];
}[] = [
  {
    title: "Purpose Transformation",
    description: [
      "8 weeks of self guided training that moves you from uncertainty to clarity with a simple plan you can apply on your own.",
      "Self paced and flexible."
    ]
  },
  {
    title: "Goal Setting Workbook & Book On How To Make Progress",
    sections: [
      {
        title: "Goal Setting Workbook",
        description: [
          "Build goals that match how you live and think.",
          "Pair vision with awareness so direction is realistic and repeatable.",
          "Small steps. Clear metrics. A plan you can sustain tomorrow and next month."
        ]
      },
      {
        title: "Book On How To Make Progress",
        description: [
          "Three mental models and three short exercises that break inertia fast.",
          "Clarify what actually matters. Stop looping the same problems. Start moving today.",
          "Designed for functionality, performance, and purpose."
        ]
      }
    ]
  },
  {
    title: "Instinctive breathwork: Deeper Awareness",
    description: [
      "Learn a simple discovery method that unlocks the full range of your breathing.",
      "Use it to reach the state you need in the moment. Calm. Focus. Endurance. Recovery.",
      "Not a single technique. A way to find the right technique on demand."
    ]
  },
  {
    title: "Purpose Profile Personality Test",
    description: [
      "Discover your unique purpose profile through a comprehensive personality assessment.",
      "Understand how your natural tendencies align with purposeful living and get personalized insights for your journey."
    ]
  },
  {
    title: "Set \"Fail-Resistant\" Goals",
    description: [
      "Most goal-setting exercises leave out core components needed to make sure you actually cross the finish line.",
      "This video training + workbook will make winning at the goals you set inevitable…",
      "Broken down in a step-by-step framework so that you start setting goals that actually get done!"
    ]
  },
  {
    title: "Get Moving & Make It Happen Now",
    description: [
      "Discover the unfamiliar strategies you need to start taking action today (and every day) toward building the life you want.",
      "Based on the true fundamentals of how to change human behavior. (Probably the opposite of what you're trying now.)"
    ]
  },
  {
    title: "The Purpose Paradox",
    description: [
      "Understand the truth of living with purpose. (FYI: It isn't a discovery. It's a skill set.)",
      "So you can create on a larger scale in your life, and in the smallest moments every day."
    ]
  },
  {
    title: "$500 Credit Towards Josh's Mentoring",
    description: [
      "Includes a $500 credit you can apply to Josh's mentoring. Limited spots for group circles or 1 on 1's.",
      "During our Clarity Call Josh's Head Coach will determine best fit with you."
    ]
  }
];

// Prices for each bonus item (matching order of bonusTexts)
const bonusPrices: string[] = [
  "$1,000", // Purpose Transformation
  "$260",   // Goal Setting Workbook & Book On How To Make Progress
  "$500",   // Instinctive Breathwork
  "$60",    // Purpose Profile Personality Test
  "$300",   // Set Fail-Resistant Goals
  "$300",   // Get Moving Make It Happen Now
  "$350",   // The Purpose Paradox
  "$500",   // $500 Credit Towards Josh's Mentoring
];

export function TotalValue() {
  return (
    <RandomScrollReveal delay={bonusTexts.length * 100} randomDelay={true}>
      {/* Mobile: Text only, no box */}
      <div className="md:hidden text-center">
        <h3 className="font-heading text-sm font-bold mb-1 text-white total-value-title">
          Total Value
        </h3>
        <div className="text-center">
          <span className="text-white font-mono text-base font-bold inline-block relative total-value-price"
          style={{
            textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
          }}>
            $3,270
            <span
              style={{
                position: 'absolute',
                left: '0%',
                right: '0%',
                top: '50%',
                height: '0.1em',
                backgroundColor: '#d9d7b3',
                transform: 'translateY(-50%) rotate(-15deg)',
                transformOrigin: 'center',
                boxShadow: '0 0 4px rgba(217, 215, 179, 0.6)',
                width: '120%',
              }}
            />
          </span>
        </div>
      </div>
      {/* Desktop: Text only, no box */}
      <div className="hidden md:block text-right">
        <h3 className="font-heading text-sm font-bold mb-0.5 text-white total-value-title">
          Total Value
        </h3>
        <div className="text-center">
          <span className="text-white font-mono text-base font-bold inline-block relative total-value-price"
          style={{
            textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4)',
          }}>
            $3,270
            <span
              style={{
                position: 'absolute',
                left: '0%',
                right: '0%',
                top: '50%',
                height: '0.1em',
                backgroundColor: '#d9d7b3',
                transform: 'translateY(-50%) rotate(-15deg)',
                transformOrigin: 'center',
                boxShadow: '0 0 4px rgba(217, 215, 179, 0.6)',
                width: '120%',
              }}
            />
          </span>
        </div>
      </div>
    </RandomScrollReveal>
  );
}

export default function BonusesGrid() {
  const [selectedBonus, setSelectedBonus] = useState<number | null>(null);

  return (
    <>
      {/* Vertical List Layout - Same for Desktop and Mobile */}
      <div className="space-y-1 sm:space-y-2 md:space-y-2.5 mb-2 sm:mb-3 md:mb-4">
        {bonusTexts.map((bonus, index) => (
          <RandomScrollReveal key={`bonus-${index}`} delay={index * 100} randomDelay={true}>
            <button
              onClick={() => {
                setSelectedBonus(index);
              }}
              className="backdrop-blur-sm border rounded-lg p-2 sm:p-3.5 md:p-3 transition-all duration-300 w-full cursor-pointer group flex items-center justify-between bg-white/5 border-white/10 hover:bg-white/10 bonus-card-3d"
            >
              {/* Left side - Title with arrow */}
              <div className="flex-1 text-left min-w-0 pl-1.5 sm:pl-3 md:pl-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 
                    className={`font-heading ${index === 0 ? 'text-base sm:text-lg md:text-lg lg:text-xl' : 'text-sm sm:text-base md:text-base lg:text-lg'} font-bold group-hover:transition-all truncate ${index === 0 ? 'bonus-text-glow-enhanced' : index === 7 ? 'bonus-text-glow-beige' : 'bonus-text-glow'} ${
                      index === 0 
                        ? 'text-orange-red group-hover:text-orange-red/90'
                        : index === 7
                        ? 'text-warm-beige group-hover:text-warm-beige/90'
                        : 'text-white group-hover:text-white/90'
                    }`}
                    style={{
                      '--glow-color-1': index === 0 
                        ? 'rgba(188,69,0,1)'
                        : index === 7
                        ? 'rgba(249,229,193,1)'
                        : 'rgba(255,255,255,0.8)',
                      '--glow-color-2': index === 0 
                        ? 'rgba(188,69,0,0.9)'
                        : index === 7
                        ? 'rgba(249,229,193,0.9)'
                        : 'rgba(99,157,240,0.6)',
                      '--glow-color-3': index === 0 
                        ? 'rgba(188,69,0,0.8)'
                        : index === 7
                        ? 'rgba(249,229,193,0.8)'
                        : 'rgba(99,157,240,0.4)',
                      transformOrigin: 'center',
                      transition: 'all 0.3s ease',
                      isolation: 'isolate', // Isolate text from background
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.animation = 'none';
                      e.currentTarget.style.transform = 'scale(1.08)';
                      e.currentTarget.style.textShadow = index === 0
                        ? '0 0 3px rgba(188,69,0,0.8)'
                        : index === 7
                        ? '0 0 3px rgba(249,229,193,1), 0 0 4px rgba(249,229,193,0.8)'
                        : '0 0 3px rgba(255,255,255,0.6)';
                      e.currentTarget.classList.remove(index === 0 ? 'bonus-text-glow-enhanced' : index === 7 ? 'bonus-text-glow-beige' : 'bonus-text-glow');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.animation = '';
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.textShadow = '';
                      e.currentTarget.classList.add(index === 0 ? 'bonus-text-glow-enhanced' : index === 7 ? 'bonus-text-glow-beige' : 'bonus-text-glow');
                    }}
                  >
                    {bonus.title}
                  </h3>
                  <span 
                    className={`inline-block group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ${
                      index === 0 ? 'text-orange-red/60 group-hover:text-orange-red/80' : index === 7 ? 'text-warm-beige/60 group-hover:text-warm-beige/80' : 'text-white/50 group-hover:text-white/80'
                    }`}
                    style={{
                      textShadow: index === 0 
                        ? '0 0 2px rgba(188,69,0,0.5)'
                        : index === 7
                        ? '0 0 2px rgba(249,229,193,0.8), 0 0 3px rgba(249,229,193,0.6)'
                        : '0 0 2px rgba(255,255,255,0.3)',
                      animation: 'bonusTextGlow 3s ease-in-out infinite',
                    }}
                  >
                    →
                  </span>
                </div>
                {bonus.subtitle && (
                  <p className="text-[10px] sm:text-xs md:text-xs font-sans leading-tight text-white/70 mt-0.5 md:mt-0.5 line-clamp-1">
                    {bonus.subtitle}
                  </p>
                )}
              </div>
              
              {/* Right side - Price */}
              <div className="ml-1.5 sm:ml-3 md:ml-2 pr-1.5 sm:pr-3 md:pr-4 flex-shrink-0">
                <span 
                  className={`font-mono ${index === 0 ? 'text-base sm:text-lg md:text-lg lg:text-xl' : 'text-sm sm:text-base md:text-base lg:text-lg'} font-bold inline-block relative ${
                    index === 0 ? 'text-orange-red' : index === 7 ? 'text-warm-beige' : 'text-white'
                  }`}
                  style={{
                    textShadow: index === 0 
                      ? '0 0 2px rgba(188,69,0,0.6)'
                      : index === 7
                      ? '0 0 2px rgba(249,229,193,0.8), 0 0 3px rgba(249,229,193,0.6)'
                      : '0 0 2px rgba(255,255,255,0.4)',
                  }}
                >
                  {bonusPrices[index] || "$297"}
                  <span
                    style={{
                      position: 'absolute',
                      left: '0%',
                      right: '0%',
                      top: '50%',
                      height: '0.1em',
                      backgroundColor: '#d9d7b3',
                      transform: 'translateY(-50%) rotate(-15deg)',
                      transformOrigin: 'center',
                      boxShadow: '0 0 4px rgba(217, 215, 179, 0.6)',
                      width: '120%',
                    }}
                  />
                </span>
              </div>
            </button>
          </RandomScrollReveal>
        ))}
      </div>


      {/* Modal for bonus details */}
      {selectedBonus !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelectedBonus(null)}
        >
          <div 
            className="bg-black border border-white/10 rounded-sm p-4 sm:p-6 md:p-10 mx-auto flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
            }}
          >
            <div className="flex justify-between items-start mb-6 flex-shrink-0 relative z-10">
              <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-white flex-1 pr-4">
                {bonusDescriptions[selectedBonus]?.title}
              </h3>
              <button
                onClick={() => setSelectedBonus(null)}
                className="text-white/50 hover:text-white/80 text-6xl font-light flex-shrink-0 transition-colors leading-none"
                aria-label="Close"
                style={{ lineHeight: '1' }}
              >
                ×
              </button>
            </div>
            <div className="space-y-5 overflow-y-auto flex-1 relative z-10" style={{ maxHeight: 'calc(90vh - 120px)', paddingRight: 'clamp(20px, 8vw, 100px)', paddingBottom: 'clamp(20px, 8vw, 100px)' }}>
              {bonusDescriptions[selectedBonus]?.sections ? (
                // Render multiple sections
                bonusDescriptions[selectedBonus].sections!.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="space-y-3">
                    <h4 className="font-heading text-xl md:text-2xl font-semibold text-white">
                      {section.title}
                    </h4>
                    {section.description.map((paragraph, idx) => (
                      <p 
                        key={idx}
                        className="text-white/70 text-base md:text-lg lg:text-xl font-sans leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))
              ) : (
                // Render single description
                bonusDescriptions[selectedBonus]?.description?.map((paragraph, idx) => (
                  <p 
                    key={idx}
                    className="text-white/70 text-base md:text-lg lg:text-xl font-sans leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))
              )}
            </div>
            
            {/* Tree logo in bottom-right corner */}
            <div 
              className="absolute bottom-4 right-4 z-20 opacity-50 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
            >
              <Image
                src="/Tree of life.png"
                alt="Tree Logo"
                width={80}
                height={80}
                className="drop-shadow-sm w-full h-full"
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

