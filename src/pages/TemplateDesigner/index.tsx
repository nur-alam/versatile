import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import TemplateDesigner from './TemplateDesigner';
import ErrorBoundary from '../../components/ErrorBoundary';

// Initialize the TemplateDesigner when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('versatile-template-designer-root');
  
  if (!rootElement) {
    console.warn('Template Designer: Root element not found');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    
    // QueryClient instance for the TemplateDesigner
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    });

    // Get template ID and mode from data attributes
    const templateId = rootElement.getAttribute('data-template-id') || undefined;
    const mode = (rootElement.getAttribute('data-mode') as 'maintenance' | 'comingsoon') || 'maintenance';

    console.log('Template Designer: Initializing with', { templateId, mode });

    root.render(
      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error('Template Designer Error:', error, errorInfo);
          // Show user-friendly error message
          rootElement.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #dc2626;">
              <h3>Template Designer Error</h3>
              <p>There was an error loading the template designer. Please refresh the page and try again.</p>
              <details style="margin-top: 10px; text-align: left;">
                <summary>Error Details</summary>
                <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow: auto;">
                  ${error.message}
                </pre>
              </details>
            </div>
          `;
        }}
      >
        <QueryClientProvider client={queryClient}>
          <TemplateDesigner 
            templateId={templateId}
            mode={mode}
          />
          <Toaster
            position="bottom-right"
            containerClassName="!z-[9999999]"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  borderColor: '#86efac',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  borderColor: '#fecaca',
                },
              },
            }}
          />
        </QueryClientProvider>
      </ErrorBoundary>
    );

    console.log('Template Designer: Successfully mounted');
  } catch (error) {
    console.error('Template Designer: Failed to initialize', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #dc2626;">
        <h3>Initialization Error</h3>
        <p>Failed to initialize the template designer. Please check the console for more details.</p>
      </div>
    `;
  }
});

// Also export the component for potential use elsewhere
export { default } from './TemplateDesigner';