import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import HistoryDrawer from './components/HistoryDrawer';
import AboutModal from './components/AboutModal';
import PrivacyModal from './components/PrivacyModal';
import ContactModal from './components/ContactModal';
import AuthModal from './components/AuthModal';
import { aiService } from './services/aiService';
import { authService } from './services/authService';

export default function App() {
  const [currentView, setCurrentView] = useState('workspace'); // 'home' or 'workspace'
  const [theme, setTheme] = useState(() => localStorage.getItem('devnest_theme') || 'dark');
  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | 'contact' | null

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Local storage history
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('devnest_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devnest_theme', theme);
  }, [theme]);

  // Verify and sync current user on startup
  useEffect(() => {
    const syncUser = async () => {
      const user = await authService.getMe();
      if (user) {
        setCurrentUser(user);
      } else if (!authService.getToken()) {
        setCurrentUser(null);
      }
    };
    syncUser();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Poll backend health status
  const checkHealth = async () => {
    try {
      const data = await aiService.checkHealth();
      if (data && data.status === 'UP') {
        setBackendStatus('UP');
      } else {
        setBackendStatus('DOWN');
      }
    } catch {
      setBackendStatus('DOWN');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAddHistoryItem = (item) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 20); // Keep latest 20 items
      localStorage.setItem('devnest_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('devnest_history');
  };

  const handleSelectHistoryItem = () => {
    setCurrentView('workspace');
  };

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
        backendStatus={backendStatus}
        historyCount={history.length}
        setIsHistoryOpen={setIsHistoryOpen}
        openModal={setActiveModal}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'home' ? (
          <Home
            onOpenWorkspace={() => setCurrentView('workspace')}
            openModal={setActiveModal}
          />
        ) : (
          <Workspace
            onAddHistoryItem={handleAddHistoryItem}
          />
        )}
      </main>

      {/* History Slide-out Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Info Modals */}
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
      />
      <PrivacyModal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      />
      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal(null)}
      />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <button type="button" onClick={() => setActiveModal('about')}>
              About
            </button>
            <button type="button" onClick={() => setActiveModal('privacy')}>
              Privacy & Security
            </button>
            <button type="button" onClick={() => setActiveModal('contact')}>
              Contact
            </button>
            <a 
              href="https://devnestlabs.shop" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--text-secondary)' }}
            >
              devnestlabs.shop
            </a>
          </div>
          <div className="footer-copy">
            DevNest Labs © 2026 • AI Developer Workspace • Powered by Gemini & Spring Boot
          </div>
        </div>
      </footer>
    </div>
  );
}
