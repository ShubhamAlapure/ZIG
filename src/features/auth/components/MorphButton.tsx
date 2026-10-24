import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

export interface MorphButtonProps {
  type?: 'submit' | 'button';
  status: 'idle' | 'loading' | 'success' | 'error';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loadingText?: string;
  successText?: string;
  className?: string;
  triggerConfettiOnSuccess?: boolean;
}

export const MorphButton: React.FC<MorphButtonProps> = ({
  type = 'submit',
  status,
  onClick,
  disabled = false,
  children,
  icon,
  loadingText = 'Authenticating…',
  successText = 'Welcome In',
  className = '',
  triggerConfettiOnSuccess = true,
}) => {
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  useEffect(() => {
    if (status === 'success' && triggerConfettiOnSuccess && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.6, x: 0.3 },
          colors: ['#C5A059', '#DFBE7E', '#B89248', '#FAF8F5', '#171412'],
          ticks: 180,
          gravity: 1.1,
          scalar: 0.85,
        });
      } catch (e) {
        // Safe fallback in test environments
      }
    } else if (status !== 'success') {
      setHasTriggeredConfetti(false);
    }
  }, [status, triggerConfettiOnSuccess, hasTriggeredConfetti]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-live="polite"
      whileHover={!disabled && !isLoading ? { y: -1 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden w-full h-[46px] sm:h-[48px] rounded-xl text-[13.5px] tracking-[0.03em] font-semibold text-white select-none shadow-md cursor-pointer flex items-center justify-center gap-2 ${
        isError
          ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] animate-shake'
          : isSuccess
          ? 'bg-gradient-to-r from-[#059669] to-[#047857]'
          : 'bg-gradient-to-r from-[#C5A059] via-[#B89248] to-[#9E7A32] hover:from-[#CCA862] hover:via-[#C19B51] hover:to-[#A8843B]'
      } ${disabled ? 'opacity-60 cursor-not-allowed filter grayscale-[25%]' : ''} ${className}`}
      style={{
        boxShadow: isSuccess
          ? '0 6px 20px -2px rgba(5, 150, 105, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
          : isError
          ? '0 6px 20px -2px rgba(220, 38, 38, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
          : '0 8px 24px -4px rgba(184, 144, 71, 0.36), 0 2px 6px rgba(184, 144, 71, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
      }}
    >
      {/* Velvety light sheen sweep */}
      {status === 'idle' && !disabled && (
        <span
          className="absolute inset-0 w-2/5 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none satin-sheen-active"
          aria-hidden="true"
        />
      )}

      {/* Button Content Morph with Smooth Fade */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 text-white"
          >
            <svg
              className="w-4 h-4 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="opacity-95"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="font-medium tracking-wide">{loadingText}</span>
          </motion.span>
        ) : isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-white font-medium"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{successText}</span>
          </motion.span>
        ) : isError ? (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 text-white font-medium"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Try Again</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 text-white"
          >
            {icon}
            <span>{children}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default MorphButton;
