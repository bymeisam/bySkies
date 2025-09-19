export const styles = {
  // Loading skeleton container
  loadingContainer: "space-y-6",

  // Loading skeleton item
  loadingItem: "bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 animate-pulse",

  // Loading skeleton content
  loadingContent: "h-32 bg-white/5 rounded-2xl",

  // Error state container
  errorContainer: "text-center text-red-300 p-4 bg-red-900/20 rounded-lg",

  // Error heading
  errorHeading: "font-bold mb-2",

  // Error message
  errorMessage: "text-sm",

  // Empty state container
  emptyContainer: "text-center text-slate-300 p-4",

  // Empty heading
  emptyHeading: "font-bold mb-2",

  // Empty message
  emptyMessage: "text-sm",

  // Main content container
  contentContainer: "space-y-6",

  // Tab content empty state
  tabEmptyState: "text-center text-slate-300 p-8",
};

// Motion variants for animations
export const motionVariants = {
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
};