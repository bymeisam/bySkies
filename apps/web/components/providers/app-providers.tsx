'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { queryClient } from '@/lib/query/query-client';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-slate-50 to-sky-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl p-8 shadow-2xl shadow-red-500/10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            BySkies encountered an unexpected error. Don't worry, your data is safe.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transform hover:scale-105 transition-all duration-300"
            >
              Try again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Refresh page
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer mb-2">
                Error details (dev mode)
              </summary>
              <pre className="text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-auto max-h-32">
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
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
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