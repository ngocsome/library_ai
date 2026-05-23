import React, { useState, useEffect } from 'react';
import {
  Flag,
  Trash2,
  CheckCircle,
  MessageSquare,
  ShieldAlert,
  AlertCircle,
  User,
  Calendar,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import {
  getForumReports,
  handleForumModeration,
  deleteReportedForumPost,
} from '../../services/adminService';

const getReportId = (report) =>
  report?.ReportID || report?.reportId || report?.id || report?.ID;

const getPostId = (report) =>
  report?.PostID || report?.postId || report?.ForumPosts?.PostID || report?.ForumPosts?.id;

const getPostTitle = (report) =>
  report?.PostTitle ||
  report?.postTitle ||
  report?.ForumPosts?.Title ||
  report?.ForumPosts?.title ||
  'Bài viết không có tiêu đề';

const getPostContent = (report) =>
  report?.PostContentPreview ||
  report?.postContentPreview ||
  report?.ForumPosts?.Content ||
  report?.ForumPosts?.content ||
  'Không có nội dung xem trước';

const getReporterName = (report) =>
  report?.ReporterUsername ||
  report?.reporterUsername ||
  report?.Users?.FullName ||
  report?.Users?.Username ||
  'Người dùng';

const getPostAuthor = (report) =>
  report?.ForumPosts?.Users?.Username ||
  report?.ForumPosts?.Users?.FullName ||
  'Không rõ';

const getReason = (report) => report?.Reason || report?.reason || 'Không có lý do';

const getDescription = (report) => report?.Description || report?.description || '';

const getStatus = (report) =>
  String(report?.Status || report?.status || 'PENDING').toUpperCase();

const getCreatedAt = (report) =>
  report?.CreatedAt || report?.createdAt || report?.created_at || null;

const formatDateTime = (value) => {
  if (!value) return 'Chưa rõ';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa rõ';

  return date.toLocaleString('vi-VN');
};

const normalizeReportsResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      reports: data,
      totalReports: data.length,
      pendingReports: data.filter((item) => getStatus(item) === 'PENDING').length,
      resolvedReports: data.filter((item) => getStatus(item) === 'RESOLVED').length,
      rejectedReports: data.filter((item) => getStatus(item) === 'REJECTED').length,
    };
  }

  const reports = Array.isArray(data?.reports) ? data.reports : [];

  return {
    reports,
    totalReports: Number(data?.totalReports ?? reports.length),
    pendingReports: Number(
      data?.pendingReports ?? reports.filter((item) => getStatus(item) === 'PENDING').length
    ),
    resolvedReports: Number(
      data?.resolvedReports ?? reports.filter((item) => getStatus(item) === 'RESOLVED').length
    ),
    rejectedReports: Number(
      data?.rejectedReports ?? reports.filter((item) => getStatus(item) === 'REJECTED').length
    ),
  };
};

