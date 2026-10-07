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
import staticQuizzes from '../data/quizzes.json';

export const quizService = {
  /**
   * Fetch all quizzes (filtered by published for public students)
   * Public requests load instantly from static JSON without waiting for Google Apps Script.
   */
  async getQuizzes(isAdmin = false) {
    if (!isAdmin) {
      return (staticQuizzes || []).filter(q => q.published !== false);
    }
    const adminToken = authService.getAdminToken();
    const quizzes = await apiService.get('getQuizzes', { adminToken });
    return quizzes || [];
  },

  /**
   * Fetch a single quiz along with its ordered questions
   */
  async getQuizById(quizId, isAdmin = false) {
    if (!quizId) throw new Error('Quiz ID is required.');

    if (!isAdmin) {
      const found = (staticQuizzes || []).find(q => String(q.id) === String(quizId));
      if (found && Array.isArray(found.questions) && found.questions.length > 0) {
        return {
          quiz: {
            id: found.id,
            title: found.title,
            subjectId: found.subjectId,
            description: found.description,
            difficulty: found.difficulty,
            timeLimit: found.timeLimit,
            published: found.published,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt
          },
          questions: found.questions
        };
      }
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

    if (quizData.id) {
      return await apiService.post('updateQuiz', { id: quizData.id, data: quizData }, adminToken);
    } else {
      return await apiService.post('createQuiz', { data: quizData }, adminToken);
    }
  },

  /**
   * Delete quiz and associated questions (Admin only, calls Google Apps Script)
   */
  async deleteQuiz(quizId) {
    const adminToken = authService.getAdminToken();
    if (!adminToken) throw new Error('Unauthorized: Admin login required.');
    return await apiService.post('deleteQuiz', { id: quizId }, adminToken);
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
  }
};
