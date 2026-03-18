import React from 'react';

/**
 * Error Boundary Component - Catches React component errors
 * Prevents entire app from crashing
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Log to external service in production
    // logErrorService.log(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '50px auto'
        }}>
          <div style={{
            background: '#ffe0e0',
            border: '2px solid #f5a0a0',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center'
          }}>
            <h1 style={{ color: '#c53030', marginBottom: '15px' }}>
              ⚠️ Oops! Something went wrong
            </h1>

            <p style={{ color: '#742a2a', fontSize: '16px', marginBottom: '10px' }}>
              We're sorry for the inconvenience. An unexpected error occurred in the application.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: '20px',
                padding: '15px',
                background: '#fff5f5',
                borderRadius: '4px',
                textAlign: 'left',
                fontSize: '12px',
                color: '#666',
                cursor: 'pointer'
              }}>
                <summary style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  marginTop: '10px'
                }}>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginTop: '10px'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div style={{ marginTop: '30px' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
