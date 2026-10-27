import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface UiverseSubmitButtonProps {
  type?: 'submit' | 'button';
  status?: 'idle' | 'loading' | 'success' | 'error';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loadingText?: string;
  className?: string;
  triggerConfettiOnSuccess?: boolean;
}

/**
 * Uiverse kinetic submit button with layered bubble expansion animation (OliverZeros)
 * Custom-styled in Zigguratss fine art golden palette.
 */
export const UiverseSubmitButton: React.FC<UiverseSubmitButtonProps> = ({
  type = 'submit',
  status,
  loading = false,
  disabled = false,
  onClick,
  children,
  icon,
  loadingText = 'Authenticating…',
  className = '',
  triggerConfettiOnSuccess = true,
}) => {
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const isLoading = loading || status === 'loading';
  const isSuccess = status === 'success';

  useEffect(() => {
    if (isSuccess && triggerConfettiOnSuccess && !hasTriggeredConfetti) {
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
    } else if (!isSuccess) {
      setHasTriggeredConfetti(false);
    }
  }, [isSuccess, triggerConfettiOnSuccess, hasTriggeredConfetti]);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`uiverse-submit-btn button button-item ${className}`}
      aria-busy={isLoading}
    >
      <span className="button-bg">
        <span className="button-bg-layers">
          <span className="button-bg-layer button-bg-layer-1 -purple" />
          <span className="button-bg-layer button-bg-layer-2 -turquoise" />
          <span className="button-bg-layer button-bg-layer-3 -yellow" />
        </span>
      </span>
      <span className="button-inner">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2 text-[#171412]">
            <svg
              className="w-4 h-4 animate-spin text-[#171412]"
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
            <span className="font-semibold tracking-wide">{loadingText}</span>
          </span>
        ) : (
          <>
            <span className="button-inner-static flex items-center justify-center gap-2">
              {icon}
              <span>{children}</span>
            </span>
            <span className="button-inner-hover flex items-center justify-center gap-2">
              {icon}
              <span>{children}</span>
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default UiverseSubmitButton;
