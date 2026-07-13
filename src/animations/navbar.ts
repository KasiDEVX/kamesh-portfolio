export const initNavbarAnimation = (
  navElement: HTMLElement
) => {
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navElement.classList.add('is-scrolled');
    } else {
      navElement.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run immediately to set initial state

  return {
    kill: () => {
      window.removeEventListener('scroll', handleScroll);
    },
  };
};
