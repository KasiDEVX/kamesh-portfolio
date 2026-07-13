import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { initAboutScrollAnimation } from '@/animations/about';
import aboutPortrait from '@/assets/images/about.jpeg';
import { MagicText } from '@/components/ui/magic-text';

export const Introduction: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const anim = initAboutScrollAnimation(containerRef.current);

    return () => {
      anim.kill();
    };
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent overflow-hidden"
      id="introduction"
    >
      {/* Scene 01: Large Editorial Philosophy */}
      <div className="scene-philosophy min-h-[48vh] flex flex-col justify-center max-w-[1280px] mx-auto px-8 pt-28 pb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-6 animate-fade-rise">
          02 / Philosophy
        </span>
        <MagicText
          text="Great software is built with intention, not just code."
          className="s1-text max-w-5xl p-0 text-neutral font-display"
          textClassName="text-[clamp(2.6rem,6vw,5.8rem)] font-light leading-[1.12] tracking-tight"
        />
        <p className="s1-subtext text-neutral/45 font-body text-base md:text-lg max-w-2xl leading-relaxed mt-8">
          The best products don't demand attention. They quietly solve problems through thoughtful design, careful architecture, and countless decisions that users never have to notice.
        </p>
      </div>

      {/* Scene 02: About Me */}
      <div className="scene-who-i-am py-20 md:py-24 border-t border-neutral/5 bg-transparent">
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center lg:justify-start s2-visual">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-lg border border-neutral/10 bg-surface/20 shadow-2xl shadow-background/25">
              <img
                src={aboutPortrait}
                alt="Kamesh portrait"
                className="aspect-[4/5] w-full object-cover grayscale-[12%] contrast-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-accent/10" />
              <div className="absolute inset-x-6 bottom-6 h-px bg-neutral/20" />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5 max-w-[620px]">
            <div className="s2-text">
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                About Me
              </span>
              <MagicText
                text="The craft behind the code"
                className="mt-3 p-0 text-neutral font-display"
                textClassName="text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.18]"
              />
            </div>
            <p className="s2-text font-body text-base md:text-[1.05rem] text-neutral/70 leading-[1.85] max-w-[560px]">
              I'm Kamesh R, a Full Stack Developer who enjoys understanding systems before building them. Whether I'm designing a web application, experimenting with machine learning, or exploring low-level technologies, I'm driven by curiosity and a desire to create software that feels simple despite the complexity behind it.
            </p>
            <p className="s2-text font-body text-base md:text-[1.05rem] text-neutral/70 leading-[1.85] max-w-[560px]">
              My approach is rooted in thoughtful engineering rather than chasing trends. I enjoy breaking down difficult problems, refining ideas through iteration, and paying attention to the small details that shape the overall experience. To me, good software is not just functional, it's reliable, intuitive, and built to last.
            </p>
          </div>
        </div>
      </div>

      {/* Scene 03: Academic Studies */}
      <div className="scene-studies relative py-20 md:py-24 border-t border-neutral/5 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#122920]/55 pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 relative">
          <div className="lg:col-span-3">
            <div className="sticky top-32 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                02.1 / Studies
              </span>
              <h3 className="font-display text-2xl text-neutral font-light mt-2">
                Academic Foundations
              </h3>
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-12">
            <div className="timeline-container relative pl-6 md:pl-8 border-l border-neutral/10 flex flex-col gap-12">
              
              {/* Timeline Progress Line (lights up on scroll) */}
              <div className="absolute left-[-1px] top-2 bottom-2 w-[2px] bg-neutral/10 pointer-events-none">
                <div className="timeline-progress-line absolute left-0 top-0 w-full bg-accent origin-top scale-y-0 h-full" />
              </div>

              {[
                {
                  year: '2023 – 2027',
                  institution: 'Ramco Institute of Technology, Rajapalayam',
                  title: 'Bachelor of Engineering in Computer Science and Business Systems',
                  desc: 'Currently in my 3rd year. Focused on computing fundamentals, software architectures, database systems, and business operations.',
                  coursework: ['Design Patterns', 'Advanced Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'],
                  isCurrent: true
                },
                {
                  year: '2011 – 2023',
                  institution: 'Spectrum Matric Hr Sec School, Elathur',
                  title: 'Primary & Secondary Education (1st – 12th Grade)',
                  desc: 'Completed secondary schooling with a major focus on mathematics, physics, and computer science foundations.',
                  coursework: ['Advanced Mathematics', 'Physics & Chemistry', 'Structured Programming', 'Computer Science'],
                  isCurrent: false
                }
              ].map((study, idx) => (
                <div
                  key={idx}
                  className="study-item relative flex flex-col gap-3 pb-4"
                >
                  {/* Timeline node dot */}
                  <div className="timeline-dot absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full border border-neutral/30 bg-[#19372D] transition-all duration-300" />

                  <span className={`study-num font-body text-xs tracking-wider font-semibold ${
                    study.isCurrent ? 'text-accent' : 'text-accent-secondary/60'
                  }`}>
                    {study.year} {study.isCurrent && '• Currently Studying'}
                  </span>
                  
                  <h4 className="study-title font-display text-2xl text-neutral font-light uppercase tracking-wide">
                    {study.institution}
                  </h4>
                  
                  <p className="study-desc font-body text-xs text-neutral/50 -mt-1 font-medium tracking-wide">
                    {study.title}
                  </p>

                  <p className="font-body text-sm md:text-base text-neutral/60 leading-relaxed max-w-2xl mt-1">
                    {study.desc}
                  </p>

                  {/* Coursework Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {study.coursework.map((course) => (
                      <span
                        key={course}
                        className="rounded-full border border-border-light bg-[#1A2B22]/20 px-3 py-1 font-mono text-[10px] text-text-secondary hover:text-text-primary hover:border-accent-primary/40 transition-colors duration-200"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="s3-closing mt-2 border-t border-neutral/10 pt-8">
              <blockquote className="max-w-[680px] font-display text-2xl md:text-3xl text-neutral/85 font-light leading-[1.35]">
                Build slowly enough to understand the system. Then make the result feel simple.
              </blockquote>
              <div className="mt-8 text-neutral/40">
                <p
                  className="text-2xl leading-none"
                  style={{ fontFamily: '"Segoe Script", "Bradley Hand ITC", cursive' }}
                >
                  Kamesh R
                </p>
                <p className="mt-3 font-body text-xs tracking-[0.18em] uppercase">
                  Building software with purpose.
                </p>
              </div>
            </div>

            <a
              href="#skills"
              className="s3-link cursor-target -mt-2 inline-flex w-fit items-center gap-2 font-body text-sm text-neutral/50 hover:text-neutral hover:underline transition-colors duration-200"
            >
              Continue into skills, education, and journey
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
