import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Universal scroll utility that works with both Lenis smooth scroll and native browser scroll
 */
export const scrollToTop = (smooth = true) => {
  if (window.lenis) {
    window.lenis.scrollTo(0, {
      immediate: !smooth,
      duration: smooth ? 0.8 : 0,
      lock: true,
    });
  } else {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  // Refresh GSAP ScrollTrigger calculations
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
};

export const scrollToElement = (target, smooth = true, offset = 0) => {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  if (window.lenis) {
    window.lenis.scrollTo(el, {
      offset: offset,
      immediate: !smooth,
      duration: smooth ? 1 : 0,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
      top,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. If anchor hash exists (e.g. #kontak, #harga), scroll to anchor
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          scrollToElement(element, true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    // 2. Otherwise always scroll to top immediately on route change
    scrollToTop(false);

    // Double check after page transition animation mounts (50ms & 150ms)
    const t1 = setTimeout(() => scrollToTop(false), 50);
    const t2 = setTimeout(() => {
      scrollToTop(false);
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
