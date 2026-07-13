import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CaseStudyCard } from './CaseStudyCard';

export interface ProjectData {
  id: string;
  num: string;
  title: string;
  category: string;
  tech: string[];
  description: string;
  imageSrc: string;
  link: string;
  cta: string;
  type: 'image' | 'text';
  priority?: boolean;
  widthClass?: string;
  alignClass?: string;
  marginClass?: string;
  textPosition?: 'up' | 'down';
  subtitle?: string;
}

interface ProjectPanelProps {
  project: ProjectData;
  onOpenCaseStudy?: (project: ProjectData) => void;
}

const ScatteredTextPanel: React.FC<{ project: ProjectData; onClick?: () => void }> = ({ project, onClick }) => (
  <motion.div
    className={`panel flex-shrink-0 flex flex-col justify-center items-start text-left p-8 bg-surface/10 border border-neutral/5 rounded-sm group ${project.widthClass} ${project.alignClass} ${project.marginClass}`}
    onClick={onClick}
    whileHover={{ y: -4, transition: { duration: 0.3 } }}
    whileTap={{ scale: 0.98 }}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-6">
      {project.category}
    </span>
    <h3 className="font-display text-3xl md:text-5xl text-neutral font-light leading-[1.1]">
      {project.title}
    </h3>
    <p className="font-body text-sm text-neutral/50 leading-relaxed mt-6 max-w-sm">
      {project.description}
    </p>
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="cursor-target font-body text-sm text-neutral/60 group-hover:text-neutral hover:underline inline-flex items-center gap-2 transition-colors duration-200 mt-8"
    >
      {project.cta}
      <ArrowRight width={12} height={12} />
    </button>
  </motion.div>
);

export const ProjectPanel: React.FC<ProjectPanelProps> = ({ project, onOpenCaseStudy }) => {
  const handleClick = () => {
    onOpenCaseStudy?.(project);
  };

  if (project.type === 'text') {
    return <ScatteredTextPanel project={project} onClick={handleClick} />;
  }

  return <CaseStudyCard project={project} onClick={handleClick} layoutId={`project-card-${project.id}`} />;
};

export default ProjectPanel;