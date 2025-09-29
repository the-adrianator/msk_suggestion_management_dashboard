// Animation utility classes for consistent transitions
export const animationClasses = {
  // Fade animations
  fadeIn: "animate-in fade-in duration-300",
  fadeOut: "animate-out fade-out duration-300",

  // Slide animations
  slideInFromRight: "animate-in slide-in-from-right duration-300",
  slideInFromLeft: "animate-in slide-in-from-left duration-300",
  slideInFromTop: "animate-in slide-in-from-top duration-300",
  slideInFromBottom: "animate-in slide-in-from-bottom duration-300",

  // Scale animations
  scaleIn: "animate-in zoom-in duration-200",
  scaleOut: "animate-out zoom-out duration-200",

  // Hover effects
  hoverScale: "transition-transform duration-200 hover:scale-105",
  hoverLift: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",

  // Focus effects
  focusRing:
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

  // Loading animations
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
};

// Transition presets for common UI patterns
export const transitionPresets = {
  // Button transitions
  button: "transition-all duration-200 hover:shadow-md active:scale-95",

  // Card transitions
  card: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",

  // Modal transitions
  modal: "transition-all duration-300 ease-out",

  // Drawer transitions
  drawer: "transition-transform duration-300 ease-in-out",

  // Toast transitions
  toast: "transition-all duration-300 ease-out",
};

// Accessibility helpers
export const accessibilityClasses = {
  // Screen reader only
  srOnly: "sr-only",

  // Focus visible
  focusVisible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",

  // Reduced motion
  reducedMotion: "motion-reduce:transition-none motion-reduce:animate-none",
};
