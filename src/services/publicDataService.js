/**
 * ============================================================================
 * publicDataService.js - Centralized Hybrid Public Data & Caching Service
 * ============================================================================
 * Implements the hybrid data architecture:
 *   Google Sheets -> Google Apps Script API -> Browser Cache (localStorage) -> Static JSON Fallback
 *
 * Core Features:
 *   1. Stale-While-Revalidate: Instant synchronous retrieval from browser cache
 *      or static JSON, with background refresh from Google Apps Script API.
 *   2. Resilient Fallback: If Google Apps Script is unavailable or slow,
 *      seamlessly falls back to local cache or bundled static JSON.
 *   3. Zero Secrets: No admin keys, deploy hooks, or secrets exposed.
 *   4. Cache Invalidation: Automatically invalidated after TTL (60s) or on admin mutation.
 *   5. Request Deduplication: In-flight requests are coalesced to prevent duplicate network calls.
 * ============================================================================
 */

import { API_BASE_URL, isApiConfigured, PUBLIC_DATA_CACHE_TTL } from '../config';
import staticSubjects from '../data/subjects.json';
import staticClasses from '../data/classes.json';
import staticQuizzes from '../data/quizzes.json';
import staticTrainer from '../data/trainer.json';

const CACHE_PREFIX = 'vlsi_pub_cache_';
const MEMORY_CACHE = new Map();
const inFlightRequests = new Map();

/**
 * Safely read cached entry from localStorage with in-memory fallback
 */
function getCacheEntry(key) {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'timestamp' in parsed && 'data' in parsed) {
        return parsed;
      }
    }
  } catch (e) {
    // localStorage might be blocked or full (e.g. private browsing)
  }
  return MEMORY_CACHE.get(key) || null;
}

/**
 * Safely store entry to localStorage with in-memory fallback
 */
function setCacheEntry(key, data) {
  const entry = { data, timestamp: Date.now() };
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (e) {
    // QuotaExceeded or security error
  }
  MEMORY_CACHE.set(key, entry);
}

/**
 * Remove a specific key from cache
 */
function removeCacheEntry(key) {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (e) {}
  MEMORY_CACHE.delete(key);
}

/**
 * Deduplicate concurrent asynchronous calls to the same endpoint
 */
function deduplicatedFetch(key, fetchFn) {
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }
  const promise = fetchFn().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}

/**
 * Make a public GET request to Google Apps Script API with timeout
 */
