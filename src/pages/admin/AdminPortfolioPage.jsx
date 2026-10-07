import React, { useEffect, useState } from 'react';
import { Save, User, Mail, Youtube, Linkedin, Award, BookOpen, Layers, Sparkles, HelpCircle, Briefcase, BarChart2 } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { courseService } from '../../services/courseService';
import { Button } from '../../components/common/Button';
import { ThumbnailPreview } from '../../components/admin/ThumbnailPreview';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const AdminPortfolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSubjectsCount, setActiveSubjectsCount] = useState(0);
  const [formData, setFormData] = useState({
    trainerName: '',
    designation: '',
    bio: '',
    fullBiography: '',
    profileImage: '',
    experienceHeadline: '',
    industryFocus: '',
    yearsExperience: '',
    teachingPhilosophy: '',
    studentsCount: '',
    totalClassesCount: '',
    email: '',
    youtube: '',
    linkedin: ''
  });

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchProfileAndSubjects = async () => {
      try {
        setLoading(true);
        const [data, subjects] = await Promise.all([
          portfolioService.getTrainerProfile(true),
          courseService.getSubjects(true)
        ]);

        if (Array.isArray(subjects)) {
          setActiveSubjectsCount(subjects.filter(s => Boolean(s.published)).length);
        }

        if (data) {
          setFormData({
            trainerName: data.trainerName || '',
            designation: data.designation || '',
            bio: data.bio || '',
            fullBiography: data.fullBiography || '',
            profileImage: data.profileImage || '',
            experienceHeadline: data.experienceHeadline || '10+ Years Semiconductor & Teaching Experience',
            industryFocus: data.industryFocus || 'Design & Verification',
            yearsExperience: data.yearsExperience || '12+',
            teachingPhilosophy: data.teachingPhilosophy || '',
            studentsCount: data.studentsCount || '15,000+',
            totalClassesCount: data.totalClassesCount || '100+',
            email: data.email || '',
            youtube: data.youtube || '',
            linkedin: data.linkedin || ''
          });
        }
      } catch (err) {
        showError('Failed to load portfolio details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndSubjects();
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '940px' }}>
      <div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
          Trainer Profile & Website Content Settings
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
          Manage all trainer branding, biography, experience credentials, statistics, and social links displayed across the public website.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}
      >
        {/* ========================================================================= */}
        {/* SECTION 1: TRAINER INFORMATION                                            */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
                Trainer Information
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Core personal identity, designation, biographies, and avatar photograph
              </p>
            </div>
          </div>

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
                placeholder="e.g. Sanath Kannam"
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
              Short Biography (Hero & Homepage About overview)
            </label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Concise overview of trainer mission and focus areas shown on the homepage..."
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

          {/* Full Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Full Biography (Displayed on About page)
            </label>
            <textarea
              rows={4}
              name="fullBiography"
              value={formData.fullBiography}
              onChange={handleChange}
              placeholder="In-depth pedagogical background, technical expertise, and career journey..."
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
              placeholder="https://res.cloudinary.com/..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                outline: 'none'
              }}
            />
            <div style={{ maxWidth: '240px', marginTop: '10px' }}>
              <ThumbnailPreview url={formData.profileImage} label="Profile Picture Preview" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: PROFESSIONAL INFORMATION                                       */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
                Professional Information
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Headline credentials, core domain focus, and pedagogical approach
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Experience Headline *
              </label>
              <input
                type="text"
                required
                name="experienceHeadline"
                value={formData.experienceHeadline}
                onChange={handleChange}
                placeholder="e.g. 10+ Years Semiconductor & Teaching Experience"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Shown on Homepage trainer badge and About page credentials bar.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Industry Focus *
              </label>
              <input
                type="text"
                required
                name="industryFocus"
                value={formData.industryFocus}
                onChange={handleChange}
                placeholder="e.g. Design & Verification"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Shown on Homepage Quick Metrics bar and About page overview.
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Years Experience Display
              </label>
              <input
                type="text"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                placeholder="e.g. 12+ or 10+"
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

          {/* Teaching Philosophy */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Teaching Philosophy
            </label>
            <textarea
              rows={3}
              name="teachingPhilosophy"
              value={formData.teachingPhilosophy}
              onChange={handleChange}
              placeholder="Educational philosophy on teaching silicon concepts, waveforms, and testbenches..."
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
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: STATISTICS INDICATORS                                          */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
                Homepage & About Statistics Indicators
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Control learners count, class counts, and curriculum metric indicators
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Students Count (Learners Taught)
              </label>
              <input
                type="text"
                name="studentsCount"
                value={formData.studentsCount}
                onChange={handleChange}
                placeholder="e.g. 5,000+ or 15,000+"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Used in Homepage hero stats and About trainer metrics bar.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Total Classes Display (YouTube Lectures)
              </label>
              <input
                type="text"
                name="totalClassesCount"
                value={formData.totalClassesCount}
                onChange={handleChange}
                placeholder="e.g. 700+ or 100+"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                Used in Homepage Free Tutorials counter and YouTube Lectures metric.
              </span>
            </div>
          </div>

          {/* Informational banner on Subjects Count */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Layers size={18} color="#0284c7" />
            <span>
              <strong>Subjects Count Auto-Sync:</strong> The "VLSI Topics" indicator on the public homepage is automatically computed from your published Subjects in Google Sheets (currently <strong>{activeSubjectsCount} published subjects</strong>).
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: CONTACT & SOCIAL LINKS                                         */}
        {/* ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
                Contact & Social Links
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                Public communication endpoints, YouTube community channel, and professional LinkedIn
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Public Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. contact@vlsisimplified.com"
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
                placeholder="https://www.youtube.com/@VLSI_Simlified"
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
                placeholder="https://www.linkedin.com/in/..."
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
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <Button type="submit" variant="primary" size="lg" icon={Save} loading={saving}>
            Save Portfolio Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
