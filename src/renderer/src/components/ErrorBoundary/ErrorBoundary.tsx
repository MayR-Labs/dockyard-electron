/**
 * Error Boundary Component
 * Catches and displays React errors gracefully
 * Single Responsibility: Error handling and display
 */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-950 text-white p-8">
          <div className="max-w-2xl w-full">
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <svg
                    className="w-12 h-12 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-red-400 mb-2">
                    Something went wrong
                  </h1>
                  <p className="text-gray-300 mb-4">
                    The application encountered an unexpected error. You can try restarting or
                    check the details below.
                  </p>
                  
                  {this.state.error && (
                    <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-auto">
                      <p className="text-red-400 font-mono text-sm mb-2">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <details className="text-gray-400 text-xs font-mono">
                          <summary className="cursor-pointer hover:text-gray-300 mb-2">
                            Stack trace
                          </summary>
                          <pre className="whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={this.handleReset}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                    >
                      Reload App
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
