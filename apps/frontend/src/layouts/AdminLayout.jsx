import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Bell, 
  ChevronLeft, 
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(''); // State tìm kiếm cục bộ tiện ích
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Người dùng', icon: Users },
    { path: '/admin/documents', label: 'Tài liệu', icon: FileText },
    { path: '/admin/forum', label: 'Diễn đàn', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Logic tìm kiếm nội bộ admin (nếu cần mở rộng sau này)
    console.log("Đang tìm kiếm trong Admin:", searchKeyword);
  };

  // Trích xuất chữ cái đầu tiên của Admin để làm avatar gradient nếu không có ảnh
  const getInitialName = () => {
    const name = user?.FullName || 'Quản trị viên';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows (Đốm sáng nghệ thuật tạo chiều sâu không gian) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/20 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 84 : 280 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
        className="fixed left-0 top-0 h-full bg-[#090D16] text-slate-300 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.15)] border-r border-slate-800/50"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/40 overflow-hidden shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
                L
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 whitespace-nowrap"
                >
                  ADMIN PANEL
                </motion.span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-violet-600/90 to-indigo-600/90 text-white shadow-[0_4px_20px_rgba(124,58,237,0.25)] border-[0.5px] border-violet-500/30' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] border-[0.5px] border-transparent hover:border-slate-800/40'
                  }`}
                >
                  {/* Icon chuyển động vi mô khi di chuột */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-colors duration-300 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'
                      }`} 
                    />
                  </motion.div>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm tracking-wide whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute right-0 w-1 h-5 bg-gradient-to-t from-violet-400 to-pink-400 rounded-l-full shadow-[0_0_10px_rgba(167,139,250,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 border-t border-slate-800/40 bg-slate-950/40 backdrop-blur-md">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-2 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-900/70 transition-all duration-300`}>
              <div className="relative w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 overflow-visible">
                {user?.Avatar ? (
                  <img src={user.Avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  /* Avatar chữ cái Gradient thời thượng khi không có ảnh đại diện */
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_2px_8px_rgba(168,85,247,0.3)]">
                    {getInitialName()}
                  </div>
                )}
                {/* Active Green Dot (Chấm xanh online nhấp nháy 3D) */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-none mb-1">{user?.FullName || 'Quản trị viên'}</p>
                  <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase leading-none">Admin</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className={`mt-3 w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all duration-300 group`}
            >
              <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              {!isCollapsed && <span className="text-xs font-semibold tracking-wide">Đăng xuất</span>}
            </button>
          </div>
        </div>

        {/* Collapse Toggle Button (Với animation xoay mượt mà của Framer Motion) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-24 w-7 h-7 bg-[#090D16] border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-[4px_0_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 hover:border-slate-700 z-50 cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center"
          >
            <ChevronLeft size={14} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 z-10"
        style={{ marginLeft: isCollapsed ? 84 : 280 }}
      >
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
             <form onSubmit={handleSearchSubmit} className="relative group hidden lg:block">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm quản trị..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-slate-100/60 border border-transparent text-xs font-medium rounded-xl pl-10 pr-10 py-3 w-64 focus:w-72 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500/30 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
              />
              
              {searchKeyword ? (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                /* Phím tắt ảo */
                <kbd className="absolute right-3.5 top-3 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200/50 border border-slate-300/40 rounded">
                  ⌘K
                </kbd>
              )}
            </form>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-all relative group cursor-pointer">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
            </button>
            
            {/* Library Button */}
            <button 
              onClick={() => navigate('/library')}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-[0_4px_14px_rgba(124,58,237,0.25)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.35)] transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              Xem Thư viện
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 pb-16 max-w-[1600px] mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;