import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-8 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-5" />

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-400/40">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Library AI
              </h1>
              <p className="text-cyan-600 text-sm font-semibold">
                Thư viện số thông minh
              </p>
            </div>
          </div>

          <h2 className="text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
            Quản lý, tìm kiếm <br /> và khai thác tài liệu <br /> dễ dàng hơn.
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
            Đăng nhập để truy cập thư viện tài liệu, diễn đàn học tập, nhóm học tập và các tiện ích AI hỗ trợ nghiên cứu.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-5 max-w-2xl">
            <div className="group bg-white border border-emerald-200 rounded-2xl p-6 shadow-md hover:shadow-emerald-200/50 transition-all duration-300 hover:border-emerald-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-300/40 group-hover:scale-110 transition-transform">
                <Sparkles size={24} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-slate-900 text-lg">Tìm kiếm nhanh</p>
              <p className="text-sm text-slate-600 mt-2">Tra cứu tài liệu theo tên, tác giả, danh mục.</p>
            </div>

            <div className="group bg-white border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-blue-200/50 transition-all duration-300 hover:border-blue-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-300/40 group-hover:scale-110 transition-transform">
                <BookOpen size={24} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-slate-900 text-lg">Học tập tập trung</p>
              <p className="text-sm text-slate-600 mt-2">Lưu yêu thích, tải tài liệu và thảo luận.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-400/40">
              <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Library AI
              </h1>
              <p className="text-cyan-600 text-xs font-semibold">Thư viện số thông minh</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
