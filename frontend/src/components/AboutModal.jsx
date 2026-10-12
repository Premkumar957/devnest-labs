import React from 'react';
import { X, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">About DevNest Labs</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              An AI-Powered Workspace for Developers
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} id="close-about-modal" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            <strong>DevNest Labs</strong> is an AI-powered developer workspace designed to help developers solve everyday coding challenges faster, understand unfamiliar code, debug errors, and generate clear technical documentation.
          </p>
          <p>
            Our mission is to make AI-assisted development more practical, accessible, and productive for developers at every experience level.
          </p>

          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            What You Can Do with DevNest Labs
          </h4>
          <ul className="feature-bullets" style={{ marginBottom: '1.25rem' }}>
            <li>
              <strong>Understand Unfamiliar Code:</strong> Get clear, structured explanations of complex code tailored to your understanding and experience level.
            </li>
            <li>
              <strong>Debug and Troubleshoot:</strong> Analyze coding errors, explore potential root causes, and discover practical solutions to common development problems.
            </li>
            <li>
              <strong>Generate Technical Documentation:</strong> Create structured documentation, code comments, Javadoc, Markdown, and docstrings to make projects easier to understand and maintain.
            </li>
          </ul>

          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={16} style={{ color: '#06b6d4' }} />
            Our Technology
          </h4>
          <p style={{ marginBottom: '0.5rem' }}>
            DevNest Labs is being developed as a full-stack web application using modern technologies:
          </p>
          <ul className="feature-bullets" style={{ marginBottom: '1.25rem' }}>
            <li>
              <strong>Frontend:</strong> React 19 and Vite, with a responsive interface designed for a smooth developer experience.
            </li>
            <li>
              <strong>Backend:</strong> Java 21 and Spring Boot 3, providing REST APIs and server-side request handling.
            </li>
            <li>
              <strong>AI Integration:</strong> Designed to integrate AI models into developer workflows, with a focus on useful responses, responsible implementation, and cost-effective operation.
            </li>
            <li>
              <strong>Security:</strong> Backend-side API handling, input validation, and CORS configuration to support safer communication between the frontend and backend.
            </li>
          </ul>

          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            Our Vision
          </h4>
          <p>
            We believe AI should do more than generate code. It should help developers understand problems, learn new concepts, and build better software with confidence.
          </p>
          <p>
            DevNest Labs aims to bring code understanding, debugging assistance, and documentation generation together in one workspace—helping developers spend less time stuck on problems and more time building meaningful products.
          </p>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-primary)'
            }}
          >
            DevNest Labs — Understand Code. Solve Problems. Build Better.
          </div>
        </div>
      </div>
    </div>
  );
}
