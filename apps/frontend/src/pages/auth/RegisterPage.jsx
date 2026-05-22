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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Đăng ký tài khoản</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
            {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${role === 'student' ? 'border-brand-green bg-brand-green/5 text-brand-green' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
                <User size={24} className="mb-1" />
                <span className="text-sm font-medium">Sinh viên</span>
            </button>
            <button 
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${role === 'teacher' ? 'border-brand-green bg-brand-green/5 text-brand-green' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
                <Briefcase size={24} className="mb-1" />
                <span className="text-sm font-medium">Giảng viên</span>
            </button>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input 
              name="fullName"
              type="text" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="Nguyễn Văn A"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email trường</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="email"
              type="email" 
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder={role === 'student' ? "sv12345@tvu.edu.vn" : "gv.ten@tvu.edu.vn"}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="password"
              type="password" 
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="confirmPassword"
              type="password" 
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-brand-green hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"
        >
          {loading ? (
             <><Loader2 size={20} className="animate-spin" /> Đang tạo tài khoản...</>
          ) : (
             <>Hoàn tất đăng ký <ArrowRight size={20} /></>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Đã có tài khoản? <Link to="/login" className="text-brand-green font-medium hover:underline">Đăng nhập</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
