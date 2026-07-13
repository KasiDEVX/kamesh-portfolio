import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface FlowingStackItem {
  title: string;
  marquee: string[];
  image: string;
  description: string;
  technologies: string[];
  philosophy: string;
}

interface FlowingStackProps {
  items: FlowingStackItem[];
}

interface StackRowProps extends FlowingStackItem {
  isActive: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

const FlowingStackRow: React.FC<StackRowProps> = ({
  title,
  marquee,
  image,
  description,
  technologies,
  philosophy,
  isActive,
  isFirst,
  onToggle,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const detailInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const content = marqueeInnerRef.current.querySelector('.flowing-stack-marquee-part') as HTMLElement | null;
      if (!content) return;
      const contentWidth = content.offsetWidth;
      if (!contentWidth) return;
      const needed = Math.ceil(window.innerWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [marquee]);

  useEffect(() => {
    if (!marqueeInnerRef.current) return;
    const content = marqueeInnerRef.current.querySelector('.flowing-stack-marquee-part') as HTMLElement | null;
    if (!content) return;
    const contentWidth = content.offsetWidth;
    if (!contentWidth) return;

    animationRef.current?.kill();
    animationRef.current = gsap.to(marqueeInnerRef.current, {
      x: -contentWidth,
      duration: 18,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      animationRef.current?.kill();
    };
  }, [marquee, repetitions]);

  useLayoutEffect(() => {
    if (!detailInnerRef.current) return;

    gsap.killTweensOf(detailInnerRef.current);

    if (isActive) {
      gsap.fromTo(
        detailInnerRef.current,
        { yPercent: -12, scaleY: 0.92, opacity: 0, transformOrigin: 'top center' },
        { yPercent: 0, scaleY: 1, opacity: 1, duration: 0.55, ease: 'power3.out' }
      );
    } else {
      gsap.to(detailInnerRef.current, {
        yPercent: -8,
        scaleY: 0.96,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        transformOrigin: 'top center',
      });
    }
  }, [isActive]);

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: { duration: 0.6, ease: 'expo.out' } })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap.timeline({ defaults: { duration: 0.6, ease: 'expo.out' } })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      ref={rowRef}
      className="relative overflow-hidden"
      style={{ borderTop: isFirst ? 'none' : '1px solid rgba(245, 240, 222, 0.08)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative flex min-h-[88px] w-full items-center justify-between overflow-hidden bg-transparent px-5 py-4 text-left sm:px-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-surface/10 via-transparent to-surface/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 flex w-full items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <span className="font-body text-[11px] uppercase tracking-[0.28em] text-neutral/35">
              Stack
            </span>
            <h4 className="font-display text-[clamp(1.45rem,2.6vw,2.1rem)] font-light leading-none text-neutral">
              {title}
            </h4>
          </div>
          <span
            className={`font-body text-xs uppercase tracking-[0.3em] transition-colors duration-300 ${
              isActive ? 'text-accent' : 'text-neutral/35'
            }`}
          >
            {isActive ? 'Open' : 'Expand'}
          </span>
        </div>
      </button>

      <div
        ref={marqueeRef}
        className="pointer-events-none absolute inset-0 z-20 translate-y-[101%] overflow-hidden bg-[#F5F0DE]"
        style={{ height: '76px' }}
      >
        <div ref={marqueeInnerRef} className="flex h-full w-fit">
          {Array.from({ length: repetitions }).map((_, idx) => (
            <div
              key={idx}
              className="flowing-stack-marquee-part flex flex-shrink-0 items-center text-[#0E211A]"
            >
              <span className="px-4 font-display text-[clamp(1.35rem,2.3vw,2rem)] font-light uppercase leading-none">
                {marquee.join('  /  ')}
              </span>
              <div
                className="mx-6 h-[48px] w-[150px] rounded-full border border-[#0E211A]/10 bg-cover bg-center shadow-[0_8px_22px_rgba(14,33,26,0.16)]"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div
          ref={detailInnerRef}
          className="grid min-h-0 grid-cols-1 gap-5 border-t border-neutral/10 bg-surface/20 px-5 py-5 opacity-0 shadow-[0_16px_44px_rgba(5,22,17,0.14)] sm:px-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="flex flex-col gap-5">
            <p className="font-body text-sm md:text-[15px] leading-7 text-neutral/72">
              {description}
            </p>
            <div className="overflow-hidden rounded-lg border border-neutral/10 bg-background/20 shadow-[0_12px_30px_rgba(5,22,17,0.22)]">
              <img src={image} alt={title} className="aspect-[16/9] w-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-body text-[11px] uppercase tracking-[0.28em] text-accent">
                Technologies
              </span>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-neutral/10 bg-background/25 px-3 py-1.5 font-mono text-[11px] text-neutral/82 shadow-[0_6px_18px_rgba(5,22,17,0.12)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-body text-[11px] uppercase tracking-[0.28em] text-accent">
                Philosophy
              </span>
              <p className="font-body text-[13px] leading-6 text-neutral/62">
                {philosophy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlowingStack: React.FC<FlowingStackProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="w-full overflow-hidden border-y border-neutral/10 bg-[linear-gradient(180deg,rgba(16,86,102,0.08),rgba(10,51,35,0.05))] shadow-[0_14px_36px_rgba(5,22,17,0.12)]">
      <div className="flex flex-col">
        {items.map((item, index) => (
          <FlowingStackRow
            key={item.title}
            {...item}
            isFirst={index === 0}
            isActive={activeIndex === index}
            onToggle={() => setActiveIndex((current) => (current === index ? null : index))}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowingStack;
