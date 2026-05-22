import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Component bảo vệ route theo đăng nhập và phân quyền.
 *
 * allowedRoles:
 * - []: chỉ cần đăng nhập
 * - [1]: chỉ admin
 *
 * Quy ước:
 * - Chưa đăng nhập -> /login
 * - Đăng nhập nhưng không đủ quyền -> /403
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-sm text-slate-500">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = Number(
      user.RoleID ??
        user.roleID ??
        user.roleId ??
        user.RoleId ??
        user.role
    );

    const isAllowed = allowedRoles.map(Number).includes(userRole);

    if (!isAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;