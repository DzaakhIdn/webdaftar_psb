/**
 * Utility to suppress browser extension errors that are not related to our application
 * These errors commonly occur from Chrome extensions trying to inject scripts or communicate
 * with content scripts, and they don't affect our application functionality.
 */

// List of error patterns to suppress
const SUPPRESSED_ERROR_PATTERNS = [
  'tx_attempts_exceeded',
  'tx_ack_timeout', 
  'Failed to initialize messaging',
  'chrome-extension://',
  'Extension context invalidated',
  'Could not establish connection',
  'Receiving end does not exist',
  'The message port closed before a response was received',
  'Script error for: chrome-extension://',
  'Non-Error promise rejection captured',
];

// Store original console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

/**
 * Check if an error message should be suppressed
 */
function shouldSuppressError(message: string): boolean {
  return SUPPRESSED_ERROR_PATTERNS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Enhanced console.error that filters out browser extension errors
 */
function filteredConsoleError(...args: any[]) {
  const message = args.join(' ');
  
  if (shouldSuppressError(message)) {
    // Optionally log to a different level or completely ignore
    // console.debug('[Suppressed Extension Error]:', message);
    return;
  }
  
  // Call original console.error for legitimate errors
  originalConsoleError.apply(console, args);
}

/**
 * Enhanced console.warn that filters out browser extension warnings
 */
function filteredConsoleWarn(...args: any[]) {
  const message = args.join(' ');
  
  if (shouldSuppressError(message)) {
    return;
  }
  
  originalConsoleWarn.apply(console, args);
}

/**
 * Initialize error suppression
 * Call this early in your application lifecycle
 */
export function initializeErrorSuppression() {
  // Override console methods
  console.error = filteredConsoleError;
  console.warn = filteredConsoleWarn;
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    
    if (shouldSuppressError(message)) {
      event.preventDefault(); // Prevent the error from being logged
      return;
    }
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    const message = event.message || event.error?.message || '';
    
    if (shouldSuppressError(message)) {
      event.preventDefault();
      return;
    }
  });
  
  console.log('✅ Error suppression initialized - Browser extension errors will be filtered');
}

/**
 * Restore original console methods
 * Useful for debugging or testing
 */
export function restoreOriginalConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log('✅ Original console methods restored');
}

/**
 * Temporarily suppress errors during a specific operation
 */
export async function withErrorSuppression<T>(
  operation: () => Promise<T> | T,
  additionalPatterns: string[] = []
): Promise<T> {
  const tempPatterns = [...SUPPRESSED_ERROR_PATTERNS, ...additionalPatterns];
  
  const tempConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (tempPatterns.some(pattern => message.includes(pattern))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  try {
    return await operation();
  } finally {
    console.error = tempConsoleError;
  }
}

/**
 * Check if current environment has browser extensions that might cause issues
 */
export function detectProblematicExtensions(): string[] {
  const problematicExtensions: string[] = [];
  
  // Check for common extension indicators
  if (typeof window !== 'undefined') {
    // Check for extension-injected properties
    const extensionIndicators = [
      '__REACT_DEVTOOLS_GLOBAL_HOOK__',
      '__REDUX_DEVTOOLS_EXTENSION__',
      'chrome',
      '__APOLLO_DEVTOOLS_GLOBAL_HOOK__',
    ];
    
    extensionIndicators.forEach(indicator => {
      if ((window as any)[indicator]) {
        problematicExtensions.push(indicator);
      }
    });
  }
  
  return problematicExtensions;
}

export default {
  initializeErrorSuppression,
  restoreOriginalConsole,
  withErrorSuppression,
  detectProblematicExtensions,
};
