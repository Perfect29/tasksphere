import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import authService from './lib/auth';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import Header from './components/layout/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize authentication
    const initAuth = async () => {
      try {
        const currentUser = await authService.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log('User not authenticated, will redirect to login');
        // Auth service will handle the redirect automatically
      } finally {
        setLoading(false);
      }
    };

    // Suppress analytics errors globally
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('Failed to send analytics events')) {
        // Silently ignore analytics errors
        return;
      }
      originalConsoleError.apply(console, args);
    };

    initAuth();

    // Cleanup
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading TaskSphere...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to TaskSphere</h1>
          <p className="text-slate-600 mb-6">Please sign in to continue</p>
          <button
            onClick={() => authService.auth.login()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/board/:boardId" element={<BoardView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;