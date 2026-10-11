import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Workspace from './pages/Workspace';
import HistoryDrawer from './components/HistoryDrawer';
import AboutModal from './components/AboutModal';
import PrivacyModal from './components/PrivacyModal';
import ContactModal from './components/ContactModal';
import { aiService } from './services/aiService';

export default function App() {
  const [currentView, setCurrentView] = useState('workspace'); // 'home' or 'workspace'
  const [theme, setTheme] = useState(() => localStorage.getItem('devnest_theme') || 'dark');
  const [backendStatus, setBackendStatus] = useState('CHECKING');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'privacy' | 'contact' | null

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

  const handleSelectHistoryItem = (item) => {
    setCurrentView('workspace');
    // Note: Can enhance to propagate to workspace if desired
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
            DevNest Labs © 2026 • AI Developer Workspace • Powered by Claude & Spring Boot
          </div>
        </div>
      </footer>
    </div>
  );
}
