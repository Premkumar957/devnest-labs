import React from 'react';
import { BookOpen, Bug, FileCode } from 'lucide-react';

export default function FeatureSelector({ activeFeature, onSelectFeature }) {
  const features = [
    {
      id: 'explain',
      name: 'Explain Code',
      tagline: 'Understand logic & control flow',
      icon: BookOpen,
      iconClass: 'tab-icon-explain'
    },
    {
      id: 'debug',
      name: 'Debug Error',
      tagline: 'Diagnose causes & suggested fixes',
      icon: Bug,
      iconClass: 'tab-icon-debug'
    },
    {
      id: 'document',
      name: 'Generate Documentation',
      tagline: 'Produce Javadoc, Markdown & Docstrings',
      icon: FileCode,
      iconClass: 'tab-icon-document'
    }
  ];

  return (
    <div className="workspace-selector-container">
      <div className="feature-tabs" role="tablist">
        {features.map((item) => {
          const Icon = item.icon;
          const isActive = activeFeature === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              className={`feature-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFeature(item.id)}
              id={`tab-${item.id}`}
            >
              <div className={`feature-tab-icon ${item.iconClass}`}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
              <div className="feature-tab-info">
                <span className="feature-tab-name">{item.name}</span>
                <span className="feature-tab-tagline">{item.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
