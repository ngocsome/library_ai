import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { forgotPassword } from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');

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
      setResetToken('');

      const response = await forgotPassword(trimmedEmail);

      setMessage(
        response?.message ||
          'Nếu email tồn tại, hệ thống đã tạo yêu cầu đặt lại mật khẩu.'
      );

      if (response?.token) {
        setResetToken(response.token);
      }

      setSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);

      setMessage(
        error.response?.data?.message ||
          'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 size={34} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Kiểm tra email
        </h2>

        <p className="text-slate-600 mb-8 text-sm leading-relaxed">
          {message ||
            'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.'}
        </p>

        {resetToken && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-4 text-sm mb-8 text-left break-all">
            <p className="font-semibold mb-2">Token test:</p>

            <p className="text-xs bg-white border border-amber-200 rounded-lg p-3 mb-3">{resetToken}</p>

            <Link
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="inline-block text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
            >
              Đi tới trang đặt lại mật khẩu
            </Link>
          </div>
        )}

        {!resetToken && (
          <p className="text-xs text-slate-500 mb-8">
            Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử lại sau vài
            phút.
          </p>
        )}

        <Link
          to="/login"
          className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/login"
        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Quay lại
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tight">
          Quên mật khẩu?
        </h2>

        <p className="text-center text-slate-600 text-sm">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      {message && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Email
          </label>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang gửi...
            </>
          ) : (
            'Gửi yêu cầu'
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
