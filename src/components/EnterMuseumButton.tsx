import React from 'react';
import { useAppStore } from '@/app/store';

/**
 * Vertical seam tab attached directly to the divider between the auth panel and park canvas.
 * Functions and looks like a deliberate drawer pull tab with rotated text.
 */
export interface EnterMuseumButtonProps {
  isMobile?: boolean;
}

export const EnterMuseumButton: React.FC<EnterMuseumButtonProps> = ({ isMobile = false }) => {
  const { login } = useAppStore();

  const handleClick = () => {
    // Enter the museum view
    login('guest@museum.art', 'Guest Visitor', 'Guest');
  };

  return (
    <button
      type="button"
      className={`enter-museum-seam-tab ${isMobile ? 'is-mobile' : ''}`}
      onClick={handleClick}
      aria-label="Join Us - Pull open museum"
      title="Join Us · Pull open the museum gallery"
    >
      {/* Outer ambient glow */}
      <span className="enter-museum-seam-tab__glow" aria-hidden="true" />

      {/* Main Tab Body */}
      <span className="enter-museum-seam-tab__body">
        {/* Tactile drawer grip notches */}
        <span className="enter-museum-seam-tab__grip" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        {/* Rotated text */}
        <span className="enter-museum-seam-tab__text">JOIN US</span>

        {/* Directional pull arrow */}
        <span className="enter-museum-seam-tab__arrow" aria-hidden="true">
          →
        </span>
      </span>
    </button>
  );
};

export default EnterMuseumButton;
