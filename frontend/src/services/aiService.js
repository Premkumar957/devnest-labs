/**
 * DevNest Labs AI Service
 * Connects React frontend securely to Spring Boot backend REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('devnest_auth_token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to DevNest backend. Please ensure the Spring Boot server is running on port 8080.');
    }
    throw err;
  }
}

export const aiService = {
  /**
   * Check backend health and Gemini API status
   */
  async checkHealth() {
    return request('/health', { method: 'GET' });
  },

  /**
   * Explain code logic
   * @param {{ code: string, language: string, level: string }} params
   */
  async explainCode({ code, language, level }) {
    if (!code || !code.trim()) {
      throw new Error('Please provide code to explain.');
    }
    return request('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ code, language, level }),
    });
  },

  /**
   * Debug error and stack trace
   * @param {{ error: string, code?: string, language: string, expectedBehavior?: string }} params
   */
  async debugError({ error, code, language, expectedBehavior }) {
    if (!error || !error.trim()) {
      throw new Error('Please provide an error message or stack trace to debug.');
    }
    return request('/ai/debug', {
      method: 'POST',
      body: JSON.stringify({ error, code, language, expectedBehavior }),
    });
  },

  /**
   * Generate technical documentation
   * @param {{ code: string, language: string, format: string }} params
   */
  async generateDocumentation({ code, language, format }) {
    if (!code || !code.trim()) {
      throw new Error('Please provide source code to generate documentation.');
    }
    return request('/ai/document', {
      method: 'POST',
      body: JSON.stringify({ code, language, format }),
    });
  },
};
