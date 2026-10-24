import React from 'react';
import { LoginForm } from './LoginForm';
import { RotatingArtQuote } from './RotatingArtQuote';

export const AuthPanel: React.FC = () => {
  return (
    <div
      id="auth-card"
      className="w-full h-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none overflow-y-auto custom-scrollbar"
    >
      {/* ── Elevated Luxury Company Brand Header ── */}
      <a
        className="group inline-flex items-center gap-3 no-underline transition-all duration-200 mb-2 sm:mb-3"
        aria-label="Zigguratss Artwork LLP home"
        href="/"
      >
        <span className="w-10 h-10 sm:w-11 sm:h-11 p-1.5 rounded-xl bg-white border border-[#C5A059]/35 shadow-xs flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-[#C5A059] group-hover:shadow-sm">
          <img
            src="/zigguratss-logo.png"
            alt="Zigguratss Artwork LLP logo"
            className="w-full h-full object-contain"
          />
        </span>
        <div className="flex flex-col text-left">
          <span
            className="text-[18px] sm:text-[20px] lg:text-[22px] font-black tracking-[0.16em] uppercase text-[#171412] group-hover:text-[#9E7A32] transition-colors leading-none"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Zigguratss
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-bold text-[#9E7A32] mt-1 leading-none">
            Artwork LLP · Fine Art Maison
          </span>
        </div>
      </a>

      {/* ── Main Centered Form Group ── */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-1 sm:py-2">
        <div className="mb-2 text-left">
          <h1
            className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#171412]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#7D705C] mt-0.5">
            Sign in to access your art collection, documents and museum
          </p>
        </div>

        {/* Curatorial Art Quote */}
        <RotatingArtQuote />

        {/* Login Form */}
        <LoginForm />
      </div>

      {/* ── Footer ── */}
      <footer className="mt-auto pt-3 border-t border-[#E8DFC8]/60 text-center">
        <nav aria-label="Help and legal" className="flex items-center justify-center gap-4 text-xs text-[#7D705C]">
          <a href="#help" className="hover:text-[#9E7A32] transition-colors font-medium">Help</a>
          <span>·</span>
          <a href="#privacy" className="hover:text-[#9E7A32] transition-colors font-medium">Privacy</a>
          <span>·</span>
          <a href="#terms" className="hover:text-[#9E7A32] transition-colors font-medium">Terms</a>
        </nav>
      </footer>
    </div>
  );
};

export default AuthPanel;
