import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Bug, 
  FileCode, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  Lock 
} from 'lucide-react';

export default function Home({ onOpenWorkspace, openModal }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>DevNest Labs • Powered by Spring Boot & Gemini 3.8</span>
        </div>

        <h1 className="hero-title">
          The Intelligent Workspace for <br />
          <span className="hero-gradient-text">Modern Developers</span>
        </h1>

        <p className="hero-subtitle">
          Stop struggling with unfamiliar legacy code, cryptic stack traces, and tedious documentation. DevNest Labs delivers lightning-fast semantic explanations, automated debugging, and production-grade docs in seconds.
        </p>

        <div className="hero-cta-group">
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onOpenWorkspace}
            id="hero-launch-btn"
          >
            <span>Launch Workspace</span>
            <ArrowRight size={18} />
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => openModal('about')}
            id="hero-learn-more-btn"
          >
            <span>Architecture & Specs</span>
          </button>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="features-grid">
        {/* Feature 1: Explain Code */}
        <div className="feature-card explain">
          <div className="feature-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <h2 className="feature-title">1. Explain Code</h2>
          <p className="feature-description">
            Understand complex methods, recursive logic, and unfamiliar algorithms without tracing every line manually.
          </p>
          <ul className="feature-bullets">
            <li>Tailored Beginner, Intermediate, or Advanced levels</li>
            <li>Step-by-step sequential logic trace</li>
            <li>Synthesized example calls and output states</li>
            <li>Proactive edge-case and boundary warnings</li>
          </ul>
        </div>

        {/* Feature 2: Debug Error */}
        <div className="feature-card debug">
          <div className="feature-icon-wrapper">
            <Bug size={24} />
          </div>
          <h2 className="feature-title">2. Debug Error</h2>
          <p className="feature-description">
            Paste cryptic stack traces or runtime exceptions alongside your code to isolate root causes and receive verified fixes.
          </p>
          <ul className="feature-bullets">
            <li>Plain-English error diagnosis</li>
            <li>Ranked root cause probabilities</li>
            <li>Copy-paste ready corrected code snippet</li>
            <li>Explicit verification steps to test the fix</li>
          </ul>
        </div>

        {/* Feature 3: Generate Documentation */}
        <div className="feature-card document">
          <div className="feature-icon-wrapper">
            <FileCode size={24} />
          </div>
          <h2 className="feature-title">3. Generate Documentation</h2>
          <p className="feature-description">
            Automate tedious doc writing. Generate clean Javadoc, Python docstrings, or GitHub-flavored Markdown.
          </p>
          <ul className="feature-bullets">
            <li>Extracts parameters, types, and return values</li>
            <li>Documents potential exceptions thrown</li>
            <li>Includes realistic caller usage samples</li>
            <li>Standards-compliant Javadoc and Markdown</li>
          </ul>
        </div>
      </section>

      {/* Architecture & Enterprise Security Section */}
      <section className="architecture-section">
        <div className="section-header">
          <div className="section-tag">Production Architecture</div>
          <h2 className="section-title">Engineered for Safety and Speed</h2>
        </div>

        <div className="arch-flow-box">
          <div className="arch-steps">
            <div className="arch-step-item">
              <div className="arch-step-num">STEP 01</div>
              <div className="arch-step-title">Developer Browser</div>
              <div className="arch-step-desc">
                React + Vite client with client-side input validation and zero API secrets stored in browser bundles.
              </div>
            </div>

            <div className="arch-step-item">
              <div className="arch-step-num">STEP 02</div>
              <div className="arch-step-title">Spring Boot REST API</div>
              <div className="arch-step-desc">
                Java 21 backend performs payload bounds checking, prompt sandboxing, and CORS protection.
              </div>
            </div>

            <div className="arch-step-item">
              <div className="arch-step-num">STEP 03</div>
              <div className="arch-step-title">Gemini 3.8 Flash Engine</div>
              <div className="arch-step-desc">
                Secure server-to-server Google Gemini REST API call generating structured, validated JSON output.
              </div>
            </div>

            <div className="arch-step-item">
              <div className="arch-step-num">STEP 04</div>
              <div className="arch-step-title">Structured Workspace</div>
              <div className="arch-step-desc">
                Delivers immediate copyable code fixes, structured step cards, and downloadable markdown reports.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
              <span>Zero client-side secrets</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Lock size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Ephemeral stateless execution</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Cpu size={18} style={{ color: '#06b6d4' }} />
              <span>Multi-language AST understanding</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
