import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Tags,
  Newspaper,
  FolderPlus,
  BookOpen,
  PlusCircle,
  Settings,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getDashboardStats } from '../../services/adminService';

const StatCard = ({ title, value, icon: Icon, color, delay, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group relative overflow-hidden text-left transition-all hover:shadow-lg"
  >
    <div
      className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150 duration-500 ${color}`}
    />

    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>

      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
        <ArrowUpRight size={12} />
        <span>Live</span>
      </div>
    </div>

    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
          {Number(value || 0).toLocaleString('vi-VN')}
        </h3>
      </div>
    </div>
  </motion.button>
);

const QuickActionCard = ({ icon: Icon, title, description, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
  >
    <div
      className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 shadow-sm`}
    >
      <Icon size={20} className="text-white" />
    </div>

    <div className="min-w-0">
      <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-primary-600 transition-colors">
        {title}
      </h4>
      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
        {description}
      </p>
    </div>
  </button>
);

const getUserDisplayName = (user) =>
  user?.FullName || user?.fullName || user?.username || user?.Username || 'Admin';

const getDocId = (doc) => doc?.DocID || doc?.id || doc?.documentId || doc?.DocumentID;
const getDocTitle = (doc) => doc?.Title || doc?.title || 'Không có tiêu đề';
const getDocViews = (doc) => Number(doc?.ViewCount || doc?.viewCount || 0);

