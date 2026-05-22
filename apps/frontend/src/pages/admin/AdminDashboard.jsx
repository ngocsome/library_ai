import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Eye, 
  ArrowUpRight,
  Target,
  Activity,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-150 duration-500 ${color}`} />
    
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
        <ArrowUpRight size={12} />
        <span>+12%</span>
      </div>
    </div>
    
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            toast.error('Không thể tải thống kê hệ thống');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex justify-center items-center">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <div className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Chào buổi chiều, {user.FullName?.split(' ').pop() || 'Admin'} 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1"
          >
            Đây là những gì đang diễn ra trong thư viện của bạn hôm nay.
          </motion.p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Clock size={16} /> Làm mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20">
            <Activity size={16} /> Xuất báo cáo
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng người dùng" value={stats?.counts?.users || 0} icon={Users} color="bg-blue-600" delay={0.1} />
        <StatCard title="Tài liệu số" value={stats?.counts?.documents || 0} icon={FileText} color="bg-emerald-600" delay={0.2} />
        <StatCard title="Bài viết diễn đàn" value={stats?.counts?.posts || 0} icon={MessageSquare} color="bg-violet-600" delay={0.3} />
        <StatCard title="Nhóm học tập" value={stats?.counts?.groups || 0} icon={Target} color="bg-orange-600" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Documents Section */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
         >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={24} className="text-primary-600" />
                  Tài liệu xu hướng
              </h2>
              <button className="text-sm font-bold text-primary-600 hover:underline">Xem tất cả</button>
            </div>
            
            <div className="space-y-4">
                {stats?.recentDocuments?.length > 0 ? (
                    stats.recentDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                                  <FileText className="text-primary-500" size={20} />
                                </div>
                                <div className="truncate">
                                  <p className="text-slate-900 font-bold truncate group-hover:text-primary-600 transition-colors">{doc.Title}</p>
                                  <p className="text-xs text-slate-500 mt-1">Cập nhật 2 giờ trước</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                      <Eye size={14} className="text-slate-400" />
                                      <span>{doc.ViewCount.toLocaleString()}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-medium">Lượt xem</span>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100">
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

         {/* Activity & Quick Actions */}
         <div className="space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.6 }}
               className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <h3 className="text-lg font-bold mb-2">Thông tin hệ thống</h3>
               <p className="text-indigo-100 text-sm leading-relaxed mb-6">Mọi thứ đang vận hành ổn định. Thời gian phản hồi trung bình của API là 45ms.</p>
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
                  <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:text-primary-600 transition-colors">
                      <UserPlus size={16} />
                    </div>
                    Thêm người dùng mới
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:text-primary-600 transition-colors">
                      <FileText size={16} />
                    </div>
                    Duyệt tài liệu chờ
                  </button>
                  <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-sm font-bold text-slate-700 group">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:text-primary-600 transition-colors">
                      <MessageSquare size={16} />
                    </div>
                    Báo cáo diễn đàn
                  </button>
               </div>
            </motion.div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
