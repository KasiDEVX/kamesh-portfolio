import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import heroImage from '@/assets/hero.png';
import aboutImage from '@/assets/images/about.jpeg';
import logoImage from '@/assets/images/logo.png';

interface SkillCategory {
  label: string;
  num: string;
  items: string[];
  image: string;
}

const skillCategories: SkillCategory[] = [
  {
    label: 'Languages',
    num: '01',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'HTML/CSS'],
    image: heroImage,
  },
  {
    label: 'Frameworks & Libraries',
    num: '02',
    items: ['React', 'Next.js', 'Node.js', 'Express', 'Flask', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
    image: aboutImage,
  },
  {
    label: 'Tools & Platforms',
    num: '03',
    items: ['Git', 'Docker', 'PostgreSQL', 'MongoDB', 'Linux', 'Neovim', 'Figma', 'Vercel', 'CI/CD'],
    image: logoImage,
  },
];

const education = [
  {
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'State Technical University',
    year: '2023 – 2027',
    coursework: 'Design Patterns, Advanced Algorithms, Database Systems, Operating Systems, Computer Networks',
  },
  {
    degree: 'Senior Secondary Education (Computer Science)',
    institution: 'National Academy',
    year: '2021 – 2023',
    coursework: 'Structured Programming, Computer Architecture, Data Structures, Boolean Algebra',
  },
];

const SkillRow: React.FC<{ category: SkillCategory; isOpen: boolean; onToggle: () => void }> = ({
  category,
  isOpen,
  onToggle,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const content = marqueeInnerRef.current.querySelector('.stack-marquee-part') as HTMLElement | null;
      if (!content) return;
      const contentWidth = content.offsetWidth;
      if (!contentWidth) return;
      setRepetitions(Math.max(4, Math.ceil(window.innerWidth / contentWidth) + 2));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [category.items]);

  useEffect(() => {
    if (!marqueeInnerRef.current) return;
    const content = marqueeInnerRef.current.querySelector('.stack-marquee-part') as HTMLElement | null;
    if (!content) return;
    const contentWidth = content.offsetWidth;
    if (!contentWidth) return;

    animationRef.current?.kill();
    animationRef.current = gsap.to(marqueeInnerRef.current, {
      x: -contentWidth,
      duration: 16,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      animationRef.current?.kill();
    };
  }, [category.items, repetitions]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = ev.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom';

    gsap.timeline({ defaults: { duration: 0.55, ease: 'expo.out' } })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = ev.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom';

    gsap.timeline({ defaults: { duration: 0.55, ease: 'expo.out' } })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
  <div className="border-b border-neutral/8 relative overflow-hidden" ref={rowRef}>
    {/* Collapsed Row — 76px height */}
    <button
      onClick={onToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-target w-full flex items-center justify-between gap-6 py-5 group text-left focus:outline-none"
      style={{ minHeight: '76px' }}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-5">
        <span className="font-body text-[10px] text-neutral/30 font-medium tracking-wider tabular-nums">
          {category.num}
        </span>
        <h4 className="font-display text-base md:text-lg text-neutral/80 group-hover:text-neutral font-light uppercase tracking-wide transition-colors duration-300">
          {category.label}
        </h4>
      </div>

      <div className="flex items-center gap-6">
        {/* Collapsed inline preview — small flowing list */}
        {!isOpen && (
          <span className="hidden md:inline font-body text-[11px] text-neutral/35 tracking-wide max-w-[320px] truncate">
            {category.items.slice(0, 4).join(' · ')}
            {category.items.length > 4 && ` · +${category.items.length - 4}`}
          </span>
        )}

        {/* Toggle icon */}
        <span
          className="w-5 h-5 flex items-center justify-center text-neutral/30 group-hover:text-accent transition-all duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </button>

    <div
      ref={marqueeRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-20 translate-y-[101%] overflow-hidden bg-[#F5F0DE]"
      style={{ height: '78px' }}
    >
      <div ref={marqueeInnerRef} className="flex h-full w-fit">
        {Array.from({ length: repetitions }).map((_, idx) => (
          <div key={idx} className="stack-marquee-part flex flex-shrink-0 items-center text-[#0E211A]">
            <span className="px-4 font-display text-[clamp(1.25rem,2vw,1.7rem)] font-light uppercase leading-none">
              {category.items.join('  /  ')}
            </span>
            <div
              className="mx-5 h-[42px] w-[132px] rounded-full border border-[#0E211A]/10 bg-cover bg-center shadow-[0_8px_22px_rgba(14,33,26,0.16)]"
              style={{ backgroundImage: `url(${category.image})` }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Expanded Content — below the row */}
    <div
      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        maxHeight: isOpen ? '280px' : '0px',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="pb-8 pl-8 md:pl-12">
        <div className="flex flex-wrap gap-2">
          {category.items.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-neutral/8 bg-surface/20 px-3.5 py-1 font-body text-[11px] text-neutral/70 transition-colors duration-200 hover:border-accent/30 hover:text-neutral/90"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export const Knowledge: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="relative w-full py-16 md:py-24 lg:py-28 bg-transparent overflow-hidden border-t border-neutral/5"
      id="skills"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="sticky top-32 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold font-body">
                03 / Knowledge
              </span>
              <h3 className="font-display text-xl md:text-2xl text-neutral font-light leading-tight mt-2">
                Capabilities &amp;<br />Academic Core
              </h3>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-9">
            {/* Skill Accordion Rows */}
            <div className="border-t border-neutral/8">
              {skillCategories.map((category, idx) => (
                <SkillRow
                  key={category.label}
                  category={category}
                  isOpen={openIndex === idx}
                  onToggle={() => handleToggle(idx)}
                />
              ))}
            </div>

            {/* Education Timeline */}
            <div className="pt-8 mt-2">
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold font-body">
                Education
              </span>
              <div className="relative border-l border-neutral/10 pl-6 mt-6 space-y-8">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-accent border-2 border-background group-hover:scale-125 transition-transform duration-300" />
                    <span className="text-[11px] font-body text-accent font-medium tracking-wider">{edu.year}</span>
                    <h4 className="font-display text-base text-neutral font-medium mt-1 leading-snug">{edu.degree}</h4>
                    <p className="font-body text-xs text-neutral/45 mt-0.5">{edu.institution}</p>
                    <p className="font-body text-xs text-neutral/55 leading-relaxed mt-2">
                      <strong className="text-neutral/70 font-medium">Focus:</strong> {edu.coursework}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer transition link */}
        <div className="border-t border-neutral/8 pt-8 mt-14">
          <a
            href="#certificates"
            className="cursor-target inline-flex items-center gap-2 font-body text-xs text-neutral/40 hover:text-neutral transition-colors duration-200"
          >
            Continue into certificates &amp; industry experience
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Knowledge;
