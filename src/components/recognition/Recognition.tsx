import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import cert1 from '@/assets/certs/cert-1.jpeg';
import cert2 from '@/assets/certs/cert-2.jpeg';
import cert3 from '@/assets/certs/cert-3.jpeg';
import cert4 from '@/assets/certs/cert-4.jpeg';
import cert5 from '@/assets/certs/cert-5.jpeg';

interface Certification {
  title: string;
  org: string;
  year: string;
  description: string;
  skills: string[];
  verificationLink: string;
  image: string;
}

const certifications: Certification[] = [
  {
    title: 'AWS Certified Cloud Practitioner',
    org: 'Amazon Web Services (AWS)',
    year: 'Completed • February 2026',
    description: 'Validates a comprehensive understanding of the AWS Cloud ecosystem. Topics include identity management, security protocols, core computation services (EC2, Lambda), scalable storage (S3), relational databases (RDS), and cost optimization models.',
    skills: ['AWS Cloud', 'IAM Security', 'EC2 & S3', 'Serverless', 'Cloud Architectures', 'Cost Management'],
    verificationLink: 'https://aws.amazon.com/verification',
    image: cert1,
  },
  {
    title: 'Full Stack Open Certification',
    org: 'University of Helsinki',
    year: 'Completed • November 2025',
    description: 'Deep-dive program focused on building resilient, modern React web applications. Explores advanced routing, complex state management using Redux, Node.js/Express backend architectures, relational databases (PostgreSQL), schema building with GraphQL, containerization with Docker, and CI/CD pipelines.',
    skills: ['React & Redux', 'Node.js & Express', 'PostgreSQL', 'GraphQL', 'TypeScript', 'Docker', 'CI/CD Pipelines'],
    verificationLink: 'https://studies.helsinki.fi/stats/api/v1/certificates',
    image: cert2,
  },
  {
    title: 'React Native Expert Certification',
    org: 'Meta Professional',
    year: 'Completed • August 2025',
    description: 'Specialize in cross-platform mobile application development. Focuses on lifecycle modeling, gesture responders, native module integration, responsive layout systems for iOS and Android, offline data persistence, push notifications, and App Store deployment pipelines.',
    skills: ['React Native', 'Expo', 'iOS & Android Dev', 'Mobile Performance', 'Native Modules', 'Store Deployment'],
    verificationLink: 'https://www.coursera.org/verify/meta-react-native-expert',
    image: cert3,
  },
  {
    title: 'Algorithms & Computational Complexity',
    org: 'Stanford Online',
    year: 'Completed • May 2025',
    description: 'Rigorous training in algorithm design and complexity theory. Core topics encompass divide-and-conquer methodologies, greedy paradigms, dynamic programming, graph theory (traversals, shortest paths, spanning trees), and resolving NP-complete computational boundaries.',
    skills: ['Algorithm Design', 'Computational Complexity', 'Graph Algorithms', 'Dynamic Programming', 'NP-Completeness'],
    verificationLink: 'https://online.stanford.edu/verification',
    image: cert4,
  },
  {
    title: 'Advanced UI/UX & Design Systems',
    org: 'Interaction Design Foundation',
    year: 'Completed • October 2024',
    description: 'Mastery of design system mechanics for scalable web applications. Focuses on typographic systems, visual grids, color harmonies, components-as-code mappings, interaction standards, responsive behaviors, and designing with accessibility (WCAG compliance) in mind.',
    skills: ['Design Systems', 'WCAG Accessibility', 'Color Harmonies', 'Typography Systems', 'Interaction Architecture'],
    verificationLink: 'https://www.interaction-design.org/members/kamesh/certificate',
    image: cert5,
  },
];

// Apple-inspired animation variants
const contentVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.15
    } 
  }
};

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25
    }
  }
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } 
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      delay: 0.4, 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const
    } 
  }
};

