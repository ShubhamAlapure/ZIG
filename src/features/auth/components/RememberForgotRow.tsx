import React, { useState } from 'react';
import { TickCheckbox } from './TickCheckbox';

export interface RememberForgotRowProps {
  rememberMe: boolean;
  onRememberChange: (checked: boolean) => void;
  onForgotPasswordClick?: () => void;
}

export const RememberForgotRow: React.FC<RememberForgotRowProps> = ({
  rememberMe,
  onRememberChange,
  onForgotPasswordClick,
}) => {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleOpenForgot = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onForgotPasswordClick) {
      onForgotPasswordClick();
    } else {
      setShowForgotModal(true);
    }
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowForgotModal(false);
        setResetEmail('');
      }, 2500);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between text-xs pt-1 select-none">
        {/* Custom Uiverse Animated Tick Checkbox for Remember Me */}
        <div className="flex items-center gap-2 cursor-pointer text-[#6B5D49] hover:text-[#171412] transition-colors">
          <TickCheckbox
            checked={rememberMe}
            onChange={onRememberChange}
            ariaLabel="Remember me"
          />
          <span
            onClick={() => onRememberChange(!rememberMe)}
            className="font-medium tracking-tight text-[12px] cursor-pointer"
          >
            Remember me
          </span>
        </div>

        {/* Forgot password link */}
        <button
          type="button"
          onClick={handleOpenForgot}
          className="text-xs font-semibold text-[#9E7A32] hover:text-[#C5A059] hover:underline underline-offset-2 transition-colors cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {/* Light museum gallery recovery modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-pwd-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-[#FAF8F5] border border-[#C5A059]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-left">
            <h3
              id="forgot-pwd-title"
              className="text-lg font-bold text-[#171412]"
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              Account Recovery
            </h3>
            <p className="text-xs text-[#7D705C] mt-1.5 leading-relaxed">
              Enter your fine art account email to receive a secure recovery key.
            </p>

            {resetSent ? (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium animate-fadeIn">
                ✓ Recovery link has been sent to your email. Check your inbox!
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="mt-4 space-y-3">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@europeanmuseum.art"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D6CBB8] rounded-xl text-sm text-[#171412] outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#7D705C] hover:text-[#171412] rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#C5A059] to-[#9E7A32] hover:from-[#CCA862] hover:to-[#A8843B] text-white rounded-xl shadow-sm transition"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RememberForgotRow;
