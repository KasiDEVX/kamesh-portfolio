import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import heroFallback from '@/assets/hero_fallback.jpg';

export const Conversation: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prevent page reload and mark as submitted
    // TODO: wire to a backend service (e.g. Formspree, Web3Forms, EmailJS)
    setFormSubmitted(true);
  };
  const sectionRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const fadeContentRef = useRef<HTMLDivElement>(null);
  const footerLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !footerRef.current || !wordRef.current || !fadeContentRef.current || !footerLinksRef.current) return;

    const ctx = gsap.context(() => {
      // The word starts pushed down — only the top ~15% is visible at the fold
      gsap.set(wordRef.current, { yPercent: 75, scale: 0.96, opacity: 0.3 });
      gsap.set(footerLinksRef.current, { opacity: 0, y: 40 });

      // Main scroll-driven timeline: the word rises into full view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          end: 'top 10%',
          scrub: 1.2,
          // markers: false,
        },
      });

      // Fade out the contact form content
      tl.to(fadeContentRef.current, {
        opacity: 0,
        y: -60,
        scale: 0.97,
        duration: 0.3,
        ease: 'power2.in',
      }, 0);

      // Rise the word into full view
      tl.to(wordRef.current, {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'none',
      }, 0.15);

      // Fade in footer links at the end
      tl.to(footerLinksRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.7);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" id="contact">
      {/* Contact Section — fades out as visitor scrolls deeper */}
      <div ref={fadeContentRef} className="w-full py-24 md:py-36 bg-transparent border-t border-neutral/5">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                06 / Conversation
              </span>
              <h3 className="font-display text-2xl text-neutral font-light mt-2">
                Let's Build <br />Something Together
              </h3>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-9 flex flex-col gap-20">
            {formSubmitted ? (
              <div className="liquid-glass p-8 sm:p-10 rounded-3xl flex flex-col gap-4 max-w-2xl border border-accent/20 text-center">
                <span className="text-2xl">✦</span>
                <h4 className="font-display text-lg text-neutral font-light">Message received.</h4>
                <p className="font-body text-sm text-neutral/50">Thanks for reaching out — I'll get back to you soon.</p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="cursor-target self-center mt-2 font-body text-xs text-neutral/40 hover:text-neutral/70 underline underline-offset-4 transition-colors duration-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="liquid-glass p-8 sm:p-10 rounded-3xl flex flex-col gap-6 max-w-2xl border border-neutral/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-body text-xs text-neutral/50 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="John Doe"
                      className="font-body text-sm bg-surface/20 border border-neutral/10 rounded-xl px-4 py-3 text-neutral placeholder:text-neutral/20 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-body text-xs text-neutral/50 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="john@example.com"
                      className="font-body text-sm bg-surface/20 border border-neutral/10 rounded-xl px-4 py-3 text-neutral placeholder:text-neutral/20 focus:outline-none focus:border-accent/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-body text-xs text-neutral/50 uppercase tracking-wider">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className="font-body text-sm bg-surface/20 border border-neutral/10 rounded-xl px-4 py-3 text-neutral placeholder:text-neutral/20 focus:outline-none focus:border-accent/40 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-target inline-block liquid-glass rounded-full px-10 py-4 text-sm font-medium text-neutral hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 self-start"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CINEMATIC FOOTER — THE WORD RISES FROM THE FOLD
          ═══════════════════════════════════════════════ */}
      <footer
        ref={footerRef}
        className="footer-reveal relative w-full min-h-screen bg-[#0B1C16] overflow-hidden flex flex-col justify-between items-center"
      >
        {/* Atmospheric background — subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(212, 190, 114, 0.04) 0%, transparent 70%)',
          }}
        />

        {/* Top bar: section label + signature */}
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-16 lg:px-20 pt-12 sm:pt-16 flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 sm:gap-0">
          <div className="text-[10px] tracking-[0.3em] text-[#F5F0DE]/25 uppercase font-body select-none">
            06 / CONCLUSION
          </div>

          {/* Signature — echoes the about section sign-off */}
          <div className="flex flex-col items-start sm:items-end gap-1 sm:text-right opacity-70">
            <p
              className="text-[#F5F0DE]/35 text-xl md:text-2xl leading-none select-none"
              style={{ fontFamily: '"Segoe Script", "Bradley Hand ITC", cursive' }}
            >
              Kamesh R
            </p>
            <p className="font-body text-[9px] tracking-[0.22em] uppercase text-[#F5F0DE]/18 select-none">
              Building software with purpose.
            </p>
          </div>
        </div>

        {/* ── THE WORD ── */}
        <div
          ref={wordRef}
          className="relative z-10 w-full flex-1 flex justify-center items-center select-none overflow-hidden"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="w-full h-[45vh] max-h-[550px] flex justify-center items-center px-4">
            <svg
              className="w-full h-full pointer-events-none"
              viewBox="0 0 1800 500"
              preserveAspectRatio="xMidYMid meet"
              aria-label="PURPOSE"
            >
              <defs>
                <mask id="purpose-text-mask" x="0" y="0" width="100%" height="100%">
                  <rect width="100%" height="100%" fill="black" />
                  <text
                    x="900"
                    y="270"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    className="font-display"
                    textLength="1680"
                    lengthAdjust="spacing"
                    style={{
                      fontSize: '440px',
                      fontWeight: 700,
                      letterSpacing: '-0.06em',
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    PURPOSE
                  </text>
                </mask>
              </defs>

              <g mask="url(#purpose-text-mask)">
                <foreignObject x="0" y="0" width="100%" height="100%">
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Base layer: hero background image */}
                    <img
                      src={heroFallback}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
                    />
                    {/* Dark atmospheric overlay to blend image with clouds */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(11,28,22,0.35) 0%, rgba(11,28,22,0.25) 40%, rgba(11,28,22,0.45) 100%)',
                      }}
                    />
                    {/* Cloud layer 1 — large, slow drift */}
                    <div className="footer-cloud footer-cloud--1" />
                    {/* Cloud layer 2 — medium, offset */}
                    <div className="footer-cloud footer-cloud--2" />
                    {/* Cloud layer 3 — foreground wisps */}
                    <div className="footer-cloud footer-cloud--3" />
                    {/* Warm atmospheric tint on top */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(212,190,114,0.08) 0%, transparent 50%, rgba(212,190,114,0.06) 100%)',
                      }}
                    />
                  </div>
                </foreignObject>
              </g>
            </svg>
          </div>
        </div>

        {/* Footer Bottom Links */}
        <div
          ref={footerLinksRef}
          className="relative z-10 w-full max-w-[1400px] border-t border-neutral/10 pt-10 pb-12 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-neutral/40 text-xs"
        >
          <div className="flex flex-col gap-1.5 items-center md:items-start font-body">
            <span className="font-semibold text-[#F5F0DE]/80 text-sm tracking-wide">Designed &amp; Developed by Kamesh R.</span>
            <span className="text-xs">Full Stack Developer &amp; Tech Craftsman.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-10 font-body uppercase tracking-widest text-sm font-medium">
            <a href="https://github.com/kameshoffcl-code" target="_blank" rel="noreferrer" className="cursor-target hover:text-[#F5F0DE] transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/kamesh-r-702497339/" target="_blank" rel="noreferrer" className="cursor-target hover:text-[#F5F0DE] transition-colors">LinkedIn</a>
            <a href="mailto:kamesh.offcl@gmail.com" className="cursor-target hover:text-[#F5F0DE] transition-colors">Email</a>
          </div>

          <span className="font-body text-xs">&copy; 2026 Kasi Vishwanathan P.</span>
        </div>
      </footer>
    </section>
  );
};

export default Conversation;
