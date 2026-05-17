import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('UI_ERROR_BOUNDARY', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
          <div className="max-w-xl rounded-xl border border-rose-500/30 bg-rose-950/30 p-6">
            <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-slate-300">Please refresh the app. If this persists, contact support.</p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
