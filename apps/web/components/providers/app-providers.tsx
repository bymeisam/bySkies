'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { queryClient } from '@/lib/query/query-client';
import { styles, toastStyles, toastIconThemes } from './app-providers.styles';
import { Svg } from '@repo/ui';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorWrapper}>
        <div className={styles.errorCard}>
          <div className={styles.errorIconContainer}>
            <Svg name="warning" className={styles.errorIcon} />
          </div>

          <h2 className={styles.errorHeading}>
            Something went wrong
          </h2>

          <p className={styles.errorMessage}>
            BySkies encountered an unexpected error. Don't worry, your data is safe.
          </p>

          <div className={styles.buttonContainer}>
            <button
              onClick={resetErrorBoundary}
              className={styles.button({ variant: 'primary' })}
            >
              Try again
            </button>

            <button
              onClick={() => window.location.reload()}
              className={styles.button({ variant: 'secondary' })}
            >
              Refresh page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className={styles.errorDetails}>
              <summary className={styles.errorDetailsSummary}>
                Error details (dev mode)
              </summary>
              <pre className={styles.errorDetailsContent}>
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Clear any cached data and reset the app state
        queryClient.clear();
        window.location.reload();
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: toastStyles,
            success: {
              iconTheme: toastIconThemes.success,
            },
            error: {
              iconTheme: toastIconThemes.error,
            },
          }}
        />
        
        {/* React Query DevTools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools 
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}