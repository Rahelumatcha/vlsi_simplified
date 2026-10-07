/**
 * ============================================================================
 * quizService.js - Quizzes & Questions Data Service
 * ============================================================================
 * Public students: Served INSTANTLY from static JSON (quizzes.json)
 * Admin: Direct live connection with Google Apps Script & Google Sheets
 * ============================================================================
 */

import { apiService } from './apiService';
import { authService } from './authService';
import { publicDataService } from './publicDataService';

export const quizService = {
  /**
   * Fetch all quizzes (filtered by published for public students)
   * Public requests use hybrid cached API data with static JSON fallback.
   */
  async getQuizzes(isAdmin = false) {
    if (!isAdmin) {
      return await publicDataService.getPublicQuizzes();
    }
    const adminToken = authService.getAdminToken();
    const quizzes = await apiService.get('getQuizzes', { adminToken });
    if (!Array.isArray(quizzes)) {
      throw new Error('Expected quizzes array from Google Sheets, received invalid format');
    }
    return quizzes;
  },

  /**
   * Fetch a single quiz along with its ordered questions
   */
  async getQuizById(quizId, isAdmin = false) {
    if (!quizId) throw new Error('Quiz ID is required.');

    if (!isAdmin) {
      return await publicDataService.getPublicQuiz(quizId);
    }

    const data = await apiService.get('getQuiz', { id: quizId });
    return data; // { quiz, questions: [...] }
  },

  /**
   * Create or update a quiz along with questions (Admin only, calls Google Apps Script)
   */
  async saveQuiz(quizData) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');

    if (!quizData.title || !quizData.title.trim()) {
      throw new Error('Quiz title is required.');
    }
    if (!quizData.subjectId) {
      throw new Error('Please select an associated subject.');
    }

    let res;
    if (quizData.id) {
      res = await apiService.post('updateQuiz', { id: quizData.id, data: quizData }, adminToken);
    } else {
      res = await apiService.post('createQuiz', { data: quizData }, adminToken);
    }
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Delete quiz and associated questions (Admin only, calls Google Apps Script)
   */
  async deleteQuiz(quizId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    const res = await apiService.post('deleteQuiz', { id: quizId }, adminToken);
    publicDataService.clearPublicCache();
    return res;
  },

  /**
   * Evaluate user quiz submission
   * @param {Array} questions - Array of questions with correctAnswer
   * @param {Object} userAnswers - Map of questionId -> selectedOptionIndex ('A'|'B'|'C'|'D')
   */
  evaluateQuiz(questions = [], userAnswers = {}) {
    let correctCount = 0;
    const totalQuestions = questions.length;
    const optionMap = ['A', 'B', 'C', 'D'];

    const breakdown = questions.map(q => {
      const selected = userAnswers[q.id];
      // Normalize answer comparison (can be 'A' or 0-indexed)
      const correct = String(q.correctAnswer).toUpperCase();
      let selectedChar = selected;
      if (typeof selected === 'number') {
        selectedChar = optionMap[selected];
      }
      const isCorrect = selectedChar === correct;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        selectedAnswer: selectedChar || 'None',
        correctAnswer: correct,
        explanation: q.explanation,
        isCorrect
      };
    });

    const wrongCount = totalQuestions - correctCount;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= 60;

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      percentage,
      passed,
      breakdown
    };
  },

  /**
   * Group and calculate quiz statistics per subject
   * Every published subject produces a Quiz Course Card, even if quizCount is 0.
   * @param {Array} subjects - List of subjects
   * @param {Array} quizzes - List of published quizzes
   * @returns {Array} List of all published subjects, enriched with quiz counts and difficulty stats
   */
  calculateSubjectQuizStats(subjects = [], quizzes = []) {
    const pubQuizzes = (quizzes || []).filter(q => q.published !== false);
    
    return (subjects || [])
      .filter(s => s.published !== false)
      .map(subject => {
        const matchingQuizzes = pubQuizzes.filter(q => String(q.subjectId) === String(subject.id));
        const beginnerCount = matchingQuizzes.filter(q => String(q.difficulty || '').toLowerCase() === 'beginner').length;
        const intermediateCount = matchingQuizzes.filter(q => String(q.difficulty || '').toLowerCase() === 'intermediate').length;
        const advancedCount = matchingQuizzes.filter(q => String(q.difficulty || '').toLowerCase() === 'advanced').length;
        
        return {
          ...subject,
          subjectId: subject.id,
          name: subject.name,
          slug: subject.slug,
          description: subject.description,
          thumbnailUrl: subject.thumbnailUrl,
          totalQuizCount: matchingQuizzes.length,
          quizCount: matchingQuizzes.length,
          beginnerCount,
          intermediateCount,
          advancedCount,
          quizzes: matchingQuizzes
        };
      });
  },

  /**
   * Find any published quizzes that do not match an existing active subject
   */
  getOrphanedQuizzes(subjects = [], quizzes = []) {
    const pubQuizzes = (quizzes || []).filter(q => q.published !== false);
    const subjectIds = new Set((subjects || []).map(s => String(s.id)));
    return pubQuizzes.filter(q => !subjectIds.has(String(q.subjectId)));
  }
};
