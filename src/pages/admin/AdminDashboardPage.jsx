import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  HelpCircle,
  CheckCircle2,
  Plus,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { publishService } from '../../services/publishService';
import { StatsCard } from '../../components/admin/StatsCard';
import { PublishStatusCard } from '../../components/admin/PublishStatusCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [data, pub] = await Promise.all([
        portfolioService.getDashboardStats(),
        publishService.getPublishStatus()
      ]);
      setStats(data);
      setPublishStatus(pub);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return <LoadingSpinner message="Calculating dashboard statistics..." />;
  }

  const s = stats || {
    totalSubjects: 0,
    totalClasses: 0,
    publishedClasses: 0,
    totalQuizzes: 0,
    publishedQuizzes: 0,
    recentClasses: [],
    recentQuizzes: []
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Welcome & Quick Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#071a2b', margin: 0 }}>
            Dashboard Overview
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0' }}>
            Real-time curriculum metrics and student learning resources.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchStats} loading={loading}>
            Refresh
          </Button>
          <Link to="/admin/classes">
            <Button variant="primary" size="sm" icon={Plus}>
              Add Class
            </Button>
          </Link>
          <Link to="/admin/subjects">
            <Button variant="secondary" size="sm" icon={Plus}>
              Add Subject
            </Button>
          </Link>
          <Link to="/admin/quizzes">
            <Button variant="outline" size="sm" icon={Plus}>
              Add Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Production Publish & Automated Deployment Card */}
      <PublishStatusCard
        statusData={publishStatus}
        onRefresh={fetchStats}
        isLoading={loading}
      />

      {/* Metrics Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '18px'
        }}
      >
        <StatsCard
          title="Total Subjects"
          value={s.totalSubjects}
          subtitle="Curriculum domains"
          icon={BookOpen}
          variant="primary"
        />
        <StatsCard
          title="Total Classes"
          value={s.totalClasses}
          subtitle="YouTube linked lectures"
          icon={GraduationCap}
          variant="primary"
        />
        <StatsCard
          title="Published Classes"
          value={s.publishedClasses}
          subtitle={`${Math.round((s.publishedClasses / (s.totalClasses || 1)) * 100)}% live for students`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="Total Quizzes"
          value={s.totalQuizzes}
          subtitle="Self-assessment tests"
          icon={HelpCircle}
          variant="warning"
        />
        <StatsCard
          title="Published Quizzes"
          value={s.publishedQuizzes}
          subtitle="Active on student portal"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Recent Activity Sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Recent Classes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b', margin: 0 }}>
              Recent Classes Added
            </h3>
            <Link to="/admin/classes" style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 600 }}>
              Manage All
            </Link>
          </div>

          {s.recentClasses.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No classes recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {s.recentClasses.map((cls) => (
                <div
                  key={cls.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#071a2b',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}
                    >
                      Class {cls.classNumber}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#071a2b' }}>
                        {cls.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {cls.notesUrl ? 'Notes Attached' : 'No Notes'}
                      </div>
                    </div>
                  </div>

                  <Badge variant={cls.published ? 'success' : 'neutral'} size="sm">
                    {cls.published ? 'Live' : 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e1effa',
            boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b', margin: 0 }}>
              Recent Quizzes Added
            </h3>
            <Link to="/admin/quizzes" style={{ fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 600 }}>
              Manage All
            </Link>
          </div>

          {s.recentQuizzes.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No quizzes recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {s.recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#071a2b' }}>
                      {quiz.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Difficulty: {quiz.difficulty || 'Intermediate'}
                    </div>
                  </div>

                  <Badge variant={quiz.published ? 'success' : 'neutral'} size="sm">
                    {quiz.published ? 'Live' : 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
