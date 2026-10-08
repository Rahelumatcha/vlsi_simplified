import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, Eye, EyeOff, Layers, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';

export const AdminQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    description: '',
    difficulty: 'Intermediate',
    timeLimit: 15,
    published: true,
    questions: []
  });
  const [saving, setSaving] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizList, subList] = await Promise.all([
        quizService.getQuizzes(true),
        courseService.getSubjects(true)
      ]);
      setQuizzes(quizList);
      setSubjects(subList);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
      setError(err.message || 'Failed to retrieve quizzes from Google Sheets.');
      showError('Failed to load quizzes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const subjectMap = useMemo(() => {
    const map = {};
    (subjects || []).forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [subjects]);

  const openCreateModal = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      subjectId: '',
      description: '',
      difficulty: 'Intermediate',
      timeLimit: 15,
      published: true,
      questions: [
        {
          id: `QUES-${Date.now()}-1`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 'A',
          explanation: ''
        }
      ]
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (quiz) => {
    try {
      setLoading(true);
      const fullQuiz = await quizService.getQuizById(quiz.id, true);
      setEditingQuiz(fullQuiz.quiz);
      setFormData({
        title: fullQuiz.quiz.title || '',
        subjectId: fullQuiz.quiz.subjectId || '',
        description: fullQuiz.quiz.description || '',
        difficulty: fullQuiz.quiz.difficulty || 'Intermediate',
        timeLimit: fullQuiz.quiz.timeLimit || 15,
        published: Boolean(fullQuiz.quiz.published),
        questions: fullQuiz.questions || []
      });
      setIsModalOpen(true);
    } catch (err) {
      showError('Unable to load quiz details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Question manipulation
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `QUES-${Date.now()}-${prev.questions.length + 1}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 'A',
          explanation: ''
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleQuestionChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      const opts = [...(updated[qIdx].options || ['', '', '', ''])];
      opts[optIdx] = value;
      updated[qIdx] = { ...updated[qIdx], options: opts };
      return { ...prev, questions: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Quiz title is required.');
      return;
    }
    if (!formData.subjectId) {
      showError('Please select a subject from the list.');
      return;
    }
    const validSubject = (subjects || []).find((s) => String(s.id) === String(formData.subjectId));
    if (!validSubject) {
      showError('The selected subject is invalid or no longer exists. Please choose a valid subject.');
      return;
    }
    if (formData.questions.length === 0) {
      showError('A quiz must have at least one question.');
      return;
    }

    // Verify questions have text
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        showError(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      if (!q.options[0]?.trim() || !q.options[1]?.trim()) {
        showError(`Question ${i + 1} must have at least options A and B filled.`);
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        ...(editingQuiz ? { id: editingQuiz.id } : {}),
        ...formData
      };
      await quizService.saveQuiz(payload);
      showSuccess(editingQuiz ? 'Quiz updated successfully.' : 'Quiz created successfully.');
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      showError(err.message || 'Unable to save quiz.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await quizService.deleteQuiz(deleteTarget.id);
      showSuccess(`Quiz "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      showError(err.message || 'Unable to delete quiz.');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (quiz) => {
    try {
      await quizService.saveQuiz({
        id: quiz.id,
        title: quiz.title,
        subjectId: quiz.subjectId,
        description: quiz.description,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        published: !quiz.published
      });
      showSuccess(`Quiz ${!quiz.published ? 'published' : 'unpublished'}.`);
      await fetchData();
    } catch (err) {
      showError(err.message);
    }
  };

  const filteredQuizzes = (quizzes || []).filter(
    (q) =>
      q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
            Quiz & Assessment Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Build timed multiple-choice questionnaires with explanations and difficulty tiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchData} loading={loading}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={openCreateModal}>
            Add New Quiz
          </Button>
        </div>
      </div>

      {/* Non-blocking refresh error banner when previous data is preserved */}
      {error && quizzes !== null && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            color: '#92400e',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                Unable to refresh quizzes from Google Sheets.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Showing last known quizzes catalog. ({error})
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchData}
            loading={loading}
            style={{ borderColor: '#d97706', color: '#b45309', flexShrink: 0 }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search quizzes by title or topic..."
          maxWidth="380px"
        />
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          {quizzes ? `${filteredQuizzes.length} quizzes found` : '—'}
        </span>
      </div>

      {/* Data Table / States */}
      {loading && quizzes === null ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <LoadingSpinner message="Loading quizzes from Google Sheets..." />
        </div>
      ) : error && quizzes === null ? (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '20px auto', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: '16px',
              padding: '32px',
              color: '#991b1b',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.08)'
            }}
          >
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: '#fee2e2', marginBottom: '12px' }}>
              <AlertCircle size={32} color="#dc2626" />
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 800 }}>Unable to Load Quizzes</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#b91c1c', lineHeight: 1.5 }}>
              {error}
            </p>
            <Button variant="primary" size="md" icon={RefreshCw} onClick={fetchData}>
              Retry Connection
            </Button>
          </div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={searchTerm.trim() ? "No matching quizzes found" : "No quizzes found"}
          description={searchTerm.trim() ? `No quizzes match "${searchTerm}".` : "Create your first quiz to evaluate students in Digital Systems or VLSI."}
          actionText={searchTerm.trim() ? undefined : "Add New Quiz"}
          onAction={searchTerm.trim() ? undefined : openCreateModal}
        />
      ) : (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e1effa',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Quiz Title</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Difficulty</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Time Limit</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#071a2b' }}>{quiz.title}</div>
                      <div
                        style={{
                          fontSize: '0.775rem',
                          color: '#64748b',
                          maxWidth: '320px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {quiz.description}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155', fontWeight: 600 }}>
                      {subjectMap[quiz.subjectId] || (
                        <span style={{ color: '#ef4444', fontStyle: 'italic', fontSize: '0.8rem' }}>
                          Subject Removed
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Badge variant="primary" size="sm">
                        {quiz.difficulty || 'Intermediate'}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748b' }}>
                      {quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No Limit'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Badge variant={quiz.published ? 'success' : 'neutral'} size="sm">
                        {quiz.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleTogglePublish(quiz)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: quiz.published ? '#10b981' : '#64748b',
                            cursor: 'pointer'
                          }}
                          title={quiz.published ? 'Unpublish Quiz' : 'Publish Quiz'}
                        >
                          {quiz.published ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => openEditModal(quiz)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#0ea5e9',
                            cursor: 'pointer'
                          }}
                          title="Edit Quiz & Questions"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(quiz)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Delete Quiz"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Quiz Modal with Embedded Question Builder */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuiz ? 'Edit Quiz & Questions' : 'Create New Quiz'}
        maxWidth="750px"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* General Quiz Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Quiz Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Digital Systems Fundamentals"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Associated Subject *
              </label>
              <select
                required
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="">Select Subject ▼</option>
                {(subjects || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {!s.published ? '(Unpublished)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Overview of topics tested in this quiz..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Time Limit (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="quizPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }}
            />
            <label htmlFor="quizPublished" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#071a2b', cursor: 'pointer' }}>
              Published (Visible to students)
            </label>
          </div>

          {/* Embedded Multiple-Choice Question Builder */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#071a2b', margin: 0 }}>
                Questions ({formData.questions.length})
              </h4>
              <Button type="button" variant="outline" size="sm" icon={Plus} onClick={handleAddQuestion}>
                Add Question
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '350px', overflowY: 'auto', paddingRight: '6px' }}>
              {formData.questions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9' }}>
                      Question #{qIdx + 1}
                    </span>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        title="Remove Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <input
                    type="text"
                    required
                    placeholder="Enter question prompt..."
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />

                  {/* 4 Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                      <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', width: '16px' }}>
                          {letter}:
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${letter}`}
                          value={q.options?.[optIdx] || ''}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: '0.85rem',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer & Explanation */}
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', alignItems: 'center' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        Correct Option
                      </label>
                      <select
                        value={q.correctAnswer || 'A'}
                        onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontWeight: 700,
                          color: '#059669',
                          outline: 'none'
                        }}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        Technical Explanation (Shown after completion)
                      </label>
                      <input
                        type="text"
                        placeholder="Why is this answer correct?"
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '0.85rem',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingQuiz ? 'Save Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete quiz "${deleteTarget?.title}"? All associated questions will also be permanently deleted.`}
        loading={deleting}
      />
    </div>
  );
};
