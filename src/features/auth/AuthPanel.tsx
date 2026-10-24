import React from 'react';
import { LoginForm } from './LoginForm';
import { RotatingArtQuote } from './RotatingArtQuote';

export const AuthPanel: React.FC = () => {
  return (
    <main id="auth-card" className="page-module___8aEwW__card select-none">
      {/* Brand Header */}
      <a className="page-module___8aEwW__brand" aria-label="Zigguratss Artwork LLP home" href="/">
        <img
          src="/zigguratss-logo.png"
          alt="Zigguratss Artwork LLP logo"
          className="w-7 h-7 object-contain"
        />
        <span>Zigguratss Artwork LLP</span>
      </a>

      <div className="page-module___8aEwW__content">
        <div className="page-module___8aEwW__header mb-1">
          <h1 className="page-module___8aEwW__heading text-2xl font-bold tracking-tight text-amber-950">
            Welcome Back
          </h1>
          <p className="page-module___8aEwW__lede text-xs sm:text-sm text-amber-800/80">
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
