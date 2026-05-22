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
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={34} />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Kiểm tra email
        </h2>

        <p className="text-gray-600 mb-5 text-sm leading-relaxed">
          {message ||
            'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.'}
        </p>

        {resetToken && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 text-sm mb-5 text-left break-all">
            <p className="font-semibold mb-1">Token test:</p>

            <p>{resetToken}</p>

            <Link
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="inline-block mt-3 text-brand-green font-semibold hover:underline"
            >
              Đi tới trang đặt lại mật khẩu
            </Link>
          </div>
        )}

        {!resetToken && (
          <p className="text-xs text-gray-400 mb-5">
            Nếu không thấy email, hãy kiểm tra thư mục spam hoặc thử lại sau vài
            phút.
          </p>
        )}

        <Link
          to="/login"
          className="text-brand-green font-medium hover:underline flex items-center justify-center gap-2"
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
        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-6"
      >
        <ArrowLeft size={16} />
        Quay lại
      </Link>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Quên mật khẩu?
      </h2>

      <p className="text-center text-gray-500 mb-6 text-sm">
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
      </p>

      {message && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
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