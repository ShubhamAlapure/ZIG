import React from 'react';
import { LoginForm } from './LoginForm';
import { RotatingArtQuote } from './RotatingArtQuote';

export const AuthPanel: React.FC = () => {
  return (
    <main id="auth-card" className="page-module___8aEwW__card select-none">
      {/* Brand Header */}
      <a
        className="page-module___8aEwW__brand group inline-flex items-center gap-2.5 no-underline transition-all duration-200"
        aria-label="Zigguratss Artwork LLP home"
        href="/"
      >
        <img
          src="/zigguratss-logo.png"
          alt="Zigguratss Artwork LLP logo"
          className="w-7 h-7 object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className="text-[15px] sm:text-[16px] font-bold tracking-tight text-[#1E1A14] transition-colors duration-200 group-hover:text-[#D98E04]"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          Zigguratss Artwork LLP
        </span>
      </a>

      <div className="page-module___8aEwW__content">
        <div className="page-module___8aEwW__header mb-1">
          <h1
            className="page-module___8aEwW__heading text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#1E1A14]"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Welcome Back
          </h1>
          <p className="page-module___8aEwW__lede text-xs sm:text-[13.5px] text-[#7A6C58] font-normal leading-relaxed">
            Sign in to access your art collection, documents and museum
          </p>
        </div>

        {/* Rotating Art Quote in the heading gap */}
        <RotatingArtQuote />

        {/* Login Form Only on the Park Page */}
        <LoginForm />
      </div>

      <footer className="page-module___8aEwW__footer mt-auto pt-4">
        <nav aria-label="Help and legal">
          <a href="#help">Help</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </nav>
      </footer>
    </main>
  );
};

export default AuthPanel;
