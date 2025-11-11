import TypewriterText from './components/HandwritingText';
import ScrollAnimatedIcon from './components/ScrollAnimatedIcon';
import BackgroundTrees from './components/BackgroundTrees';
import EnvelopeWithText from './components/EnvelopeWithText';
import WriteTree from './components/WriteTree';
import DiamondBranches from './components/DiamondBranches';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-gradient-hero text-white relative">
      <BackgroundTrees />
      <div className="fixed top-0 left-0 z-20 pointer-events-none">
        <WriteTree size={192} bg="transparent" />
      </div>
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 lg:py-40 max-w-4xl mx-auto text-center relative z-10">
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-white leading-tight">
          <TypewriterText 
            text="Find Purpose.\nBuild Clarity.\nMove Forward."
            totalDuration={2000}
            fontStyle="handwritten"
            className="font-bold"
          />
        </h1>
        <div className="text-xl md:text-2xl mb-12 text-white/90 flex items-center justify-center">
          <EnvelopeWithText />
        </div>
          <a
            href="#purchase"
            className="inline-block bg-deep-blue text-white px-12 py-5 text-lg font-bold tracking-wide hover:bg-dark-brown transition-all duration-200 shadow-lg"
          >
            Get Started — $297
          </a>
      </section>

      {/* About the Blueprint */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-white">About the Blueprint</h2>
          <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl mx-auto">
            An 8-week guided digital system designed to help you uncover your purpose and build clear direction for your life. 
            Self-paced, comprehensive, and built for transformation.
          </p>
        </div>
      </section>

      {/* Purpose Transformation - Diamond Branches */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-8 text-white">
            Purpose Transformation
          </h2>
          <DiamondBranches />
        </div>
      </section>

      {/* Why It Works / Transformation Promise */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-20 text-black">
            Why It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-deep-blue flex items-center justify-center bg-deep-blue/10">
                <div className="w-10 h-10 border-2 border-deep-blue"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-white">Proven Framework</h3>
              <p className="text-white/80 leading-relaxed">
                Built on tested methodologies that guide you from confusion to clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-dark-brown flex items-center justify-center bg-dark-brown/10">
                <div className="w-10 h-10 bg-dark-brown"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-white">Self-Paced</h3>
              <p className="text-white/80 leading-relaxed">
                Move at your own speed. No pressure, just progress when you're ready.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-black flex items-center justify-center bg-black/10">
                <div className="w-10 h-10 border-2 border-black rounded-full"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-white">Complete System</h3>
              <p className="text-white/80 leading-relaxed">
                Everything you need in one place. No gaps, no guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Offer Section */}
      <section className="px-6 py-24 text-white relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono inline-block bg-orange-red text-white px-6 py-2 mb-8 text-sm font-bold tracking-wider">
            BLACK FRIDAY SPECIAL
          </div>
          <h2 className="font-heading text-5xl md:text-6xl font-black mb-6">
            <span className="font-mono">$297</span>
          </h2>
          <p className="text-xl md:text-2xl mb-4 font-medium text-warm-beige">
            One-Time Payment
          </p>
          <p className="font-mono text-lg mb-8 text-muted-olive">
            Lifetime Access • No Recurring Fees
          </p>
          <a
            href="#purchase"
            className="inline-block bg-deep-blue text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-dark-brown transition-all duration-200 shadow-lg"
          >
            Claim Your Spot
          </a>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-16 text-white">
            What Others Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
              <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                "This blueprint changed everything. I finally have clarity on my direction."
              </p>
              <p className="text-sm font-bold text-white">— Testimonial 1</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
              <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                "The self-paced format allowed me to truly absorb each module. Highly recommend."
              </p>
              <p className="text-sm font-bold text-white">— Testimonial 2</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 border-2 border-deep-blue shadow-lg">
              <p className="text-lg mb-6 text-white/90 italic leading-relaxed">
                "Worth every penny. The transformation has been remarkable."
              </p>
              <p className="text-sm font-bold text-white">— Testimonial 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="purchase" className="px-6 py-32 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-8">
            Ready to Transform?
          </h2>
          <p className="text-xl mb-12 text-muted-olive">
            Join others who have found their purpose. Start your journey today.
          </p>
          <a
            href="#purchase"
            className="inline-block bg-deep-blue text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-dark-brown transition-all duration-200 mb-6 shadow-lg"
          >
            Get Started — <span className="font-mono">$297</span>
          </a>
          <p className="font-mono text-sm text-white/60">
            Lifetime Access • Instant Download • 30-Day Money-Back Guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-charcoal text-muted-olive text-center text-sm relative z-10">
        <p className="font-mono">© 2024 Josh Terry. All rights reserved.</p>
      </footer>
    </main>
  );
}
