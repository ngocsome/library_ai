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
        navigate('/home', { replace: true });
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
      <div className="mb-8 text-center relative">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
          Đăng nhập
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Học tập và nghiên cứu đỉnh cao cùng Trí tuệ nhân tạo
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100/80 p-4 rounded-2xl text-sm mb-6 text-rose-700 animate-in fade-in zoom-in-95 duration-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Tài khoản
          </label>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Mail size={18} />
            </div>

            <input
              type="text"
              name="usernameOrEmail"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-[inner_0_2px_4px_rgba(0,0,0,0.01)]"
              placeholder="Username hoặc Email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
              Mật khẩu
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-cyan-600 after:transition-all after:duration-200"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Lock size={18} />
            </div>

            <input
              type="password"
              name="password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-[inner_0_2px_4px_rgba(0,0,0,0.01)]"
              placeholder="••••••••"
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
              <span>Hệ thống đang xác thực...</span>
            </>
          ) : (
            <>
              <span>Xác thực ngay</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
        Chưa gia nhập hệ thống?{' '}
        <Link
          to="/register"
          className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-cyan-600 after:transition-all after:duration-200"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;