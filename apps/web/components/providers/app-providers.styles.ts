// Clean interface definitions for style functions
interface ButtonStyleProps {
  variant?: 'primary' | 'secondary';
}

export const styles = {
  // Error fallback container
  errorContainer: "min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-sky-50",

  // Error fallback content wrapper
  errorWrapper: "max-w-md w-full mx-4",

  // Error fallback card
  errorCard: "bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl p-8 shadow-2xl shadow-red-500/10 text-center",

  // Error icon container
  errorIconContainer: "w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6",

  // Error icon
  errorIcon: "w-8 h-8 text-white",

  // Error heading
  errorHeading: "text-xl font-bold text-gray-900 mb-4",

  // Error message
  errorMessage: "text-gray-600 mb-6 text-sm leading-relaxed",

  // Button container
  buttonContainer: "space-y-3",

  // Button variants
  button: (props: ButtonStyleProps = {}) => {
    const { variant = 'primary' } = props;

    const base = "w-full px-6 py-3 font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300";

    const variantStyles = {
      primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30",
      secondary: "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg"
    };

    return `${base} ${variantStyles[variant]}`.trim();
  },

  // Error details container
  errorDetails: "mt-6 text-left",

  // Error details summary
  errorDetailsSummary: "text-xs text-gray-500 cursor-pointer mb-2",

  // Error details content
  errorDetailsContent: "text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-auto max-h-32",
};

// Toast notification styles
export const toastStyles = {
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '1rem',
  padding: '1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
};

// Toast icon themes
export const toastIconThemes = {
  success: {
    primary: '#10b981',
    secondary: '#ffffff',
  },
  error: {
    primary: '#ef4444',
    secondary: '#ffffff',
  },
};