"use client";

import TypewriterText from './components/HandwritingText';
import ScrollAnimatedIcon from './components/ScrollAnimatedIcon';
import BackgroundTrees from './components/BackgroundTrees';
import EnvelopeWithText from './components/EnvelopeWithText';
import DiamondBranches from './components/DiamondBranches';
import RandomScrollReveal from './components/RandomScrollReveal';
import CharacterPopIn from './components/CharacterPopIn';
import FloatingGeometry from './components/FloatingGeometry';
import TitleWithBorder from './components/TitleWithBorder';
import ExpandingLines from './components/ExpandingLines';
import CountdownTimer from './components/CountdownTimer';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-gradient-hero text-white relative">
      <CountdownTimer />
      <FloatingGeometry />
      <BackgroundTrees />
      {/* Hero Section */}
      <section className="px-6 pt-24 pb-24 md:pt-28 md:pb-32 lg:pt-28 lg:pb-40 max-w-4xl mx-auto text-center relative z-10">
        <RandomScrollReveal delay={0} randomDelay={true}>
          <h1 
            className="font-heading text-5xl md:text-6xl lg:text-7xl mb-16 text-white leading-tight"
            style={{
              textShadow: `
                1px 1px 0px rgba(0, 0, 0, 0.4),
                2px 2px 0px rgba(0, 0, 0, 0.3),
                3px 3px 0px rgba(0, 0, 0, 0.2),
                4px 4px 4px rgba(0, 0, 0, 0.5),
                5px 5px 8px rgba(0, 0, 0, 0.4),
                6px 6px 12px rgba(0, 0, 0, 0.3),
                0 0 30px rgba(255, 255, 255, 0.15),
                0 0 60px rgba(255, 255, 255, 0.08)
              `,
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4))',
              WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.2)',
              WebkitTextFillColor: '#ffffff',
              letterSpacing: '0.02em',
            }}
          >
            <TypewriterText 
              text="Find Purpose.\nBuild Clarity.\nMove Forward."
              totalDuration={2000}
              fontStyle="handwritten"
              className="font-bold"
            />
          </h1>
        </RandomScrollReveal>
        <RandomScrollReveal delay={200} randomDelay={true}>
          <div className="text-xl md:text-2xl mb-12 text-white/90 flex items-center justify-center mt-20 md:mt-24">
            <EnvelopeWithText />
          </div>
        </RandomScrollReveal>
        <RandomScrollReveal delay={400} randomDelay={true}>
          <a
            href="#purchase"
            className="seal-button text-lg mt-4"
          >
            <span><CharacterPopIn delay={400}>Get Started — $297</CharacterPopIn></span>
          </a>
        </RandomScrollReveal>
      </section>

      {/* Purpose Transformation - Diamond Branches */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-8">
              <TitleWithBorder padding="px-6 py-4">
                <div className="text-center">
                  <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white">
                    <CharacterPopIn delay={0}>Purpose Transformation</CharacterPopIn>
                  </h2>
                  <p className="text-white/70 text-sm md:text-base mt-2 font-sans">
                    Simply click on a week to see what it&apos;s all about.
                  </p>
                </div>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <RandomScrollReveal delay={200} randomDelay={true} duration={1.2}>
            <DiamondBranches />
          </RandomScrollReveal>
        </div>
      </section>

      {/* About the Blueprint */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
              <CharacterPopIn delay={0}>About the Blueprint</CharacterPopIn>
            </h2>
          </RandomScrollReveal>
          <RandomScrollReveal delay={200} randomDelay={true}>
            <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto">
              <CharacterPopIn delay={200}>
                8 weeks of self guided training that moves you from uncertainty to clarity with a simple plan you can apply on your own. Self paced and flexible.
              </CharacterPopIn>
            </p>
          </RandomScrollReveal>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="px-6 pt-24 pb-8 md:pb-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-0">
              <TitleWithBorder padding="px-8 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white text-center whitespace-nowrap">
                  <CharacterPopIn delay={0}>Bonuses</CharacterPopIn>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <ExpandingLines />
          {/* Total Value */}
          <RandomScrollReveal delay={400} randomDelay={true}>
            <div className="flex justify-center -mt-8 md:-mt-12">
              <div className="text-center">
                <p 
                  className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-2"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4), 0.5px 0.5px 0.5px rgba(0,0,0,0.3), -0.5px -0.5px 0.5px rgba(0,0,0,0.3)',
                    filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                    fontWeight: 900,
                    letterSpacing: '0.02em',
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.4)',
                    WebkitTextFillColor: '#ffffff',
                  }}
                >
                  Total Value
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span 
                    className="text-white font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold inline-block relative"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 12px rgba(99,157,240,0.4), 0.5px 0.5px 0.5px rgba(0,0,0,0.3), -0.5px -0.5px 0.5px rgba(0,0,0,0.3)',
                      filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                      WebkitTextStroke: '0.5px rgba(0,0,0,0.4)',
                      WebkitTextFillColor: '#ffffff',
                    }}
                  >
                    <span style={{ 
                      position: 'relative',
                      display: 'inline-block',
                    }}>
                      $2,079
                      {/* Diagonal strikethrough line */}
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
                  </span>
                </div>
                {/* Get Started Button */}
                <div className="flex flex-col items-center justify-center mt-12 md:mt-20">
                  <RandomScrollReveal delay={600} randomDelay={true} duration={1}>
                    <a
                      href="#purchase"
                      className="seal-button text-xl mb-4"
                    >
                      <span><CharacterPopIn delay={600}>Get Started — <span className="font-mono">$297</span></CharacterPopIn></span>
                    </a>
                  </RandomScrollReveal>
                  <RandomScrollReveal delay={800} randomDelay={true}>
                    <p className="text-xl text-muted-olive">
                      <CharacterPopIn delay={800}>Join others who have found their purpose. Start your journey today.</CharacterPopIn>
                    </p>
                  </RandomScrollReveal>
                </div>
              </div>
            </div>
          </RandomScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-charcoal text-muted-olive text-center text-sm relative z-10">
        <RandomScrollReveal delay={0} randomDelay={true}>
          <p className="font-mono">
            <CharacterPopIn delay={0}>© 2024 Josh Terry. All rights reserved.</CharacterPopIn>
          </p>
        </RandomScrollReveal>
      </footer>
    </main>
  );
}
