import React from 'react';
import { useAppStore } from '@/app/store';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPanel: React.FC = () => {
  const { authMode } = useAppStore();

  return (
    <main id="auth-card" className="page-module___8aEwW__card select-none">
      {/* Brand Header */}
      <a className="page-module___8aEwW__brand" aria-label="Zigguratss Artwork LLP home" href="/">
        <span className="page-module___8aEwW__mark" aria-hidden="true">
          <img
            src="/zigguratss-logo.png"
            alt="Zigguratss Artwork LLP logo"
            className="w-full h-full object-contain p-1"
          />
        </span>
        Zigguratss Artwork LLP
      </a>

      <div className="page-module___8aEwW__content">
        <div className="page-module___8aEwW__header mb-2">
          <h1 className="page-module___8aEwW__heading text-2xl font-bold tracking-tight text-amber-950">
            {authMode === 'register' ? 'Join Us' : 'Welcome Back'}
          </h1>
          <p className="page-module___8aEwW__lede text-xs sm:text-sm text-amber-800/80">
            {authMode === 'register'
              ? 'Art Gallery & Collection Platform · Unleash your creativity'
              : 'Sign in to access your art collection, documents and museum'}
          </p>
        </div>

        {/* Dynamic Form Component based on authMode */}
        {authMode === 'register' ? <RegisterForm /> : <LoginForm />}
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
