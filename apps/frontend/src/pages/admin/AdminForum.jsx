import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  Trash2, 
  CheckCircle, 
  MessageSquare, 
  ShieldAlert, 
  AlertCircle,
  MoreVertical,
  User,
  Calendar,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { getForumReports, handleForumModeration } from '../../services/adminService';

const AdminForum = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await getForumReports();
            setReports(data);
        } catch (error) {
            toast.error("Không thể tải danh sách báo cáo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleAction = async (reportId, actionType) => {
        try {
            const action = actionType === 'Giữ lại' ? 'keep' : 'delete';
            await handleForumModeration(reportId, action);
            toast.success(`Đã thực hiện: ${actionType}`);
            setReports(prev => prev.filter(r => r.ReportID !== reportId));
        } catch (error) {
            toast.error("Thao tác thất bại");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Kiểm duyệt diễn đàn
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold border border-red-200 uppercase tracking-wider">
                            {reports.length} mới
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Xử lý các báo cáo vi phạm và duy trì môi trường thảo luận lành mạnh.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        Lịch sử kiểm duyệt
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20">
                        Quy tắc cộng đồng
                    </button>
                </div>
            </div>

            {/* Moderation Queue */}
            <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="text-slate-500 mt-4 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {reports.map((report, idx) => (
                                <motion.div
                                    key={report.ReportID}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Report Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold border bg-red-50 text-red-700 border-red-100 uppercase">
                                                        CẢNH BÁO
                                                    </span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(report.CreatedAt).toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                                                    {report.ForumPosts?.Title}
                                                </h3>
                                                <p className="text-slate-500 text-sm mt-2 line-clamp-2 italic">
                                                    "{report.ForumPosts?.Content}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                                                    <User size={14} className="text-slate-400" />
                                                    Người đăng: @{report.ForumPosts?.Users?.Username}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100/50">
                                                    <Flag size={14} />
                                                    Báo cáo bởi: {report.Users?.FullName}
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/50">
                                                    Lý do: {report.Reason}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex lg:flex-col items-center justify-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                                            <button 
                                                onClick={() => handleAction(report.ReportID, 'Giữ lại')}
                                                className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                                            >
                                                <CheckCircle size={18} /> Giữ lại
                                            </button>
                                            <button 
                                                onClick={() => handleAction(report.ReportID, 'Xóa bài')}
                                                className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100"
                                            >
                                                <Trash2 size={18} /> Xóa bài
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                {reports.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
                    >
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert size={40} />
                        </div>
                        <h3 className="text-slate-900 font-bold text-xl">Mọi thứ đều sạch sẽ</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            Hiện không có báo cáo vi phạm nào cần xử lý. Diễn đàn đang vận hành rất tốt!
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
                        >
                            Làm mới dữ liệu
                        </button>
                    </motion.div>
                )}
            </div>
            
            {/* Moderation Summary Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <AlertCircle size={20} className="text-primary-400" />
                        </div>
                        <h4 className="font-bold">Mẹo kiểm duyệt</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                            Kiểm tra lịch sử của người dùng trước khi thực hiện hành động xóa vĩnh viễn.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
                            Ưu tiên xử lý các báo cáo có nhãn "CẢNH BÁO CAO".
                        </li>
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tỉ lệ phản hồi</p>
                            <p className="text-2xl font-bold text-slate-900">98.5%</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Tốt</span>
                        <p className="text-[10px] text-slate-400 mt-1">Trong 24h qua</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminForum;
