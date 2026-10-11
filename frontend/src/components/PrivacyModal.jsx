import React from 'react';
import { X, ShieldAlert, Lock, EyeOff } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Privacy Policy & Safe Usage</div>
          <button type="button" className="icon-btn" onClick={onClose} id="close-privacy-modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="disclaimer-banner" style={{ marginTop: 0, marginBottom: '1.25rem' }}>
            <ShieldAlert size={18} />
            <span>
              <strong>Crucial Notice:</strong> Never submit production secrets, API keys, database credentials, or confidential proprietary code.
            </span>
          </div>

          <h4>How Your Code is Processed</h4>
          <p>
            When you submit code or error logs in the DevNest Labs workspace:
          </p>
          <ul className="feature-bullets" style={{ marginBottom: '1rem' }}>
            <li>Your input is transmitted securely via HTTPS directly to our Spring Boot backend.</li>
            <li>The backend validates the length and content boundaries before transmitting to Anthropic's Claude API.</li>
            <li>Requests are processed in memory and are <strong>not</strong> stored permanently in any relational database during MVP usage.</li>
            <li>Recent analyses shown in your history drawer are stored strictly on your local browser machine via HTML5 LocalStorage.</li>
          </ul>

          <h4>API Key Protection & Confidentiality</h4>
          <p>
            Your browser never communicates with Anthropic Claude directly. All Claude API keys and model credentials remain secured strictly server-side behind Spring Boot environment variables.
          </p>
        </div>
      </div>
    </div>
  );
}
