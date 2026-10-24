import React from 'react';
import { useAppStore } from '@/app/store';

/**
 * Vertical seam tab attached directly to the divider between the 3D museum viewport and the registration form.
 * Symmetrically matches the "JOIN US" drawer pull tab on the park page, allowing visitors to return to the Sign In portal.
 */
export const SignInSeamButton: React.FC = () => {
  const { logout } = useAppStore();

  return (
    <button
      type="button"
      className="sign-in-seam-tab"
      onClick={logout}
      aria-label="Sign In - Return to login portal"
      title="Sign In · Return to login portal"
    >
      {/* Outer ambient glow */}
      <span className="sign-in-seam-tab__glow" aria-hidden="true" />

      {/* Main Tab Body */}
      <span className="sign-in-seam-tab__body">
        {/* Tactile drawer grip notches */}
        <span className="sign-in-seam-tab__grip" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        {/* Rotated text */}
        <span className="sign-in-seam-tab__text">SIGN IN</span>

        {/* Directional pull arrow pointing back toward login */}
        <span className="sign-in-seam-tab__arrow" aria-hidden="true">
          ←
        </span>
      </span>
    </button>
  );
};

export default SignInSeamButton;
