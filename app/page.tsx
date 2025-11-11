import TypewriterText from './components/HandwritingText';
import ScrollAnimatedIcon from './components/ScrollAnimatedIcon';
import BackgroundTrees from './components/BackgroundTrees';
import EnvelopeWithText from './components/EnvelopeWithText';
import DiamondBranches from './components/DiamondBranches';
import RandomScrollReveal from './components/RandomScrollReveal';
import CharacterPopIn from './components/CharacterPopIn';
import FloatingGeometry from './components/FloatingGeometry';
import TitleWithBorder from './components/TitleWithBorder';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-gradient-hero text-white relative">
      <FloatingGeometry />
      <BackgroundTrees />
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 lg:py-40 max-w-4xl mx-auto text-center relative z-10">
        <RandomScrollReveal delay={0} randomDelay={true}>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-white leading-tight">
            <TypewriterText 
              text="Find Purpose.\nBuild Clarity.\nMove Forward."
              totalDuration={2000}
              fontStyle="handwritten"
              className="font-bold"
            />
          </h1>
        </RandomScrollReveal>
        <RandomScrollReveal delay={200} randomDelay={true}>
          <div className="text-xl md:text-2xl mb-12 text-white/90 flex items-center justify-center">
            <EnvelopeWithText />
          </div>
        </RandomScrollReveal>
        <RandomScrollReveal delay={400} randomDelay={true}>
          <a
            href="#purchase"
            className="seal-button text-lg"
          >
            <span><CharacterPopIn delay={400}>Get Started — $297</CharacterPopIn></span>
          </a>
        </RandomScrollReveal>
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

      {/* Purpose Transformation - Diamond Branches */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-8">
              <TitleWithBorder padding="px-6 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white">
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

      {/* Why It Works / Transformation Promise */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-20">
              <TitleWithBorder padding="px-6 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white">
                  <CharacterPopIn delay={0}>Why It Works</CharacterPopIn>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <RandomScrollReveal delay={100} randomDelay={true}>
              <div className="text-center">
                <RandomScrollReveal delay={0} randomDelay={true}>
                  <div className="w-20 h-20 mx-auto mb-6 border-4 border-deep-blue flex items-center justify-center bg-deep-blue/10">
                    <div className="w-10 h-10 border-2 border-deep-blue"></div>
                  </div>
                </RandomScrollReveal>
                <TitleWithBorder className="mb-4" padding="px-4 py-3">
                  <h3 className="font-heading text-2xl font-bold text-white">
                    <CharacterPopIn delay={150}>Proven Framework</CharacterPopIn>
                  </h3>
                </TitleWithBorder>
                <p className="text-white/80 leading-relaxed">
                  <CharacterPopIn delay={200}>Built on tested methodologies that guide you from confusion to clarity.</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
            <RandomScrollReveal delay={200} randomDelay={true}>
              <div className="text-center">
                <RandomScrollReveal delay={0} randomDelay={true}>
                  <div className="w-20 h-20 mx-auto mb-6 border-4 border-dark-brown flex items-center justify-center bg-dark-brown/10">
                    <div className="w-10 h-10 bg-dark-brown"></div>
                  </div>
                </RandomScrollReveal>
                <TitleWithBorder className="mb-4" padding="px-4 py-3">
                  <h3 className="font-heading text-2xl font-bold text-white">
                    <CharacterPopIn delay={150}>Self-Paced</CharacterPopIn>
                  </h3>
                </TitleWithBorder>
                <p className="text-white/80 leading-relaxed">
                  <CharacterPopIn delay={200}>Move at your own speed. No pressure, just progress when you're ready.</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
            <RandomScrollReveal delay={300} randomDelay={true}>
              <div className="text-center">
                <RandomScrollReveal delay={0} randomDelay={true}>
                  <div className="w-20 h-20 mx-auto mb-6 border-4 border-black flex items-center justify-center bg-black/10">
                    <div className="w-10 h-10 border-2 border-black rounded-full"></div>
                  </div>
                </RandomScrollReveal>
                <TitleWithBorder className="mb-4" padding="px-4 py-3">
                  <h3 className="font-heading text-2xl font-bold text-white">
                    <CharacterPopIn delay={150}>Complete System</CharacterPopIn>
                  </h3>
                </TitleWithBorder>
                <p className="text-white/80 leading-relaxed">
                  <CharacterPopIn delay={200}>Everything you need in one place. No gaps, no guesswork.</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
          </div>
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

      {/* Testimonials / Social Proof */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <RandomScrollReveal delay={0} randomDelay={true}>
            <div className="flex justify-center mb-16">
              <TitleWithBorder padding="px-6 py-4">
                <h2 className="font-heading text-4xl md:text-5xl font-black text-white">
                  <CharacterPopIn delay={0}>What Others Say</CharacterPopIn>
                </h2>
              </TitleWithBorder>
            </div>
          </RandomScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RandomScrollReveal delay={100} randomDelay={true}>
              <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
                <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                  <CharacterPopIn delay={100}>&quot;This blueprint changed everything. I finally have clarity on my direction.&quot;</CharacterPopIn>
                </p>
                <p className="text-sm font-bold text-white">
                  <CharacterPopIn delay={300}>— Testimonial 1</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
            <RandomScrollReveal delay={200} randomDelay={true}>
              <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
                <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                  <CharacterPopIn delay={200}>&quot;The self-paced format allowed me to truly absorb each module. Highly recommend.&quot;</CharacterPopIn>
                </p>
                <p className="text-sm font-bold text-white">
                  <CharacterPopIn delay={400}>— Testimonial 2</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
            <RandomScrollReveal delay={300} randomDelay={true}>
              <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
                <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                  <CharacterPopIn delay={300}>&quot;Worth every penny. The transformation has been remarkable.&quot;</CharacterPopIn>
                </p>
                <p className="text-sm font-bold text-white">
                  <CharacterPopIn delay={500}>— Testimonial 3</CharacterPopIn>
                </p>
              </div>
            </RandomScrollReveal>
          </div>
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
