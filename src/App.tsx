import React, { useRef, useState, useEffect } from 'react';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import Navbar from '@/components/layout/Navbar';
import OpeningScene from '@/components/opening-scene/OpeningScene';
import Introduction from '@/components/introduction/Introduction';
import EditorialGallery from '@/components/editorial-gallery/EditorialGallery';
import EngineeringStack from '@/components/knowledge/EngineeringStack';
import Recognition from '@/components/recognition/Recognition';
import Conversation from '@/components/conversation/Conversation';
import TargetCursor from '@/components/ui/TargetCursor';
import LineSidebar from '@/components/ui/LineSidebar';
import { useGSAP } from '@gsap/react';
import { initBackgroundTransitions } from '@/animations/background';
import Loader from '@/components/loader/Loader';
import { AnimatePresence } from 'framer-motion';

export const App: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useGSAP(() => {
    if (!mainRef.current) return;
    const cleanup = initBackgroundTransitions(mainRef.current);
    return () => {
      cleanup();
    };
  }, { scope: mainRef });

  useEffect(() => {
    const sectionIds = ['opening-scene', 'editorial-gallery', 'introduction', 'skills', 'certificates', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleItemClick = (index: number) => {
    const sectionIds = ['opening-scene', 'editorial-gallery', 'introduction', 'skills', 'certificates', 'contact'];
    const el = document.getElementById(sectionIds[index]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoaderExit = () => {
    setShowLoader(false);
    document.body.style.overflow = '';
  };

  return (
    <SmoothScroll>
      {/* Premium custom mouse cursor */}
      <TargetCursor targetSelector=".cursor-target" />

      {/* Navigation Header */}
      <Navbar />

      {/* Viewport Side Navigation */}
      <LineSidebar
        items={['Home', 'Work', 'About', 'Skills', 'Certificates', 'Contact']}
        accentColor="#D4BE72"
        textColor="rgba(245, 240, 222, 0.22)"
        markerColor="rgba(245, 240, 222, 0.06)"
        showIndex={true}
        showMarker={true}
        proximityRadius={80}
        maxShift={15}
        falloff="smooth"
        markerLength={30}
        markerGap={8}
        tickScale={0.5}
        scaleTick={true}
        itemGap={16}
        fontSize={0.7}
        smoothing={80}
        active={activeSection}
        onItemClick={handleItemClick}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex"
      />

      {/* Experience Pipeline: Hero → Work → About → Skills → Contact */}
      <main ref={mainRef} className="relative w-full min-h-screen" style={{ backgroundColor: '#1A2B22' }}>
        <>
          <OpeningScene />
          <EditorialGallery />
          <Introduction />
          <EngineeringStack />
          <Recognition />
          <Conversation />
        </>
        <AnimatePresence>
          {showLoader && <Loader onExitComplete={handleLoaderExit} />}
        </AnimatePresence>
      </main>
    </SmoothScroll>
  );
};

export default App;
