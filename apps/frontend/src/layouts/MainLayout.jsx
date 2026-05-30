import React, { useState, useEffect } from 'react';
import {
  Link,
  useLocation,
  Outlet,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  User,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import logo from '../assets/logo.png';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const keywordFromUrl = searchParams.get('search') || '';
    setSearchKeyword(keywordFromUrl);
  }, [searchParams]);

  const menuItems = [
    {
      path: '/home',
      label: 'Trang chủ',
      active: location.pathname === '/home' || location.pathname === '/',
    },
    {
      path: '/library',
      label: 'Thư viện',
      active:
        location.pathname === '/library' ||
        location.pathname.startsWith('/library/'),
    },
    {
      path: '/favorites',
      label: 'Đã yêu thích',
      active: location.pathname.startsWith('/favorites'),
    },
    {
      path: '/forum',
      label: 'Diễn đàn',
      active: location.pathname.startsWith('/forum'),
    },
    {
      path: '/groups',
      label: 'Nhóm học tập',
      active: location.pathname.startsWith('/groups'),
    },
    {
      path: '/ai',
      label: 'AI Hỗ trợ',
      active: location.pathname.startsWith('/ai'),
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const keyword = searchKeyword.trim();

    setIsMobileMenuOpen(false);

    if (!keyword) {
      navigate('/library');
      return;
    }

    navigate(`/library?search=${encodeURIComponent(keyword)}`);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    navigate('/library');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-200/20 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full filter blur-[140px] pointer-events-none z-0" />

      <div
        className="fixed inset-0 z-0 opacity-[0.15] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-300 group-hover:scale-105">
              <img
                src={logo}
                alt="Logo"
                className="w-11 h-11 object-contain bg-white"
              />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-800 flex items-center gap-1">
              THƯ VIỆN
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 ${
                  item.active
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.15)]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4.5">
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden lg:block group"
            >
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />

              <input
                type="text"
                placeholder="Tìm tài liệu..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-white/80 border border-slate-200/80 text-xs font-medium rounded-full pl-10 pr-9 py-2.5 w-52 focus:w-64 focus:outline-none focus:border-violet-500/30 focus:ring-4 focus:ring-violet-500/10 focus:bg-white transition-all text-slate-700 placeholder-slate-400 shadow-sm"
              />

              {searchKeyword ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded pointer-events-none group-focus-within:opacity-0 transition-opacity">
                  ⌘K
                </kbd>
              )}
            </form>

            <Link
              to="/notifications"
              className={`hidden sm:flex p-2.5 transition-all duration-300 relative rounded-full ${
                location.pathname.startsWith('/notifications')
                  ? 'text-violet-600 bg-violet-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
              }`}
              title="Thông báo"
            >
              <Bell className="w-5 h-5 transition-transform hover:rotate-12 duration-300" />

              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
            </Link>

            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-indigo-500 p-[2px] cursor-pointer shadow-[0_2px_10px_rgba(124,58,237,0.15)] transition-transform duration-300 hover:scale-105">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {user.Avatar || user.avatar ? (
                    <img
                      src={user.Avatar || user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4.5 h-4.5 text-slate-600" />
                  )}
                </div>
              </div>

              <div className="absolute right-0 top-full pt-3.5 w-60 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100/80 p-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100/80 mb-1.5 bg-slate-50/50 rounded-xl">
                    <p className="text-xs font-bold text-slate-850 truncate leading-none mb-1.5">
                      {user.FullName || user.fullName || 'User'}
                    </p>

                    <p className="text-[10px] text-slate-500 truncate leading-none">
                      {user.Email || user.email || 'user@example.com'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <User size={15} className="text-slate-400" />
                    Hồ sơ cá nhân
                  </Link>

                  {Number(user.RoleID || user.roleID || user.roleId) === 1 && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
                    >
                      <ShieldCheck size={15} />
                      Trang quản trị
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-650 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg mt-3 mx-4 rounded-2xl overflow-hidden border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 space-y-2">
              <form onSubmit={handleSearchSubmit} className="relative mb-3.5">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Tìm tài liệu..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/60 text-xs font-medium rounded-xl pl-10 pr-10 py-3.5 focus:outline-none focus:border-violet-550 focus:ring-1 focus:ring-violet-500/20 transition-all text-slate-700 placeholder-slate-400"
                />

                {searchKeyword && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    item.active
                      ? 'bg-violet-50 text-violet-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname.startsWith('/notifications')
                    ? 'bg-violet-50 text-violet-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Thông báo
              </Link>

              <div className="pt-3 border-t border-slate-100 mt-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <User size={18} className="text-slate-400" />
                  Hồ sơ cá nhân
                </Link>

                {Number(user.RoleID || user.roleID || user.roleId) === 1 && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-violet-600 hover:bg-violet-50"
                  >
                    <ShieldCheck size={18} />
                    Trang quản trị
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 relative z-10 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;