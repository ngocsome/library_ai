import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div 
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px)', 
        backgroundSize: '24px 24px' 
      }}
    >
      {/* High-Tech Glowing Ambient Sources */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-300/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-300/15 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-400/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Cybernetic Tech lines (Static layout accents) */}
      <div className="absolute top-10 left-10 w-32 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent hidden md:block" />
      <div className="absolute top-10 left-10 w-[1px] h-32 bg-gradient-to-b from-cyan-500/20 to-transparent hidden md:block" />
      <div className="absolute bottom-10 right-10 w-32 h-[1px] bg-gradient-to-l from-indigo-500/20 to-transparent hidden md:block" />
      <div className="absolute bottom-10 right-10 w-[1px] h-32 bg-gradient-to-t from-indigo-500/20 to-transparent hidden md:block" />

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left column - Futuristic Brand & Features */}
        <div className="hidden lg:block">
          
          {/* Animated Logo block with neon dots */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-4 mb-8 group cursor-pointer relative"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(6,182,212,0.3)] transform group-hover:rotate-6 transition-transform duration-300">
              <BookOpen size={26} strokeWidth={2} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Library AI
                </h1>
                <span className="text-[9px] font-bold tracking-widest text-cyan-600 bg-cyan-50 border border-cyan-200/50 px-2 py-0.5 rounded-md uppercase">
                  V2.0
                </span>
              </div>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-0.5">
                Next-Gen Knowledge Base
              </p>
            </div>
          </motion.div>

          {/* Cybernetic Styled Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] mb-6 tracking-tight"
          >
            Quản lý, tìm kiếm <br /> 
            <span className="relative inline-block text-slate-900">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">và khai thác</span>
              <span className="absolute left-0 bottom-1 w-full h-[8px] bg-cyan-400/20 -skew-x-12 rounded-sm" />
            </span> tài liệu <br /> 
            dễ dàng hơn.
          </motion.h2>

          {/* Animated Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="text-slate-500 text-lg leading-relaxed max-w-lg font-medium"
          >
            Đăng nhập để truy cập thư viện tài liệu thông minh, diễn đàn học tập chất lượng cao và hệ thống AI hỗ trợ nghiên cứu chuyên nghiệp.
          </motion.p>

          {/* Staggered Feature Cards with Tech Borders */}
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-2xl">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="group relative backdrop-blur-md bg-white/40 hover:bg-white/80 border border-slate-200/50 hover:border-cyan-400/50 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.08)] transition-all duration-500 hover:-translate-y-1"
            >
              {/* Corner tech details */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-lg" />
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 text-white flex items-center justify-center mb-4 shadow-[0_8px_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-all duration-300">
                <Sparkles size={22} strokeWidth={1.8} />
              </div>
              <p className="font-bold text-slate-900 text-lg group-hover:text-cyan-600 transition-colors">Tìm kiếm nhanh</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">Tra cứu thần tốc tài liệu theo tên, tác giả hoặc mô hình từ khóa học thuật.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="group relative backdrop-blur-md bg-white/40 hover:bg-white/80 border border-slate-200/50 hover:border-indigo-400/50 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.08)] transition-all duration-500 hover:-translate-y-1"
            >
              {/* Corner tech details */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-lg" />

              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-[0_8px_20px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-all duration-300">
                <BookOpen size={22} strokeWidth={1.8} />
              </div>
              <p className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">Học tập tập trung</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">Lưu trữ yêu thích cá nhân, thiết lập tiến độ và chia sẻ thảo luận nhóm.</p>
            </motion.div>
          </div>
        </div>

        {/* Right column - Main Cyber Glass Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo block (Mobile screens) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <BookOpen size={22} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Library AI
              </h1>
              <p className="text-cyan-600 text-xs font-bold tracking-wider uppercase">Thư viện số thông minh</p>
            </div>
          </div>

          {/* Master Cyber Glass Card Wrapper */}
          <div className="backdrop-blur-xl bg-white/80 border border-slate-200/50 shadow-[0_24px_80px_rgba(0,0,0,0.06)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-[0_32px_96px_rgba(0,0,0,0.08)]">
            
            {/* Top Glowing Neon Strip */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            {/* AI Status Badge */}
            <div className="absolute top-3 right-6 flex items-center gap-1.5 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                AI CORE
              </span>
            </div>

            {/* Subtle background glows inside the card */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;