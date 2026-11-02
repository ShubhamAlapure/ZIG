import React from 'react';
import { motion } from 'framer-motion';

export interface FieldIconProps {
  type: 'mail' | 'lock' | 'lock-open' | 'eye' | 'eye-off' | 'user' | 'phone';
  active?: boolean;
  className?: string;
  variant?: 'daylight' | 'gallery';
}

/**
 * FieldIcon
 * Dynamic, reactive tactile icons with physics-based springs:
 * - mail: envelope with animated flap that opens and a tiny golden letter peeks out
 * - lock: padlock with shackle that clicks open and springs
 * - eye: eyelid blink and pupil contract
 * - user: avatar with radiating aura pulse
 * - phone: radio broadcast waves emitting on active
 */
export const FieldIcon: React.FC<FieldIconProps> = ({
  type,
  active = false,
  className = '',
}) => {
  const iconColor = active ? '#C5A059' : '#8C7D6B';
  const glowColor = active ? 'drop-shadow(0 0 6px rgba(229,169,28,0.5))' : 'none';

  switch (type) {
    case 'mail':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-300 ${className}`}
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: glowColor }}
          aria-hidden="true"
        >
          {/* Base envelope body */}
          <rect x="3" y="6" width="18" height="14" rx="3.5" />

          {/* Animated letter sheet peeking out when focused */}
          <motion.path
            d="M7 8h10M7 11h6"
            initial={{ opacity: 0, y: 2 }}
            animate={active ? { opacity: 0.8, y: -1 } : { opacity: 0, y: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            stroke="#E5A91C"
            strokeWidth="1.4"
          />

          {/* Envelope fold flap springs open */}
          <motion.path
            d={active ? 'M3 8l9 2.5 9-2.5' : 'M3 7l9 5.5 9-5.5'}
            animate={{ d: active ? 'M3 8l9 2.5 9-2.5' : 'M3 7l9 5.5 9-5.5' }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          />
        </svg>
      );

    case 'lock':
    case 'lock-open': {
      const isOpen = type === 'lock-open' || active;
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-300 ${className}`}
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: glowColor }}
          aria-hidden="true"
        >
          <rect x="4" y="11" width="16" height="11" rx="3" />
          {/* Shackle spring */}
          <motion.path
            d="M7 11V7a5 5 0 0 1 10 0v4"
            animate={
              isOpen
                ? { y: -3.5, rotate: -15, transformOrigin: '7px 11px' }
                : { y: 0, rotate: 0 }
            }
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          />
          <circle cx="12" cy="16" r="1.3" fill={iconColor} />
        </svg>
      );
    }

    case 'eye':
    case 'eye-off': {
      const isOff = type === 'eye-off';
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-300 ${className}`}
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
          <motion.circle
            cx="12"
            cy="12"
            r="3"
            animate={{ scale: isOff ? 0.35 : 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
          />
          {isOff && (
            <motion.line
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </svg>
      );
    }

    case 'user':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-300 ${className}`}
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: glowColor }}
          aria-hidden="true"
        >
          <motion.circle
            cx="12"
            cy="8"
            r="4"
            animate={{ scale: active ? 1.12 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      );

    case 'phone':
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 transition-all duration-300 ${className}`}
          fill="none"
          stroke={iconColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: glowColor }}
          aria-hidden="true"
        >
          <rect x="5" y="2" width="14" height="20" rx="3.5" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
          {active && (
            <motion.path
              d="M9 5h6"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </svg>
      );

    default:
      return null;
  }
};

export default FieldIcon;
