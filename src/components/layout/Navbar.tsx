import React, { useRef, useState, useEffect } from 'react';
import { initNavbarAnimation } from '@/animations/navbar';
import { useGSAP } from '@gsap/react';
import logoImg from '@/assets/images/logo.png';
import { useAudio } from '@/context/AudioContext';

const NAV_LINKS = [
  { label: 'About', target: '#introduction' },
  { label: 'Selected Work', target: '#editorial-gallery' },
  { label: 'Skills', target: '#skills' },
  { label: 'Certificates', target: '#certificates' },
  { label: 'Contact', target: '#contact' },
];

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const logoWrapperRef = useRef<HTMLAnchorElement>(null);
  const { isMuted, toggleSound } = useAudio();
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    if (!navRef.current || !logoRef.current || !logoWrapperRef.current) return;
    const trigger = initNavbarAnimation(
      navRef.current
    );
    return () => {
      trigger.kill();
    };
  }, { scope: navRef });

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="navbar fixed top-0 left-0 w-full z-50 border-b border-transparent"
      >
        <div className="nav-container max-w-[1280px] mx-auto flex justify-between items-center px-6 sm:px-8">
          {/* Left: Logo */}
          <a
            ref={logoWrapperRef}
            href="#"
            className="logo-wrapper cursor-target flex items-center text-neutral hover:opacity-90 transition-opacity"
          >
            <img
              ref={logoRef}
              src={logoImg}
              alt="Kamesh R Logo"
              className="logo-img w-auto object-contain"
              style={{ willChange: 'height' }}
            />
            <span className="font-semibold text-lg tracking-wide font-body text-[#F5F0DE]">
              Kamesh R
            </span>
          </a>

          {/* Right: Desktop Nav Links + Sound Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((item, idx) => (
                <a
                  key={idx}
                  href={item.target}
                  className="cursor-target font-body text-[14px] text-[#F5F0DE]/70 hover:text-[#F5F0DE] transition-colors relative py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              onClick={toggleSound}
              className="cursor-target flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/25 hover:border-accent rounded-full text-[10px] font-body uppercase tracking-[0.15em] text-accent hover:bg-accent/15 transition-all duration-300 focus:outline-none"
              aria-label="Toggle ambient music"
            >
              <div className="flex items-end gap-[2px] h-2.5 w-3.5">
                <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-2.5 animate-sound-bar-1'}`} />
                <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-1.5 animate-sound-bar-2'}`} />
                <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-2.5 animate-sound-bar-3'}`} />
                <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-1' : 'h-1.5 animate-sound-bar-4'}`} />
              </div>
              <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus:outline-none relative z-50 pointer-events-auto"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span
                className={`block w-5 h-[1.5px] bg-[#F5F0DE] rounded-full transition-all duration-300 origin-center ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#F5F0DE] rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#F5F0DE] rounded-full transition-all duration-300 origin-center ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (placed outside the animated nav to prevent viewport containment issues) */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-[49] bg-[#0E211A] transition-all duration-500 flex flex-col justify-center items-center gap-8 ${
          menuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: menuOpen ? 'auto' : 'none',
          visibility: menuOpen ? 'visible' : 'hidden',
          transitionProperty: 'opacity, visibility',
        }}
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((item, idx) => (
          <a
            key={idx}
            href={item.target}
            onClick={() => setMenuOpen(false)}
            className="font-display text-[clamp(2rem,8vw,3.5rem)] font-light text-[#F5F0DE]/80 hover:text-[#D4BE72] transition-colors duration-300 tracking-tight"
            style={{
              transitionDelay: menuOpen ? `${idx * 60}ms` : '0ms',
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 400ms ease ${idx * 60}ms, transform 400ms ease ${idx * 60}ms, color 200ms`,
            }}
          >
            {item.label}
          </a>
        ))}

        <div
          className="mt-6 flex items-center gap-8 text-[#F5F0DE]/30 text-xs font-body tracking-widest uppercase"
          style={{
            opacity: menuOpen ? 1 : 0,
            transition: `opacity 400ms ease ${NAV_LINKS.length * 60 + 60}ms`,
          }}
        >
          <a href="https://github.com/KameshDEVX/profile" target="_blank" rel="noreferrer" className="hover:text-[#F5F0DE] transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/kamesh-r-702497339/" target="_blank" rel="noreferrer" className="hover:text-[#F5F0DE] transition-colors">LinkedIn</a>
          <a href="mailto:kamesh.offcl@gmail.com" className="hover:text-[#F5F0DE] transition-colors">Email</a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
