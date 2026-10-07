import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Layers, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
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

export const AdminSubjectsPage = () => {
  const [subjects, setSubjects] = useState(null);
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    thumbnailUrl: '',
    published: true
  });
  const [saving, setSaving] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subs, clss] = await Promise.all([
        courseService.getSubjects(true),
        courseService.getClasses(null, true)
      ]);
      const dynamicSubs = courseService.attachDynamicClassCounts(subs, clss);
      setSubjects(dynamicSubs);
      setClasses(clss);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setError(err.message || 'Failed to retrieve subjects from Google Sheets.');
      showError('Failed to load subjects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      thumbnailUrl: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      slug: subject.slug || '',
      description: subject.description || '',
      thumbnailUrl: subject.thumbnailUrl || '',
      published: Boolean(subject.published)
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name) => {
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      // Only auto-update slug if creating or if slug is empty
      slug: !editingSubject ? autoSlug : prev.slug
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      showError('Please enter subject name and slug.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...(editingSubject ? { id: editingSubject.id } : {}),
        ...formData,
        thumbnailUrl: normalizeImageUrl(formData.thumbnailUrl)
      };
      await courseService.saveSubject(payload);
      showSuccess(editingSubject ? 'Subject updated successfully.' : 'Subject created successfully.');
      setIsModalOpen(false);
      await fetchSubjects();
    } catch (err) {
      showError(err.message || 'Unable to save subject.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await courseService.deleteSubject(deleteTarget.id);
      showSuccess(`Subject "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await fetchSubjects();
    } catch (err) {
      showError(err.message || 'Unable to delete subject.');
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (subject) => {
    try {
      await courseService.saveSubject({
        id: subject.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        thumbnailUrl: subject.thumbnailUrl,
        published: !subject.published
      });
      showSuccess(`Subject ${!subject.published ? 'published' : 'unpublished'}.`);
      await fetchSubjects();
    } catch (err) {
      showError(err.message);
    }
  };

  const filteredSubjects = (subjects || []).filter((s) =>
    s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
            Subject Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Create and organize subjects. Class counts update automatically from classes data.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchSubjects} loading={loading}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={openCreateModal}>
            Add New Subject
          </Button>
        </div>
      </div>

      {/* Non-blocking refresh error banner when previous data is preserved */}
      {error && subjects !== null && (
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
                Unable to refresh subjects from Google Sheets.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b45309' }}>
                Showing last known curriculum. ({error})
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchSubjects}
            loading={loading}
            style={{ borderColor: '#d97706', color: '#b45309', flexShrink: 0 }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter subjects by name or slug..."
          maxWidth="380px"
        />
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          {subjects ? `${filteredSubjects.length} subjects found` : '—'}
        </span>
      </div>

      {/* Data Table / States */}
      {loading && subjects === null ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <LoadingSpinner message="Loading curriculum from Google Sheets..." />
        </div>
      ) : error && subjects === null ? (
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
            <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 800 }}>Unable to Load Subjects</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#b91c1c', lineHeight: 1.5 }}>
              {error}
            </p>
            <Button variant="primary" size="md" icon={RefreshCw} onClick={fetchSubjects}>
              Retry Connection
            </Button>
          </div>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchTerm.trim() ? "No matching subjects found" : "No subjects found"}
          description={searchTerm.trim() ? `No subjects match "${searchTerm}".` : "Create your first subject curriculum to begin adding classes and video lectures."}
          actionText={searchTerm.trim() ? undefined : "Add New Subject"}
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
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Slug</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Classes</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#071a2b',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={sub.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'}
                            alt={sub.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#071a2b' }}>{sub.name}</div>
                          <div
                            style={{
                              fontSize: '0.775rem',
                              color: '#64748b',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {sub.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#0ea5e9' }}>
                      /courses/{sub.slug}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 700, color: '#071a2b' }}>{sub.classCount}</span>{' '}
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>classes</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Badge variant={sub.published ? 'success' : 'neutral'} size="sm">
                        {sub.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => handleTogglePublish(sub)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: sub.published ? '#10b981' : '#64748b',
                            cursor: 'pointer'
                          }}
                          title={sub.published ? 'Unpublish Subject' : 'Publish Subject'}
                        >
                          {sub.published ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => openEditModal(sub)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#0ea5e9',
                            cursor: 'pointer'
                          }}
                          title="Edit Subject"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            color: '#ef4444',
                            cursor: 'pointer'
                          }}
                          title="Delete Subject"
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

      {/* Create / Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
        maxWidth="540px"
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Digital Systems"
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
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. digital-systems"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
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
              placeholder="Fundamentals of digital logic, Boolean algebra, combinational and sequential circuits."
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
              Thumbnail Image URL
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
            <ThumbnailPreview url={formData.thumbnailUrl} label="Subject Card Image Preview" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <input
              type="checkbox"
              id="subPublished"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }}
            />
            <label htmlFor="subPublished" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#071a2b', cursor: 'pointer' }}>
              Published (Visible to students)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Classes associated with this subject may become orphaned.`}
        loading={deleting}
      />
    </div>
  );
};
