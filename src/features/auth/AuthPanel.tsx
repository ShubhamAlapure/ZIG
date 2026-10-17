import React from 'react';
import { LoginForm } from './LoginForm';

export const AuthPanel: React.FC = () => {
  return (
    <main id="auth-card" className="page-module___8aEwW__card">
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
        <div className="page-module___8aEwW__header">
          <h1 className="page-module___8aEwW__heading">Welcome back</h1>
          <p className="page-module___8aEwW__lede">
            Sign in to see your account, documents and messages.
          </p>
        </div>

        <LoginForm />
      </div>

      <footer className="page-module___8aEwW__footer">
        <nav aria-label="Help and legal">
          <a href="#help">Help</a>
          <a href="#privacy">Privacy</a>
        </nav>
      </footer>
    </main>
  );
};
