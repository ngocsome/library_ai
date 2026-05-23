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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  getPostById,
  addComment,
  likePost,
  unlikePost,
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
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Báo cáo vi phạm
                </h2>
                <p className="text-sm text-slate-500">
                  Gửi báo cáo để quản trị viên xem xét bài viết này.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Lý do báo cáo <span className="text-red-500">*</span>
              </label>

              <select
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">Chọn lý do</option>
                {reportReasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mô tả thêm
              </label>

              <textarea
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                rows="4"
                placeholder="Bạn có thể mô tả rõ hơn lý do báo cáo..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 resize-none"
              />
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700">
              Báo cáo sai sự thật hoặc spam báo cáo có thể ảnh hưởng đến tài khoản của bạn.
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg disabled:bg-red-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} />
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
      setCurrentLikeCount(result.LikeCount ?? result.likeCount ?? result.Upvotes ?? 0);
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
    try {
      if (liked) {
        const result = await unlikePost(postId);
        setLiked(false);
        setCurrentLikeCount(result.likeCount ?? Math.max(0, currentLikeCount - 1));
      } else {
        const result = await likePost(postId);
        setLiked(true);
        setCurrentLikeCount(result.likeCount ?? currentLikeCount + 1);
      }
    } catch (error) {
      console.error('Like failed', error);
      alert(error.response?.data?.message || 'Không thể cập nhật lượt thích');
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
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-bold mb-2">Đã có lỗi xảy ra</div>
        <div className="text-gray-600">{error}</div>
        <button
          onClick={fetchPost}
          className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-10 text-center text-gray-500">
        Bài viết không tồn tại hoặc đã bị xóa.
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
    const parentId = comment.ParentCommentID ?? comment.ParentID ?? comment.parentId;
    return !parentId;
  });

  const getReplies = (parentCommentId) => {
    return comments.filter((comment) => {
      const parentId = comment.ParentCommentID ?? comment.ParentID ?? comment.parentId;
      return parentId === parentCommentId;
    });
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-12 space-y-6 px-4">
      <Link
        to="/forum"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={20} />
        Quay lại diễn đàn
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {authorName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div>
              <h3 className="font-bold text-gray-800">{authorName}</h3>
              <p className="text-xs text-gray-500">
                {formatDateTime(createdAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setReportMenuOpen((prev) => !prev)}
              className="text-gray-400 hover:bg-gray-100 p-1 rounded"
            >
              <MoreVertical size={20} />
            </button>

            {reportMenuOpen && (
              <div className="absolute right-0 top-9 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <button
                  type="button"
                  onClick={openReportModal}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  <AlertTriangle size={16} />
                  Báo cáo vi phạm
                </button>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
          {content}
        </p>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              liked
                ? 'bg-brand-green/10 text-brand-green font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp size={18} fill={liked ? 'currentColor' : 'none'} />
            {currentLikeCount}
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100">
            <MessageSquare size={18} />
            {comments.length}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 ml-auto"
          >
            <Share2 size={18} />
            Chia sẻ
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 ml-1">
          Bình luận ({comments.length})
        </h3>

        {parentComments.map((comment) => {
          const commentId = comment.CommentID || comment.id;
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
              className={`bg-white rounded-xl border p-4 ${
                isAcceptedAnswer
                  ? 'border-brand-green/30 ring-1 ring-brand-green/30'
                  : 'border-gray-200'
              }`}
            >
              {isAcceptedAnswer && (
                <div className="text-xs font-bold text-brand-green mb-2 uppercase tracking-wide">
                  Câu trả lời được chấp nhận
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {commentAuthor?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-800 text-sm">
                      {commentAuthor}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatDate(commentCreatedAt)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mt-1">
                    {commentContent}
                  </p>

                  <div className="flex gap-4 mt-2">
                    <button className="text-xs font-medium text-gray-500 hover:text-gray-800">
                      Thích
                    </button>

                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === commentId ? null : commentId
                        )
                      }
                      className="text-xs font-medium text-gray-500 hover:text-gray-800"
                    >
                      Phản hồi
                    </button>
                  </div>

                  {replyingTo === commentId && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết câu trả lời..."
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleComment(commentId)
                        }
                      />

                      <button
                        onClick={() => handleComment(commentId)}
                        className="px-3 py-1.5 bg-brand-green text-white text-xs rounded hover:bg-green-700"
                      >
                        Gửi
                      </button>
                    </div>
                  )}

                  {replies.length > 0 && (
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
                      {replies.map((reply) => {
                        const replyId = reply.CommentID || reply.id;
                        const replyAuthor =
                          reply.Users?.FullName ||
                          reply.AuthorName ||
                          reply.authorName ||
                          'Người dùng';
                        const replyContent = reply.Content || reply.content || '';
                        const replyCreatedAt =
                          reply.CreatedAt || reply.createdAt || reply.created_at;

                        return (
                          <div key={replyId} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                              {replyAuthor?.charAt(0)?.toUpperCase() || 'U'}
                            </div>

                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-xs text-gray-600">
                                  {replyAuthor}
                                </span>

                                <span className="text-[10px] text-gray-400">
                                  {formatDate(replyCreatedAt)}
                                </span>
                              </div>

                              <p className="text-gray-600 text-sm">
                                {replyContent}
                              </p>
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
          <div className="text-center text-gray-400 py-6">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky bottom-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-green"
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
          />

          <button
            onClick={() => handleComment()}
            className="p-2 bg-brand-green text-white rounded-lg hover:bg-green-700"
          >
            <Send size={20} />
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
