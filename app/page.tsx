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
      <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40 max-w-4xl mx-auto text-center relative z-10">
        <RandomScrollReveal delay={0} randomDelay={true}>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-16 text-white leading-tight">
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
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white text-center">
                  <CharacterPopIn delay={0}>Purpose Transformation</CharacterPopIn>
                </h2>
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
                An 8-week guided digital system designed to help you uncover your purpose and build clear direction for your life. 
                Self-paced, comprehensive, and built for transformation.
              </CharacterPopIn>
            </p>
          </RandomScrollReveal>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-20">
              <TitleWithBorder padding="px-8 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white text-center whitespace-nowrap">
                  <CharacterPopIn delay={0}>Bonuses</CharacterPopIn>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <ExpandingLines />
        </div>
      </section>

      {/* Limited Offer Section */}
      <section className="px-6 py-24 text-white relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <RandomScrollReveal delay={0} randomDelay={true} forceDirection="right">
            <div className="font-mono inline-block bg-orange-red text-white px-6 py-2 mb-8 text-sm font-bold tracking-wider">
              <CharacterPopIn delay={0}>BLACK FRIDAY SPECIAL</CharacterPopIn>
            </div>
          </RandomScrollReveal>
          <RandomScrollReveal delay={200} randomDelay={true} duration={1}>
            <div className="flex justify-center mb-6">
              <TitleWithBorder padding="px-8 py-5">
                <h2 className="font-heading text-5xl md:text-6xl font-black">
                  <span className="font-mono">
                    <CharacterPopIn delay={200}>$297</CharacterPopIn>
                  </span>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <RandomScrollReveal delay={400} randomDelay={true}>
            <p className="text-xl md:text-2xl mb-4 font-medium text-warm-beige">
              <CharacterPopIn delay={400}>One-Time Payment</CharacterPopIn>
            </p>
          </RandomScrollReveal>
          <RandomScrollReveal delay={600} randomDelay={true}>
            <p className="font-mono text-lg mb-8 text-muted-olive">
              <CharacterPopIn delay={600}>Lifetime Access • No Recurring Fees</CharacterPopIn>
            </p>
          </RandomScrollReveal>
          <RandomScrollReveal delay={800} randomDelay={true}>
            <a
              href="#purchase"
              className="seal-button text-xl"
            >
              <span><CharacterPopIn delay={800}>Claim Your Spot</CharacterPopIn></span>
            </a>
          </RandomScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section id="purchase" className="px-6 py-32 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-8">
              <TitleWithBorder padding="px-6 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black">
                  <CharacterPopIn delay={0}>Ready to Transform?</CharacterPopIn>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <RandomScrollReveal delay={200} randomDelay={true}>
            <p className="text-xl mb-12 text-muted-olive">
              <CharacterPopIn delay={200}>Join others who have found their purpose. Start your journey today.</CharacterPopIn>
            </p>
          </RandomScrollReveal>
          <RandomScrollReveal delay={400} randomDelay={true} duration={1}>
            <a
              href="#purchase"
              className="seal-button text-xl mb-6"
            >
              <span><CharacterPopIn delay={400}>Get Started — <span className="font-mono">$297</span></CharacterPopIn></span>
            </a>
          </RandomScrollReveal>
          <RandomScrollReveal delay={600} randomDelay={true}>
            <p className="font-mono text-sm text-white/60">
              <CharacterPopIn delay={600}>Lifetime Access • Instant Download • 30-Day Money-Back Guarantee</CharacterPopIn>
            </p>
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
