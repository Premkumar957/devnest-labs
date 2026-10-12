import React from 'react';
import { 
  Sparkles, 
  Trash2, 
  FileCode2, 
  CornerDownLeft, 
  AlertCircle 
} from 'lucide-react';

export default function CodeEditor({
  activeFeature,
  formData,
  setFormData,
  onSubmit,
  isLoading,
  onClear,
  onLoadSample
}) {
  const languages = [
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'cpp', label: 'C++' },
    { value: 'rust', label: 'Rust' },
    { value: 'csharp', label: 'C#' },
    { value: 'sql', label: 'SQL' },
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner (Intuitive & Friendly)' },
    { value: 'intermediate', label: 'Intermediate (Pragmatic & Idiomatic)' },
    { value: 'advanced', label: 'Advanced (Architecture & Performance)' },
  ];

  const docFormats = [
    { value: 'javadoc', label: 'Javadoc (/** ... */)' },
    { value: 'markdown', label: 'Markdown (# Method Doc)' },
    { value: 'docstring', label: 'Python Docstring (""" ... """)' },
    { value: 'jsdoc', label: 'JSDoc' },
  ];

  const handleKeyDown = (e) => {
    // Ctrl + Enter or Cmd + Enter shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) return 'Analyzing with Gemini...';
    switch (activeFeature) {
      case 'explain': return 'Explain Code';
      case 'debug': return 'Diagnose & Debug';
      case 'document': return 'Generate Documentation';
      default: return 'Analyze';
    }
  };

  const isFormValid = () => {
    if (activeFeature === 'debug') {
      return Boolean(formData.error && formData.error.trim().length > 0);
    }
    return Boolean(formData.code && formData.code.trim().length > 0);
  };

  return (
    <div className="editor-card">
      {/* Editor Controls Header */}
      <div className="editor-header">
        <div className="editor-controls-left">
          {/* Language selector */}
          <select
            className="select-control"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            id="language-select"
            title="Programming Language"
          >
            {languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Mode-specific Option */}
          {activeFeature === 'explain' && (
            <select
              className="select-control"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              id="explanation-level-select"
              title="Explanation Level"
            >
              {levels.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          )}

          {activeFeature === 'document' && (
            <select
              className="select-control"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              id="doc-format-select"
              title="Documentation Format"
            >
              {docFormats.map((fmt) => (
                <option key={fmt.value} value={fmt.value}>
                  {fmt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="editor-controls-right">
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={onLoadSample}
            id="load-sample-btn"
            title="Load sample snippet"
          >
            <FileCode2 size={14} />
            <span>Load Sample</span>
          </button>
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={onClear}
            id="clear-editor-btn"
            title="Clear all fields"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Editor Main Body */}
      <div className="editor-body">
        {/* DEBUG MODE INPUTS */}
        {activeFeature === 'debug' ? (
          <>
            <div>
              <div className="input-label-row">
                <label htmlFor="error-input" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} style={{ color: '#fbbf24' }} />
                  Error Message or Stack Trace *
                </label>
                <span className="char-count">
                  {(formData.error || '').length} / 6000 chars
                </span>
              </div>
              <textarea
                id="error-input"
                className="code-textarea secondary-textarea"
                placeholder="Paste the runtime exception or error stack trace here (e.g. java.lang.NullPointerException...)"
                value={formData.error || ''}
                onChange={(e) => setFormData({ ...formData, error: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="input-label-row">
                <label htmlFor="debug-code-input">Relevant Source Code (Optional)</label>
                <span className="char-count">
                  {(formData.code || '').length} / 12000 chars
                </span>
              </div>
              <textarea
                id="debug-code-input"
                className="code-textarea"
                placeholder="Paste the relevant source code snippet where the error occurred..."
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <div className="input-label-row">
                <label htmlFor="expected-behavior-input">Expected Behavior (Optional)</label>
              </div>
              <input
                id="expected-behavior-input"
                type="text"
                className="input-text-field"
                placeholder="What did you expect to happen? (e.g. Return empty array instead of throwing exception)"
                value={formData.expectedBehavior || ''}
                onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                onKeyDown={handleKeyDown}
              />
            </div>
          </>
        ) : (
          /* EXPLAIN & DOCUMENT MODES INPUT */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="input-label-row">
              <label htmlFor="source-code-input">
                {activeFeature === 'explain' ? 'Source Code to Explain *' : 'Source Code to Document *'}
              </label>
              <span className="char-count">
                {(formData.code || '').length} / 12000 chars
              </span>
            </div>
            <textarea
              id="source-code-input"
              className="code-textarea"
              placeholder={`Paste your ${formData.language} source code here...`}
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>

      {/* Editor Footer / Action Bar */}
      <div className="editor-footer">
        <div className="editor-hint">
          <span>Run analysis</span>
          <span className="kbd-badge">Ctrl</span> + <span className="kbd-badge">Enter</span>
        </div>

        <button
          type="button"
          className="btn-submit"
          onClick={onSubmit}
          disabled={!isFormValid() || isLoading}
          id="submit-analysis-btn"
        >
          <Sparkles size={16} />
          <span>{getSubmitButtonText()}</span>
        </button>
      </div>
    </div>
  );
}
