/**
 * ============================================================================
 * portfolioService.js - Trainer Profile & Dashboard Stats Service
 * ============================================================================
 * Public students: Served INSTANTLY from static JSON (trainer.json)
 * Admin: Direct live connection with Google Apps Script & Google Sheets
 * ============================================================================
 */

import { apiService } from './apiService';
import { authService } from './authService';
import { courseService } from './courseService';
import { quizService } from './quizService';
import { publicDataService } from './publicDataService';

export const portfolioService = {
  /**
   * Fetch trainer profile details
   * Public requests use hybrid cached API data with static JSON fallback.
   */
  async getTrainerProfile(isAdmin = false) {
    if (!isAdmin) {
      return await publicDataService.getPublicTrainer();
    }
    const profile = await apiService.get('getTrainerProfile');
    return profile || {};
  },

  /**
   * Update trainer profile details (Admin only, calls Google Apps Script)
   */
  async updateTrainerProfile(profileData) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    const res = await apiService.post('updateTrainerProfile', { data: profileData }, adminToken);
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Calculate live admin dashboard statistics from real Google Sheets data
   */
  async getDashboardStats() {
    const [subjects, classes, quizzes] = await Promise.all([
      courseService.getSubjects(true),
      courseService.getClasses(null, true),
      quizService.getQuizzes(true)
    ]);

    if (!Array.isArray(subjects) || !Array.isArray(classes) || !Array.isArray(quizzes)) {
      throw new Error('Incomplete or invalid curriculum data received from Google Sheets.');
    }

    const totalSubjects = subjects.length;
    const totalClasses = classes.length;
    const publishedClasses = classes.filter(c => Boolean(c.published)).length;
    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter(q => Boolean(q.published)).length;

    // Sort recent items
    const recentClasses = [...classes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    const recentQuizzes = [...quizzes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    return {
      totalSubjects,
      totalClasses,
      publishedClasses,
      totalQuizzes,
      publishedQuizzes,
      recentClasses,
      recentQuizzes,
      subjects,
      classes,
      quizzes
    };
  }
};
