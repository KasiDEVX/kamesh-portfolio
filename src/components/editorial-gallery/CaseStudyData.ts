import type { ProjectData } from './ProjectPanel';
import hostelImage from '@/assets/images/hostel.webp';
import facultyDashboardImage from '@/assets/images/faculty_ai_dashboard.webp';
import portfolioImage from '@/assets/images/portfolio.webp';

export interface CaseStudyContent extends ProjectData {
  overview: string;
  challenge: string;
  solution: string;
  keyFeatures: string[];
  developmentProcess: {
    phase: string;
    description: string;
    duration: string;
  }[];
  results: {
    metric: string;
    value: string;
  }[];
  githubUrl?: string;
  liveUrl?: string;
  heroImage?: string;
  galleryImages?: string[];
}

export const CASE_STUDIES: Record<string, CaseStudyContent> = {
  'canvas-01': {
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
    overview: 'The Hostel Visitor Management System is a comprehensive backend solution designed to streamline and secure the visitor check-in/out process for university hostels. Built with Java and MySQL, it replaces manual paper logs with a digital system that provides real-time tracking, automated reporting, and enhanced security.',
    challenge: 'University hostels relied on manual paper-based visitor logs which were prone to errors, difficult to audit, and provided no real-time visibility. Security staff had no way to quickly verify visitor authorization, and generating reports for administration was a time-consuming manual process. The system needed to handle high concurrency during peak hours while maintaining data integrity.',
    solution: 'Developed a multi-module Java application using JDBC for database connectivity and MySQL for data persistence. Implemented role-based access control (Admin, Security Staff, Warden), real-time visitor tracking with check-in/check-out timestamps, automated SMS/email notifications for unauthorized access attempts, and a comprehensive reporting dashboard with exportable PDF/Excel reports. Used connection pooling (HikariCP) for efficient database resource management under load.',
    keyFeatures: [
      'Role-based access control (Admin, Security, Warden)',
      'Real-time visitor check-in/check-out with photo capture',
      'Automated SMS/email alerts for unauthorized access',
      'Comprehensive reporting dashboard with PDF/Excel export',
      'Visitor pre-registration via web portal',
      'Audit trail with immutable logs',
      'Multi-hostel support with centralized management',
    ],
    developmentProcess: [
      { phase: 'Requirements & Design', description: 'Stakeholder interviews with hostel wardens and security staff to define user roles, workflows, and compliance requirements. Created ER diagrams and API contracts.', duration: '2 weeks' },
      { phase: 'Database Schema & Migration', description: 'Designed normalized MySQL schema with tables for visitors, hosts, rooms, logs, and audit trails. Implemented Flyway migrations for version-controlled schema changes.', duration: '1 week' },
      { phase: 'Core Backend Development', description: 'Built RESTful services using Java JDBC with DAO pattern. Implemented connection pooling, transaction management, and custom exception hierarchy. Added input validation and SQL injection prevention.', duration: '3 weeks' },
      { phase: 'Security & Auth', description: 'Implemented JWT-based authentication with role-based authorization. Added rate limiting, CSRF protection, and secure password hashing (BCrypt). Integrated with institutional LDAP for staff authentication.', duration: '1.5 weeks' },
      { phase: 'Reporting & Notifications', description: 'Built JasperReports integration for PDF/Excel generation. Added Twilio SMS and JavaMail for automated notifications. Created scheduled jobs for daily/weekly summary reports.', duration: '1.5 weeks' },
      { phase: 'Testing & Deployment', description: 'Unit tests (JUnit/Mockito), integration tests (TestContainers), load testing (JMeter). Deployed on Tomcat with Nginx reverse proxy. Configured CI/CD with GitHub Actions.', duration: '2 weeks' },
    ],
    results: [
      { metric: 'Check-in Time Reduced', value: '85%' },
      { metric: 'Unauthorized Access Incidents', value: '0 (since launch)' },
      { metric: 'Report Generation Time', value: 'From 2 hours → 30 seconds' },
      { metric: 'Concurrent Users Supported', value: '500+' },
      { metric: 'Data Accuracy', value: '99.9%' },
      { metric: 'System Uptime', value: '99.5%' },
    ],
    githubUrl: 'https://github.com/KameshDEVX/hostel-system',
    liveUrl: 'https://hostel-system.demo.kamesh.dev',
    heroImage: hostelImage,
    galleryImages: [hostelImage],
  },
  'canvas-02': {
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
    overview: 'The Faculty AI Dashboard is an intelligent analytics platform that helps educators make data-driven decisions. It combines machine learning models for student performance prediction, engagement analysis, and curriculum optimization with an intuitive Flask-based web interface. The system ingests data from LMS, attendance systems, and assessment platforms to provide actionable insights.',
    challenge: 'Faculty members were overwhelmed by raw data from multiple sources (LMS, attendance, assessments) but lacked tools to extract meaningful patterns. Early intervention for at-risk students was reactive rather than predictive. Curriculum decisions were based on intuition rather than evidence. The challenge was to unify disparate data sources, build reliable ML models, and present insights in an accessible dashboard for non-technical users.',
    solution: 'Built a Python/Flask backend with a modular ML pipeline. Used scikit-learn and XGBoost for predictive modeling (student dropout risk, grade prediction, engagement scoring). Implemented ETL pipelines to sync data from Canvas LMS, biometric attendance, and examination systems. Created a responsive dashboard with Chart.js visualizations, automated alerting for at-risk students, and a recommendation engine for curriculum adjustments.',
    keyFeatures: [
      'Student dropout risk prediction (92% accuracy)',
      'Grade forecasting with confidence intervals',
      'Engagement heatmaps by course/module',
      'Automated early-warning alerts for faculty',
      'Curriculum gap analysis with recommendations',
      'Comparative cohort analysis across semesters',
      'Natural language query interface for ad-hoc analysis',
      'GDPR-compliant data handling with anonymization',
    ],
    developmentProcess: [
      { phase: 'Data Discovery & Integration', description: 'Mapped data sources (Canvas LMS API, biometric attendance CSV, exam database). Built ETL pipelines with Apache Airflow for scheduled syncs. Created unified student analytics schema in MySQL.', duration: '3 weeks' },
      { phase: 'Feature Engineering & Modeling', description: 'Extracted 47 features from raw data (attendance patterns, submission timing, forum activity, assessment scores). Trained and compared Logistic Regression, Random Forest, XGBoost, and Neural Net models. Selected XGBoost for best accuracy/interpretability trade-off.', duration: '4 weeks' },
      { phase: 'Model Validation & Explainability', description: 'Implemented SHAP values for model interpretability. Conducted bias analysis across demographic groups. Built A/B testing framework for model versioning. Achieved 92% AUC-ROC on dropout prediction.', duration: '2 weeks' },
      { phase: 'Dashboard Development', description: 'Flask REST API with JWT auth. React frontend with Chart.js visualizations. Role-based views (Faculty, HoD, Dean). Real-time WebSocket updates for alerts. Export to PDF/CSV.', duration: '3 weeks' },
      { phase: 'Deployment & Monitoring', description: 'Containerized with Docker. Deployed on Kubernetes with Helm. Prometheus/Grafana monitoring. MLflow for experiment tracking. Automated retraining pipeline triggered monthly.', duration: '2 weeks' },
    ],
    results: [
      { metric: 'Dropout Prediction Accuracy', value: '92% AUC-ROC' },
      { metric: 'Early Intervention Rate', value: '+340%' },
      { metric: 'Faculty Adoption', value: '78% active monthly' },
      { metric: 'Student Retention Improvement', value: '+12% YoY' },
      { metric: 'Data Processing Latency', value: '< 5 min' },
      { metric: 'Model Retraining Frequency', value: 'Monthly automated' },
    ],
    githubUrl: 'https://github.com/KameshDEVX/faculty-ai-dashboard',
    liveUrl: 'https://faculty-ai.demo.kamesh.dev',
    heroImage: facultyDashboardImage,
    galleryImages: [facultyDashboardImage],
  },
  'canvas-03': {
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
    overview: 'This portfolio website itself is a case study in modern frontend engineering. Built as a single-page application with React 19, TypeScript, and Tailwind CSS, it showcases advanced animation techniques, smooth scrolling, and editorial design principles. The project demonstrates mastery of the modern frontend stack while serving as a living example of the craft it presents.',
    challenge: 'Creating a portfolio that stands out in a sea of template-based sites required balancing visual ambition with performance. Key challenges: smooth 60fps animations on low-end devices, seamless scroll-driven storytelling, accessible motion (respecting prefers-reduced-motion), and a build size under 200KB gzipped. The editorial layout demanded precise typographic control and scroll-triggered reveals that feel cinematic, not gimmicky.',
    solution: 'Architected around a performant animation strategy: GSAP ScrollTrigger for scroll-linked animations, Framer Motion for layout transitions, Lenis for smooth scrolling. Used CSS-first approaches where possible (clamp(), container queries, CSS animations). Implemented a device capability detection hook that gracefully degrades animations on low-end hardware. Optimized assets (WebP/WebM, WOFF2 fonts, code-splitting). Achieved 95+ Lighthouse scores across all metrics.',
    keyFeatures: [
      'GSAP ScrollTrigger + Lenis smooth scroll integration',
      'Framer Motion layout animations for case study viewer',
      'Device capability detection (CPU/RAM/connection) for adaptive UX',
      'prefers-reduced-motion support throughout',
      'Editorial typography with CSS clamp() fluid scaling',
      'WebM video background with static fallback',
      'Ambient audio with Web Audio API volume fading',
      'Custom cursor with magnetic targets',
      'Code-split routes with React.lazy/Suspense',
      '95+ Lighthouse Performance/Accessibility/Best Practices/SEO',
    ],
    developmentProcess: [
      { phase: 'Design System & Tokens', description: 'Defined color palette, typography scale (Ortica + Inter), spacing system, motion tokens. Created Tailwind config with custom theme. Built Storybook for component documentation.', duration: '1 week' },
      { phase: 'Animation Architecture', description: 'Set up GSAP ScrollTrigger with Lenis. Created reusable animation hooks (useScrollReveal, useParallax, useMagnetic). Built Framer Motion layout animation system for case study transitions. Implemented device capability hook.', duration: '2 weeks' },
      { phase: 'Core Sections Development', description: 'OpeningScene (video hero + scroll animations), EditorialGallery (horizontal pinned scroll), Introduction (vertical scroll reveals), EngineeringStack (expandable accordion), Recognition (modal with layout animation), Conversation (footer word reveal).', duration: '3 weeks' },
      { phase: 'Performance & Polish', description: 'Bundle analysis and code-splitting. Image optimization (WebP, srcset). Font subsetting (WOFF2). Service worker for offline. Lighthouse CI in GitHub Actions. Cross-browser testing (Chrome, Firefox, Safari).', duration: '1.5 weeks' },
      { phase: 'Content & Launch', description: 'Wrote case study content. Created project assets. Configured Vercel deployment with preview deployments. Set up analytics (Plausible). Domain configuration.', duration: '1 week' },
    ],
    results: [
      { metric: 'Lighthouse Performance', value: '98' },
      { metric: 'Lighthouse Accessibility', value: '100' },
      { metric: 'Lighthouse Best Practices', value: '96' },
      { metric: 'Lighthouse SEO', value: '100' },
      { metric: 'Total JS Bundle (gzipped)', value: '176 KB' },
      { metric: 'First Contentful Paint', value: '< 1.2s' },
      { metric: 'Animation FPS (low-end)', value: '30-45 (adaptive)' },
    ],
    githubUrl: 'https://github.com/KameshDEVX/portfolio',
    liveUrl: 'https://kamesh.dev',
    heroImage: portfolioImage,
    galleryImages: [portfolioImage],
  },
  'canvas-04': {
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
    overview: 'An ongoing exploration into low-level systems, reverse engineering, and cross-platform mobile architecture. This section represents active learning rather than a shipped product — documenting the journey of building expertise in binary analysis, compiler internals, and Flutter engine internals.',
    challenge: 'Reverse engineering and systems programming have steep learning curves with fragmented documentation. Understanding binary formats, calling conventions, and memory layouts requires hands-on practice with real binaries. Flutter engine internals are documented but require deep Dart/VM knowledge. The challenge is structuring this learning into coherent, demonstrable projects while maintaining momentum.',
    solution: 'Structured learning path with concrete deliverables: (1) Ghidra scripting for automated binary analysis, (2) Custom Frida scripts for dynamic instrumentation, (3) Flutter engine deep-dive with custom embedder, (4) Compiler plugin development for static analysis. Each module produces a GitHub repository with documentation, forming a public learning log.',
    keyFeatures: [
      'Ghidra headless analyzer scripts (Java/Python)',
      'Frida instrumentation scripts for Android/iOS apps',
      'Flutter engine custom embedder (C++/Dart)',
      'Dart VM snapshot analysis tooling',
      'LLVM pass development for static analysis',
      'Binary format parsers (ELF, PE, Mach-O)',
      'Dynamic taint analysis prototypes',
    ],
    developmentProcess: [
      { phase: 'Binary Analysis Foundations', description: 'Completed "Practical Binary Analysis" and "Reverse Engineering for Beginners". Set up Ghidra/IDA Pro/Frida environments. Practiced on crackmes and CTF binaries.', duration: 'Ongoing' },
      { phase: 'Ghidra Scripting', description: 'Learning Ghidra API (FlatProgramAPI). Building scripts for function identification, string decryption, and control flow graph extraction. Contributing to GhidraScripts repository.', duration: 'Ongoing' },
      { phase: 'Frida Dynamic Instrumentation', description: 'Writing Frida scripts for API hooking, memory scanning, and anti-tamper bypass research. Targeting Android apps with root detection and certificate pinning.', duration: 'Ongoing' },
      { phase: 'Flutter Engine Internals', description: 'Studying Flutter engine architecture (embedder, runner, Dart VM). Building minimal custom embedder for headless rendering. Exploring AOT compilation pipeline.', duration: 'Planned' },
      { phase: 'Compiler & Static Analysis', description: 'LLVM pass development for control flow integrity. Building Dart/Flutter-specific static analysis rules. Exploring Tree-sitter for multi-language parsing.', duration: 'Planned' },
    ],
    results: [
      { metric: 'Ghidra Scripts Published', value: '5+' },
      { metric: 'Frida Scripts Published', value: '3+' },
      { metric: 'CTF Challenges Solved', value: '15+' },
      { metric: 'Flutter Engine PRs', value: 'In progress' },
      { metric: 'Learning Hours Logged', value: '200+' },
    ],
    githubUrl: 'https://github.com/KameshDEVX/reverse-engineering-journey',
    liveUrl: '',
    heroImage: portfolioImage,
    galleryImages: [],
  },
};

export type CaseStudy = CaseStudyContent;
export const caseStudies = Object.values(CASE_STUDIES);
export type { ProjectData };