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
        <Card className="max-w-2xl mx-auto mt-8 border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-red-700">
              {__('Something went wrong', 'versatile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              {__('We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.', 'versatile')}
            </p>
            
            <div className="flex justify-center gap-3">
              <Button 
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {__('Try Again', 'versatile')}
              </Button>
              
              {this.props.showDetails !== false && (
                <Button 
                  variant="outline"
                  onClick={this.toggleErrorDetails}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  {this.state.showErrorDetails 
                    ? __('Hide Details', 'versatile')
                    : __('Show Details', 'versatile')
                  }
                </Button>
              )}
            </div>

            {this.state.showErrorDetails && this.state.error && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2 text-gray-700">
                  {__('Error Details:', 'versatile')}
                </h4>
                <div className="text-xs font-mono text-gray-600 space-y-2">
                  <div>
                    <strong>{__('Message:', 'versatile')}</strong>
                    <pre className="mt-1 whitespace-pre-wrap break-words">
                      {this.state.error.message}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>{__('Stack Trace:', 'versatile')}</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>{__('Component Stack:', 'versatile')}</strong>
                      <pre className="mt-1 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
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