import React, { useState, useEffect } from 'react';

export default function LoadingIndicator({ activeFeature }) {
  const [tipIndex, setTipIndex] = useState(0);

  const tipsByFeature = {
    explain: [
      'Deconstructing code AST and identifier bindings...',
      'Mapping execution flow and conditional branches...',
      'Synthesizing plain English breakdown...',
      'Formulating test input and output scenarios...'
    ],
    debug: [
      'Parsing exception trace and frame offsets...',
      'Ranking probable root causes by likelihood...',
      'Generating verified defensive code correction...',
      'Compiling reproduction and verification steps...'
    ],
    document: [
      'Extracting function signatures and parameter contracts...',
      'Inferring return invariants and potential throws...',
      'Formatting doc blocks according to industry standards...',
      'Drafting real-world invocation examples...'
    ]
  };

  const currentTips = tipsByFeature[activeFeature] || tipsByFeature.explain;

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % currentTips.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [currentTips.length]);

  return (
    <div className="loading-container">
      <div className="loader-spinner" />
      <div>
        <div className="loading-title">Analyzing with Claude AI</div>
        <div className="loading-tip">{currentTips[tipIndex]}</div>
      </div>
    </div>
  );
}
