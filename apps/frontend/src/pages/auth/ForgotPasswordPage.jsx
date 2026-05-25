import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { forgotPassword } from '../../services/authService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage('Vui lòng nhập email.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await forgotPassword(trimmedEmail);

      const token =
        response?.token ||
        response?.resetToken ||
        response?.ResetToken ||
        response?.data?.token ||
        response?.data?.resetToken ||
        '';

      if (!token) {
        setMessage(
          response?.message ||
            'Không tìm thấy email trong hệ thống hoặc hệ thống chưa tạo được token đặt lại mật khẩu.'
        );
        return;
      }

      navigate(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (error) {
      console.error('Forgot password error:', error);

      setMessage(
        error.response?.data?.message ||
          'Email không tồn tại trong hệ thống hoặc không thể gửi yêu cầu đặt lại mật khẩu.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        to="/login"
        className="group text-sm font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại</span>
      </Link>

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
          Quên mật khẩu?
        </h2>

        <p className="text-slate-500 text-sm mt-2">
          Nhập email tài khoản để chuyển sang trang đặt lại mật khẩu.
        </p>
      </div>

      {message && (
        <div className="mb-6 bg-rose-50 border border-rose-100/80 text-rose-700 rounded-2xl px-4 py-3 text-sm flex items-start gap-2.5 animate-in fade-in zoom-in-95 duration-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-500" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Email
          </label>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Mail size={18} />
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (message) setMessage('');
              }}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-[inner_0_2px_4px_rgba(0,0,0,0.01)]"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(6,182,212,0.25)] hover:shadow-[0_12px_40px_rgb(6,182,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Đang kiểm tra email...</span>
            </>
          ) : (
            'Tiếp tục'
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
