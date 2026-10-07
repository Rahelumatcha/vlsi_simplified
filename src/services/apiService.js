/**
 * ============================================================================
 * apiService.js - Core Network & Backend Communication Layer
 * ============================================================================
 * Handles communication with Google Apps Script serverless Web App API.
 * 
 * Features:
 *  - Communicates directly with Google Apps Script Web App endpoints.
 *  - Handles CORS & Google Apps Script redirect nuances (POST with text/plain prevents CORS preflight blockage).
 *  - Provides development fallback when Google Apps Script URL is not yet configured,
 *    enabling local testing while preserving the Google Sheets architecture contract.
 * ============================================================================
 */

import { API_BASE_URL, isApiConfigured } from '../config';
import { initialSubjects } from '../data/initialSubjects';
import { initialClasses } from '../data/initialClasses';
import { initialQuizzes } from '../data/initialQuizzes';
import { initialTrainerProfile } from '../data/initialTrainerProfile';

// In-memory fallback stores for development testing when API is not yet linked
let devSubjects = [...initialSubjects];
let devClasses = [...initialClasses];
let devQuizzes = [...initialQuizzes];
let devTrainerProfile = { ...initialTrainerProfile };
let devLastModifiedAt = '';
let devLastPublishedAt = new Date().toISOString();

// In-memory cache for GET requests with TTL (time-to-live)
const apiCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Deduplication map for concurrent in-flight GET requests
const inFlightRequests = new Map();

class ApiService {
  /**
   * Helper to make GET requests to Google Apps Script with smart caching, deduplication & robust error handling
   */
  async get(action, params = {}, bypassCache = false) {
    if (!isApiConfigured()) {
      return this.handleDevFallbackGet(action, params);
    }

    const isAdmin = Boolean(params.adminToken);
    const cacheKey = `${action}_${JSON.stringify(params)}`;

    // Return cached response if valid (public requests only; admin always bypasses cache)
    if (!isAdmin && !bypassCache && apiCache.has(cacheKey)) {
      const entry = apiCache.get(cacheKey);
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        return entry.data;
      }
    }

