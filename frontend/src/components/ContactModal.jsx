import React from 'react';
import { X, Mail, Globe, Send } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Contact & Support</div>
          <button type="button" className="icon-btn" onClick={onClose} id="close-contact-modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Have feedback, feature requests, or partnership inquiries regarding the DevNest Labs workspace or our Gemini AI project?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
            <div className="step-item">
              <Mail size={18} style={{ color: 'var(--accent-primary)', marginTop: '2px' }} />
              <div>
                <strong>Direct Email</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  contact@devnestlabs.shop
                </div>
              </div>
            </div>

            <div className="step-item">
              <Globe size={18} style={{ color: '#06b6d4', marginTop: '2px' }} />
              <div>
                <strong>Official Web Presence</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  https://devnestlabs.shop
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
