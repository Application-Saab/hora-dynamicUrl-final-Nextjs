"use client";

import React from "react";
import { reportError } from "@/utils/errorReporter";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);

    // reportError(error, errorInfo, {
    //   type: 'frontend',
    //   component: this.props.componentName || 'UnknownComponent',
    // });

    reportError(error, errorInfo, {
      type: "frontend",
      component: this.props.componentName, // Agar manually diya ho to priority
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-red-600 text-xl mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
