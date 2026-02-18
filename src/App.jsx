import { Component } from 'react';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', color: 'red' }}>
          <h1>Something went wrong!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  console.log('[App] Rendering with ScrollToTop');
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-[#FAF9F6] text-[#1a1a1a] font-sans antialiased selection:bg-[#D4F57B] selection:text-[#385040]">
          <Toaster position="top-center" richColors />
          {/* ScrollToTop component to handle scroll restoration on route change */}
          <ScrollToTop />
          <AppRoutes />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
