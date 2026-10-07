/**
 * ============================================================================
 * authService.js - Authentication & Authorization Abstraction Layer
 * ============================================================================
 * IMPORTANT SECURITY COMPLIANCE:
 *  - NO admin passwords, secrets, or API keys are stored in source code.
 *  - Authentication is handled server-side by Google Apps Script using
 *    Script Properties ('ADMIN_KEY').
 *  - This abstraction can seamlessly transition to Supabase / Firebase / JWT
 *    by replacing the verify call with a standard auth SDK.
 * ============================================================================
 */

import { apiService } from './apiService';

const SESSION_STORAGE_KEY = 'vlsi_admin_session_token';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = null;
    this.restoreSession();
  }

  restoreSession() {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.token = parsed.token;
        this.currentUser = parsed.user;
      }
    } catch (e) {
      this.token = null;
      this.currentUser = null;
    }
  }

  /**
   * Attempts admin login by verifying the key against the backend API.
   * Neither the password nor the key is hardcoded in the frontend.
   */
  async login(adminKey) {
    if (!adminKey || !adminKey.trim()) {
      throw new Error('Please enter your Admin Passphrase / Key.');
    }

    try {
      const result = await apiService.post('verifyAdmin', {}, adminKey.trim());
      
      if (result && result.success) {
        this.token = adminKey.trim();
        this.currentUser = {
          role: 'admin',
          username: 'Trainer/Admin',
          authenticatedAt: new Date().toISOString()
        };

        // Store active session token only for the current browser session
        sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({
            token: this.token,
            user: this.currentUser
          })
        );

        return { success: true, user: this.currentUser };
      } else {
        throw new Error(result?.error || 'Invalid Admin Key. Authorization rejected by server.');
      }
    } catch (error) {
      throw new Error(error.message || 'Authentication failed. Please verify your credentials.');
    }
  }

  /**
   * Clears the current admin session
   */
  logout() {
    this.token = null;
    this.currentUser = null;
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {}
  }

  /**
   * Check if current user is authenticated
   */
  isAuthenticated() {
    return Boolean(this.token && this.currentUser);
  }

  /**
   * Returns current user info or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Returns current admin token to attach to mutation requests
   */
  getAdminToken() {
    return this.token || '';
  }
}

export const authService = new AuthService();