export const Recognition: React.FC = () => {
  const [active, setActive] = useState<Certification | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [active]);

  return (
    <section className="relative w-full px-6 md:px-8 lg:px-12 py-24 md:py-36 bg-[#19372D] overflow-hidden" id="certificates">
      
      {/* Header Area */}
      <div className="mx-auto max-w-[1400px] w-full flex flex-col gap-4 mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold font-body">
          05 / CERTIFICATIONS
        </span>
        <h3 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-text-primary font-light leading-tight">
          Recognition through <br />
          continuous learning.
        </h3>
      </div>

      {/* Main Grid Container */}
      <div className="mx-auto max-w-[1400px] w-full border-t border-b border-border-light/60 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {certifications.map((cert, idx) => (
            <motion.div
              layoutId={`card-${cert.title}-${id}`}
              key={`card-${cert.title}-${id}`}
              onClick={() => setActive(cert)}
              className="group cursor-target flex flex-col items-center justify-start text-center relative pt-4"
            >
              {/* Floating Certificate Number */}
              <span className="absolute -top-10 -left-4 font-display text-[6.5rem] leading-none text-[#F5F0DE]/5 select-none z-20 pointer-events-none tracking-tighter font-light">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Certificate Image Thumbnail */}
              <motion.div
                layoutId={`image-${cert.title}-${id}`}
                className="w-full aspect-[2/1] rounded-[24px] overflow-hidden bg-[#1A2B22]/30 border border-border-light/10 shadow-sm relative z-10"
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="h-full w-full object-cover filter saturate-75 group-hover:saturate-100 group-hover:scale-[1.02] transition-all duration-500"
                />
              </motion.div>

              {/* Title & Organization */}
              <div className="flex flex-col items-center mt-6 max-w-[90%] relative z-10">
                <span className="font-body text-[10px] text-accent uppercase tracking-widest mb-1.5 opacity-80">
                  {cert.year}
                </span>
                <motion.h4
                  layoutId={`title-${cert.title}-${id}`}
                  className="font-body font-semibold text-sm md:text-base text-text-primary tracking-wide leading-tight group-hover:text-accent transition-colors duration-300"
                >
                  {cert.title}
                </motion.h4>
                <motion.p
                  layoutId={`description-${cert.org}-${id}`}
                  className="font-body text-xs text-text-secondary/70 mt-2"
                >
                  {cert.org}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 md:p-8 overflow-y-auto">
            
            {/* Backdrop dim overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-[#0E211A]/85 backdrop-blur-sm h-full w-full pointer-events-auto"
              onClick={() => setActive(null)}
            />

            {/* Modal Card Content */}
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="relative w-full max-w-[500px] bg-[#204234] border border-border-light/60 rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(14,33,26,0.5)] z-10 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActive(null)}
                className="cursor-target absolute top-4 right-4 w-8 h-8 rounded-full border border-border-light/40 hover:border-accent flex items-center justify-center text-text-muted hover:text-text-primary transition-all duration-300 z-50 bg-[#204234]/70 backdrop-blur-sm shadow-md"
                aria-label="Close details"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M1 1L11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Full Image Banner */}
              <motion.div
                layoutId={`image-${active.title}-${id}`}
                className="w-full bg-[#1A2B22]/30 relative overflow-hidden"
              >
                <motion.img
                  initial={{ scale: 0.94, opacity: 0.85 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0.85 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                  src={active.image}
                  alt={active.title}
                  className="w-full h-auto block object-cover filter saturate-90"
                />
              </motion.div>

              {/* Details & Description Section */}
              <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto flex-1">
                
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <span className="font-body text-[10px] text-accent uppercase tracking-widest block mb-1">
                      {active.year} &bull; {active.org}
                    </span>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-display text-2xl text-text-primary font-light leading-snug tracking-wide"
                    >
                      {active.title}
                    </motion.h3>
                  </motion.div>

                  <motion.a
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    href={active.verificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target px-5 py-2.5 rounded-full font-body font-semibold text-xs uppercase tracking-wider bg-accent text-bg-dark hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 shrink-0"
                  >
                    Verify
                  </motion.a>
                </div>

                {/* Details / Description text */}
                <motion.div 
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-col gap-4"
                >
                  <p className="font-body text-xs md:text-sm leading-relaxed text-text-secondary">
                    {active.description}
                  </p>

                  {/* Skills Acquired */}
                  <motion.div 
                    variants={tagContainerVariants}
                    className="flex flex-col gap-2.5 mt-2"
                  >
                    <span className="font-body text-[10px] uppercase tracking-widest text-accent-secondary/60 font-semibold">
                      Skills Acquired
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {active.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          variants={tagVariants}
                          className="rounded-full border border-border-light bg-[#19372D]/40 px-3 py-1 font-mono text-[9px] text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors duration-200"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Recognition;
