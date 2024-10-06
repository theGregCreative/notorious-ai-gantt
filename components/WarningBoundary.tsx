import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class WarningBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes('Support for defaultProps will be removed from memo components')) {
      console.log('Suppressed warning about defaultProps in memo components');
    } else if (error.message.includes('Warning:')) {
      console.log('Suppressed React warning:', error.message);
    } else {
      console.error('Uncaught error:', error, errorInfo);
      this.setState({ hasError: true });
    }
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}

export default WarningBoundary;