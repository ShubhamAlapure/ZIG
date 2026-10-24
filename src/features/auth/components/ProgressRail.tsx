import React from 'react';

export interface ProgressRailProps {
  currentStep: number;
  totalSteps?: number;
  stepLabels?: string[];
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  currentStep,
  totalSteps = 4,
  stepLabels = ['Identity', 'Credentials', 'Patron Role', 'Security'],
}) => {
  // Percentage calculation
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full select-none mb-4 pt-1">
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C7654] mb-1.5 px-0.5">
        <span className="uppercase tracking-wider">
          Step {Math.min(currentStep, totalSteps)} of {totalSteps}
        </span>
        <span className="text-[#B37400] font-bold">
          {stepLabels[Math.min(currentStep - 1, totalSteps - 1)] || 'Progress'}
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 w-full bg-[#E8DFC8] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D98E04] via-[#E5A91C] to-[#C48003] rounded-full transition-all duration-400 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Paint Dots */}
      <div className="flex justify-between items-center -mt-2.5 px-1 relative pointer-events-none">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={stepNum}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                isDone
                  ? 'bg-[#D98E04] border-[#B37400] shadow-xs'
                  : isCurrent
                  ? 'bg-white border-[#D98E04] ring-2 ring-[#D98E04]/30 scale-110'
                  : 'bg-[#F2ECE0] border-[#D1C5B0]'
              }`}
            >
              {isDone ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              ) : isCurrent ? (
                <div className="w-1.5 h-1.5 rounded-full bg-[#D98E04] animate-pulse" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressRail;
