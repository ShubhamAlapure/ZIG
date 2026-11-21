import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface ProgressLineProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

/**
 * ProgressLine — Futuristic neon-gold pipeline with retro modular nodes.
 */
export const ProgressLine: React.FC<ProgressLineProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  const progressPercent = ((currentStep) / Math.max(steps.length - 1, 1)) * 100;

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Top microtext console header */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider mb-2.5 uppercase">
        <span className="flex items-center gap-1.5" style={{ color: 'var(--auth-ink-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D98E04] animate-pulse" />
          <span>PIPELINE:</span>
          <strong className="text-[#171412] font-black">0{currentStep + 1} / 0{steps.length}</strong>
        </span>
        <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#8A5D02] text-[10px]">
          {steps[currentStep]}
        </span>
      </div>

      {/* Progress Track and Pipeline Nodes */}
      <div className="relative flex items-center justify-between py-1 px-1">
        {/* Background Track Line */}
        <div
          className="absolute left-2 right-2 h-2 rounded-full overflow-hidden"
          style={{
            background: 'rgba(23, 20, 18, 0.08)',
            border: '1px solid rgba(229, 169, 28, 0.22)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          {/* Animated Filled Progress Laser Beam */}
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #F2CB5C 0%, #E5A91C 50%, #D98E04 100%)',
              boxShadow: '0 0 12px rgba(229, 169, 28, 0.65)',
            }}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((label, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  boxShadow: isCurrent
                    ? 'var(--auth-clay-focus), var(--auth-sticker-lg), 0 0 12px rgba(229, 169, 28, 0.5)'
                    : isDone
                      ? 'var(--auth-sticker)'
                      : 'none',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-mono font-black transition-colors duration-200 cursor-default"
                style={{
                  background: isDone
                    ? '#2A9D8F'
                    : isCurrent
                      ? 'linear-gradient(135deg, #FAD67B 0%, #D98E04 100%)'
                      : '#FFFFFF',
                  color: isDone ? '#FFFFFF' : isCurrent ? '#171412' : '#9E9282',
                  border: isDone
                    ? '2px solid #1E7569'
                    : isCurrent
                      ? '2px solid #996200'
                      : '1.5px solid rgba(229, 169, 28, 0.3)',
                }}
              >
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    <Check className="w-3.5 h-3.5 text-white stroke-[3.2]" />
                  </motion.div>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressLine;
