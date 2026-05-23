import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const usernameOrEmail = formData.get('usernameOrEmail');
    const password = formData.get('password');

    try {
      const result = await login(usernameOrEmail, password);

      if (result.success) {
        navigate('/library');
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tight">
          Đăng nhập
        </h2>
        <p className="text-center text-slate-600 text-sm">
          Truy cập thư viện của bạn để bắt đầu học tập
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 text-center border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Tài khoản
          </label>

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              name="usernameOrEmail"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="Username hoặc Email"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-900">
              Mật khẩu
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="password"
              name="password"
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="••••••••"
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
              Vui lòng chờ...
            </>
          ) : (
            <>
              Đăng nhập
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
