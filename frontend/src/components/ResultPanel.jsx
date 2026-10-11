import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Code, 
  ListOrdered, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import LoadingIndicator from './LoadingIndicator';

export default function ResultPanel({ 
  result, 
  activeFeature, 
  isLoading, 
  error, 
  onRetry 
}) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [viewMode, setViewMode] = useState('structured'); // 'structured' or 'markdown'

  const handleCopyAll = () => {
    let textToCopy = '';
    if (viewMode === 'markdown' && result?.markdownContent) {
      textToCopy = result.markdownContent;
    } else {
      textToCopy = JSON.stringify(result, null, 2);
      if (activeFeature === 'explain') {
        textToCopy = `# Summary\n${result.summary || ''}\n\n# Steps\n${(result.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n# Example\n${result.example || ''}`;
      } else if (activeFeature === 'debug') {
        textToCopy = `# Error Meaning\n${result.errorMeaning || ''}\n\n# Likely Causes\n${(result.likelyCauses || []).join('\n')}\n\n# Suggested Solution\n${result.suggestedSolution || ''}\n\n# Corrected Code\n${result.correctedCode || ''}`;
      } else if (activeFeature === 'document') {
        textToCopy = result.generatedDocumentation || result.summary || '';
      }
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDownload = () => {
    let content = '';
    const dateStr = new Date().toISOString().slice(0, 10);
    let fileName = `devnest-${activeFeature}-${dateStr}.md`;

    if (activeFeature === 'explain') {
      content = `# Code Explanation (DevNest Labs)\n\n## Summary\n${result.summary || ''}\n\n## Step-by-Step Analysis\n${(result.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n## Example\n\`\`\`\n${result.example || ''}\n\`\`\`\n\n## Potential Issues\n${(result.potentialIssues || []).map((iss) => `- ${iss}`).join('\n')}\n`;
    } else if (activeFeature === 'debug') {
      content = `# Debug Analysis (DevNest Labs)\n\n## Error Meaning\n${result.errorMeaning || ''}\n\n## Likely Causes\n${(result.likelyCauses || []).map((c) => `- ${c}`).join('\n')}\n\n## Suggested Fix\n${result.suggestedSolution || ''}\n\n## Corrected Code\n\`\`\`\n${result.correctedCode || ''}\n\`\`\`\n\n## Verification Steps\n${(result.verificationSteps || []).map((v) => `- ${v}`).join('\n')}\n`;
    } else if (activeFeature === 'document') {
      content = `# Technical Documentation (DevNest Labs)\n\n${result.generatedDocumentation || ''}\n\n## Summary\n${result.summary || ''}\n\n## Example Usage\n\`\`\`\n${result.exampleUsage || ''}\n\`\`\`\n`;
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="result-card">
      {/* Result Header */}
      <div className="result-header">
        <div className="result-header-title">
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>AI Analysis & Insights</span>
          {result && activeFeature === 'debug' && result.confidenceLevel && (
            <span className="confidence-badge high">
              Confidence: {result.confidenceLevel}
            </span>
          )}
        </div>

        {result && !isLoading && (
          <div className="result-actions">
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={handleCopyAll}
              id="copy-result-btn"
              title="Copy entire analysis"
            >
              {copied ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              className="btn-ghost-sm"
              onClick={handleDownload}
              id="download-result-btn"
              title="Download as Markdown"
            >
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Result Body */}
      <div className="result-body">
        {isLoading && <LoadingIndicator activeFeature={activeFeature} />}

        {!isLoading && error && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle size={28} />
            </div>
            <div className="empty-state-title" style={{ color: 'var(--danger)' }}>Analysis Encountered an Error</div>
            <div className="empty-state-desc" style={{ marginBottom: '1.25rem' }}>{error}</div>
            {onRetry && (
              <button type="button" className="btn-secondary" onClick={onRetry} id="retry-btn">
                Retry Analysis
              </button>
            )}
          </div>
        )}

        {!isLoading && !error && !result && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Code size={28} />
            </div>
            <div className="empty-state-title">Ready for Analysis</div>
            <div className="empty-state-desc">
              Paste your source code or error details on the left and click analyze to receive structured Claude insights.
            </div>
          </div>
        )}

        {!isLoading && !error && result && (
          <>
            {/* 1. EXPLAIN CODE RESULT VIEW */}
            {activeFeature === 'explain' && (
              <div>
                {/* Summary */}
                <div className="result-section">
                  <div className="result-section-title">
                    <Info size={15} />
                    High-Level Summary
                  </div>
                  <div className="summary-box">
                    {result.summary}
                  </div>
                </div>

                {/* Steps */}
                {result.steps && result.steps.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <ListOrdered size={15} />
                      Step-by-Step Logic
                    </div>
                    <div className="steps-list">
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="step-item">
                          <span className="step-num-badge">{idx + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Components */}
                {result.keyComponents && result.keyComponents.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <Code size={15} />
                      Key Variables & Methods
                    </div>
                    <ul className="feature-bullets" style={{ paddingLeft: '0.5rem' }}>
                      {result.keyComponents.map((comp, idx) => (
                        <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                          {comp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Example Call & Output */}
                {result.example && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <CheckCircle2 size={15} />
                      Example Input & Expected Output
                    </div>
                    <div className="code-output-block">
                      {result.example}
                    </div>
                  </div>
                )}

                {/* Potential Issues & Edge Cases */}
                {result.potentialIssues && result.potentialIssues.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title" style={{ color: '#fbbf24' }}>
                      <AlertTriangle size={15} />
                      Potential Issues & Edge Cases
                    </div>
                    <ul className="feature-bullets" style={{ paddingLeft: '0.5rem' }}>
                      {result.potentialIssues.map((issue, idx) => (
                        <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 2. DEBUG ERROR RESULT VIEW */}
            {activeFeature === 'debug' && (
              <div>
                {/* Meaning */}
                <div className="result-section">
                  <div className="result-section-title">
                    <Info size={15} />
                    Error Meaning
                  </div>
                  <div className="summary-box">
                    {result.errorMeaning}
                  </div>
                </div>

                {/* Likely Causes (Ranked) */}
                {result.likelyCauses && result.likelyCauses.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <AlertTriangle size={15} style={{ color: '#fbbf24' }} />
                      Likely Causes (Ranked by Plausibility)
                    </div>
                    <div className="steps-list">
                      {result.likelyCauses.map((cause, idx) => (
                        <div key={idx} className="step-item">
                          <span className="step-num-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                            {idx + 1}
                          </span>
                          <span>{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Fix */}
                {result.suggestedSolution && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <CheckCircle2 size={15} style={{ color: '#34d399' }} />
                      Suggested Solution
                    </div>
                    <div className="summary-box" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
                      {result.suggestedSolution}
                    </div>
                  </div>
                )}

                {/* Corrected Code Snippet */}
                {result.correctedCode && (
                  <div className="result-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div className="result-section-title" style={{ margin: 0 }}>
                        <Code size={15} />
                        Corrected Code Snippet
                      </div>
                      <button
                        type="button"
                        className="btn-ghost-sm"
                        onClick={() => handleCopyCode(result.correctedCode)}
                        id="copy-corrected-code-btn"
                        title="Copy code snippet"
                      >
                        {codeCopied ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                        <span>{codeCopied ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <div className="code-output-block">
                      {result.correctedCode}
                    </div>
                  </div>
                )}

                {/* Verification Steps */}
                {result.verificationSteps && result.verificationSteps.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <ListOrdered size={15} />
                      Steps to Verify Fix
                    </div>
                    <div className="steps-list">
                      {result.verificationSteps.map((vStep, idx) => (
                        <div key={idx} className="step-item">
                          <span className="step-num-badge">{idx + 1}</span>
                          <span>{vStep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mandatory AI Accuracy Disclaimer Banner */}
                <div className="disclaimer-banner">
                  <ShieldAlert size={16} />
                  <span>
                    AI-generated diagnostic guidance. Always verify code in your test environment before deploying to production.
                  </span>
                </div>
              </div>
            )}

            {/* 3. GENERATE DOCUMENTATION RESULT VIEW */}
            {activeFeature === 'document' && (
              <div>
                {/* Generated Documentation Block */}
                <div className="result-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div className="result-section-title" style={{ margin: 0 }}>
                      <FileText size={15} />
                      Generated Documentation
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-sm"
                      onClick={() => handleCopyCode(result.generatedDocumentation)}
                      id="copy-doc-block-btn"
                    >
                      {codeCopied ? <Check size={13} style={{ color: 'var(--success)' }} /> : <Copy size={13} />}
                      <span>{codeCopied ? 'Copied Doc' : 'Copy Doc'}</span>
                    </button>
                  </div>
                  <div className="code-output-block" style={{ color: '#a5b4fc', whiteSpace: 'pre-wrap' }}>
                    {result.generatedDocumentation}
                  </div>
                </div>

                {/* Summary */}
                <div className="result-section">
                  <div className="result-section-title">
                    <Info size={15} />
                    Summary & Purpose
                  </div>
                  <div className="summary-box">
                    {result.summary}
                  </div>
                </div>

                {/* Parameters */}
                {result.parameters && result.parameters.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <Code size={15} />
                      Parameters
                    </div>
                    <ul className="feature-bullets" style={{ paddingLeft: '0.5rem' }}>
                      {result.parameters.map((param, idx) => (
                        <li key={idx} style={{ color: 'var(--text-secondary)' }}>
                          {param}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Return Value */}
                {result.returnValue && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <CheckCircle2 size={15} />
                      Return Value
                    </div>
                    <div className="summary-box">
                      {result.returnValue}
                    </div>
                  </div>
                )}

                {/* Example Usage */}
                {result.exampleUsage && (
                  <div className="result-section">
                    <div className="result-section-title">
                      <Code size={15} />
                      Example Usage
                    </div>
                    <div className="code-output-block">
                      {result.exampleUsage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
