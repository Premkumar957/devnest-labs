import React from 'react';
import { 
  Code2, 
  Terminal, 
  Sun, 
  Moon, 
  History, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  theme, 
  toggleTheme, 
  backendStatus, 
  historyCount, 
  setIsHistoryOpen,
  openModal 
}) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setCurrentView('home')}>
        <div className="brand-icon">
          <Terminal size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="brand-title">DevNest Labs</span>
        </div>
        <span className="brand-badge">AI Workspace</span>
      </div>

      <nav className="nav-links">
        <button 
          className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
          id="nav-home-btn"
        >
          Overview
        </button>
        <button 
          className={`nav-tab-btn ${currentView === 'workspace' ? 'active' : ''}`}
          onClick={() => setCurrentView('workspace')}
          id="nav-workspace-btn"
        >
          <Code2 size={16} />
          Workspace
        </button>
        <button 
          className="nav-tab-btn" 
          onClick={() => openModal('about')}
          id="nav-about-btn"
        >
          <Info size={15} />
          About
        </button>
        <button 
          className="nav-tab-btn" 
          onClick={() => openModal('privacy')}
          id="nav-privacy-btn"
        >
          <ShieldCheck size={15} />
          Privacy
        </button>
      </nav>

      <div className="nav-actions">
        {/* Backend health status badge */}
        <div 
          className={`health-status-badge ${backendStatus === 'UP' ? '' : 'error'}`}
          title={backendStatus === 'UP' ? 'Spring Boot REST API Connected' : 'Checking or Offline'}
        >
          <div className="health-dot" />
          <span>{backendStatus === 'UP' ? 'API Live' : 'API Connecting...'}</span>
        </div>

        {/* History drawer trigger button */}
        <button 
          className="icon-btn" 
          onClick={() => setIsHistoryOpen(true)}
          title="Recent Inquiries"
          id="history-drawer-btn"
        >
          <History size={18} />
          {historyCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: 'var(--accent-primary)',
              borderRadius: '50%'
            }} />
          )}
        </button>

        {/* Dark/Light theme toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* GitHub link button */}
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="icon-btn"
          title="View on GitHub"
          id="github-repo-link"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>
      </div>
    </header>
  );
}
