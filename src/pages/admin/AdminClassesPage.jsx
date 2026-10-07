import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Youtube, FileText, ExternalLink, Eye, EyeOff, GraduationCap, RefreshCw, AlertCircle } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { ThumbnailPreview } from '../../components/admin/ThumbnailPreview';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const AdminClassesPage = () => {
  const [classes, setClasses] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    classNumber: 1,
    title: '',
    description: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    notesUrl: '',
    published: true
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
      const [classList, subjectList] = await Promise.all([
        courseService.getClasses(null, true),
        courseService.getSubjects(true)
      ]);
      setClasses(classList);
      setSubjects(subjectList);
    } catch (err) {
      console.error('Failed to load classes:', err);
      setError(err.message || 'Failed to retrieve classes from Google Sheets.');
      showError('Failed to load classes: ' + err.message);
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
    setEditingClass(null);
    // Find highest class number for current or first subject
    const subList = subjects || [];
    const clsList = classes || [];
    const defaultSub = selectedSubjectId !== 'ALL' ? selectedSubjectId : subList[0]?.id || '';
    const existingForSub = clsList.filter((c) => String(c.subjectId) === String(defaultSub));
    const nextNumber = existingForSub.length + 1;

    setFormData({
      subjectId: defaultSub,
      classNumber: nextNumber,
      title: '',
      description: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      notesUrl: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      subjectId: cls.subjectId || '',
      classNumber: cls.classNumber || 1,
      title: cls.title || '',
      description: cls.description || '',
      youtubeUrl: cls.youtubeUrl || '',
      thumbnailUrl: cls.thumbnailUrl || '',
      notesUrl: cls.notesUrl || '',
      published: Boolean(cls.published)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.subjectId) {
      showError('Please select a subject.');
      return;
    }
    if (!formData.title.trim()) {
      showError('Class title is required.');
      return;
    }
    if (!courseService.isValidYouTubeUrl(formData.youtubeUrl)) {
      showError('Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).');
      return;
    }
    if (formData.notesUrl && !courseService.isValidGoogleDriveUrl(formData.notesUrl)) {
      showError('Please enter a valid Google Drive URL for notes.');
      return;
    }

    try {
      setSaving(true);
      const resolvedThumb = formData.thumbnailUrl?.trim()
        ? normalizeImageUrl(formData.thumbnailUrl)
        : '';

      const payload = {
        ...(editingClass ? { id: editingClass.id } : {}),
        ...formData,
        thumbnailUrl: resolvedThumb,
        classNumber: Number(formData.classNumber || 1)
      };

      await courseService.saveClass(payload);
      showSuccess(editingClass ? 'Class updated successfully.' : 'Class created successfully.');
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      showError(err.message || 'Unable to save class.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await courseService.deleteClass(deleteTarget.id);
      showSuccess(`Class "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      showError(err.message || 'Unable to delete class.');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (cls) => {
    try {
      await courseService.saveClass({
        id: cls.id,
        subjectId: cls.subjectId,
        classNumber: cls.classNumber,
        title: cls.title,
        description: cls.description,
        youtubeUrl: cls.youtubeUrl,
        thumbnailUrl: cls.thumbnailUrl,
        notesUrl: cls.notesUrl,
        published: !cls.published
      });
      showSuccess(`Class ${!cls.published ? 'published' : 'unpublished'}.`);
      await fetchData();
    } catch (err) {
      showError(err.message);
    }
  };

  // Filtered classes
  const filteredClasses = (classes || []).filter((cls) => {
    const matchSub = selectedSubjectId === 'ALL' || String(cls.subjectId) === String(selectedSubjectId);
    const matchStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'PUBLISHED' && cls.published) ||
      (selectedStatus === 'DRAFT' && !cls.published);
    const matchSearch =
      cls.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cls.classNumber).includes(searchTerm);
    return matchSub && matchStatus && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
            Class & Lecture Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Manage YouTube video links, Google Drive notes, class numbers, and thumbnails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchData} loading={loading}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={openCreateModal}>
            Add New Class
          </Button>
        </div>
      </div>

      {/* Non-blocking refresh error banner when previous data is preserved */}
      {error && classes !== null && (
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
                Unable to refresh classes from Google Sheets.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Showing last known classes catalog. ({error})
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

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e1effa'
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter by class title or number..."
          maxWidth="320px"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Subject Filter */}
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#071a2b',
              outline: 'none'
            }}
          >
            <option value="ALL">All Subjects</option>
            {(subjects || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              color: '#071a2b',
              outline: 'none'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>

          <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
            {classes ? `${filteredClasses.length} of ${classes.length} classes` : '—'}
          </span>
        </div>
      </div>

      {/* Data Table / States */}
      {loading && classes === null ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <LoadingSpinner message="Loading classes catalog from Google Sheets..." />
        </div>
      ) : error && classes === null ? (
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
            <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 800 }}>Unable to Load Classes</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#b91c1c', lineHeight: 1.5 }}>
              {error}
            </p>
            <Button variant="primary" size="md" icon={RefreshCw} onClick={fetchData}>
              Retry Connection
            </Button>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={searchTerm.trim() || selectedSubjectId !== 'ALL' || selectedStatus !== 'ALL' ? "No matching classes found" : "No classes found"}
          description={searchTerm.trim() || selectedSubjectId !== 'ALL' || selectedStatus !== 'ALL' ? "No classes match your search or filter criteria." : "Create your first class by linking a YouTube URL and optional Google Drive notes."}
          actionText={searchTerm.trim() || selectedSubjectId !== 'ALL' || selectedStatus !== 'ALL' ? undefined : "Add New Class"}
          onAction={searchTerm.trim() || selectedSubjectId !== 'ALL' || selectedStatus !== 'ALL' ? undefined : openCreateModal}
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
                  <th style={{ padding: '14px 18px', fontWeight: 700, width: '90px' }}>#</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Class Details</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Links</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#071a2b',
                          color: '#38bdf8',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {String(cls.classNumber).padStart(2, '0')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '34px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#071a2b',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={cls.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80'}
                            alt={cls.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#071a2b' }}>{cls.title}</div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#64748b',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {cls.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                        {subjectMap[cls.subjectId] || 'Unassigned'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <a
                          href={cls.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#ff0000', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                          title="Open YouTube Video"
                        >
                          <Youtube size={15} />
                          <span>Video</span>
                        </a>
                        {cls.notesUrl ? (
                          <a
                            href={cls.notesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                            title="Open Google Drive Notes"
                          >
                            <FileText size={15} />
                            <span>Notes</span>
                          </a>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>No Notes</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Badge variant={cls.published ? 'success' : 'neutral'} size="sm">
                        {cls.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleTogglePublish(cls)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: cls.published ? '#10b981' : '#64748b',
                            cursor: 'pointer'
                          }}
                          title={cls.published ? 'Unpublish Class' : 'Publish Class'}
                        >
                          {cls.published ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => openEditModal(cls)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#0ea5e9',
                            cursor: 'pointer'
                          }}
                          title="Edit Class"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cls)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Delete Class"
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

      {/* Create / Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Class' : 'Add New Class'}
        maxWidth="560px"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Subject *
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
                <option value="">Select a Subject</option>
                {(subjects || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Class # *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.classNumber}
                onChange={(e) => setFormData({ ...formData, classNumber: e.target.value })}
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

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Class Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Introduction to Digital Systems & Binary Logic"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of topics covered in this lecture video..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              YouTube URL *
            </label>
            <input
              type="url"
              required
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Students will be redirected to YouTube in a new tab when clicked. Never embedded.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Google Drive Notes URL (Optional)
            </label>
            <input
              type="url"
              value={formData.notesUrl}
              onChange={(e) => setFormData({ ...formData, notesUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/.../view"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Leave blank to display "Notes coming soon" on public card.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Thumbnail Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
            <ThumbnailPreview url={formData.thumbnailUrl} label="Class Card Thumbnail Preview" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="clsPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }}
            />
            <label htmlFor="clsPublished" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#071a2b', cursor: 'pointer' }}>
              Published (Visible to students)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingClass ? 'Save Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        loading={deleting}
      />
    </div>
  );
};
