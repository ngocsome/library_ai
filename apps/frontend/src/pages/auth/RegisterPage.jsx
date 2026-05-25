import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight, Loader2 } from 'lucide-react';

import { register } from '../../services/authService';

const RegisterPage = () => {
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      
      const formData = new FormData(e.target);
      const fullName = formData.get('fullName');
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
      }

      try {
        await register({
            username: email.split('@')[0], 
            email,
            password,
            fullName,
            roleId: role === 'student' ? 3 : 2 
        });
        navigate('/login');
      } catch (err) {
          setError(err.response?.data?.message || 'Đăng ký thất bại');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
      {/* Header section (Transparent clean inline design) */}
      <div className="mb-8 text-center relative">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
          Đăng ký tài khoản
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Tạo tài khoản để bắt đầu hành trình học tập
        </p>
      </div>
      
      {/* Cybernetic High-Tech Warning Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100/80 p-4 rounded-2xl text-sm mb-6 text-rose-700 animate-in fade-in zoom-in-95 duration-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
          <span className="font-semibold">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Futuristic Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  role === 'student' 
                    ? 'border-cyan-500 bg-cyan-500/5 text-cyan-600 shadow-[0_8px_20px_rgba(6,182,212,0.1)]' 
                    : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
                <User size={24} className="mb-2" strokeWidth={2} />
                <span className="text-sm font-bold">Sinh viên</span>
            </button>
            <button 
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  role === 'teacher' 
                    ? 'border-blue-500 bg-blue-500/5 text-blue-600 shadow-[0_8px_20px_rgba(59,130,246,0.1)]' 
                    : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300'
                }`}
            >
                <Briefcase size={24} className="mb-2" strokeWidth={2} />
                <span className="text-sm font-bold">Giảng viên</span>
            </button>
        </div>

        {/* Full Name Input Group */}
        <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
              Họ và tên
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
                <User size={18} />
              </div>
              <input 
                name="fullName"
                type="text" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300"
                placeholder="Nguyễn Văn A"
              />
            </div>
        </div>

        {/* Email Input Group */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Email trường
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Mail size={18} />
            </div>
            <input 
              name="email"
              type="email" 
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300"
              placeholder={role === 'student' ? "sv12345@tvu.edu.vn" : "gv.ten@tvu.edu.vn"}
            />
          </div>
        </div>

        {/* Password Input Group */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Mật khẩu
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Lock size={18} />
            </div>
            <input 
              name="password"
              type="password" 
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Confirm Password Input Group */}
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-500">
            Xác nhận mật khẩu
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 group-focus-within:scale-105 transition-all duration-300 pointer-events-none">
              <Lock size={18} />
            </div>
            <input 
              name="confirmPassword"
              type="password" 
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Shimmer Sweep Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="relative w-full group overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(6,182,212,0.25)] hover:shadow-[0_12px_40px_rgb(6,182,212,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] mt-4"
        >
          {/* Holographic sweep light effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          {loading ? (
             <>
               <Loader2 size={20} className="animate-spin" /> 
               <span>Đang khởi tạo tài khoản...</span>
             </>
          ) : (
             <>
               <span>Hoàn tất đăng ký</span> 
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center text-sm text-slate-500 relative z-10">
        Đã có tài khoản?{' '}
        <Link 
          to="/login" 
          className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-cyan-600 after:transition-all after:duration-200"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;