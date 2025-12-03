"use client";

import { useState, useEffect, lazy, Suspense } from 'react';
import TypewriterText from './components/HandwritingText';
import ScrollAnimatedIcon from './components/ScrollAnimatedIcon';
import EnvelopeWithText from './components/EnvelopeWithText';
import RandomScrollReveal from './components/RandomScrollReveal';
import CharacterPopIn from './components/CharacterPopIn';
import FloatingGeometry from './components/FloatingGeometry';
import TitleWithBorder from './components/TitleWithBorder';
import Image from 'next/image';
import { TotalValue } from './components/BonusesGrid';

// Lazy load below-the-fold components for better initial load performance
const DiamondBranches = lazy(() => import('./components/DiamondBranches'));
const BonusesGrid = lazy(() => import('./components/BonusesGrid'));

interface FAQItemProps {
  faq: { question: string; answer: string };
  index: number;
}

function FAQItem({ faq, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isContactQuestion = index === 5;

  return (
    <>
      <RandomScrollReveal delay={100 + index * 100} randomDelay={true}>
        <div className={`h-full ${index === 5 ? '' : ''}`}>
          <button
            onClick={() => setIsOpen(true)}
            className={`backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 text-left w-full cursor-pointer group flex flex-col h-full ${
              isContactQuestion 
                ? 'bg-orange-red/20 border-orange-red/30 hover:bg-orange-red/30' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <h3 className={`font-heading text-lg md:text-xl font-bold mb-3 group-hover:transition-colors ${
              isContactQuestion 
                ? 'text-orange-red group-hover:text-orange-red/90' 
                : 'text-white group-hover:text-white/90'
            }`}>
              {faq.question}
            </h3>
            <p className={`text-sm md:text-base font-sans leading-relaxed line-clamp-3 flex-grow ${
              isContactQuestion ? 'text-orange-red/80' : 'text-white/70'
            }`}>
              {faq.answer}
            </p>
            <span className={`inline-block mt-2 group-hover:translate-x-1 transition-all duration-200 ${
              isContactQuestion ? 'text-orange-red/60 group-hover:text-orange-red/80' : 'text-white/50 group-hover:text-white/80'
            }`}>
              →
            </span>
          </button>
        </div>
      </RandomScrollReveal>

      {/* FAQ Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-black border border-white/10 rounded-sm p-4 sm:p-6 md:p-10 mx-auto flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '90%',
              maxWidth: 'min(600px, 95vw)',
              maxHeight: '90vh',
            }}
          >
            <div className={`flex justify-between items-start mb-8 flex-shrink-0 relative z-10 ${
              isContactQuestion ? 'border-b border-orange-red/30 pb-4' : ''
            }`}>
              <h3 className={`font-heading text-2xl md:text-3xl lg:text-4xl font-semibold flex-1 pr-4 ${
                isContactQuestion ? 'text-orange-red' : 'text-white'
              }`}>
                {faq.question}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white/80 text-6xl font-light flex-shrink-0 transition-colors leading-none"
                aria-label="Close"
                style={{ lineHeight: '1' }}
              >
                ×
              </button>
            </div>
            <div className="space-y-5 overflow-y-auto flex-1 relative z-10" style={{ maxHeight: 'calc(90vh - 120px)', paddingRight: 'clamp(20px, 8vw, 100px)', paddingBottom: 'clamp(20px, 8vw, 100px)' }}>
              <p className={`text-lg md:text-xl lg:text-2xl font-sans leading-relaxed ${
                isContactQuestion ? 'text-orange-red/90' : 'text-white/70'
              }`}>
                {faq.answer}
              </p>
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

function EnvelopeClickableWrapper() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScroll = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const element = document.getElementById('purpose-transformation');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      // Center the Purpose Transformation section in the viewport
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.offsetHeight / 2);
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="text-xl md:text-2xl mb-12 text-white/90 flex flex-col items-center justify-center mt-[84px] md:mt-24 w-full">
      <a 
        href="#purpose-transformation"
        className="cursor-pointer hover:opacity-80 transition-opacity flex flex-col items-center w-full"
        onClick={(e) => {
          e.preventDefault();
          handleScroll();
        }}
      >
        <div onClick={handleScroll} className="flex justify-center w-full">
          <EnvelopeWithText onAnimationComplete={() => setAnimationComplete(true)} />
        </div>
      </a>
      {/* Click here button with arrow - appears after animation completes */}
      {animationComplete && (
        <button
          onClick={handleScroll}
          className="mt-6 text-white/80 hover:text-white transition-all duration-300 flex flex-col items-center gap-2 group"
          style={{
            opacity: animationComplete ? 1 : 0,
            animation: animationComplete ? 'fadeInUp 0.5s ease-out' : 'none',
          }}
        >
          <span 
            className="inline-block transition-transform group-hover:-translate-y-1 text-2xl sm:text-3xl"
            style={{
              animation: 'arrowBounceUp 2s ease-in-out infinite',
            }}
          >
            ↑
          </span>
          <span className="font-handwritten text-xl sm:text-2xl">Click here</span>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-gradient-hero text-white relative overflow-x-hidden">
      <FloatingGeometry />
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
          <EnvelopeClickableWrapper />
        </RandomScrollReveal>
      </section>

      {/* Purpose Transformation - Diamond Branches */}
      <section id="purpose-transformation" className="px-6 pt-24 pb-10 sm:pb-[3.125rem] md:pb-[3.75rem] relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex flex-col items-center -mb-8 sm:-mb-10 md:-mb-12 px-4 sm:px-0">
              <TitleWithBorder padding="px-3 sm:px-6 py-2 sm:py-4">
                <div className="text-center">
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white">
                    <CharacterPopIn delay={0}>Purpose Transformation</CharacterPopIn>
                  </h2>
                </div>
              </TitleWithBorder>
              <div className="flex flex-col items-center mt-4">
                <p className="text-xs sm:text-sm md:text-base font-sans text-center" style={{ color: '#ff6b35' }}>
                  Click on the logo of each week to learn more.
                </p>
                <svg 
                  width="40" 
                  height="80" 
                  viewBox="0 0 24 48" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mt-1 w-6 h-12 sm:w-8 sm:h-16 md:w-8 md:h-16 arrow-point-down"
                  style={{ color: 'white' }}
                >
                  <path d="M12 0v40M20 32l-8 8-8-8" />
                </svg>
              </div>
            </div>
          </RandomScrollReveal>
          <RandomScrollReveal delay={200} randomDelay={true} duration={1.2}>
            <div className="-mt-4 sm:-mt-6 md:-mt-16 lg:-mt-20">
              <Suspense fallback={<div className="min-h-[400px] sm:min-h-[500px] md:min-h-[640px]" />}>
                <DiamondBranches />
              </Suspense>
            </div>
          </RandomScrollReveal>
          {/* Get Started Button */}
          <RandomScrollReveal delay={400} randomDelay={true}>
            <div className="flex flex-col items-center justify-center -mt-8 sm:mt-5 md:-mt-12 lg:-mt-16 mb-10 sm:mb-12 md:mb-16 lg:mb-20">
              <div className="text-center w-full max-w-2xl mx-auto">
                <a
                  href="https://bookmyeventnow.com/register?a=new&p=37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="seal-button text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans"
                  style={{ fontFamily: "'Inter', 'Helvetica', 'system-ui', 'sans-serif'" }}
                >
                  <span><CharacterPopIn delay={400}>Get Started — <span className="font-mono">$499</span></CharacterPopIn></span>
                </a>
              </div>
            </div>
          </RandomScrollReveal>
          {/* See all Bonuses link */}
          <RandomScrollReveal delay={300} randomDelay={true}>
            <div className="flex flex-col items-center justify-center -mt-6 sm:mt-4 md:-mt-10 lg:-mt-12 mb-4 sm:mb-6 md:mb-8">
              <a
                href="#bonuses"
                className="text-sm sm:text-base md:text-lg font-sans text-white/70 hover:text-white/90 transition-colors flex items-center gap-2"
              >
                See all Bonuses
                <span className="text-xs sm:text-sm md:text-base">↓</span>
              </a>
            </div>
          </RandomScrollReveal>
        </div>
      </section>

      {/* About the Blueprint */}
      <section className="px-6 pt-10 sm:pt-[3.125rem] md:pt-[3.75rem] pb-[3.75rem] sm:pb-20 md:pb-[6.25rem] relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">
              <CharacterPopIn delay={0}>What Is Purpose Transformation?</CharacterPopIn>
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
      <section id="bonuses" className="px-6 pt-[0.3125rem] sm:pt-5 md:pt-[0.9375rem] pb-[0.3125rem] md:pb-[0.9375rem] relative z-10">
        <div className="max-w-4xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-0 px-4 sm:px-0">
              <TitleWithBorder padding="px-3 sm:px-6 md:px-6 py-0.5 sm:py-1 md:py-1">
                <div className="text-center">
                  <h2 className="font-heading text-lg sm:text-xl md:text-xl lg:text-2xl font-black text-white text-center">
                    <CharacterPopIn delay={0}>Bonuses</CharacterPopIn>
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm md:text-sm mt-0.5 sm:mt-1 md:mt-0.5 font-sans">
                    All systems created by Josh Terry.<br />
                    <span className="border-b border-white/50 pb-0.5 inline-block">
                      Click on each title to learn more.
                    </span>
                  </p>
                </div>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <div className="mt-1 sm:mt-3 md:mt-3">
            <Suspense fallback={<div className="min-h-[300px]" />}>
              <BonusesGrid />
            </Suspense>
          </div>
          {/* Mobile: Stacked layout - Total Value centered, Get Started below */}
          <div className="flex flex-col items-center md:hidden relative mt-1 gap-2">
            <Suspense fallback={null}>
              <TotalValue />
            </Suspense>
            <RandomScrollReveal delay={400} randomDelay={true}>
              <div id="purchase" className="flex-shrink-0">
                <RandomScrollReveal delay={600} randomDelay={true} duration={1}>
                  <a
                    href="https://bookmyeventnow.com/register?a=new&p=37"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="seal-button text-lg font-sans"
                    style={{ fontFamily: "'Inter', 'Helvetica', 'system-ui', 'sans-serif'" }}
                  >
                    <span><CharacterPopIn delay={600}>Get Started — <span className="font-mono">$499</span></CharacterPopIn></span>
                  </a>
                </RandomScrollReveal>
              </div>
            </RandomScrollReveal>
          </div>
          {/* Desktop: Side by Side */}
          <div className="hidden md:flex flex-row items-center relative mt-0 gap-4">
            {/* Left spacer for centering */}
            <div className="flex-1"></div>
            {/* Get Started Button - Centered */}
            <RandomScrollReveal delay={400} randomDelay={true}>
              <div id="purchase" className="flex-shrink-0">
                <RandomScrollReveal delay={600} randomDelay={true} duration={1}>
                  <a
                    href="https://bookmyeventnow.com/register?a=new&p=37"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="seal-button text-xl lg:text-2xl font-sans"
                    style={{ fontFamily: "'Inter', 'Helvetica', 'system-ui', 'sans-serif'" }}
                  >
                    <span><CharacterPopIn delay={600}>Get Started — <span className="font-mono">$499</span></CharacterPopIn></span>
                  </a>
                </RandomScrollReveal>
              </div>
            </RandomScrollReveal>
            {/* Right spacer with Total Value */}
            <div className="flex-1 flex justify-end items-center">
              <div className="flex-shrink-0">
                <Suspense fallback={null}>
                  <TotalValue />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pt-[10rem] sm:pt-[12.5rem] md:pt-[15rem] pb-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-12 px-4 sm:px-0">
              <TitleWithBorder padding="px-3 sm:px-6 md:px-8 py-2 sm:py-4">
                <div className="text-center">
                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white text-center">
                    <CharacterPopIn delay={0}>Frequently Asked Questions</CharacterPopIn>
                  </h2>
                </div>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          
          {/* FAQ Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 items-stretch">
            {[
              {
                question: "What exactly do I receive and how is it delivered?",
                answer: "You get a self guided eight week curriculum with short video lessons, worksheets, and checklists. The bundle also includes the programs Instinctive Breathwork, Goal Setting Workbook, Purpose Paradox, Ten Minute Progress, and additional tools. Everything lives in a secure online portal with lifetime access. PDFs are downloadable."
              },
              {
                question: "How much time does this require and can I adjust the pace?",
                answer: "Plan about sixty to ninety minutes per week for the core lesson plus a brief daily check that takes a few minutes. The program is self paced. You can pause, repeat, or move faster. The weeks are designed to be taken in order, but you can dip into any program as needed."
              },
              {
                question: "How do the bonuses fit into the eight weeks?",
                answer: "Each bonus supports a specific skill. Breathwork for state control. Goal Setting for focus and follow through. Purpose Paradox for thinking clearly about meaning. Ten Minute Progress for breaking inertia. They plug into the main sequence so you can practice a tool the moment it becomes relevant."
              },
              {
                question: "How will I know it is working?",
                answer: "You will track a small set of visible measures such as completed actions per week, decision time on important tasks, and a simple clarity score. The portal provides templates for baseline and weekly review so you can compare before and after and see trend lines over time."
              },
              {
                question: "Is this approach evidence informed and safe to use?",
                answer: "The methods are drawn from established principles in behavior change, goal setting, and basic breath mechanics. All practices are self guided and conservative. If you have a medical condition or concerns, check with your physician before doing breathwork or any physical practice. The rest of the curriculum is cognitive and planning based and can be done by anyone."
              }
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
          
          {/* Contact FAQ - Horizontal */}
          <div className="mt-12 grid grid-cols-2 md:flex md:flex-row md:items-start gap-3 md:gap-6">
            {/* Contact Question - Half screen on mobile */}
            <div className="md:flex-1">
              <FAQItem 
                faq={{
                  question: "I have other questions, how can I contact you guys?",
                  answer: "Send us an email at support@wayfindercoaching.net We're happy to answer any questions you might have."
                }} 
                index={5} 
              />
            </div>
            {/* Profile Picture and Button - Half screen on mobile */}
            <div className="md:flex-shrink-0 flex flex-col items-center">
              <Image
                src="/profile-pic.png"
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full object-cover mb-3 w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="text-center">
                <p className="text-white/70 text-xs sm:text-sm font-sans mb-3">Contact Details</p>
                <a
                  href="mailto:support@wayfindercoaching.net?cc=support@wayfindercoaching.net"
                  className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg transition-all duration-300 cursor-pointer backdrop-blur-sm w-full md:w-auto text-center"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="text-white font-sans font-semibold text-sm sm:text-base">
                    Send us a message
                  </div>
                  <div className="text-white/60 text-xs mt-1 font-sans">
                    Click here
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 relative z-10">
      </footer>
    </main>
  );
}
