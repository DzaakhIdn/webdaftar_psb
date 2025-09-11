'use client';

import { useEffect } from 'react';
import { initializeErrorSuppression } from '@/utils/error-suppression';

/**
 * Client-side component to initialize error suppression
 * This should be included early in the application lifecycle
 */
export function ErrorSuppressionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize error suppression on client-side
    initializeErrorSuppression();
    
    // Cleanup function (optional)
    return () => {
      // Could restore original console if needed
      // restoreOriginalConsole();
    };
  }, []);

  return <>{children}</>;
}

export default ErrorSuppressionProvider;
