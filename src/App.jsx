import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Common Public Layout Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ScrollToTop } from './components/common/ScrollToTop';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { SubjectClassesPage } from './pages/SubjectClassesPage';
import { QuizListPage } from './pages/QuizListPage';
import { QuizTakePage } from './pages/QuizTakePage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages & Layout
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSubjectsPage } from './pages/admin/AdminSubjectsPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminQuizzesPage } from './pages/admin/AdminQuizzesPage';
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage';

// Public Layout Wrapper
const PublicLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes with Navbar, Footer, and Floating WhatsApp */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/courses"
              element={
                <PublicLayout>
                  <CoursesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/courses/:slug"
              element={
                <PublicLayout>
                  <SubjectClassesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/quiz"
              element={
                <PublicLayout>
                  <QuizListPage />
                </PublicLayout>
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <PublicLayout>
                  <QuizTakePage />
                </PublicLayout>
              }
            />
            <Route
              path="/workshops"
              element={
                <PublicLayout>
                  <WorkshopsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />

            {/* Discreet Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="subjects" element={<AdminSubjectsPage />} />
              <Route path="classes" element={<AdminClassesPage />} />
              <Route path="quizzes" element={<AdminQuizzesPage />} />
              <Route path="portfolio" element={<AdminPortfolioPage />} />
            </Route>

            {/* 404 Catch All */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
