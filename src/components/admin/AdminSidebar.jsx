import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  HelpCircle,
  UserCheck,
  LogOut,
  ExternalLink,
  Cpu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { APP_CONFIG } from '../../config';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showSuccess('Admin logged out successfully.');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Classes', path: '/admin/classes', icon: GraduationCap },
    { name: 'Quizzes', path: '/admin/quizzes', icon: HelpCircle },
    { name: 'Portfolio', path: '/admin/portfolio', icon: UserCheck }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 26, 43, 0.65)',
            zIndex: 1050,
            display: 'block'
          }}
          className="admin-backdrop"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: '#071a2b',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(14, 165, 233, 0.15)',
          zIndex: 1100,
          transition: 'transform 0.25s ease'
        }}
        className={`admin-sidebar ${isOpen ? 'open' : ''}`}
      >
        {/* Brand header */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <img
                src={APP_CONFIG.assets.logoPlaceholder}
                alt="VLSI Simplified Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>
                Admin Portal
              </span>
              <span style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 600, textTransform: 'uppercase' }}>
                VLSI Simplified
              </span>
            </div>
          </div>

          {/* Close on mobile */}
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'none'
            }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation items */}
        <nav style={{ padding: '20px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? '#0ea5e9' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#38bdf8',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              textDecoration: 'none'
            }}
          >
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#ef4444',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .admin-sidebar {
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              transform: translateX(-100%);
            }
            .admin-sidebar.open {
              transform: translateX(0);
            }
            .sidebar-close-btn {
              display: block !important;
            }
          }
          @media (min-width: 901px) {
            .admin-backdrop {
              display: none !important;
            }
            .admin-sidebar {
              transform: none !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
