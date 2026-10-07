/**
 * ============================================================================
 * courseService.js - Subjects & Classes High-Level Data Service
 * ============================================================================
 * Public students: Served INSTANTLY from static JSON (subjects.json, classes.json)
 * Admin: Direct live connection with Google Apps Script & Google Sheets
 * ============================================================================
 */

import { apiService } from './apiService';
import { authService } from './authService';
import { publicDataService } from './publicDataService';

export const courseService = {
  /**
   * Fetch all subjects (filtered by published for public students)
   * Public requests use hybrid cached API data with static JSON fallback.
   */
  async getSubjects(isAdmin = false) {
    if (!isAdmin) {
      return await publicDataService.getPublicSubjects();
    }
    const adminToken = authService.getAdminToken();
    const subjects = await apiService.get('getSubjects', { adminToken });
    if (!Array.isArray(subjects)) {
      throw new Error('Expected subjects array from Google Sheets, received invalid format');
    }
    return subjects;
  },

  /**
   * Fetch single subject by slug
   */
  async getSubjectBySlug(slug, isAdmin = false) {
    if (!slug) return null;
    const cleanSlug = String(slug).toLowerCase().trim();
    const subjects = await this.getSubjects(isAdmin);
    return (
      subjects.find(
        s =>
          (s.slug || '').toLowerCase().trim() === cleanSlug ||
          String(s.id).toLowerCase() === cleanSlug ||
          (s.name || '').toLowerCase().replace(/\s+/g, '-').trim() === cleanSlug
      ) || null
    );
  },

  /**
   * Fetch classes, optionally filtered by subjectId
   * Public requests use hybrid cached API data with static JSON fallback.
   */
  async getClasses(subjectId = null, isAdmin = false) {
    if (!isAdmin) {
      return await publicDataService.getPublicClasses(subjectId);
    }

    const adminToken = authService.getAdminToken();
    const params = { adminToken };
    if (subjectId) params.subjectId = subjectId;
    const classes = await apiService.get('getClasses', params);
    if (!Array.isArray(classes)) {
      throw new Error('Expected classes array from Google Sheets, received invalid format');
    }
    return classes;
  },

  /**
   * Dynamically calculate published class counts for each subject
   * Do NOT use hardcoded class counts.
   */
  attachDynamicClassCounts(subjects = [], classes = []) {
    return subjects.map(subject => {
      const matchingClasses = classes.filter(
        cls => String(cls.subjectId) === String(subject.id) && Boolean(cls.published)
      );
      return {
        ...subject,
        classCount: matchingClasses.length
      };
    });
  },

  /**
   * Validate YouTube URL format
   * Accepts: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
   */
  isValidYouTubeUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
    return pattern.test(url.trim());
  },

  /**
   * Validate Google Drive URL format
   */
  isValidGoogleDriveUrl(url) {
    if (!url || typeof url !== 'string' || !url.trim()) return true; // Optional field
    return url.includes('drive.google.com') || url.includes('docs.google.com');
  },

  /**
   * Create or update subject (Admin only, calls Google Apps Script)
   */
  async saveSubject(subjectData) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');

    if (!subjectData.name || !subjectData.name.trim()) {
      throw new Error('Subject name is required.');
    }
    if (!subjectData.slug || !subjectData.slug.trim()) {
      throw new Error('Subject slug is required.');
    }

    let res;
    if (subjectData.id) {
      res = await apiService.post('updateSubject', { id: subjectData.id, data: subjectData }, adminToken);
    } else {
      res = await apiService.post('createSubject', { data: subjectData }, adminToken);
    }
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Delete subject (Admin only, calls Google Apps Script)
   */
  async deleteSubject(subjectId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    const res = await apiService.post('deleteSubject', { id: subjectId }, adminToken);
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Create or update class (Admin only, calls Google Apps Script)
   */
  async saveClass(classData) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');

    if (!classData.subjectId) {
      throw new Error('Please select a subject.');
    }
    if (!classData.title || !classData.title.trim()) {
      throw new Error('Class title is required.');
    }
    if (!classData.youtubeUrl || !this.isValidYouTubeUrl(classData.youtubeUrl)) {
      throw new Error('Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=... or https://youtu.be/...).');
    }
    if (classData.notesUrl && !this.isValidGoogleDriveUrl(classData.notesUrl)) {
      throw new Error('Please enter a valid Google Drive link (e.g., https://drive.google.com/...).');
    }

    let res;
    if (classData.id) {
      res = await apiService.post('updateClass', { id: classData.id, data: classData }, adminToken);
    } else {
      res = await apiService.post('createClass', { data: classData }, adminToken);
    }
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Delete class (Admin only, calls Google Apps Script)
   */
  async deleteClass(classId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    const res = await apiService.post('deleteClass', { id: classId }, adminToken);
    publicDataService.clearPublicCache();
    return res;
  }
};
