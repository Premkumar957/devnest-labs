/**
 * DevNest Labs Authentication Service
 * Manages JWT tokens, user sessions, and REST communication for Auth endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const TOKEN_KEY = 'devnest_auth_token';
const USER_KEY = 'devnest_auth_user';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem(TOKEN_KEY);

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
      throw new Error('Unable to connect to DevNest backend. Ensure the Spring Boot server is running on port 8080.');
    }
    throw err;
  }
}

export const authService = {
  /**
   * Register a new user
   * @param {{ name: string, email: string, password: string }} credentials
   */
  async signup({ name, email, password }) {
    const res = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (res?.result?.token && res?.result?.user) {
      this.setSession(res.result.token, res.result.user);
    }
    return res.result;
  },

  /**
   * Log in an existing user
   * @param {{ email: string, password: string }} credentials
   */
  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res?.result?.token && res?.result?.user) {
      this.setSession(res.result.token, res.result.user);
    }
    return res.result;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await request('/auth/me', { method: 'GET' });
      if (res?.result) {
        localStorage.setItem(USER_KEY, JSON.stringify(res.result));
        return res.result;
      }
    } catch {
      this.logout();
      return null;
    }
    return null;
  },

  /**
   * Save session token and user info
   */
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Get currently stored JWT token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get cached user object
   */
  getUser() {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Log out user and clear storage
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
