import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Share2,
  MoreVertical,
  Send,
  Loader2,
  X,
  Clock,
  ShieldAlert,
  CornerDownRight,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  getPostById,
  addComment,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  reportPost,
} from '../../services/forumService';
import { useAuth } from '../../context/AuthContext';

const reportReasons = [
  'Spam/quảng cáo',
  'Nội dung không phù hợp',
  'Ngôn từ xúc phạm/thù ghét',
  'Thông tin sai lệch',
  'Vi phạm bản quyền',
  'Khác',
];

const ReportModal = ({
  open,
  reason,
  description,
  submitting,
  onClose,
  onReasonChange,
  onDescriptionChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="w-full max-w-lg bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/50 shadow-sm">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">
                  Báo cáo vi phạm
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gửi báo cáo để quản trị viên xem xét nội dung này.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Lý do báo cáo <span className="text-red-500">*</span>
              </label>

              <select
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                required
                className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all cursor-pointer"
              >
                <option value="" className="font-bold">
                  Chọn lý do phù hợp
                </option>
                {reportReasons.map((item) => (
                  <option key={item} value={item} className="font-semibold">
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết hơn
              </label>

              <textarea
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                rows="4"
                placeholder="Bạn có thể ghi chú thêm thông tin chi tiết..."
                className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all text-slate-800 placeholder-slate-400 resize-none leading-relaxed"
              />
            </div>

            <div className="rounded-2xl bg-amber-50/60 border border-amber-100 text-[11px] font-bold text-amber-700 p-4 leading-relaxed flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 text-amber-600 mt-0.5" />
              Báo cáo sai sự thật hoặc cố tình spam phá hoại có thể khiến tài khoản của bạn bị hạn chế.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-[0_4px_14px_rgba(244,63,94,0.2)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.3)] disabled:bg-rose-350 disabled:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <AlertTriangle size={15} />
                    Gửi báo cáo
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PostDetailPage = () => {
  const { postId } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);

  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const fetchPost = async () => {
    setLoading(true);

    try {
      const result = await getPostById(postId);

      setPost(result);
      setLiked(result.Liked || result.liked || false);
      setCurrentLikeCount(
        result.LikeCount ?? result.likeCount ?? result.Upvotes ?? result.upvotes ?? 0
      );
      setError(null);
    } catch (error) {
      console.error('Failed to load post', error);
      setError(error.message || 'Lỗi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const getCommentId = (comment) => {
    return comment.CommentID || comment.commentId || comment.id;
  };

  const getCommentLikeCount = (comment) => {
    return (
      comment.LikeCount ??
      comment.likeCount ??
      comment.Upvotes ??
      comment.upvotes ??
      0
    );
  };

  const isCommentLiked = (comment) => {
    return (
      comment.Liked ??
      comment.liked ??
      comment.IsLiked ??
      comment.isLiked ??
      false
    );
  };

  const updateCommentInPost = (commentId, updater) => {
    setPost((prevPost) => {
      if (!prevPost) return prevPost;

      const currentComments =
        prevPost.ForumComments || prevPost.Comments || prevPost.comments || [];

      const updatedComments = currentComments.map((comment) => {
        const currentId = getCommentId(comment);

        if (currentId !== commentId) return comment;

        return updater(comment);
      });

      if (prevPost.ForumComments) {
        return {
          ...prevPost,
          ForumComments: updatedComments,
        };
      }

      if (prevPost.Comments) {
        return {
          ...prevPost,
          Comments: updatedComments,
        };
      }

      return {
        ...prevPost,
        comments: updatedComments,
      };
    });
  };

  const handleComment = async (parentId = null) => {
    const content = parentId ? replyText : commentText;

    if (!content.trim()) return;

    try {
      await addComment(postId, content, parentId);

      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
      } else {
        setCommentText('');
      }

      fetchPost();
    } catch (error) {
      console.error('Failed to post comment', error);
      alert(error.response?.data?.message || 'Gửi bình luận thất bại');
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để thích bài viết');
      return;
    }

    try {
      if (liked) {
        const result = await unlikePost(postId);
        setLiked(false);
        setCurrentLikeCount(
          result.likeCount ?? result.LikeCount ?? Math.max(0, currentLikeCount - 1)
        );
      } else {
        const result = await likePost(postId);
        setLiked(true);
        setCurrentLikeCount(
          result.likeCount ?? result.LikeCount ?? currentLikeCount + 1
        );
      }
    } catch (error) {
      console.error('Like failed', error);
      alert(error.response?.data?.message || 'Không thể cập nhật lượt thích');
    }
  };

  const handleLikeComment = async (comment) => {
    if (!user) {
      alert('Bạn cần đăng nhập để thích bình luận');
      return;
    }

    const commentId = getCommentId(comment);

    if (!commentId) {
      alert('Không tìm thấy ID bình luận');
      return;
    }

    const commentLiked = isCommentLiked(comment);
    const currentCommentLikeCount = getCommentLikeCount(comment);

    try {
      if (commentLiked) {
        const result = await unlikeComment(commentId);
        const nextLikeCount =
          result?.likeCount ??
          result?.LikeCount ??
          Math.max(0, currentCommentLikeCount - 1);

        updateCommentInPost(commentId, (oldComment) => ({
          ...oldComment,
          Liked: false,
          liked: false,
          IsLiked: false,
          isLiked: false,
          LikeCount: nextLikeCount,
          likeCount: nextLikeCount,
        }));
      } else {
        const result = await likeComment(commentId);
        const nextLikeCount =
          result?.likeCount ??
          result?.LikeCount ??
          currentCommentLikeCount + 1;

        updateCommentInPost(commentId, (oldComment) => ({
          ...oldComment,
          Liked: true,
          liked: true,
          IsLiked: true,
          isLiked: true,
          LikeCount: nextLikeCount,
          likeCount: nextLikeCount,
        }));
      }
    } catch (error) {
      console.error('Like comment failed', error);
      alert(
        error.response?.data?.message ||
          'Không thể cập nhật lượt thích bình luận'
      );
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      alert('Đã copy link bài viết');
    } catch (error) {
      console.error('Share failed', error);
      alert('Không thể copy link bài viết');
    }
  };

  const openReportModal = () => {
    if (!user) {
      alert('Bạn cần đăng nhập để báo cáo bài viết');
      return;
    }

    setReportMenuOpen(false);
    setReportReason('');
    setReportDescription('');
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    if (reportSubmitting) return;

    setReportModalOpen(false);
    setReportReason('');
    setReportDescription('');
  };

  const handleSubmitReport = async (event) => {
    event.preventDefault();

    if (!reportReason.trim()) {
      alert('Vui lòng chọn lý do báo cáo');
      return;
    }

    try {
      setReportSubmitting(true);

      const result = await reportPost(postId, {
        reason: reportReason,
        description: reportDescription,
      });

      alert(result?.message || 'Đã gửi báo cáo vi phạm');
      closeReportModal();
    } catch (error) {
      console.error('Report post failed', error);
      alert(error.response?.data?.message || 'Gửi báo cáo thất bại');
    } finally {
      setReportSubmitting(false);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString('vi-VN');
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="animate-spin text-brand-green w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl border border-slate-200/60 shadow-sm mt-12">
        <div className="text-red-500 font-extrabold text-sm mb-2">
          Đã xảy ra sự cố
        </div>
        <div className="text-slate-500 text-xs font-semibold mb-6">
          {error}
        </div>
        <button
          onClick={fetchPost}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center text-slate-550 font-bold bg-white rounded-3xl border border-slate-200/60 shadow-sm mt-12">
        Bài thảo luận không tồn tại hoặc đã bị gỡ bỏ.
      </div>
    );
  }

  const title = post.Title || post.title || 'Không có tiêu đề';
  const content = post.Content || post.content || '';
  const authorName =
    post.Users?.FullName ||
    post.AuthorName ||
    post.authorName ||
    'Người dùng ẩn danh';
  const createdAt = post.CreatedAt || post.createdAt || post.created_at;
  const comments = post.ForumComments || post.Comments || post.comments || [];

  const parentComments = comments.filter((comment) => {
    const parentId =
      comment.ParentCommentID ?? comment.ParentID ?? comment.parentId;
    return !parentId;
  });

  const getReplies = (parentCommentId) => {
    return comments.filter((comment) => {
      const parentId =
        comment.ParentCommentID ?? comment.ParentID ?? comment.parentId;
      return parentId === parentCommentId;
    });
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-20 space-y-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-emerald-250/15 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/10 to-transparent rounded-full filter blur-[140px] pointer-events-none z-0" />

      <Link
        to="/forum"
        className="flex items-center gap-2 text-slate-450 hover:text-slate-800 font-bold text-xs tracking-wider uppercase transition-all duration-300 group hover:-translate-x-1 relative z-10"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Quay lại diễn đàn
      </Link>

      <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgba(15,23,42,0.02)] border border-slate-200/60 p-6 sm:p-8 relative z-10">
        <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-green to-emerald-450 flex items-center justify-center text-white font-black text-sm shadow-[0_2px_8px_rgba(16,185,129,0.25)] shrink-0">
              {authorName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                {authorName}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} className="text-slate-350" />
                {formatDateTime(createdAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setReportMenuOpen((prev) => !prev)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer"
            >
              <MoreVertical size={18} />
            </button>

            {reportMenuOpen && (
              <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200/60 rounded-2xl shadow-[0_4px_25px_rgba(15,23,42,0.08)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  type="button"
                  onClick={openReportModal}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                >
                  <AlertTriangle size={15} />
                  Báo cáo vi phạm
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-850 tracking-tight leading-snug mb-4">
          {title}
        </h1>

        <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line mb-8 font-medium">
          {content}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 border ${
              liked
                ? 'bg-emerald-50 border-emerald-100 text-brand-green shadow-sm shadow-green-500/10'
                : 'bg-slate-50/50 border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <ThumbsUp
              size={15}
              fill={liked ? 'currentColor' : 'none'}
              className="transition-transform"
            />
            <span>{currentLikeCount} lượt thích</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50/50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200/60 text-xs font-bold transition-all duration-300">
            <MessageSquare size={15} />
            <span>{comments.length} bình luận</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4.5 py-2 rounded-2xl bg-slate-550/10 hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-750 text-xs font-bold transition-all duration-300 ml-auto cursor-pointer active:scale-95"
          >
            <Share2 size={15} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest ml-1">
          Bình luận đối thoại ({comments.length})
        </h3>

        {parentComments.map((comment) => {
          const commentId = getCommentId(comment);
          const commentAuthor =
            comment.Users?.FullName ||
            comment.AuthorName ||
            comment.authorName ||
            'Người dùng';
          const commentContent = comment.Content || comment.content || '';
          const commentCreatedAt =
            comment.CreatedAt || comment.createdAt || comment.created_at;
          const isAcceptedAnswer = comment.IsAcceptedAnswer || false;
          const replies = getReplies(commentId);

          return (
            <div
              key={commentId}
              className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all duration-300 shadow-[0_4px_20px_rgba(15,23,42,0.01)] ${
                isAcceptedAnswer
                  ? 'border-brand-green/40 ring-4 ring-brand-green/5 shadow-[0_6px_22px_rgba(16,185,129,0.08)]'
                  : 'border-slate-200/60 hover:shadow-md'
              }`}
            >
              {isAcceptedAnswer && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-brand-green text-[9px] font-black uppercase tracking-wider rounded-lg border border-emerald-100/50 mb-3.5 shadow-sm">
                  Câu trả lời được chấp nhận
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-500 shrink-0">
                  {commentAuthor?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                    <span className="font-extrabold text-slate-800 text-xs sm:text-sm">
                      {commentAuthor}
                    </span>

                    <span className="text-[10px] text-slate-400 font-bold">
                      {formatDate(commentCreatedAt)}
                    </span>
                  </div>

                  <p className="text-slate-650 text-xs sm:text-sm mt-2 leading-relaxed font-semibold">
                    {commentContent}
                  </p>

                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(comment)}
                      className={`text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isCommentLiked(comment)
                          ? 'text-brand-green'
                          : 'text-slate-400 hover:text-brand-green'
                      }`}
                    >
                      Thích{' '}
                      {getCommentLikeCount(comment) > 0
                        ? `(${getCommentLikeCount(comment)})`
                        : ''}
                    </button>

                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === commentId ? null : commentId
                        )
                      }
                      className="text-[10px] font-bold text-slate-400 hover:text-brand-green uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Phản hồi
                    </button>
                  </div>

                  {replyingTo === commentId && (
                    <div className="mt-4 flex gap-2 animate-in slide-in-from-top-1.5 duration-200">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết câu trả lời nhanh..."
                        className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green text-slate-800 font-semibold"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleComment(commentId)
                        }
                      />

                      <button
                        onClick={() => handleComment(commentId)}
                        className="px-4.5 py-2.5 bg-brand-green text-white text-xs font-bold rounded-2xl hover:bg-green-700 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
                      >
                        Gửi
                      </button>
                    </div>
                  )}

                  {replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-slate-100">
                      {replies.map((reply) => {
                        const replyId = getCommentId(reply);
                        const replyAuthor =
                          reply.Users?.FullName ||
                          reply.AuthorName ||
                          reply.authorName ||
                          'Người dùng';
                        const replyContent =
                          reply.Content || reply.content || '';
                        const replyCreatedAt =
                          reply.CreatedAt ||
                          reply.createdAt ||
                          reply.created_at;

                        return (
                          <div
                            key={replyId}
                            className="flex items-start gap-2.5 group"
                          >
                            <CornerDownRight
                              size={14}
                              className="text-slate-300 mt-1 shrink-0"
                            />

                            <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0">
                              {replyAuthor?.charAt(0)?.toUpperCase() || 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-bold text-xs text-slate-700">
                                  {replyAuthor}
                                </span>

                                <span className="text-[9px] text-slate-400 font-bold">
                                  {formatDate(replyCreatedAt)}
                                </span>
                              </div>

                              <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-semibold">
                                {replyContent}
                              </p>

                              <button
                                onClick={() => handleLikeComment(reply)}
                                className={`mt-2 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                  isCommentLiked(reply)
                                    ? 'text-brand-green'
                                    : 'text-slate-400 hover:text-brand-green'
                                }`}
                              >
                                Thích{' '}
                                {getCommentLikeCount(reply) > 0
                                  ? `(${getCommentLikeCount(reply)})`
                                  : ''}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <div className="text-center text-slate-400 py-12 bg-white/60 backdrop-blur-md rounded-[28px] border-2 border-dashed border-slate-200/80 p-6">
            <MessageSquare size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-450 uppercase tracking-wide">
              Chưa có bình luận nào
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">
              Hãy là người đầu tiên chia sẻ góc nhìn của bạn về bài viết này!
            </p>
          </div>
        )}
      </div>

      <div className="bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-2xl p-2.5 shadow-[0_-8px_30px_rgba(15,23,42,0.04)] sticky bottom-4 z-40 transition-all">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận hoặc đóng góp của bạn..."
            className="flex-1 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green text-xs font-semibold text-slate-800 placeholder-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
          />

          <button
            onClick={() => handleComment()}
            className="p-3 bg-brand-green hover:bg-green-700 text-white rounded-xl transition-all shadow-md shadow-green-500/10 hover:shadow-green-500/20 cursor-pointer active:scale-95 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <ReportModal
        open={reportModalOpen}
        reason={reportReason}
        description={reportDescription}
        submitting={reportSubmitting}
        onClose={closeReportModal}
        onReasonChange={setReportReason}
        onDescriptionChange={setReportDescription}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
};

export default PostDetailPage;