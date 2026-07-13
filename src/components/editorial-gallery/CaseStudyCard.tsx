import React from 'react';
import { motion } from 'framer-motion';
import type { ProjectData } from './ProjectPanel';
import { ArrowRight } from 'lucide-react';

interface CaseStudyCardProps {
  project: ProjectData;
  onClick: () => void;
  layoutId: string;
}

/* ─── Case Study Card with Layout Animation ─── */
export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ 
  project, 
  onClick, 
  layoutId 
}) => {
  const isTextDown = project.textPosition === 'down';
  const isTextOnly = project.type === 'text';

  const caption = (
    <motion.div
      layoutId={`${layoutId}-caption`}
      className={`flex flex-col opacity-75 group-hover:opacity-100 transition-opacity duration-300 ${isTextDown ? 'mt-8' : 'mb-8'}`}
    >
      <motion.span
        layoutId={`${layoutId}-category`}
        className="panel-category text-[11px] uppercase tracking-[0.25em] text-neutral/60 font-semibold mb-2 block"
      >
        {project.category}
      </motion.span>
      <motion.h3
        layoutId={`${layoutId}-title`}
        className="panel-title font-display text-2xl md:text-3xl lg:text-4xl text-neutral font-medium tracking-wide uppercase leading-tight"
      >
        {project.title}
      </motion.h3>
      {project.tech && project.tech.length > 0 && (
        <motion.span
          layoutId={`${layoutId}-tech`}
          className="panel-tech text-xs sm:text-sm tracking-wider text-neutral/50 font-body mt-4 uppercase font-medium block"
        >
          {project.tech.join(' • ')}
        </motion.span>
      )}
      {project.description && (
        <motion.p
          layoutId={`${layoutId}-desc`}
          className="panel-desc text-sm md:text-base text-neutral/60 font-body mt-5 max-w-[340px] leading-relaxed"
        >
          {project.description}
        </motion.p>
      )}
    </motion.div>
  );

  if (isTextOnly) {
    return (
      <motion.div
        layoutId={layoutId}
        className={`panel flex-shrink-0 flex flex-col justify-center items-start text-left p-8 bg-surface/10 border border-neutral/5 rounded-sm group ${project.widthClass} ${project.alignClass} ${project.marginClass}`}
        onClick={onClick}
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.98 }}
        style={{ cursor: 'pointer' }}
      >
        <motion.span
          layoutId={`${layoutId}-category`}
          className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-6 block"
        >
          {project.category}
        </motion.span>
        <motion.h3
          layoutId={`${layoutId}-title`}
          className="font-display text-3xl md:text-5xl text-neutral font-light leading-[1.1]"
        >
          {project.title}
        </motion.h3>
        <motion.p
          layoutId={`${layoutId}-desc`}
          className="font-body text-sm text-neutral/50 leading-relaxed mt-6 max-w-sm"
        >
          {project.description}
        </motion.p>
        <motion.a
          layoutId={`${layoutId}-cta`}
          className="cursor-target font-body text-sm text-neutral/60 group-hover:text-neutral hover:underline inline-flex items-center gap-2 transition-colors duration-200 mt-8"
        >
          {project.cta}
          <ArrowRight width={12} height={12} />
        </motion.a>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={layoutId}
      className={`panel flex-shrink-0 flex flex-col group ${project.widthClass} ${project.alignClass} ${project.marginClass}`}
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: 'pointer' }}
    >
      {!isTextDown && caption}
      
      {/* Image Container */}
      <motion.div
        layoutId={`${layoutId}-hero`}
        className="relative w-full rounded-2xl overflow-hidden bg-surface/20 aspect-[4/5] sm:aspect-auto"
      >
        <motion.img
          layoutId={`${layoutId}-image`}
          src={project.imageSrc}
          alt={project.title}
          loading={project.priority ? 'eager' : 'lazy'}
          fetchPriority={project.priority ? 'high' : 'auto'}
          decoding="async"
          className="panel-image w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 rounded-xl transition-filter duration-700"
        />
        <motion.div
          className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none rounded-xl"
        />
      </motion.div>

      {isTextDown && caption}
    </motion.div>
  );
};

export default CaseStudyCard;