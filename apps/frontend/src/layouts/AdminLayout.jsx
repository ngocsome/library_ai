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
  ChevronRight,
  Search,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-full bg-slate-900 text-slate-300 z-50 shadow-2xl border-r border-slate-800"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/50 overflow-hidden shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                L
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
                >
                  ADMIN PANEL
                </motion.span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                      : 'hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-400'} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section Bottom */}
          <div className="p-4 border-t border-slate-800/50 bg-slate-950/20">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-2`}>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0 overflow-hidden">
                {user?.Avatar ? (
                  <img src={user.Avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-slate-400" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.FullName || 'Quản trị viên'}</p>
                  <p className="text-xs text-slate-500 truncate">Administrator</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleLogout}
              className={`mt-4 w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-all duration-200 group`}
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="text-sm font-medium">Đăng xuất</span>}
            </button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-xl transition-all hover:scale-110 z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      >
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm quản trị..." 
                className="bg-slate-100/50 border-none text-sm rounded-xl pl-10 pr-4 py-2.5 w-64 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            
            <div 
              onClick={() => navigate('/library')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
            >
              Xem Thư viện
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 pb-12 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
