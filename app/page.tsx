import TypewriterText from './components/HandwritingText';
import ScrollAnimatedIcon from './components/ScrollAnimatedIcon';

export default function Home() {
  return (
    <main className="min-h-screen bg-light-cream text-charcoal">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-32 lg:py-40 max-w-4xl mx-auto text-center">
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl mb-8 text-black leading-tight">
          <TypewriterText 
            text="Find Purpose.\nBuild Clarity.\nMove Forward."
            totalDuration={2000}
            fontStyle="handwritten"
            className="font-bold"
          />
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-charcoal">
          <TypewriterText 
            text="Purpose Transformation Blueprint"
            totalDuration={800}
            fontStyle="handwritten"
            startDelay={2200}
            className="font-bold"
          />
        </p>
        <a
          href="#purchase"
          className="inline-block bg-deep-blue text-white px-12 py-5 text-lg font-bold tracking-wide hover:bg-opacity-90 transition-all duration-200"
        >
          Get Started — $297
        </a>
      </section>

      {/* About the Blueprint */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-black">About the Blueprint</h2>
          <p className="text-lg md:text-xl leading-relaxed text-charcoal max-w-2xl mx-auto">
            An 8-week guided digital system designed to help you uncover your purpose and build clear direction for your life. 
            Self-paced, comprehensive, and built for transformation.
          </p>
        </div>
      </section>

      {/* What's Inside - Value Stack */}
      <section className="px-6 py-24 bg-light-cream">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-16 text-black">
            What's Inside
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Instinctive Breathwork */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={0}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle className="icon-path" cx="12" cy="12" r="10" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Instinctive Breathwork</h3>
              <p className="text-sm text-charcoal">Master the art of conscious breathing for clarity and focus.</p>
            </div>

            {/* Personality Test */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={100}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect className="icon-path" x="4" y="4" width="8" height="8" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Personality Test</h3>
              <p className="text-sm text-charcoal">Discover your unique traits and how they shape your purpose.</p>
            </div>

            {/* Purpose Paradox */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={200}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                    <line className="icon-path" x1="4" y1="4" x2="28" y2="28" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Purpose Paradox</h3>
              <p className="text-sm text-charcoal">Navigate the contradictions that lead to true purpose.</p>
            </div>

            {/* Goal Setting Workbook */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={300}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect className="icon-path" x="4" y="4" width="16" height="16" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Goal Setting Workbook</h3>
              <p className="text-sm text-charcoal">Structure your aspirations into actionable steps.</p>
            </div>

            {/* Life Reboot Bundle */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={400}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect className="icon-path" x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Life Reboot Bundle</h3>
              <p className="text-sm text-charcoal">Complete system for resetting and realigning your life.</p>
            </div>

            {/* 10-Minute Progress Book */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={500}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
                    <line className="icon-path" x1="4" y1="16" x2="28" y2="16" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">10-Minute Progress Book</h3>
              <p className="text-sm text-charcoal">Quick daily practices for consistent forward movement.</p>
            </div>

            {/* Placeholder 1 */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={600}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line className="icon-path" x1="4" y1="12" x2="20" y2="12" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Module 7</h3>
              <p className="text-sm text-charcoal">Additional transformative content included.</p>
            </div>

            {/* Placeholder 2 */}
            <div className="bg-white p-8 border-2 border-black hover:border-deep-blue transition-colors">
              <ScrollAnimatedIcon delay={700}>
                <div className="w-12 h-12 mb-6 border-2 border-black flex items-center justify-center icon-wrapper">
                  <svg className="w-1 h-6" viewBox="0 0 4 24" fill="currentColor">
                    <rect className="icon-path" x="0" y="0" width="4" height="24" />
                  </svg>
                </div>
              </ScrollAnimatedIcon>
              <h3 className="font-heading text-xl font-bold mb-3 text-black">Module 8</h3>
              <p className="text-sm text-charcoal">Additional transformative content included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works / Transformation Promise */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-20 text-black">
            Why It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-deep-blue flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-deep-blue"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-black">Proven Framework</h3>
              <p className="text-charcoal leading-relaxed">
                Built on tested methodologies that guide you from confusion to clarity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-orange-red flex items-center justify-center">
                <div className="w-10 h-10 bg-orange-red"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-black">Self-Paced</h3>
              <p className="text-charcoal leading-relaxed">
                Move at your own speed. No pressure, just progress when you're ready.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-dark-brown flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-dark-brown rounded-full"></div>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-black">Complete System</h3>
              <p className="text-charcoal leading-relaxed">
                Everything you need in one place. No gaps, no guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Offer Section */}
      <section className="px-6 py-24 bg-charcoal text-white">
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
            className="inline-block bg-deep-blue text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-opacity-90 transition-all duration-200"
          >
            Claim Your Spot
          </a>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="px-6 py-24 bg-light-cream">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-black text-center mb-16 text-black">
            What Others Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border-2 border-charcoal">
              <p className="text-lg mb-6 text-charcoal italic leading-relaxed">
                "This blueprint changed everything. I finally have clarity on my direction."
              </p>
              <p className="text-sm font-bold text-black">— Testimonial 1</p>
            </div>
            <div className="bg-white p-8 border-2 border-charcoal">
              <p className="text-lg mb-6 text-charcoal italic leading-relaxed">
                "The self-paced format allowed me to truly absorb each module. Highly recommend."
              </p>
              <p className="text-sm font-bold text-black">— Testimonial 2</p>
            </div>
            <div className="bg-white p-8 border-2 border-charcoal">
              <p className="text-lg mb-6 text-charcoal italic leading-relaxed">
                "Worth every penny. The transformation has been remarkable."
              </p>
              <p className="text-sm font-bold text-black">— Testimonial 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="purchase" className="px-6 py-32 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-black mb-8">
            Ready to Transform?
          </h2>
          <p className="text-xl mb-12 text-muted-olive">
            Join others who have found their purpose. Start your journey today.
          </p>
          <a
            href="#purchase"
            className="inline-block bg-deep-blue text-white px-16 py-6 text-xl font-bold tracking-wide hover:bg-opacity-90 transition-all duration-200 mb-6"
          >
            Get Started — <span className="font-mono">$297</span>
          </a>
          <p className="font-mono text-sm text-charcoal">
            Lifetime Access • Instant Download • 30-Day Money-Back Guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-charcoal text-muted-olive text-center text-sm">
        <p className="font-mono">© 2024 Josh Terry. All rights reserved.</p>
      </footer>
    </main>
  );
}
