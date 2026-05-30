import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// User pages
import ProfilePage from './pages/user/ProfilePage';

// Home page
import HomePage from './pages/home/HomePage';

// Library pages
import LibraryPage from './pages/library/LibraryPage';
import DocumentDetailPage from './pages/library/DocumentDetailPage';
import FavoritesPage from './pages/library/FavoritesPage';

// Forum pages
import ForumPage from './pages/forum/ForumPage';
import CreatePostPage from './pages/forum/CreatePostPage';
import PostDetailPage from './pages/forum/PostDetailPage';

// Group pages
import GroupListPage from './pages/groups/GroupListPage';
import GroupDetailPage from './pages/groups/GroupDetailPage';

// AI pages
import AIChatPage from './pages/ai/AIChatPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminForum from './pages/admin/AdminForum';
import AdminCategories from './pages/admin/AdminCategories';
import AdminGroups from './pages/admin/AdminGroups';
import AdminForumCategories from './pages/admin/AdminForumCategories';

// System pages
import NotificationsPage from './pages/system/NotificationsPage';
import AnalyticsPage from './pages/system/AnalyticsPage';
import ForbiddenPage from './pages/system/ForbiddenPage';
import NotFoundPage from './pages/system/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* User routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/library" element={<LibraryPage />} />
            <Route path="/library/:docId" element={<DocumentDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/create" element={<CreatePostPage />} />
            <Route path="/forum/:postId" element={<PostDetailPage />} />

            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />

            <Route path="/ai" element={<AIChatPage />} />

            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={[1, '1', 'ADMIN', 'ROLE_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/groups" element={<AdminGroups />} />
            <Route path="/admin/forum" element={<AdminForum />} />
            <Route path="/admin/forum-categories" element={<AdminForumCategories />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

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