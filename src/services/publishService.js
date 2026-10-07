/**
 * ============================================================================
 * publishService.js - Production Publish & Deployment Trigger Service
 * ============================================================================
 * Interfaces with Google Apps Script to:
 *  1. Query live publish status and pending modifications.
 *  2. Trigger secure, server-side automated deployment (GitHub Actions / Deploy Hook).
 * ============================================================================
 */

import { apiService } from './apiService';
import { authService } from './authService';
import { publicDataService } from './publicDataService';

export const publishService = {
  /**
   * Fetch current publish status, lastModifiedAt, and lastPublishedAt
   */
  async getPublishStatus() {
    const adminToken = authService.getAdminToken();
    try {
      const result = await apiService.get('getPublishStatus', { adminToken }, true);
      return (
        result || {
          lastModifiedAt: '',
          lastPublishedAt: '',
          hasPendingChanges: false,
          deploymentTarget: 'manual'
        }
      );
    } catch (err) {
      console.warn('Could not fetch publish status:', err.message);
      return {
        lastModifiedAt: '',
        lastPublishedAt: '',
        hasPendingChanges: false,
        deploymentTarget: 'manual'
      };
    }
  },

  /**
   * Trigger the automated publish and deployment workflow
   */
  async triggerPublish() {
    const adminToken = authService.getAdminToken();
    if (!adminToken) {
      throw new Error('Unauthorized: Admin authentication is required to publish.');
    }

    const response = await apiService.post('publish', {}, adminToken);
    publicDataService.clearPublicCache();
    return response;
  }
};
