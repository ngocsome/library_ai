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

  // INVALID TOKEN STATE SCREEN
  if (!token) {
    return (
      <div>
        {/* Back Link */}
        <Link
          to="/login"
          className="group text-sm font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1.5 mb-6 transition-all duration-300"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại đăng nhập</span>
        </Link>

        <div className="text-center">
          {/* Error Warning Circle */}
          <div className="w-16 h-16 bg-rose-500/5 text-rose-600 border border-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(244,63,94,0.12)]">
            <AlertCircle size={32} className="animate-pulse" />
          </div>

          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3 tracking-tight">
            Link không hợp lệ
          </h2>

          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Liên kết đặt lại mật khẩu bị thiếu token hoặc không hợp lệ. Vui lòng
            gửi lại yêu cầu quên mật khẩu.
          </p>

          {/* Shimmer Button Link */}
          <Link
            to="/forgot-password"
            className="relative w-full group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_8px_30px_rgb(6,182,212,0.25)] hover:shadow-[0_12px_40px_rgb(6,182,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span>Gửi lại yêu cầu</span>
          </Link>
        </div>
      </div>
    );
  }

  // DEFAULT FORM STATE SCREEN
  return (
    <div>
      {/* Top Back Link */}
      <Link
        to="/login"
        className="group text-sm font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1.5 mb-6 transition-all duration-300"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại đăng nhập</span>
      </Link>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
          Đặt lại mật khẩu
        </h2>

        <p className="text-slate-500 text-sm mt-2">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {/* Cybernetic High-Tech Alert Banner (Success/Error) */}
      {message && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-300 border ${
            success
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 font-semibold'
              : 'bg-rose-50 border-rose-100 text-rose-700 font-semibold'
          }`}
        >
          {success ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500 animate-pulse" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
          )}

          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password Input Group */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Mật khẩu mới
          </label>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Lock size={18} />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-[inner_0_2px_4px_rgba(0,0,0,0.01)]"
              placeholder="••••••••"
            />

            {/* Toggle Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:scale-95 transition-all p-1 rounded-lg hover:bg-slate-100/80"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input Group */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Xác nhận mật khẩu mới
          </label>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Lock size={18} />
            </div>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-[inner_0_2px_4px_rgba(0,0,0,0.01)]"
              placeholder="••••••••"
            />

            {/* Toggle Visibility */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 active:scale-95 transition-all p-1 rounded-lg hover:bg-slate-100/80"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Shimmer Sweep Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="relative w-full group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(6,182,212,0.25)] hover:shadow-[0_12px_40px_rgb(6,182,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          {/* Holographic sweep light effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Đang lưu mật khẩu mới...</span>
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