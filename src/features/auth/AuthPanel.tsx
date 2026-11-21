import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/app/store';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import gsap from 'gsap';

/**
 * AuthPanel — root auth wrapper.
 *
 * Renders LoginForm or RegisterForm based on `authMode` from the Zustand store.
 * AnimatePresence handles container-level crossfade; GSAP/Framer handle
 * element-level stagger entrances inside each child.
 *
 * Do NOT touch: App.tsx, ParkLoginView, scene, MuseumView, EnterMuseumButton.
 */
export const AuthPanel: React.FC = () => {
  const { authMode } = useAppStore();
  const logoRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cursor-follow soft glow behind the panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let glowEl: HTMLDivElement | null = null;
    glowEl = document.createElement('div');
    glowEl.style.cssText = `
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      border-radius: inherit; overflow: hidden;
    `;
    panel.style.position = 'relative';
    panel.insertBefore(glowEl, panel.firstChild);

    const inner = document.createElement('div');
    inner.style.cssText = `
      position: absolute; width: 320px; height: 320px;
      border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(212,167,14,0.09) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      opacity: 0;
    `;
    glowEl.appendChild(inner);

    const onMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        inner.style.left = `${x}px`;
        inner.style.top = `${y}px`;
        inner.style.opacity = '1';
      } else {
        inner.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      glowEl?.remove();
    };
  }, []);

  // Logo hover spring
  const handleLogoHover = (entering: boolean) => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      scale: entering ? 1.08 : 1,
      duration: entering ? 0.4 : 0.55,
      ease: entering ? 'back.out(2)' : 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={panelRef}
      className="w-full min-h-full pt-7 sm:pt-4 pb-4 px-3.5 sm:px-6 flex flex-col justify-start select-none bg-transparent"
      style={{ zIndex: 10, position: 'relative' }}
    >
      {/* ── Luxury Company Brand Header ── */}
      <div className="w-full flex justify-center flex-shrink-0 mb-2 sm:mb-3">
        <motion.a
          className="group inline-flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3.5 no-underline mx-auto text-center sm:text-left"
          aria-label="Zigguratss Artwork LLP home"
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => handleLogoHover(true)}
          onMouseLeave={() => handleLogoHover(false)}
        >
          <div className="relative flex-shrink-0">
            <img
              ref={logoRef}
              src="/zigguratss-logo.png"
              alt="Zigguratss Artwork LLP logo"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_4px_16px_rgba(229,169,28,0.35)]"
              style={{ willChange: 'transform' }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border border-[#D4A70E]/40 pointer-events-none"
              style={{ transform: 'scale(1.22)' }}
            />
          </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-none">
            <span
              className="uppercase text-[#140F0A] tracking-[0.18em] leading-none"
              style={{
                fontFamily: "'DM Serif Display', 'Bodoni Moda', 'Italiana', Georgia, serif",
                fontSize: 'clamp(17px, 4.2vw, 22px)',
                fontWeight: 400,
                letterSpacing: '0.18em',
              }}
            >
              Zigguratss
            </span>
            <span
              className="mt-1 leading-none text-[#9E7A32]"
              style={{
                fontFamily: "'Cinzel', sans-serif",
                fontSize: 'clamp(8px, 2vw, 9.5px)',
                fontWeight: 700,
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
              }}
            >
              Artwork LLP
            </span>
          </div>
        </motion.a>
      </div>

      {/* ── Main Form Area ── */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-1 relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.40, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: -14,
              filter: 'blur(5px)',
              transition: { duration: 0.25, ease: [0.4, 0, 0.6, 1] },
            }}
          >
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <footer
        className="mt-auto pt-2.5 text-center flex-shrink-0"
        style={{ borderTop: '1px solid rgba(197, 160, 89, 0.22)' }}
      >
        <nav
          aria-label="Help and legal"
          className="flex items-center justify-center gap-4 text-xs"
        >
          {['Help', 'Privacy', 'Terms'].map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span aria-hidden="true" className="text-[#A08852]">·</span>}
              <a
                href={`#${item.toLowerCase()}`}
                className="font-medium text-[#6B5A47] transition-colors duration-150 hover:text-[#171412]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item}
              </a>
            </React.Fragment>
          ))}
        </nav>
      </footer>
    </div>
  );
};

export default AuthPanel;
