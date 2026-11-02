import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressRailProps {
  /** Primary API: array of step label strings */
  steps?: string[];
  /** Backward-compat alias for steps (EventAdvertisingPanel uses stepLabels) */
  stepLabels?: string[];
  currentStep: number;
  /** Backward-compat: total step count (derived from steps/stepLabels if omitted) */
  totalSteps?: number;
}

/**
 * ProgressRail — horizontal step indicator for the multi-step sign-up form.
 *
 * - Completed dots: gold fill with checkmark
 * - Active dot: gold glow ring, scale 1.3
 * - Upcoming dots: muted
 * - Connecting lines animate with scaleX from left
 */
export const ProgressRail: React.FC<ProgressRailProps> = ({
  steps: stepsProp,
  stepLabels,
  currentStep,
  totalSteps,
}) => {
  // Resolve steps from either prop
  const steps: string[] =
    stepsProp ??
    stepLabels ??
    Array.from({ length: totalSteps ?? 4 }, (_, i) => `Step ${i + 1}`);

  return (
    <nav
      aria-label="Registration progress"
      className="w-full mb-4"
    >
      <ol className="flex items-center justify-between relative" role="list">
        {steps.map((label, index) => {
          // currentStep is 1-indexed (1, 2, 3, 4)
          const isCompleted = index < currentStep - 1;
          const isActive = index === currentStep - 1;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={label}
              className="flex flex-col items-center relative flex-1"
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Connecting line (rendered before the dot except for first) */}
              {index > 0 && (
                <div
                  className="absolute top-[14px] right-1/2 w-full h-[2px] -z-10"
                  style={{ background: 'rgba(23,20,18,0.08)' }}
                >
                  <motion.div
                    className="h-full origin-left"
                    style={{
                      background: 'linear-gradient(90deg, var(--auth-gold), var(--auth-gold-amber))',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index < currentStep ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              )}

              {/* Step dot */}
              <motion.div
                className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-default select-none"
                animate={{
                  scale: isActive ? 1.25 : 1,
                  backgroundColor: isCompleted
                    ? '#D98E04'
                    : isActive
                    ? '#E5A91C'
                    : 'rgba(23,20,18,0.1)',
                  boxShadow: isActive
                    ? '0 0 0 4px rgba(229,169,28,0.28), 0 4px 12px -2px rgba(217,142,4,0.3)'
                    : 'none',
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                role="img"
                aria-label={
                  isCompleted
                    ? `${label} — completed`
                    : isActive
                    ? `${label} — current step`
                    : label
                }
              >
                {isCompleted ? (
                  /* Checkmark */
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{
                      strokeDasharray: 20,
                      strokeDashoffset: 0,
                      animation: 'auth-check-draw 0.4s ease forwards',
                    }}
                  >
                    <polyline points="2.5,7 5.5,10 11.5,4" />
                  </svg>
                ) : (
                  <span
                    className="text-[11px] font-bold leading-none"
                    style={{
                      color: isActive ? '#171412' : 'rgba(23,20,18,0.4)',
                    }}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step label */}
              <span
                className="mt-1.5 text-[10px] font-semibold text-center leading-tight px-1 hidden sm:block"
                style={{
                  color: isCompleted
                    ? 'var(--auth-gold)'
                    : isActive
                    ? 'var(--auth-ink-2)'
                    : 'var(--auth-ink-muted)',
                  maxWidth: '5rem',
                }}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressRail;
