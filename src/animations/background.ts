import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initBackgroundTransitions = (container: HTMLElement) => {
  const triggers: ScrollTrigger[] = [];

  // The initial background (#1A2B22) is set via inline style on <main>
  // to prevent the blue flash that occurs when GSAP initializes after paint.

  // Progressive color transitions mapped to the new section order:
  // Hero (#1A2B22) → Work (#19372D) → About (#153126) → Skills (#122920) → Contact (#0E211A)
  const scenes = [
    { id: 'editorial-gallery', color: '#19372D' },  // Warm forest green (bg-primary)
    { id: 'introduction',      color: '#153126' },  // Deep forest green (bg-secondary)
    { id: 'skills',            color: '#122920' },  // Transitional deep forest
    { id: 'certificates',      color: '#10241C' },  // Deeper forest bridge
    { id: 'contact',           color: '#0E211A' },  // Warm black shadow forest (bg-dark)
  ];

  scenes.forEach((scene) => {
    const el = document.getElementById(scene.id);
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 30%',
      scrub: true,
      animation: gsap.to(container, {
        backgroundColor: scene.color,
        ease: 'none'
      })
    });
    triggers.push(trigger);
  });

  return () => {
    triggers.forEach(t => t.kill());
  };
};
