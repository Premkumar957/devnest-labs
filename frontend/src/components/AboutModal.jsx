import React from 'react';
import { X, CheckCircle2, Cpu, Shield, Layers } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">About DevNest Labs</div>
          <button type="button" className="icon-btn" onClick={onClose} id="close-about-modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            <strong>DevNest Labs</strong> is a next-generation AI Developer Workspace crafted to solve the three primary bottlenecks developers face every single day:
          </p>
          <ul className="feature-bullets" style={{ marginBottom: '1rem' }}>
            <li><strong>Explaining Unfamiliar Code:</strong> Multi-tiered semantic explanations tailored to beginner, intermediate, or senior architects.</li>
            <li><strong>Debugging Cryptic Errors:</strong> Rapid root-cause hypothesis ranking and defensive code generation.</li>
            <li><strong>Generating Production Documentation:</strong> Producing idiomatic Javadoc, Markdown, and docstrings in seconds.</li>
          </ul>

          <h4>Technical Architecture</h4>
          <p>
            Built as a robust full-stack solution demonstrating enterprise engineering standards:
          </p>
          <ul className="feature-bullets" style={{ marginBottom: '1rem' }}>
            <li><strong>Frontend:</strong> React 19 + Vite with an ultra-responsive dark/glassmorphic custom design system.</li>
            <li><strong>Backend API:</strong> Java 21 + Spring Boot 3 REST API providing input validation, prompt sandboxing, and CORS security.</li>
            <li><strong>AI Engine:</strong> Powered by the Anthropic Claude API (Claude 3.5 Sonnet) with secure server-side key management.</li>
          </ul>

          <h4>Claude for Startups Initiative</h4>
          <p>
            This application is engineered specifically as a working demonstrator for the <em>Claude for Startups</em> program, proving real-world utility, safety guardrails, and enterprise extensibility.
          </p>
        </div>
      </div>
    </div>
  );
}
