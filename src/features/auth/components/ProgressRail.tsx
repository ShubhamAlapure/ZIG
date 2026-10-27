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
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#7D705C] mb-1.5 px-0.5">
        <span className="uppercase tracking-wider text-[10px]">
          Step {Math.min(currentStep, totalSteps)} of {totalSteps}
        </span>
        <span className="text-[#9E7A32] font-bold tracking-tight">
          {stepLabels[Math.min(currentStep - 1, totalSteps - 1)] || 'Progress'}
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-1.5 w-full bg-[#EAE2D2] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C5A059] via-[#DFBE7E] to-[#9E7A32] rounded-full transition-all duration-400 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Paint Dots */}
      <div className="flex justify-between items-center -mt-2 px-1 relative pointer-events-none">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div
              key={stepNum}
              className={`w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                isDone
                  ? 'bg-[#C5A059] border-[#9E7A32] shadow-xs'
                  : isCurrent
                  ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/30 scale-110'
                  : 'bg-[#F2ECE0] border-[#D1C5B0]'
              }`}
            >
              {isDone ? (
                <div className="w-1 h-1 rounded-full bg-white" />
              ) : isCurrent ? (
                <div className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressRail;