const AdminForum = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    rejectedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);

    try {
      const data = await getForumReports();
      const normalized = normalizeReportsResponse(data);

      setReports(normalized.reports);
      setStats({
        totalReports: normalized.totalReports,
        pendingReports: normalized.pendingReports,
        resolvedReports: normalized.resolvedReports,
        rejectedReports: normalized.rejectedReports,
      });
    } catch (error) {
      console.error('Failed to fetch forum reports', error);
      toast.error(error.response?.data?.message || 'Không thể tải danh sách báo cáo');
      setReports([]);
      setStats({
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        rejectedReports: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRejectReport = async (report) => {
    const reportId = getReportId(report);

    if (!reportId) {
      toast.error('Không tìm thấy ID báo cáo');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn bỏ qua báo cáo này không?')) return;

    try {
      setProcessingId(reportId);
      await handleForumModeration(reportId, 'reject', 'Admin đã bỏ qua báo cáo');

      toast.success('Đã bỏ qua báo cáo');
      await fetchReports();
    } catch (error) {
      console.error('Reject report failed', error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeletePost = async (report) => {
    const reportId = getReportId(report);
    const postId = getPostId(report);

    if (!reportId) {
      toast.error('Không tìm thấy ID báo cáo');
      return;
    }

    if (!postId) {
      toast.error('Không tìm thấy ID bài viết cần xóa');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài viết "${getPostTitle(report)}" không?\n\nThao tác này sẽ xóa bài viết khỏi diễn đàn và đánh dấu báo cáo là đã xử lý.`
    );

    if (!confirmed) return;

    try {
      setProcessingId(reportId);
      await deleteReportedForumPost(postId, reportId);

      toast.success('Đã xóa bài viết và xử lý báo cáo');
      await fetchReports();
    } catch (error) {
      console.error('Delete reported post failed', error);
      toast.error(error.response?.data?.message || 'Xóa bài viết thất bại');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = reports.filter((report) => getStatus(report) === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Kiểm duyệt diễn đàn
            <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold border border-red-200 uppercase tracking-wider">
              {pendingCount} mới
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Xử lý các báo cáo vi phạm và duy trì môi trường thảo luận lành mạnh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchReports}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
          >
            Quy tắc cộng đồng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Flag size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng báo cáo</p>
            <p className="text-xl font-bold text-slate-900">{stats.totalReports}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đang chờ</p>
            <p className="text-xl font-bold text-slate-900">{stats.pendingReports}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đã xử lý</p>
            <p className="text-xl font-bold text-slate-900">{stats.resolvedReports}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Bỏ qua</p>
            <p className="text-xl font-bold text-slate-900">{stats.rejectedReports}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-slate-500 mt-4 font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : reports.length > 0 ? (
          <AnimatePresence>
            {reports.map((report, idx) => {
              const reportId = getReportId(report);
              const postId = getPostId(report);
              const status = getStatus(report);
              const isPending = status === 'PENDING';
              const isProcessing = String(processingId) === String(reportId);

              return (
                <motion.div
                  key={reportId || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-2 h-full ${isPending ? 'bg-red-500' : 'bg-emerald-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase ${
                              isPending
                                ? 'bg-red-50 text-red-700 border-red-100'
                                : status === 'RESOLVED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {isPending ? 'Đang chờ xử lý' : status === 'RESOLVED' ? 'Đã xử lý' : 'Đã bỏ qua'}
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDateTime(getCreatedAt(report))}
                          </span>
                        </div>

                        {postId && (
                          <Link
                            to={`/forum/${postId}`}
                            className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                          >
                            <Eye size={14} />
                            Xem bài
                          </Link>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                          {getPostTitle(report)}
                        </h3>
                        <p className="text-slate-500 text-sm mt-2 line-clamp-2 italic">
                          &quot;{getPostContent(report)}&quot;
                        </p>
                        {getDescription(report) && (
                          <p className="text-slate-600 text-sm mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                            Mô tả thêm: {getDescription(report)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                          <User size={14} className="text-slate-400" />
                          Người đăng: @{getPostAuthor(report)}
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100/50">
                          <Flag size={14} />
                          Báo cáo bởi: {getReporterName(report)}
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100/50">
                          Lý do: {getReason(report)}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center justify-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleRejectReport(report)}
                        disabled={!isPending || isProcessing}
                        className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all border border-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={18} />
                        Bỏ qua
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePost(report)}
                        disabled={!isPending || isProcessing || !postId}
                        className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={18} />
                        Xóa bài
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
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
              type="button"
              onClick={fetchReports}
              className="mt-8 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
            >
              Làm mới dữ liệu
            </button>
          </motion.div>
        )}
      </div>

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
              Kiểm tra nội dung bài viết và lý do báo cáo trước khi đưa ra quyết định.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 shrink-0" />
              Nếu báo cáo không hợp lý, hãy chọn Bỏ qua để lưu lịch sử xử lý.
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Báo cáo đang chờ</p>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingReports}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Ổn định</span>
            <p className="text-[10px] text-slate-400 mt-1">Dữ liệu trực tiếp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForum;
