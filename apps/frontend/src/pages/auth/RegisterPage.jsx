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
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tight">
          Đăng ký tài khoản
        </h2>
        <p className="text-center text-slate-600 text-sm">
          Tạo tài khoản để bắt đầu hành trình học tập
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6 text-center border border-red-200">
            {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === 'student' ? 'border-cyan-400 bg-cyan-50 text-cyan-700 shadow-md' : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400'}`}
            >
                <User size={26} className="mb-2" strokeWidth={1.5} />
                <span className="text-sm font-semibold">Sinh viên</span>
            </button>
            <button 
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${role === 'teacher' ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-md' : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400'}`}
            >
                <Briefcase size={26} className="mb-2" strokeWidth={1.5} />
                <span className="text-sm font-semibold">Giảng viên</span>
            </button>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Họ và tên</label>
            <input 
              name="fullName"
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="Nguyễn Văn A"
            />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Email trường</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              name="email"
              type="email" 
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder={role === 'student' ? "sv12345@tvu.edu.vn" : "gv.ten@tvu.edu.vn"}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-900 mb-2">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              name="password"
              type="password" 
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-900 mb-2">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              name="confirmPassword"
              type="password" 
              required
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all hover:bg-slate-100"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 disabled:shadow-none mt-2"
        >
          {loading ? (
             <><Loader2 size={20} className="animate-spin" /> Đang tạo tài khoản...</>
          ) : (
             <>Hoàn tất đăng ký <ArrowRight size={20} /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Đã có tài khoản? <Link to="/login" className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors">Đăng nhập</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
