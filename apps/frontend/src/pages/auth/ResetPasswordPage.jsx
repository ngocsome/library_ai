import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { resetPassword } from '../../services/authService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Token đặt lại mật khẩu không hợp lệ hoặc bị thiếu.');
      return;
    }

    if (!formData.newPassword.trim()) {
      setMessage('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await resetPassword(token, formData.newPassword);

      setSuccess(true);
      setMessage(response?.message || 'Đặt lại mật khẩu thành công.');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Reset password error:', error);

      setMessage(
        error.response?.data?.message ||
          'Không thể đặt lại mật khẩu. Token có thể đã hết hạn hoặc không hợp lệ.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <Link
          to="/login"
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6"
        >
          <ArrowLeft size={16} />
          Quay lại đăng nhập
        </Link>

        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={34} />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Link không hợp lệ
          </h2>

          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Liên kết đặt lại mật khẩu bị thiếu token hoặc không hợp lệ. Vui lòng
            gửi lại yêu cầu quên mật khẩu.
          </p>

          <Link
            to="/forgot-password"
            className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Gửi lại yêu cầu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/login"
        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6"
      >
        <ArrowLeft size={16} />
        Quay lại đăng nhập
      </Link>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Đặt lại mật khẩu
      </h2>

      <p className="text-center text-gray-500 mb-6 text-sm">
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm flex items-start gap-2 ${
            success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {success ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}

          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu mới
          </label>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang lưu...
            </>
          ) : (
            'Lưu mật khẩu'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;