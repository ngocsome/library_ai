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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div
        className="fixed inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'glass-nav py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/library" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-14 object-contain shadow-sm rounded-lg"
            />

            <span className="text-xl font-bold tracking-tight text-slate-900">
              THƯ VIỆN AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-slate-200 backdrop-blur-sm shadow-sm">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  item.active
                    ? 'text-primary-600 font-bold'
                    : 'text-slate-600 hover:text-accent-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden lg:block"
            >
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Tìm tài liệu..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-white border border-slate-200 text-sm rounded-full pl-10 pr-9 py-2 w-52 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
              />

              {searchKeyword && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <Link
              to="/notifications"
              className={`hidden sm:block p-2 transition-colors relative hover:bg-slate-100 rounded-full ${
                location.pathname.startsWith('/notifications')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-600 hover:text-accent-600'
              }`}
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />

              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-white"></span>
            </Link>

            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 p-[2px] cursor-pointer shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-700" />
                </div>
              </div>

              <div className="absolute right-0 top-full pt-2 w-56 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user.FullName || user.fullName || 'User'}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {user.Email || user.email || 'user@example.com'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <User size={16} />
                    Hồ sơ cá nhân
                  </Link>

                  {Number(user.RoleID || user.roleID || user.roleId) === 1 && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <ShieldCheck size={16} />
                      Trang quản trị
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass-nav mt-3 mx-4 rounded-2xl overflow-hidden border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 space-y-2">
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Tìm tài liệu..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
                />

                {searchKeyword && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-red-500 transition-colors"
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
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    item.active
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname.startsWith('/notifications')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Thông báo
              </Link>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-600"
                >
                  <User size={20} />
                  Hồ sơ cá nhân
                </Link>

                {Number(user.RoleID || user.roleID || user.roleId) === 1 && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-primary-600"
                  >
                    <ShieldCheck size={20} />
                    Trang quản trị
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600"
                >
                  <LogOut size={20} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;