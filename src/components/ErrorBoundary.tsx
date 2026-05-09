import React, { Component, ErrorInfo, ReactNode } from 'react';
import { __ } from '@wordpress/i18n';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showErrorDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to WordPress (if available)
    if (window.console && window.console.error) {
      window.console.error('Versatile Plugin Error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showErrorDetails: false,
    });
  };

  toggleErrorDetails = () => {
    this.setState(prevState => ({
      showErrorDetails: !prevState.showErrorDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="vt-max-w-2xl vt-mx-auto vt-mt-8 vt-border-red-200 vt-bg-red-50">
          <CardHeader className="vt-text-center">
            <div className="vt-flex vt-justify-center vt-mb-4">
              <AlertTriangle className="vt-h-12 vt-w-12 vt-text-red-500" />
            </div>
            <CardTitle className="vt-text-red-700">
              {__('Something went wrong', 'versatile-toolkit')}
            </CardTitle>
          </CardHeader>
          <CardContent className="vt-space-y-4">
            <p className="vt-text-center vt-text-gray-600">
              {__('We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.', 'versatile-toolkit')}
            </p>
            
            <div className="vt-flex vt-justify-center vt-gap-3">
              <Button 
                onClick={this.handleRetry}
                className="vt-flex vt-items-center vt-gap-2"
              >
                <RefreshCw className="vt-h-4 vt-w-4" />
                {__('Try Again', 'versatile-toolkit')}
              </Button>
              
              {this.props.showDetails !== false && (
                <Button 
                  variant="outline"
                  onClick={this.toggleErrorDetails}
                  className="vt-flex vt-items-center vt-gap-2"
                >
                  <Bug className="vt-h-4 vt-w-4" />
                  {this.state.showErrorDetails 
                    ? __('Hide Details', 'versatile-toolkit')
                    : __('Show Details', 'versatile-toolkit')
                  }
                </Button>
              )}
            </div>

            {this.state.showErrorDetails && this.state.error && (
              <div className="vt-mt-6 vt-p-4 vt-bg-gray-100 vt-rounded-lg vt-border">
                <h4 className="vt-font-semibold vt-text-sm vt-mb-2 vt-text-gray-700">
                  {__('Error Details:', 'versatile-toolkit')}
                </h4>
                <div className="vt-text-xs vt-font-mono vt-text-gray-600 vt-space-y-2">
                  <div>
                    <strong>{__('Message:', 'versatile-toolkit')}</strong>
                    <pre className="vt-mt-1 vt-whitespace-pre-wrap vt-break-words">
                      {this.state.error.message}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>{__('Stack Trace:', 'versatile-toolkit')}</strong>
                      <pre className="vt-mt-1 vt-whitespace-pre-wrap vt-break-words vt-max-h-32 vt-overflow-y-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>{__('Component Stack:', 'versatile-toolkit')}</strong>
                      <pre className="vt-mt-1 vt-whitespace-pre-wrap vt-break-words vt-max-h-32 vt-overflow-y-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;