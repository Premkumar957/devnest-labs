import React from 'react';
import { 
  Code2, 
  Terminal, 
  Sun, 
  Moon, 
  History, 
  ShieldCheck, 
  Info,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  theme, 
  toggleTheme, 
  backendStatus, 
  historyCount, 
  setIsHistoryOpen,
  openModal,
  currentUser,
  onOpenAuthModal,
  onLogout
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

        {/* User Authentication state */}
        {currentUser ? (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.25rem 0.5rem 0.25rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              marginLeft: '0.25rem'
            }}
            title={`Signed in as ${currentUser.email}`}
            id="nav-user-pill"
          >
            <div 
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ffffff'
              }}
            >
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="icon-btn"
              title="Sign Out"
              style={{ width: '26px', height: '26px', borderRadius: '50%' }}
              id="nav-logout-btn"
              aria-label="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
            <button
              type="button"
              className="nav-tab-btn"
              onClick={() => onOpenAuthModal('login')}
              id="nav-login-btn"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              Sign In
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenAuthModal('signup')}
              id="nav-signup-btn"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
