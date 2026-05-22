import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60" />

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:block"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-900/20">
              <BookOpen size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Library AI
              </h1>
              <p className="text-slate-500 text-sm">
                Thư viện số thông minh
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Quản lý, tìm kiếm và khai thác tài liệu dễ dàng hơn.
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            Đăng nhập để truy cập thư viện tài liệu, diễn đàn học tập, nhóm học tập và các tiện ích AI hỗ trợ nghiên cứu.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <p className="font-bold text-slate-900">Tìm kiếm nhanh</p>
              <p className="text-sm text-slate-500 mt-1">Tra cứu tài liệu theo tên, tác giả, danh mục.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                <BookOpen size={20} />
              </div>
              <p className="font-bold text-slate-900">Học tập tập trung</p>
              <p className="text-sm text-slate-500 mt-1">Lưu yêu thích, tải tài liệu và thảo luận.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-900/20">
              <BookOpen size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Library AI
              </h1>
              <p className="text-slate-500 text-xs">Thư viện số thông minh</p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200 p-7 sm:p-8">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