async function fetchPublicAction(action, params = {}) {
  if (!isApiConfigured()) {
    throw new Error('Google Apps Script API is not configured.');
  }

  const url = new URL(API_BASE_URL);
  url.searchParams.set('action', action);
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      url.searchParams.set(k, params[k]);
    }
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12-second safety timeout

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.error || `Failed to fetch action "${action}"`);
    }

    return json.data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export const publicDataService = {
  // --------------------------------------------------------------------------
  // Synchronous Cache Access (Zero-Latency First Paint / Stale-While-Revalidate)
  // --------------------------------------------------------------------------

  /**
   * Synchronously get cached subjects or fall back to static JSON
   */
  getCachedSubjects() {
    const entry = getCacheEntry('subjects');
    if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
      return entry.data;
    }
    return (staticSubjects || []).filter((s) => s.published !== false);
  },

  /**
   * Synchronously get cached classes or fall back to static JSON
   */
  getCachedClasses(subjectId = null) {
    const entry = getCacheEntry('classes');
    let list = [];
    if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
      list = entry.data;
    } else {
      list = (staticClasses || []).filter((c) => c.published !== false);
    }
    if (subjectId) {
      return list.filter((c) => String(c.subjectId) === String(subjectId));
    }
    return list;
  },

  /**
   * Synchronously get cached quizzes or fall back to static JSON
   */
  getCachedQuizzes() {
    const entry = getCacheEntry('quizzes');
    if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
      return entry.data;
    }
    return (staticQuizzes || []).filter((q) => q.published !== false);
  },

  /**
   * Synchronously get cached single quiz by ID
   */
  getCachedQuiz(quizId) {
    const singleEntry = getCacheEntry(`quiz_${quizId}`);
    if (singleEntry && singleEntry.data) {
      return singleEntry.data;
    }
    const all = this.getCachedQuizzes();
    const found = all.find((q) => String(q.id) === String(quizId));
    if (found) {
      return { quiz: found, questions: found.questions || [] };
    }
    const staticFound = (staticQuizzes || []).find((q) => String(q.id) === String(quizId));
    if (staticFound) {
      return { quiz: staticFound, questions: staticFound.questions || [] };
    }
    return null;
  },

  /**
   * Synchronously get cached trainer profile or fall back to static JSON
   */
  getCachedTrainer() {
    const entry = getCacheEntry('trainer');
    if (entry && entry.data && typeof entry.data === 'object') {
      return entry.data;
    }
    return staticTrainer || {};
  },

  // --------------------------------------------------------------------------
  // Asynchronous Hybrid Retrieval (Cache -> Apps Script API -> Fallback)
  // --------------------------------------------------------------------------

  /**
   * Get public subjects (hybrid cached)
   */
  async getPublicSubjects(forceRefresh = false) {
    const entry = getCacheEntry('subjects');
    const isFresh = entry && Date.now() - entry.timestamp < PUBLIC_DATA_CACHE_TTL;

    if (!forceRefresh && isFresh && Array.isArray(entry.data)) {
      return entry.data;
    }

    return deduplicatedFetch('subjects', async () => {
      try {
        const raw = await fetchPublicAction('getSubjects');
        if (Array.isArray(raw)) {
          const published = raw.filter((s) => s.published !== false);
          setCacheEntry('subjects', published);
          return published;
        }
        throw new Error('Subjects data is not an array.');
      } catch (err) {
        console.warn('[publicDataService] Failed to fetch live subjects from Apps Script. Using cached/static fallback.', err.message);
        if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
          return entry.data;
        }
        return (staticSubjects || []).filter((s) => s.published !== false);
      }
    });
  },

  /**
   * Get public classes (hybrid cached, optionally filtered by subjectId)
   */
  async getPublicClasses(subjectId = null, forceRefresh = false) {
    const entry = getCacheEntry('classes');
    const isFresh = entry && Date.now() - entry.timestamp < PUBLIC_DATA_CACHE_TTL;

    if (!forceRefresh && isFresh && Array.isArray(entry.data)) {
      if (subjectId) {
        return entry.data.filter((c) => String(c.subjectId) === String(subjectId));
      }
      return entry.data;
    }

    return deduplicatedFetch('classes', async () => {
      try {
        const raw = await fetchPublicAction('getClasses');
        if (Array.isArray(raw)) {
          const published = raw
            .filter((c) => c.published !== false)
            .sort((a, b) => Number(a.classNumber || 0) - Number(b.classNumber || 0));
          setCacheEntry('classes', published);

          if (subjectId) {
            return published.filter((c) => String(c.subjectId) === String(subjectId));
          }
          return published;
        }
        throw new Error('Classes data is not an array.');
      } catch (err) {
        console.warn('[publicDataService] Failed to fetch live classes from Apps Script. Using cached/static fallback.', err.message);
        let list = [];
        if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
          list = entry.data;
        } else {
          list = (staticClasses || []).filter((c) => c.published !== false);
        }
        if (subjectId) {
          return list.filter((c) => String(c.subjectId) === String(subjectId));
        }
        return list;
      }
    });
  },

  /**
   * Get public quizzes (hybrid cached)
   */
  async getPublicQuizzes(forceRefresh = false) {
    const entry = getCacheEntry('quizzes');
    const isFresh = entry && Date.now() - entry.timestamp < PUBLIC_DATA_CACHE_TTL;

    if (!forceRefresh && isFresh && Array.isArray(entry.data)) {
      return entry.data;
    }

    return deduplicatedFetch('quizzes', async () => {
      try {
        const raw = await fetchPublicAction('getQuizzes');
        if (Array.isArray(raw)) {
          const published = raw.filter((q) => q.published !== false);
          setCacheEntry('quizzes', published);
          return published;
        }
        throw new Error('Quizzes data is not an array.');
      } catch (err) {
        console.warn('[publicDataService] Failed to fetch live quizzes from Apps Script. Using cached/static fallback.', err.message);
        if (entry && Array.isArray(entry.data) && entry.data.length > 0) {
          return entry.data;
        }
        return (staticQuizzes || []).filter((q) => q.published !== false);
      }
    });
  },

  /**
   * Get public single quiz with questions (hybrid cached)
   */
  async getPublicQuiz(quizId, forceRefresh = false) {
    if (!quizId) throw new Error('Quiz ID is required.');
    const key = `quiz_${quizId}`;
    const entry = getCacheEntry(key);
    const isFresh = entry && Date.now() - entry.timestamp < PUBLIC_DATA_CACHE_TTL;

    if (!forceRefresh && isFresh && entry.data) {
      return entry.data;
    }

    return deduplicatedFetch(key, async () => {
      try {
        const data = await fetchPublicAction('getQuiz', { id: quizId });
        if (data && data.quiz) {
          setCacheEntry(key, data);
          return data;
        }
        throw new Error('Quiz data invalid.');
      } catch (err) {
        console.warn(`[publicDataService] Failed to fetch quiz ${quizId}. Using cached/static fallback.`, err.message);
        if (entry && entry.data) {
          return entry.data;
        }
        const cached = this.getCachedQuiz(quizId);
        if (cached) return cached;
        throw err;
      }
    });
  },

  /**
   * Get public trainer profile (hybrid cached)
   */
  async getPublicTrainer(forceRefresh = false) {
    const entry = getCacheEntry('trainer');
    const isFresh = entry && Date.now() - entry.timestamp < PUBLIC_DATA_CACHE_TTL;

    if (!forceRefresh && isFresh && entry.data) {
      return entry.data;
    }

    return deduplicatedFetch('trainer', async () => {
      try {
        const raw = await fetchPublicAction('getTrainerProfile');
        if (raw && typeof raw === 'object') {
          setCacheEntry('trainer', raw);
          return raw;
        }
        throw new Error('Trainer profile data invalid.');
      } catch (err) {
        console.warn('[publicDataService] Failed to fetch trainer profile. Using cached/static fallback.', err.message);
        if (entry && entry.data) {
          return entry.data;
        }
        return staticTrainer || {};
      }
    });
  },

  /**
   * Invalidate browser cache.
   * Called immediately on admin mutations (save/delete class/subject/quiz/profile)
   * so the trainer sees updates immediately on the public website.
   */
  clearPublicCache() {
    removeCacheEntry('subjects');
    removeCacheEntry('classes');
    removeCacheEntry('quizzes');
    removeCacheEntry('trainer');

    // Also clear any cached individual quiz keys from localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}

    MEMORY_CACHE.clear();
  }
};
