import React from 'react';

export interface TickCheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Uiverse circular tick checkbox styled in Zigguratss fine art gold / espresso palette.
 * Smooth rotating scale checkmark animation with custom SVG path.
 */
export const TickCheckbox: React.FC<TickCheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  className = '',
  ariaLabel = 'Checkbox',
}) => {
  return (
    <label className={`checkbox-container ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="checkbox"
        aria-label={ariaLabel}
      />
      <div className="checkmark">
        <svg
          width="23"
          height="20"
          viewBox="0 0 23 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M22.7601 1.72837C22.6079 1.91613 8.92915 19.1417 8.79063 19.3192C8.46874 19.7242 8.01793 19.968 7.53726 19.9971C7.05659 20.0261 6.58538 19.8381 6.22719 19.4742C6.15032 19.3945 6.07907 19.3081 6.01408 19.2158L0.267659 10.9475C0.0962799 10.7536 -1.35132e-08 10.4905 0 10.2163C1.35132e-08 9.94201 0.0962799 9.67898 0.267659 9.48505C0.439039 9.29112 0.671479 9.18217 0.913846 9.18217C1.15621 9.18217 1.38865 9.29112 1.56003 9.48505L7.34451 14.6321L21.4647 0.272796C22.3385 -0.572982 23.5106 0.727565 22.7601 1.72837Z" />
        </svg>
      </div>
    </label>
  );
};

export default TickCheckbox;
