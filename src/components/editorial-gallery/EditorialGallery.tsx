import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { initHorizontalScroll } from '@/animations/selected-work';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { CaseStudyViewer } from './CaseStudyViewer';
import { CaseStudyCard } from './CaseStudyCard';
import type { ProjectData, CaseStudyContent } from './CaseStudyData';
import { CASE_STUDIES } from './CaseStudyData';
import hostelImage from '@/assets/images/hostel.webp';
import facultyDashboardImage from '@/assets/images/faculty_ai_dashboard.webp';
import portfolioImage from '@/assets/images/portfolio.webp';

const PROJECTS: ProjectData[] = [
  {
    id: 'canvas-01',
    num: '01',
    title: 'Hostel System',
    category: 'Backend Engineering',
    tech: ['Java', 'JDBC', 'MySQL'],
    description: 'A secure visitor tracking system.',
    imageSrc: hostelImage,
    link: '#canvas-01',
    cta: 'View Details',
    type: 'image',
    priority: true,
    widthClass: 'w-[75vw] sm:w-[45vw] md:w-[22vw]',
    alignClass: 'self-start',
    marginClass: 'mt-[10vh] ml-0',
    textPosition: 'down',
  },
  {
    id: 'canvas-02',
    num: '02',
    title: 'Faculty AI Dashboard',
    category: 'Machine Learning',
    tech: ['Python', 'Flask', 'MySQL'],
    description: 'An intelligent academic analytics platform.',
    imageSrc: facultyDashboardImage,
    link: '#canvas-02',
    cta: 'Explore Case Study',
    type: 'image',
    priority: true,
    widthClass: 'w-[70vw] sm:w-[50vw] md:w-[45vw]',
    alignClass: 'self-start',
    marginClass: 'mt-[25vh] ml-[10vw]',
    textPosition: 'up',
  },
  {
    id: 'canvas-03',
    num: '03',
    title: 'Kamesh R Portfolio',
    category: 'Frontend Craftsmanship',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'A cinematic editorial experience.',
    imageSrc: portfolioImage,
    link: '#canvas-03',
    cta: 'View Live',
    type: 'image',
    priority: true,
    widthClass: 'w-[85vw] sm:w-[40vw] md:w-[25vw]',
    alignClass: 'self-start',
    marginClass: 'mt-[2vh] ml-[15vw]',
    textPosition: 'down',
  },
  {
    id: 'canvas-04',
    num: '04',
    title: 'Currently Crafting',
    category: 'Active Exploration',
    tech: ['Reverse Engineering', 'Flutter'],
    description: 'Deepening expertise in binary analysis and mobile architecture.',
    imageSrc: '',
    link: '#canvas-04',
    cta: 'Follow Journey',
    type: 'text',
    widthClass: 'w-[85vw] sm:w-[35vw] md:w-[20vw]',
    alignClass: 'self-start',
    marginClass: 'mt-[45vh] ml-[12vw] mr-[30vw]',
    textPosition: 'down',
  },
];

/* ─── Vertical Editorial Card (Mobile/Tablet) ─── */
const VerticalEditorialCard: React.FC<{ project: ProjectData; index: number; onClick: () => void }> = ({ 
  project, 
  index,
  onClick 
}) => {
  const isTextDown = project.textPosition === 'down';
  const isLast = index === PROJECTS.length - 1;

  const caption = (
    <div className={`flex flex-col ${isTextDown ? 'mt-8' : 'mb-8'} gap-4`}>
      <span className="panel-category text-[11px] uppercase tracking-[0.25em] text-neutral/60 font-semibold">
        {project.category}
      </span>
      <h3 className="panel-title font-display text-2xl md:text-3xl lg:text-4xl text-neutral font-medium tracking-wide uppercase leading-tight">
        {project.title}
      </h3>
      {project.tech && project.tech.length > 0 && (
        <span className="panel-tech text-xs sm:text-sm tracking-wider text-neutral/50 font-body font-medium uppercase">
          {project.tech.join(' • ')}
        </span>
      )}
      {project.description && (
        <p className="panel-desc text-sm md:text-base text-neutral/60 font-body leading-relaxed max-w-[340px]">
          {project.description}
        </p>
      )}
    </div>
  );

  if (project.type === 'text') {
    return (
      <article
        onClick={onClick}
        className="panel relative w-full py-16 md:py-24 flex flex-col items-start text-left px-6 md:px-8 cursor-pointer"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="w-full max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-6 block">
            {project.category}
          </span>
          <h3 className="font-display text-3xl md:text-5xl text-neutral font-light leading-[1.1] mb-6">
            {project.title}
          </h3>
          <p className="font-body text-sm md:text-base text-neutral/50 leading-relaxed mb-8 max-w-sm">
            {project.description}
          </p>
          <div className="flex items-center gap-2 text-neutral/60 hover:text-neutral transition-colors duration-200 font-body text-sm">
            {project.cta}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className={`panel relative w-full flex flex-col ${isTextDown ? 'flex-col' : 'flex-col-reverse'} py-16 md:py-24 px-6 md:px-8 cursor-pointer`}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
        {!isTextDown && caption}

        {/* Image Container */}
        <div className="relative w-full max-w-5xl mx-auto">
          <a
            onClick={(e) => e.stopPropagation()}
            href={project.link}
            className="cursor-target panel-image-wrapper relative block overflow-hidden bg-surface/20 w-full rounded-xl aspect-[4/5] sm:aspect-auto"
          >
            <img
              src={project.imageSrc}
              alt={project.title}
              loading={project.priority ? 'eager' : 'lazy'}
              fetchPriority={project.priority ? 'high' : 'auto'}
              decoding="async"
              className="panel-image w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 rounded-xl"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none rounded-xl" />
          </a>
        </div>

        {isTextDown && caption}

        {/* Connecting line between cards (except last) */}
        {!isLast && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1px] h-16 bg-gradient-to-b from-neutral/20 to-transparent pointer-events-none" />
        )}
      </div>
    </article>
  );
};

