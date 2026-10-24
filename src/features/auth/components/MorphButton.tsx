import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6, x: 0.3 },
          colors: ['#D98E04', '#E5A91C', '#C48003', '#FDFBF6', '#70541E'],
          ticks: 200,
          gravity: 1.1,
          scalar: 0.9,
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported in test environments
      }
    } else if (status !== 'success') {
      setHasTriggeredConfetti(false);
    }
  }, [status, triggerConfettiOnSuccess, hasTriggeredConfetti]);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-live="polite"
      className={`relative overflow-hidden w-full h-[46px] sm:h-[48px] rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 select-none shadow-md cursor-pointer ${
        isError
          ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white animate-shake'
          : isSuccess
          ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white scale-[1.01]'
          : 'bg-gradient-to-r from-[#D98E04] via-[#E5A91C] to-[#C48003] hover:from-[#C48003] hover:to-[#B37400] text-white hover:shadow-lg active:scale-[0.97]'
      } ${disabled ? 'opacity-60 cursor-not-allowed filter grayscale-[30%]' : ''} ${className}`}
    >
      {/* Sweeping gold shine streak */}
      {status === 'idle' && !disabled && (
        <span
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none shine-sweep-active"
          aria-hidden="true"
        />
      )}

      {/* Button content based on morph state */}
      {isLoading ? (
        <span className="flex items-center gap-2 text-white">
          {/* Animated brush-stroke rotating spinner */}
          <svg
            className="w-5 h-5 animate-spin"
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
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </span>
      ) : isSuccess ? (
        <span className="flex items-center gap-2 text-white animate-fadeIn">
          <Check className="w-5 h-5 stroke-[2.5]" />
          <span>{successText}</span>
        </span>
      ) : isError ? (
        <span className="flex items-center gap-2 text-white">
          <AlertCircle className="w-5 h-5" />
          <span>Try Again</span>
        </span>
      ) : (
        <span className="flex items-center gap-2 text-white">
          {icon}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};

export default MorphButton;
