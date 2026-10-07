import React, { useEffect, useState } from 'react';
import { Save, User, Mail, Youtube, Linkedin, Award, BookOpen, Layers } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { Button } from '../../components/common/Button';
import { ThumbnailPreview } from '../../components/admin/ThumbnailPreview';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const AdminPortfolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    trainerName: '',
    designation: '',
    bio: '',
    profileImage: '',
    email: '',
    youtube: '',
    linkedin: '',
    yearsExperience: '',
    studentsCount: '',
    totalClassesCount: '',
    subjectsTaught: '',
    teachingPhilosophy: ''
  });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await portfolioService.getTrainerProfile(true);
        if (data) {
          setFormData({
            trainerName: data.trainerName || '',
            designation: data.designation || '',
            bio: data.bio || '',
            profileImage: data.profileImage || '',
            email: data.email || '',
            youtube: data.youtube || '',
            linkedin: data.linkedin || '',
            yearsExperience: data.yearsExperience || '12+',
            studentsCount: data.studentsCount || '15,000+',
            totalClassesCount: data.totalClassesCount || '100+',
            subjectsTaught: data.subjectsTaught || '5+',
            teachingPhilosophy: data.teachingPhilosophy || ''
          });
        }
      } catch (err) {
        showError('Failed to load portfolio details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await portfolioService.updateTrainerProfile({
        ...formData,
        profileImage: normalizeImageUrl(formData.profileImage)
      });
      showSuccess('Trainer profile updated successfully in Google Sheets.');
    } catch (err) {
      showError(err.message || 'Unable to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading trainer profile configuration..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
          Trainer Profile & Portfolio Settings
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Update public biography, social links, homepage statistics, and pedagogical philosophy.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #e1effa',
          boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Basic Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Trainer Full Name *
            </label>
            <input
              type="text"
              required
              name="trainerName"
              value={formData.trainerName}
              onChange={handleChange}
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
              Professional Title / Designation *
            </label>
            <input
              type="text"
              required
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Principal VLSI Architect & Technical Educator"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Short Biography (Hero & About overview)
          </label>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
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

        {/* Profile Image with preview */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Profile Avatar Image URL
          </label>
          <input
            type="url"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              outline: 'none'
            }}
          />
          <div style={{ maxWidth: '240px' }}>
            <ThumbnailPreview url={formData.profileImage} label="Profile Picture Preview" />
          </div>
        </div>

        {/* Social / Contact Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Public Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              YouTube Channel URL
            </label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/@..."
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
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Stats Numbers */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#071a2b', marginBottom: '14px' }}>
            Homepage Stats Indicators
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Years Experience
              </label>
              <input
                type="text"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Students Count
              </label>
              <input
                type="text"
                name="studentsCount"
                value={formData.studentsCount}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Total Classes Display
              </label>
              <input
                type="text"
                name="totalClassesCount"
                value={formData.totalClassesCount}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Subjects Taught Display
              </label>
              <input
                type="text"
                name="subjectsTaught"
                value={formData.subjectsTaught}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Teaching Philosophy */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Teaching Philosophy
          </label>
          <textarea
            rows={3}
            name="teachingPhilosophy"
            value={formData.teachingPhilosophy}
            onChange={handleChange}
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

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <Button type="submit" variant="primary" size="md" icon={Save} loading={saving}>
            Save Portfolio Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
