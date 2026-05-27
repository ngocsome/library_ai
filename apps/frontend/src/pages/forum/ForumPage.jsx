import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Tag,
  ThumbsUp,
  MessageCircle,
  Loader2,
  Cpu,
  User as UserIcon,
  Compass,
  MessageSquare,
  BookOpen,
  Zap,
  HelpCircle
} from 'lucide-react';
import { getPosts, getForumCategories } from '../../services/forumService';

const getPostId = (post) => post.PostID || post.postId || post.id || post.ID;

const getPostTitle = (post) => post.Title || post.title || 'Không có tiêu đề';

const getCategoryName = (post) =>
  post.ForumCategories?.Name ||
  post.ForumCategories?.name ||
  post.CategoryName ||
  post.categoryName ||
  post.category?.name ||
  'Chung';

const getAuthorName = (post) =>
  post.Users?.FullName ||
  post.Users?.fullName ||
  post.Users?.Username ||
  post.Users?.username ||
  post.AuthorName ||
  post.authorName ||
  post.author ||
  'Ẩn danh';

const getCreatedAt = (post) =>
  post.CreatedAt || post.createdAt || post.created_at || post.CreatedDate || null;

const getLikeCount = (post) =>
  Number(
    post.Upvotes ??
      post.upvotes ??
      post.LikeCount ??
      post.likeCount ??
      post.likesCount ??
      post.LikesCount ??
      0
  );