    // Deduplicate simultaneous identical requests in flight
    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }

    const requestPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25-second timeout for cold starts

      try {
        const url = new URL(API_BASE_URL);
        url.searchParams.set('action', action);
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            url.searchParams.set(key, params[key]);
          }
        });

        const response = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API HTTP error ${response.status}: ${response.statusText || 'Request failed'}`);
        }

        const text = await response.text();
        let result;
        try {
          result = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(`Invalid JSON received from API: ${text.slice(0, 150)}`);
        }

        if (!result || typeof result !== 'object') {
          throw new Error('API returned an empty or invalid response format.');
        }

        if (result.success === false) {
          throw new Error(result.error || result.message || 'API operation returned error status.');
        }

        // Cache successful public response
        if (!isAdmin) {
          apiCache.set(cacheKey, { timestamp: Date.now(), data: result.data });
        }

        return result.data;
      } catch (error) {
        clearTimeout(timeoutId);
        const isAbort = error.name === 'AbortError';
        const errorMsg = isAbort
          ? `Request timed out after 25s (action: ${action}). Google Apps Script may be waking up.`
          : error.message;

        console.error(`[ApiService] Request failed for action "${action}":`, errorMsg);
        // CRITICAL: When API is configured, NEVER swallow errors or return empty arrays!
        throw new Error(errorMsg);
      } finally {
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Invalidate in-memory cache (called automatically after mutations)
   */
  clearCache() {
    apiCache.clear();
    inFlightRequests.clear();
  }

  /**
   * Helper to make POST requests to Google Apps Script.
   * Google Apps Script requires text/plain body to avoid CORS OPTIONS preflight failures.
   */
  async post(action, payload = {}, adminToken = '') {
    if (!isApiConfigured()) {
      return this.handleDevFallbackPost(action, payload, adminToken);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const bodyData = {
        action,
        adminToken,
        ...payload
      };

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(bodyData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API HTTP error ${response.status}: ${response.statusText || 'Mutation failed'}`);
      }

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        throw new Error(`Invalid JSON received from mutation API: ${text.slice(0, 150)}`);
      }

      if (!result || typeof result !== 'object') {
        throw new Error('API returned an empty or invalid mutation response format.');
      }

      if (result.success === false) {
        throw new Error(result.error || result.message || 'Mutation rejected by server.');
      }

      // Clear cache so mutations are immediately reflected across the website
      this.clearCache();

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      const isAbort = error.name === 'AbortError';
      const errorMsg = isAbort
        ? `Mutation timed out after 25s (action: ${action}).`
        : error.message;

      console.error(`[ApiService] POST failed for action "${action}":`, errorMsg);
      throw new Error(errorMsg);
    }
  }

  // --------------------------------------------------------------------------
  // Development Mode Local Fallback Handlers
  // Used only when VITE_API_BASE_URL is not yet deployed or is offline
  // --------------------------------------------------------------------------

  handleDevFallbackGet(action, params) {
    const isAdmin = Boolean(params.adminToken);

    switch (action) {
      case 'getSubjects':
        return isAdmin ? [...devSubjects] : devSubjects.filter(s => s.published);

      case 'getClasses':
        let filtered = [...devClasses];
        if (params.subjectId) {
          filtered = filtered.filter(c => String(c.subjectId) === String(params.subjectId));
        }
        if (!isAdmin) {
          filtered = filtered.filter(c => c.published);
        }
        return filtered.sort((a, b) => Number(a.classNumber) - Number(b.classNumber));

      case 'getQuizzes':
        return isAdmin ? [...devQuizzes] : devQuizzes.filter(q => q.published);

      case 'getQuiz':
        const quiz = devQuizzes.find(q => String(q.id) === String(params.id));
        if (!quiz) throw new Error('Quiz not found');
        return {
          quiz,
          questions: quiz.questions || []
        };

      case 'getTrainerProfile':
        return { ...devTrainerProfile };

      case 'getPublishStatus':
        return {
          lastModifiedAt: devLastModifiedAt || '',
          lastPublishedAt: devLastPublishedAt || '',
          hasPendingChanges: Boolean(devLastModifiedAt && (!devLastPublishedAt || new Date(devLastModifiedAt) > new Date(devLastPublishedAt))),
          deploymentTarget: 'dev_local'
        };

      default:
        throw new Error(`Unknown fallback action: ${action}`);
    }
  }

  handleDevFallbackPost(action, payload, adminToken) {
    if (action === 'verifyAdmin') {
      // In dev fallback, allow any non-empty key or demo key
      const isValid = Boolean(adminToken && adminToken.trim().length >= 4);
      return { success: isValid, message: isValid ? 'Authorized (Dev Fallback)' : 'Invalid key' };
    }

    const now = new Date().toISOString();
    if (action !== 'verifyAdmin' && action !== 'publish') {
      devLastModifiedAt = now;
    }

    // Subjects
    if (action === 'createSubject') {
      const newSubject = {
        ...payload.data,
        id: payload.data.id || `SUB-${Date.now()}`,
        published: Boolean(payload.data.published),
        createdAt: now,
        updatedAt: now
      };
      devSubjects.push(newSubject);
      return { success: true, data: { id: newSubject.id } };
    }

    if (action === 'updateSubject') {
      const idx = devSubjects.findIndex(s => String(s.id) === String(payload.id));
      if (idx !== -1) {
        devSubjects[idx] = { ...devSubjects[idx], ...payload.data, updatedAt: now };
        return { success: true, message: 'Subject updated' };
      }
      throw new Error('Subject not found');
    }

    if (action === 'deleteSubject') {
      devSubjects = devSubjects.filter(s => String(s.id) !== String(payload.id));
      return { success: true, message: 'Subject deleted' };
    }

    // Classes
    if (action === 'createClass') {
      const newClass = {
        ...payload.data,
        id: payload.data.id || `CLS-${Date.now()}`,
        classNumber: Number(payload.data.classNumber || 1),
        published: Boolean(payload.data.published),
        createdAt: now,
        updatedAt: now
      };
      devClasses.push(newClass);
      return { success: true, data: { id: newClass.id } };
    }

    if (action === 'updateClass') {
      const idx = devClasses.findIndex(c => String(c.id) === String(payload.id));
      if (idx !== -1) {
        devClasses[idx] = {
          ...devClasses[idx],
          ...payload.data,
          classNumber: Number(payload.data.classNumber ?? devClasses[idx].classNumber),
          updatedAt: now
        };
        return { success: true, message: 'Class updated' };
      }
      throw new Error('Class not found');
    }

    if (action === 'deleteClass') {
      devClasses = devClasses.filter(c => String(c.id) !== String(payload.id));
      return { success: true, message: 'Class deleted' };
    }

    // Quizzes
    if (action === 'createQuiz') {
      const newQuiz = {
        ...payload.data,
        id: payload.data.id || `QZ-${Date.now()}`,
        published: Boolean(payload.data.published),
        createdAt: now,
        updatedAt: now
      };
      devQuizzes.push(newQuiz);
      return { success: true, data: { id: newQuiz.id } };
    }

    if (action === 'updateQuiz') {
      const idx = devQuizzes.findIndex(q => String(q.id) === String(payload.id));
      if (idx !== -1) {
        devQuizzes[idx] = { ...devQuizzes[idx], ...payload.data, updatedAt: now };
        return { success: true, message: 'Quiz updated' };
      }
      throw new Error('Quiz not found');
    }

    if (action === 'deleteQuiz') {
      devQuizzes = devQuizzes.filter(q => String(q.id) !== String(payload.id));
      return { success: true, message: 'Quiz deleted' };
    }

    // Trainer Profile
    if (action === 'updateTrainerProfile') {
      devTrainerProfile = { ...devTrainerProfile, ...payload.data };
      devLastModifiedAt = now;
      return { success: true, message: 'Trainer profile updated' };
    }

    // Publish
    if (action === 'publish') {
      devLastPublishedAt = now;
      return {
        success: true,
        message: 'Publish started successfully. The public website is being updated.',
        lastPublishedAt: now
      };
    }

    throw new Error(`Unhandled dev action: ${action}`);
  }
}

export const apiService = new ApiService();
