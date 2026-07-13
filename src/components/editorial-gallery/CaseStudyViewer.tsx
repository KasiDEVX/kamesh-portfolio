import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { caseStudies } from './CaseStudyData';
import type { CaseStudy } from './CaseStudyData';

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="currentColor" />
  </svg>
);

interface CaseStudyViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject: CaseStudy | null;
}

const COLOR_SCHEME = {
  background: '#0E211A',
  surface: '#19372D',
  elevated: '#204234',
  textPrimary: '#F5F0DE',
  textSecondary: '#D8CCB5',
  accent: '#D4BE72',
  accentHover: '#E4D29B',
  border: 'rgba(245, 240, 222, 0.12)',
  borderMedium: 'rgba(245, 240, 222, 0.18)',
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 }
  }
};

export function CaseStudyViewer({ 
  isOpen, 
  onClose, 
  initialProject 
}: CaseStudyViewerProps) {
  const [currentProject, setCurrentProject] = useState<CaseStudy | null>(initialProject);
  const scrollYRef = useRef(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialProject) {
      setCurrentProject(initialProject);
    }
  }, [initialProject]);

  // Find current project index for navigation
  const currentIndex = currentProject ? caseStudies.findIndex((p) => p.id === currentProject.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < caseStudies.length - 1;

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const navigate = useCallback((direction: number) => {
    if (currentIndex === -1) return;

    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < caseStudies.length) {
      setCurrentProject(caseStudies[newIndex]);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !currentProject) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) navigate(-1);
      if (e.key === 'ArrowRight' && hasNext) navigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProject, hasPrev, hasNext, isOpen, navigate, onClose]);

  const isDevelopmentProcess = (content: unknown): content is CaseStudy['developmentProcess'] => 
    Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && 'phase' in content[0];

  const isResults = (content: unknown): content is CaseStudy['results'] => 
    Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && 'metric' in content[0];

  const isKeyFeatures = (content: unknown): content is CaseStudy['keyFeatures'] => 
    Array.isArray(content) && content.length > 0 && typeof content[0] === 'string';

  const renderSectionContent = (content: CaseStudy['overview'] | CaseStudy['keyFeatures'] | CaseStudy['developmentProcess'] | CaseStudy['results']) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    if (isDevelopmentProcess(content)) {
      // Development process
      return (
        <div className="space-y-6">
          {content.map((item, idx) => (
            <motion.div key={idx} variants={sectionVariants} className="p-6 rounded-xl" style={{ backgroundColor: COLOR_SCHEME.elevated, border: `1px solid ${COLOR_SCHEME.border}` }}>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] font-semibold" style={{ color: COLOR_SCHEME.accent }}>
                  {item.phase}
                </span>
                <span className="font-body text-sm font-medium" style={{ color: COLOR_SCHEME.textSecondary }}>
                  {item.duration}
                </span>
              </div>
              <p style={{ color: COLOR_SCHEME.textSecondary, lineHeight: 1.7 }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      );
    }
    if (isResults(content)) {
      // Results
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.map((item, idx) => (
            <motion.div key={idx} variants={sectionVariants} className="p-6 rounded-xl text-center" style={{ backgroundColor: COLOR_SCHEME.elevated, border: `1px solid ${COLOR_SCHEME.border}` }}>
              <div className="font-display font-medium mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: COLOR_SCHEME.accent }}>
                {item.value}
              </div>
              <div className="font-body text-sm uppercase tracking-[0.15em]" style={{ color: COLOR_SCHEME.textSecondary }}>
                {item.metric}
              </div>
            </motion.div>
          ))}
        </div>
      );
    }
    if (isKeyFeatures(content)) {
      // Key features (array of strings)
      return (
        <ul className="space-y-3">
          {content.map((item, idx) => (
            <motion.li key={idx} variants={sectionVariants} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: COLOR_SCHEME.elevated, border: `1px solid ${COLOR_SCHEME.border}` }}>
              <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: COLOR_SCHEME.accent }} />
              <span style={{ color: COLOR_SCHEME.textSecondary, lineHeight: 1.7 }}>{item}</span>
            </motion.li>
          ))}
        </ul>
      );
    }
    return null;
  };

  if (!isOpen || !currentProject) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={viewerRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
          },
          exit: { 
            opacity: 0,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
          }
        }}
        className="fixed inset-0 z-[100] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Case Study Viewer"
        style={{ backgroundColor: COLOR_SCHEME.background }}
      >
        {/* Background Blur Layer */}
        <motion.div
          className="absolute inset-0 bg-[rgba(14,33,26,0.95)] backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.4 } },
            exit: { opacity: 0, transition: { duration: 0.3 } }
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: COLOR_SCHEME.elevated,
            border: `1px solid ${COLOR_SCHEME.borderMedium}`,
            color: COLOR_SCHEME.textPrimary,
          }}
          whileHover={{ 
            scale: 1.1,
            backgroundColor: COLOR_SCHEME.accent,
            color: COLOR_SCHEME.background,
            borderColor: COLOR_SCHEME.accent,
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
          aria-label="Close case study"
        >
          <X width={20} height={20} />
        </motion.button>

        {/* Navigation Arrows */}
        {hasPrev && (
          <motion.button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: COLOR_SCHEME.elevated,
              border: `1px solid ${COLOR_SCHEME.borderMedium}`,
              color: COLOR_SCHEME.textPrimary,
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: COLOR_SCHEME.accent,
              color: COLOR_SCHEME.background,
              borderColor: COLOR_SCHEME.accent,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
            aria-label="Previous project"
          >
            <ChevronLeft width={24} height={24} />
          </motion.button>
        )}

        {hasNext && (
          <motion.button
            onClick={() => navigate(1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: COLOR_SCHEME.elevated,
              border: `1px solid ${COLOR_SCHEME.borderMedium}`,
              color: COLOR_SCHEME.textPrimary,
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: COLOR_SCHEME.accent,
              color: COLOR_SCHEME.background,
              borderColor: COLOR_SCHEME.accent,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
            aria-label="Next project"
          >
            <ChevronRight width={24} height={24} />
          </motion.button>
        )}

        {/* Progress Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.4 }}
        >
          <span 
            className="font-mono text-xs"
            style={{ color: COLOR_SCHEME.textSecondary }}
          >
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <div className="w-32 h-px relative overflow-hidden" style={{ backgroundColor: COLOR_SCHEME.border }}>
            <motion.div
              className="absolute top-0 left-0 h-full"
              style={{ 
                backgroundColor: COLOR_SCHEME.accent,
                width: `${((currentIndex + 1) / caseStudies.length) * 100}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / caseStudies.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            />
          </div>
          <span 
            className="font-mono text-xs"
            style={{ color: COLOR_SCHEME.textSecondary }}
          >
            {String(caseStudies.length).padStart(2, '0')}
          </span>
        </motion.div>

        {/* Main Content - Scrollable */}
        <motion.div
          ref={contentRef}
          className="absolute inset-0 overflow-y-auto overscroll-contain"
          style={{ scrollPaddingTop: '120px', scrollPaddingBottom: '120px' }}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.2 }
            },
            exit: { 
              opacity: 0,
              transition: { staggerChildren: 0.03, staggerDirection: -1 }
            }
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 lg:px-12">
            <motion.div variants={staggerContainer}>
              {/* Project Header */}
              <motion.section variants={sectionVariants} className="mb-16 md:mb-24">
                <motion.div 
                  layoutId={`${currentProject.id}-category`}
                  className="inline-block mb-6"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <span 
                    className="font-body text-[11px] uppercase tracking-[0.3em] font-semibold"
                    style={{ color: COLOR_SCHEME.accent }}
                  >
                    {currentProject.category}
                  </span>
                </motion.div>

                <motion.h1 
                  layoutId={`${currentProject.id}-title`}
                  className="font-display font-light leading-[1.05] tracking-tight mb-6"
                  style={{ 
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: COLOR_SCHEME.textPrimary,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {currentProject.title}
                </motion.h1>

                <motion.p 
                  layoutId={`${currentProject.id}-description`}
                  className="font-body leading-relaxed max-w-2xl"
                  style={{ 
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    color: COLOR_SCHEME.textSecondary,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {currentProject.description}
                </motion.p>

                {/* Meta Tags */}
                <motion.div 
                  variants={sectionVariants}
                  className="flex flex-wrap gap-3 mt-8"
                >
                  {currentProject.tech.slice(0, 5).map((tech) => (
                    <motion.span
                      key={tech}
                      layoutId={`${currentProject.id}-tech-${tech}`}
                      className="px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-default"
                      style={{
                        backgroundColor: COLOR_SCHEME.elevated,
                        border: `1px solid ${COLOR_SCHEME.border}`,
                        color: COLOR_SCHEME.textSecondary,
                      }}
                      whileHover={{ 
                        backgroundColor: COLOR_SCHEME.accent,
                        color: COLOR_SCHEME.background,
                        borderColor: COLOR_SCHEME.accent,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {currentProject.tech.length > 5 && (
                    <motion.span
                      className="px-4 py-1.5 rounded-full text-xs font-mono font-medium"
                      style={{
                        backgroundColor: COLOR_SCHEME.elevated,
                        border: `1px solid ${COLOR_SCHEME.border}`,
                        color: COLOR_SCHEME.textSecondary,
                      }}
                    >
                      +{currentProject.tech.length - 5} more
                    </motion.span>
                  )}
                </motion.div>
              </motion.section>

              {/* Hero Image */}
              {currentProject.heroImage && (
                <motion.section variants={sectionVariants} className="mb-16 md:mb-24 relative">
                  <motion.div
                    layoutId={`${currentProject.id}-hero`}
                    className="relative w-full aspect-[16/10] md:aspect-[21/10] rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: COLOR_SCHEME.surface,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <img
                      src={currentProject.heroImage}
                      alt={currentProject.title}
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.95 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,33,26,0.6)] via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </motion.section>
              )}

              {/* Content Sections */}
              <motion.div variants={staggerContainer} className="space-y-16 md:space-y-24">
                {[
                  { id: 'overview', title: 'Overview', content: currentProject.overview },
                  { id: 'challenge', title: 'The Challenge', content: currentProject.challenge },
                  { id: 'solution', title: 'The Solution', content: currentProject.solution },
                  { id: 'features', title: 'Key Features', content: currentProject.keyFeatures },
                  { id: 'process', title: 'Development Process', content: currentProject.developmentProcess },
                  { id: 'results', title: 'Results & Impact', content: currentProject.results },
                ].map((section, i) => (
                  <motion.article
                    key={section.id}
                    variants={sectionVariants}
                    className="relative"
                    custom={i}
                  >
                    <motion.div 
                      className="flex items-center gap-4 mb-8"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <motion.span
                        className="font-mono text-[11px] uppercase tracking-[0.25em] font-semibold"
                        style={{ color: COLOR_SCHEME.accent }}
                      >
                        0{String(i + 1).padStart(2, '0')}
                      </motion.span>
                      <motion.h2
                        className="font-display font-light tracking-tight"
                        style={{ 
                          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                          color: COLOR_SCHEME.textPrimary,
                        }}
                      >
                        {section.title}
                      </motion.h2>
                      <div 
                        className="flex-1 h-px"
                        style={{ background: `linear-gradient(90deg, ${COLOR_SCHEME.accent} 0%, transparent 100%)` }}
                      />
                    </motion.div>
                    <motion.div
                      style={{ 
                        color: COLOR_SCHEME.textSecondary,
                        lineHeight: 1.85,
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                      } as React.CSSProperties}
                    >
                      {renderSectionContent(section.content)}
                    </motion.div>
                  </motion.article>
                ))}

                {/* Technologies Deep Dive */}
                <motion.article variants={sectionVariants} className="relative">
                  <motion.div 
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <motion.span
                      className="font-mono text-[11px] uppercase tracking-[0.25em] font-semibold"
                      style={{ color: COLOR_SCHEME.accent }}
                    >
                      07
                    </motion.span>
                    <motion.h2
                      className="font-display font-light tracking-tight"
                      style={{ 
                        fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                        color: COLOR_SCHEME.textPrimary,
                      }}
                    >
                      Technology Stack
                    </motion.h2>
                    <div 
                      className="flex-1 h-px"
                      style={{ background: `linear-gradient(90deg, ${COLOR_SCHEME.accent} 0%, transparent 100%)` }}
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-wrap gap-3"
                    variants={staggerContainer}
                  >
                    {currentProject.tech.map((tech) => (
                      <motion.span
                        key={tech}
                        layoutId={`${currentProject.id}-tech-detail-${tech}`}
                        className="px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-300"
                        style={{
                          backgroundColor: COLOR_SCHEME.elevated,
                          border: `1px solid ${COLOR_SCHEME.border}`,
                          color: COLOR_SCHEME.textSecondary,
                        }}
                        whileHover={{ 
                          backgroundColor: COLOR_SCHEME.accent,
                          color: COLOR_SCHEME.background,
                          borderColor: COLOR_SCHEME.accent,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 24px rgba(212, 190, 114, 0.2)`,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.article>
              </motion.div>

              {/* Action Buttons */}
              <motion.section 
                variants={sectionVariants} 
                className="mt-20 md:mt-28 pt-12 md:pt-16 border-t flex flex-col sm:flex-row gap-4 justify-center items-center"
                style={{ borderColor: COLOR_SCHEME.border }}
              >
                {currentProject.githubUrl && (
                  <motion.a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 rounded-xl font-body font-medium text-base transition-all duration-300"
                    style={{
                      backgroundColor: COLOR_SCHEME.elevated,
                      border: `1px solid ${COLOR_SCHEME.borderMedium}`,
                      color: COLOR_SCHEME.textPrimary,
                    }}
                    whileHover={{ 
                      backgroundColor: COLOR_SCHEME.surface,
                      borderColor: COLOR_SCHEME.accent,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px rgba(0, 0, 0, 0.3)`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GitHubIcon />
                    View Source Code
                  </motion.a>
                )}
                {currentProject.liveUrl && (
                  <motion.a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 rounded-xl font-body font-medium text-base transition-all duration-300"
                    style={{
                      backgroundColor: COLOR_SCHEME.accent,
                      color: COLOR_SCHEME.background,
                    }}
                    whileHover={{ 
                      backgroundColor: COLOR_SCHEME.accentHover,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px rgba(212, 190, 114, 0.3)`,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink width={20} height={20} />
                    Live Demo
                  </motion.a>
                )}
              </motion.section>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CaseStudyViewer;
