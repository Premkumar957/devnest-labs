import React, { useState } from 'react';
import FeatureSelector from '../components/FeatureSelector';
import CodeEditor from '../components/CodeEditor';
import ResultPanel from '../components/ResultPanel';
import { aiService } from '../services/aiService';

export default function Workspace({ onAddHistoryItem }) {
  const [activeFeature, setActiveFeature] = useState('explain');
  
  // Form input states
  const [formData, setFormData] = useState({
    code: 'public int add(int a, int b) {\n    return a + b;\n}',
    language: 'java',
    level: 'intermediate',
    format: 'javadoc',
    error: '',
    expectedBehavior: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sample data presets
  const samplePresets = {
    explain: {
      code: `public int add(int a, int b) {
    return a + b;
}`,
      language: 'java',
      level: 'intermediate'
    },
    debug: {
      error: `java.lang.NullPointerException: Cannot invoke "String.trim()" because "username" is null
    at com.devnest.service.UserService.register(UserService.java:42)
    at com.devnest.controller.AuthController.submit(AuthController.java:28)`,
      code: `public User register(String username, String email) {
    String cleanName = username.trim();
    return new User(cleanName, email.toLowerCase());
}`,
      language: 'java',
      expectedBehavior: 'Safely validate null or empty usernames and return an explicit validation error.'
    },
    document: {
      code: `public List<Integer> findDuplicates(List<Integer> numbers) {
    Set<Integer> seen = new HashSet<>();
    Set<Integer> duplicates = new HashSet<>();
    for (Integer num : numbers) {
        if (!seen.add(num)) {
            duplicates.add(num);
        }
    }
    return new ArrayList<>(duplicates);
}`,
      language: 'java',
      format: 'javadoc'
    }
  };

  const handleSelectFeature = (feature) => {
    setActiveFeature(feature);
    setResult(null);
    setErrorMessage(null);
  };

  const handleLoadSample = () => {
    const sample = samplePresets[activeFeature];
    if (sample) {
      setFormData((prev) => ({
        ...prev,
        ...sample
      }));
    }
  };

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      code: '',
      error: '',
      expectedBehavior: ''
    }));
    setResult(null);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let response;
      if (activeFeature === 'explain') {
        response = await aiService.explainCode({
          code: formData.code,
          language: formData.language,
          level: formData.level
        });
      } else if (activeFeature === 'debug') {
        response = await aiService.debugError({
          error: formData.error,
          code: formData.code,
          language: formData.language,
          expectedBehavior: formData.expectedBehavior
        });
      } else if (activeFeature === 'document') {
        response = await aiService.generateDocumentation({
          code: formData.code,
          language: formData.language,
          format: formData.format
        });
      }

      if (response && response.success && response.result) {
        setResult(response.result);

        // Record analysis in history
        const snippet = activeFeature === 'debug' ? formData.error : formData.code;
        onAddHistoryItem({
          id: Date.now().toString(),
          feature: activeFeature,
          language: formData.language,
          timestamp: Date.now(),
          formData: { ...formData },
          result: response.result,
          codeSnippet: snippet ? snippet.slice(0, 70).replace(/\n/g, ' ') : 'Analysis'
        });
      } else {
        throw new Error(response?.error || 'Analysis response incomplete.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workspace-container">
      {/* 1. Feature Switcher Tabs */}
      <FeatureSelector
        activeFeature={activeFeature}
        onSelectFeature={handleSelectFeature}
      />

      {/* 2. Side-by-Side Grid: Editor & Result */}
      <div className="workspace-grid">
        <CodeEditor
          activeFeature={activeFeature}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onClear={handleClear}
          onLoadSample={handleLoadSample}
        />

        <ResultPanel
          result={result}
          activeFeature={activeFeature}
          isLoading={isLoading}
          error={errorMessage}
          onRetry={handleSubmit}
        />
      </div>
    </div>
  );
}
