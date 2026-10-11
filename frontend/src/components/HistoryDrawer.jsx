import React from 'react';
import { X, Trash2, Clock, Sparkles } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory
}) {
  const getBadgeStyle = (feature) => {
    switch (feature) {
      case 'explain':
        return { background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' };
      case 'debug':
        return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' };
      case 'document':
        return { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' };
      default:
        return { background: 'rgba(255, 255, 255, 0.1)', color: '#fff' };
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={`history-drawer ${isOpen ? 'open' : ''}`} id="history-drawer">
      <div className="history-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Recent Analyses</span>
          <span className="brand-badge" style={{ fontSize: '0.65rem' }}>
            {history.length}
          </span>
        </div>
        <button
          type="button"
          className="icon-btn"
          style={{ width: '30px', height: '30px' }}
          onClick={onClose}
          id="close-history-btn"
        >
          <X size={16} />
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem', fontSize: '0.9rem' }}>
            No recent analyses yet. Paste your code in the workspace and analyze!
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => {
                onSelectHistoryItem(item);
                onClose();
              }}
            >
              <div className="history-item-top">
                <span
                  className="history-item-badge"
                  style={getBadgeStyle(item.feature)}
                >
                  {item.feature}
                </span>
                <span className="history-item-time">
                  {formatTime(item.timestamp)} • {item.language}
                </span>
              </div>
              <div className="history-item-snippet">
                {item.codeSnippet || item.errorSnippet || 'Code analysis'}
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn-ghost-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onClearHistory}
            id="clear-all-history-btn"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
}
