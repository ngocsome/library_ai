import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// User Pages
import ProfilePage from './pages/user/ProfilePage';

// Library Pages
import LibraryPage from './pages/library/LibraryPage';
import DocumentDetailPage from './pages/library/DocumentDetailPage';
import FavoritesPage from './pages/library/FavoritesPage';

// Forum Pages
import ForumPage from './pages/forum/ForumPage';
import CreatePostPage from './pages/forum/CreatePostPage';
import PostDetailPage from './pages/forum/PostDetailPage';

// Group Pages
import GroupListPage from './pages/groups/GroupListPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';

// AI Pages
import AIChatPage from './pages/ai/AIChatPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminForum from './pages/admin/AdminForum';

// System Pages
import NotificationsPage from './pages/system/NotificationsPage';
import AnalyticsPage from './pages/system/AnalyticsPage';
import NotFoundPage from './pages/system/NotFoundPage';
import ForbiddenPage from './pages/system/ForbiddenPage';

import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Main Application Routes */}
        <Route element={<ProtectedRoute />}>
          {/* General App Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/library" replace />} />
            
            {/* User */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Library */}
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/:docId" element={<DocumentDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Forum */}
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/create" element={<CreatePostPage />} />
            <Route path="/forum/:postId" element={<PostDetailPage />} />

            {/* Groups */}
            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />

            {/* AI */}
            <Route path="/ai" element={<AIChatPage />} />

            {/* System Pages */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
          </Route>

          {/* Admin Layout - Only for Admin (RoleID: 1) */}
          <Route element={<ProtectedRoute allowedRoles={[1]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
              <Route path="/admin/forum" element={<AdminForum />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e293b',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