/* ─── Simple Grid Card (Low-End) ─── */
const SimpleGridCard: React.FC<{ project: ProjectData; onClick: () => void }> = ({ 
  project, 
  onClick 
}) => {
  const isTextDown = project.textPosition === 'down';

  const caption = (
    <div className={`flex flex-col gap-3 ${isTextDown ? 'mt-6' : 'mb-6'}`}>
      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral/60 font-semibold">
        {project.category}
      </span>
      <h3 className="font-display text-xl md:text-2xl text-neutral font-medium tracking-wide uppercase leading-tight">
        {project.title}
      </h3>
      {project.tech && project.tech.length > 0 && (
        <span className="text-xs tracking-wider text-neutral/50 font-body font-medium uppercase">
          {project.tech.join(' • ')}
        </span>
      )}
      {project.description && (
        <p className="text-sm text-neutral/60 font-body leading-relaxed">
          {project.description}
        </p>
      )}
    </div>
  );

  if (project.type === 'text') {
    return (
      <article
        onClick={onClick}
        className="panel bg-surface/20 border border-neutral/5 rounded-xl p-6 md:p-8 cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-4 block">
          {project.category}
        </span>
        <h3 className="font-display text-2xl md:text-3xl text-neutral font-light leading-[1.1] mb-4">
          {project.title}
        </h3>
        <p className="font-body text-sm text-neutral/50 leading-relaxed mb-6">
          {project.description}
        </p>
        <div className="flex items-center gap-2 text-neutral/60 hover:text-neutral transition-colors duration-200 font-body text-sm">
          {project.cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="panel bg-surface/20 border border-neutral/5 rounded-xl overflow-hidden flex flex-col cursor-pointer"
    >
      <a
        onClick={(e) => e.stopPropagation()}
        href={project.link}
        className="cursor-target panel-image-wrapper relative block overflow-hidden bg-surface/20 w-full aspect-[4/5]"
      >
        <img
          src={project.imageSrc}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="panel-image w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-filter duration-500"
        />
        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500 pointer-events-none" />
      </a>
      <div className="p-6 flex-1 flex flex-col">
        {caption}
        <a
          onClick={(e) => e.stopPropagation()}
          href={project.link}
          className="cursor-target font-body text-sm text-neutral/60 hover:text-neutral hover:underline inline-flex items-center gap-2 transition-colors duration-200 mt-auto"
        >
          {project.cta}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </article>
  );
};

/* ─── Main Responsive Component ─── */
export const EditorialGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openCaseStudy, setOpenCaseStudy] = useState<CaseStudyContent | null>(null);

  const { isLowEnd, prefersReducedMotion } = useDeviceCapability();

  // Preload images
  useEffect(() => {
    const imageProjects = PROJECTS.filter((project) => project.type === 'image' && project.imageSrc);
    const preloadLinks: HTMLLinkElement[] = [];

    imageProjects.forEach((project) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = project.imageSrc;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = project.imageSrc;
      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  // Horizontal scroll animation - always enabled, matchMedia in animation handles desktop vs mobile
  // Respect prefers-reduced-motion
  const enableHorizontal = !prefersReducedMotion;

  useGSAP(() => {
    if (!containerRef.current || !panelsRef.current) return;

    const scrollAnim = initHorizontalScroll({
      container: containerRef.current,
      panelsContainer: panelsRef.current,
      panelsCount: PROJECTS.length,
      onProgressChange: (index: number) => setActiveIndex(index),
      enableHorizontal,
    });

    return () => {
      scrollAnim?.kill();
    };
  }, { scope: containerRef });

  const handleOpenCaseStudy = (project: ProjectData) => {
    const caseStudy = CASE_STUDIES[project.id];
    if (caseStudy) {
      setOpenCaseStudy(caseStudy);
    }
  };

  const handleCloseCaseStudy = () => {
    setOpenCaseStudy(null);
  };

  // Layout selection based on screen size (not device capability)
  // Desktop (>=1024px): Horizontal pinned scroll
  // Mobile/Tablet (<1024px): Vertical editorial stack
  // Low-end mobile: Simple grid
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const useSimpleGrid = isMobile && isLowEnd;

  if (useSimpleGrid) {
    return (
      <>
        <section
          ref={containerRef}
          className="relative w-full bg-transparent overflow-hidden"
          id="editorial-gallery"
        >
          {/* Title Banner */}
          <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
            <div className="max-w-[1280px] mx-auto px-6 pt-24 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-auto">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                  02 / Selected Work
                </span>
              </div>
            </div>
          </div>

          {/* Simple Grid */}
          <div className="w-full pt-24 pb-12 px-6">
            <div className="max-w-[1280px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {PROJECTS.map((project) => (
                  <SimpleGridCard key={project.id} project={project} onClick={() => handleOpenCaseStudy(project)} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="hidden sm:flex fixed bottom-8 right-8 z-40 items-center gap-3 font-body text-xs text-neutral/50 pointer-events-none select-none" style={{ mixBlendMode: 'difference' }}>
            <span className="text-neutral font-semibold text-sm tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-neutral/30">/</span>
            <span className="tabular-nums">
              {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </section>
        <CaseStudyViewer
          isOpen={!!openCaseStudy}
          onClose={handleCloseCaseStudy}
          initialProject={openCaseStudy!}
        />
      </>
    );
  }

  if (isMobile) {
    // Tablet/Mobile (<1024px): Vertical editorial layout
    return (
      <>
        <section
          ref={containerRef}
          className="relative w-full bg-transparent overflow-hidden"
          id="editorial-gallery"
        >
          {/* Title Banner - Fixed over scroll */}
          <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
            <div className="max-w-[1280px] mx-auto px-6 pt-24 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-auto">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                  02 / Selected Work
                </span>
              </div>
            </div>
          </div>

          {/* Background Connecting Path */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg
              className="w-full h-full absolute"
              preserveAspectRatio="none"
              viewBox="0 0 1000 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50,0 C50,20 50,40 50,60 C50,80 50,100 50,100"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                className="text-accent"
              />
            </svg>
          </div>

          {/* Vertical Stacked Cards */}
          <div className="w-full pt-24 pb-12 px-6">
            <div className="max-w-[1280px] mx-auto">
              <div className="relative flex flex-col gap-0">
                {PROJECTS.map((project, idx) => (
                  <VerticalEditorialCard key={project.id} project={project} index={idx} onClick={() => handleOpenCaseStudy(project)} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="hidden sm:flex fixed bottom-8 right-8 z-40 items-center gap-3 font-body text-xs text-neutral/50 pointer-events-none select-none" style={{ mixBlendMode: 'difference' }}>
            <span className="text-neutral font-semibold text-sm tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-neutral/30">/</span>
            <span className="tabular-nums">
              {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </section>
        <CaseStudyViewer
          isOpen={!!openCaseStudy}
          onClose={handleCloseCaseStudy}
          initialProject={openCaseStudy!}
        />
      </>
    );
  }

  // Desktop (>=1024px): Horizontal pinned scroll
  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full bg-transparent overflow-hidden"
        id="editorial-gallery"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* Background Connecting Path (SVG) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg
            className="w-full h-full absolute"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,50 C150,90 250,10 400,50 C550,90 650,20 800,50 C900,70 1000,50 1000,50"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-accent"
            />
          </svg>
        </div>

        {/* Title Banner - Fixed over horizontal scroll on desktop */}
        <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
          <div className="max-w-[1280px] mx-auto px-8 pt-24 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pointer-events-auto">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                02 / Selected Work
              </span>
            </div>
          </div>
        </div>

        {/* Scattered Canvases Container */}
        <div className="w-full overflow-x-auto md:overflow-hidden h-screen pt-24 pb-12">
          <div
            ref={panelsRef}
            className="flex h-full pl-[50vw] w-max items-stretch"
            style={{ willChange: 'transform' }}
          >
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                className="flex-shrink-0 flex h-full"
                style={{
                  opacity: activeIndex === idx ? 1 : 0.6,
                  transition: 'opacity 500ms ease',
                  willChange: 'opacity',
                }}
              >
                <CaseStudyCard
                  project={project}
                  layoutId={project.id}
                  onClick={() => handleOpenCaseStudy(project)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator — Bottom Right */}
        <div className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-3 font-body text-xs text-neutral/50 pointer-events-none select-none"
             style={{ mixBlendMode: 'difference' }}>
          <span className="text-neutral font-semibold text-sm tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-neutral/30">/</span>
          <span className="tabular-nums">
            {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>
      </section>
      <CaseStudyViewer
        isOpen={!!openCaseStudy}
        onClose={handleCloseCaseStudy}
        initialProject={openCaseStudy!}
      />
    </>
  );
};

export default EditorialGallery;