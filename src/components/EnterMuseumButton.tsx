import React from 'react';
import { useAppStore } from '@/app/store';

/**
 * A glowing navigation button positioned at the exact boundary between
 * the login panel (left 30%) and the park animation (right 70%).
 * 50% of the button overlaps each section.
 */
export const EnterMuseumButton: React.FC = () => {
  const { login } = useAppStore();

  const handleClick = () => {
    // Navigate to museum by authenticating as a guest patron
    login('guest@museum.art', 'Guest Visitor', 'Guest');
  };

  return (
    <button
      type="button"
      className="enter-museum-btn"
      onClick={handleClick}
      aria-label="Enter the museum"
    >
      <span className="enter-museum-btn__glow" aria-hidden="true" />
      <span className="enter-museum-btn__border" aria-hidden="true" />
      <span className="enter-museum-btn__content">
        <span className="enter-museum-btn__label">ENTER THE MUSEUM</span>
        <span className="enter-museum-btn__arrow">→</span>
      </span>
    </button>
  );
};

export default EnterMuseumButton;