const getCommentCount = (post) => {
  const directCount =
    post.CommentCount ??
    post.commentCount ??
    post.CommentsCount ??
    post.commentsCount ??
    post.TotalComments ??
    post.totalComments ??
    post._count?.ForumComments ??
    post._count?.comments;

  if (directCount !== undefined && directCount !== null) {
    const parsed = Number(directCount);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const comments = post.Comments || post.comments || post.ForumComments || post.forumComments;

  return Array.isArray(comments) ? comments.length : 0;
};

// Hàm tự động map icon phù hợp theo tên chủ đề diễn đàn
const getCategoryIcon = (name) => {
  const lowerName = String(name).toLowerCase();
  if (lowerName.includes('hỏi đáp')) return HelpCircle;
  if (lowerName.includes('chia sẻ') || lowerName.includes('tài liệu')) return BookOpen;
  if (lowerName.includes('kinh nghiệm')) return Cpu;
  if (lowerName.includes('chung')) return Tag;
  return Zap;
};

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [postsRes, catsRes] = await Promise.all([
          getPosts(selectedCategory ? { categoryId: selectedCategory } : {}),
          getForumCategories(),
        ]);

        setPosts(Array.isArray(postsRes) ? postsRes : []);
        setCategories(Array.isArray(catsRes) ? catsRes : []);
      } catch (error) {
        console.error('Failed to fetch forum data', error);
        setError(error.response?.data?.message || error.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Không rõ ngày';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Không rõ ngày';
    }

    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 space-y-8 relative overflow-hidden max-w-6xl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-emerald-250/15 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/10 to-transparent rounded-full filter blur-[140px] pointer-events-none z-0" />

      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
            Diễn đàn học tập
          </h1>
          <p className="text-xs text-slate-450 font-semibold mt-1.5 tracking-wide">
            Trao đổi tri thức công nghệ, thảo luận và hỗ trợ hỏi đáp trực tuyến
          </p>
        </div>

        <Link
          to="/forum/create"
          className="px-5 py-3 bg-brand-green hover:bg-green-700 text-white rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(5,150,105,0.15)] hover:shadow-[0_6px_16px_rgba(5,150,105,0.25)] cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={16} />
          Tạo bài viết
        </Link>
      </div>

      {/* Grid Layout 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative z-10">
        
        {/* Cột trái: DANH MỤC CHỦ ĐỀ ĐƯỢC THIẾT KẾ LẠI HOÀN HẢO */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.02)] shrink-0">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-4 pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <Compass size={16} className="text-brand-green animate-spin-slow" />
            Chủ đề diễn đàn
          </h3>

          <div className="space-y-1.5">
            {/* Nút: Tất cả */}
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border border-transparent ${
                !selectedCategory
                  ? 'bg-emerald-50 text-brand-green border-l-4 border-brand-green shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={15} className={!selectedCategory ? 'text-brand-green' : 'text-slate-400'} />
                <span>Tất cả</span>
              </div>
              
              {/* Dot LED nhấp nháy phát sáng khi được chọn */}
              {!selectedCategory && (
                <span className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              )}
            </button>

            {/* Vòng lặp nạp chủ đề */}
            {categories.map((cat, idx) => {
              const categoryId =
                cat.ForumCatID || cat.CategoryID || cat.categoryId || cat.id;
              const categoryName =
                cat.Name || cat.name || cat.CategoryName || cat.categoryName || 'Chủ đề';
              
              const isSelected = selectedCategory === categoryId;
              const CategoryIcon = getCategoryIcon(categoryName);

              return (
                <button
                  type="button"
                  key={categoryId || idx}
                  onClick={() => setSelectedCategory(categoryId)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border border-transparent ${
                    isSelected
                      ? 'bg-emerald-50 text-brand-green border-l-4 border-brand-green shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon size={15} className={isSelected ? 'text-brand-green' : 'text-slate-400'} />
                    <span className="truncate max-w-[150px]">{categoryName}</span>
                  </div>

                  {/* Dot LED nhấp nháy phát sáng */}
                  {isSelected && (
                    <span className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cột phải: Danh sách bài viết thảo luận */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-rose-50/80 backdrop-blur-sm text-rose-600 p-4.5 rounded-2xl border border-rose-100/50 text-center text-xs font-semibold leading-relaxed shadow-sm">
              <p className="font-extrabold text-sm">{error}</p>
              <span className="text-[10px] text-slate-400 font-medium block mt-1">Vui lòng thử đăng nhập lại hoặc tải lại trang web.</span>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[250px]">
              <Loader2 className="animate-spin text-brand-green w-8 h-8" />
            </div>
          ) : (
            posts.map((post, idx) => {
              const postId = getPostId(post);
              const title = getPostTitle(post);
              const categoryName = getCategoryName(post);
              const authorName = getAuthorName(post);
              const createdAt = getCreatedAt(post);
              const likeCount = getLikeCount(post);
              const commentCount = getCommentCount(post);

              return (
                <Link
                  to={`/forum/${postId}`}
                  key={postId || idx}
                  className="block bg-white rounded-3xl shadow-[0_4px_20px_rgba(15,23,42,0.02)] border border-slate-200/60 p-5 hover:shadow-md hover:border-slate-250 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    
                    {/* Avatar Gradient */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-green to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-[0_2px_8px_rgba(16,185,129,0.25)] shrink-0 group-hover:scale-105 transition-transform">
                      {authorName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Meta top */}
                      <div className="flex gap-2.5 items-center mb-2 flex-wrap">
                        <span className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-550 font-bold uppercase tracking-widest border border-slate-150/20">
                          {categoryName}
                        </span>

                        <span className="text-[10px] text-slate-400 font-semibold">
                          • {formatDate(createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-base text-slate-800 mb-3 group-hover:text-brand-green transition-colors truncate">
                        {title}
                      </h3>

                      {/* Footer Discussion Meta */}
                      <div className="flex items-center justify-between text-slate-500 text-xs font-bold flex-wrap gap-y-2 border-t border-slate-50 pt-3">
                        <div className="flex items-center gap-6">
                          <span className="flex items-center gap-1.5 text-slate-450 group-hover:text-brand-green transition-colors">
                            <ThumbsUp size={15} />
                            {likeCount} lượt thích
                          </span>

                          <span className="flex items-center gap-1.5 text-slate-450 group-hover:text-brand-green transition-colors">
                            <MessageCircle size={15} />
                            {commentCount} bình luận
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase flex items-center gap-1">
                          <UserIcon size={12} />
                          bởi {authorName}
                        </span>
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center">
              <MessageSquare size={36} className="text-slate-300 mb-3 animate-bounce" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1.5">
                Chưa có bài viết thảo luận
              </h3>
              <p className="text-xs font-semibold text-slate-450 max-w-xs mx-auto leading-relaxed">
                Chủ đề này chưa có bài thảo luận nào được tạo. Hãy là người mở đầu cho cuộc trò chuyện nhé!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForumPage;