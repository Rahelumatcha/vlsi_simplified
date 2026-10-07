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
import staticTrainer from '../data/trainer.json';
import { initialTrainerProfile } from '../data/initialTrainerProfile';

export const portfolioService = {
  /**
   * Fetch trainer profile details
   * Public requests load instantly from static JSON without waiting for Google Apps Script.
   */
  async getTrainerProfile(isAdmin = false) {
    if (!isAdmin) {
      return { ...staticTrainer };
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
    return await apiService.post('updateTrainerProfile', { data: profileData }, adminToken);
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