const normalizeDashboardData = (data) => {
  const counts = data?.counts || {};

  return {
    counts: {
      users: counts.users ?? data?.totalUsers ?? 0,
      documents: counts.documents ?? data?.totalDocuments ?? 0,
      categories: counts.categories ?? data?.totalCategories ?? 0,
      news: counts.news ?? data?.totalNews ?? 0,
      posts: counts.posts ?? data?.totalForumPosts ?? 0,
      groups: counts.groups ?? data?.totalGroups ?? 0,
      forumCategories: counts.forumCategories ?? data?.totalForumCategories ?? 0,
    },
    recentDocuments: Array.isArray(data?.recentDocuments)
      ? data.recentDocuments
      : Array.isArray(data?.trendingDocuments)
      ? data.trendingDocuments
      : [],
  };
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      documents: 0,
      categories: 0,
      news: 0,
      posts: 0,
      groups: 0,
      forumCategories: 0,
    },
    recentDocuments: [],
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(normalizeDashboardData(data));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải thống kê hệ thống. Cần kiểm tra API /api/analytics/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportReport = () => {
    const rows = [
      ['Chỉ số', 'Số lượng'],
      ['Tổng người dùng', stats.counts.users],
      ['Tài liệu số', stats.counts.documents],
      ['Chủ đề tài liệu', stats.counts.categories],
      ['Tin tức', stats.counts.news],
      ['Bài viết diễn đàn', stats.counts.posts],
      ['Nhóm học tập', stats.counts.groups],
      ['Chủ đề diễn đàn', stats.counts.forumCategories],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `bao-cao-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success('Đã xuất báo cáo dashboard');
  };

  const quickActions = useMemo(
    () => [
      {
        title: 'Quản lý người dùng',
        description: 'Xem, phân quyền và quản lý tài khoản trong hệ thống.',
        icon: Users,
        color: 'bg-blue-600',
        path: '/admin/users',
      },
      {
        title: 'Quản lý tài liệu',
        description: 'Thêm, sửa, xóa và kiểm tra tài liệu học tập.',
        icon: FileText,
        color: 'bg-emerald-600',
        path: '/admin/documents',
      },
      {
        title: 'Quản lý chủ đề',
        description: 'Tổ chức danh mục tài liệu theo ngành học hoặc môn học.',
        icon: Tags,
        color: 'bg-amber-600',
        path: '/admin/categories',
      },
      {
        title: 'Quản lý tin tức',
        description: 'Tạo bài viết, thông báo, tin tiêu điểm cho người dùng.',
        icon: Newspaper,
        color: 'bg-violet-600',
        path: '/admin/news',
      },
      {
        title: 'Quản lý nhóm học tập',
        description: 'Theo dõi nhóm học tập và hoạt động cộng tác.',
        icon: Target,
        color: 'bg-orange-600',
        path: '/admin/groups',
      },
      {
        title: 'Quản lý diễn đàn',
        description: 'Kiểm duyệt bài viết và theo dõi thảo luận của sinh viên.',
        icon: MessageSquare,
        color: 'bg-pink-600',
        path: '/admin/forum',
      },
      {
        title: 'Chủ đề diễn đàn',
        description: 'Quản lý danh mục thảo luận trong diễn đàn.',
        icon: Layers,
        color: 'bg-indigo-600',
        path: '/admin/forum-categories',
      },
      {
        title: 'Xem trang người dùng',
        description: 'Mở giao diện người dùng để kiểm tra hiển thị thực tế.',
        icon: BookOpen,
        color: 'bg-slate-700',
        path: '/home',
      },
    ],
    []
  );

  const addActions = useMemo(
    () => [
      {
        title: 'Thêm tài liệu',
        description: 'Đi tới trang quản lý tài liệu để upload tài liệu mới.',
        icon: PlusCircle,
        path: '/admin/documents',
      },
      {
        title: 'Thêm chủ đề',
        description: 'Tạo danh mục tài liệu mới để phân loại tài nguyên.',
        icon: FolderPlus,
        path: '/admin/categories',
      },
      {
        title: 'Thêm tin tức',
        description: 'Tạo thông báo hoặc bài viết mới cho trang tin tức.',
        icon: Newspaper,
        path: '/admin/news',
      },
      {
        title: 'Kiểm tra diễn đàn',
        description: 'Xem các bài viết, bình luận và nội dung cần quản lý.',
        icon: MessageSquare,
        path: '/admin/forum',
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-slate-400 text-sm font-medium animate-pulse">
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Chào mừng quay trở lại, {getUserDisplayName(user).split(' ').pop()} 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1"
          >
            Đây là trung tâm quản trị của hệ thống Thư viện AI.
          </motion.p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Clock size={16} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
          >
            <Activity size={16} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats.counts.users}
          icon={Users}
          color="bg-blue-600"
          delay={0.1}
          onClick={() => navigate('/admin/users')}
        />

        <StatCard
          title="Tài liệu số"
          value={stats.counts.documents}
          icon={FileText}
          color="bg-emerald-600"
          delay={0.15}
          onClick={() => navigate('/admin/documents')}
        />

        <StatCard
          title="Chủ đề tài liệu"
          value={stats.counts.categories}
          icon={Tags}
          color="bg-amber-600"
          delay={0.2}
          onClick={() => navigate('/admin/categories')}
        />

        <StatCard
          title="Tin tức"
          value={stats.counts.news}
          icon={Newspaper}
          color="bg-violet-600"
          delay={0.25}
          onClick={() => navigate('/admin/news')}
        />

        <StatCard
          title="Bài viết diễn đàn"
          value={stats.counts.posts}
          icon={MessageSquare}
          color="bg-pink-600"
          delay={0.3}
          onClick={() => navigate('/admin/forum')}
        />

        <StatCard
          title="Nhóm học tập"
          value={stats.counts.groups}
          icon={Target}
          color="bg-orange-600"
          delay={0.35}
          onClick={() => navigate('/admin/groups')}
        />

        <StatCard
          title="Chủ đề diễn đàn"
          value={stats.counts.forumCategories}
          icon={Layers}
          color="bg-indigo-600"
          delay={0.4}
          onClick={() => navigate('/admin/forum-categories')}
        />

        <StatCard
          title="Trạng thái hệ thống"
          value={1}
          icon={ShieldCheck}
          color="bg-slate-700"
          delay={0.45}
          onClick={() => navigate('/admin')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings size={24} className="text-primary-600" />
              Chức năng quản trị
            </h2>

            <button
              type="button"
              onClick={() => navigate('/admin/documents')}
              className="text-sm font-bold text-primary-600 hover:underline"
            >
              Quản lý tài nguyên
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.path}
                icon={action.icon}
                title={action.title}
                description={action.description}
                color={action.color}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-lg font-bold mb-2">Thông tin hệ thống</h3>

            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Dashboard tổng hợp các module chính: người dùng, tài liệu, chủ đề,
              tin tức, diễn đàn và nhóm học tập.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-200">Dung lượng ổ đĩa</span>
                <span className="font-bold">42%</span>
              </div>

              <div className="w-full h-1.5 bg-indigo-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '42%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
          >
            <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-primary-600" />
              Hành động nhanh
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {addActions.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-sm font-bold text-slate-700 group"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:text-primary-600 transition-colors">
                    <action.icon size={16} />
                  </div>

                  <div className="text-left">
                    <p>{action.title}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={24} className="text-primary-600" />
              Tài liệu xu hướng
            </h2>

            <button
              type="button"
              onClick={() => navigate('/admin/documents')}
              className="text-sm font-bold text-primary-600 hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {stats.recentDocuments.length > 0 ? (
              stats.recentDocuments.map((doc, idx) => (
                <div
                  key={getDocId(doc) || idx}
                  className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                      <FileText className="text-primary-500" size={20} />
                    </div>

                    <div className="truncate">
                      <p className="text-slate-900 font-bold truncate group-hover:text-primary-600 transition-colors">
                        {getDocTitle(doc)}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Tài liệu có lượt xem cao
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Eye size={14} className="text-slate-400" />
                        <span>{getDocViews(doc).toLocaleString('vi-VN')}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium">
                        Lượt xem
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/library/${getDocId(doc)}`)}
                      className="p-2 text-slate-400 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                  <FileText size={32} />
                </div>

                <p className="text-slate-400 font-medium">Chưa có tài liệu nổi bật</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          <h3 className="text-slate-900 font-bold mb-6 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-600" />
            Điều hướng nhanh
          </h3>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="w-full flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Xem thư viện người dùng
              <ArrowUpRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/news')}
              className="w-full flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Xem trang tin tức
              <ArrowUpRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/forum')}
              className="w-full flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Xem diễn đàn
              <ArrowUpRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="w-full flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              Xem nhóm học tập
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;