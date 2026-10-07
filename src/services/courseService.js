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
import staticSubjects from '../data/subjects.json';
import staticClasses from '../data/classes.json';

export const courseService = {
  /**
   * Fetch all subjects (filtered by published for public students)
   * Public requests load instantly from static JSON without waiting for Google Apps Script.
   */
  async getSubjects(isAdmin = false) {
    if (!isAdmin) {
      return (staticSubjects || []).filter(s => s.published !== false);
    }
    const adminToken = authService.getAdminToken();
    const subjects = await apiService.get('getSubjects', { adminToken });
    return subjects || [];
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
   * Public requests load instantly from static JSON without waiting for Google Apps Script.
   */
  async getClasses(subjectId = null, isAdmin = false) {
    if (!isAdmin) {
      let list = (staticClasses || []).filter(c => c.published !== false);
      if (subjectId) {
        list = list.filter(c => String(c.subjectId) === String(subjectId));
      }
      return list;
    }

    const adminToken = authService.getAdminToken();
    const params = { adminToken };
    if (subjectId) params.subjectId = subjectId;
    const classes = await apiService.get('getClasses', params);
    return classes || [];
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

    if (subjectData.id) {
      return await apiService.post('updateSubject', { id: subjectData.id, data: subjectData }, adminToken);
    } else {
      return await apiService.post('createSubject', { data: subjectData }, adminToken);
    }
  },

  /**
   * Delete subject (Admin only, calls Google Apps Script)
   */
  async deleteSubject(subjectId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    return await apiService.post('deleteSubject', { id: subjectId }, adminToken);
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

    if (classData.id) {
      return await apiService.post('updateClass', { id: classData.id, data: classData }, adminToken);
    } else {
      return await apiService.post('createClass', { data: classData }, adminToken);
    }
  },

  /**
   * Delete class (Admin only, calls Google Apps Script)
   */
  async deleteClass(classId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    return await apiService.post('deleteClass', { id: classId }, adminToken);
  }
};
