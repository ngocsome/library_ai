import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Tag,
  ThumbsUp,
  MessageCircle,
  Loader2,
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
    <div className="container mx-auto px-6 pt-24 pb-12 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Diễn đàn học tập
          </h1>
          <p className="text-gray-500 text-sm">
            Trao đổi kiến thức, thảo luận và hỏi đáp
          </p>
        </div>

        <Link
          to="/forum/create"
          className="px-4 py-2 bg-brand-green text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Tạo bài viết
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Tag size={18} />
              Chủ đề
            </h3>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-brand-green/10 text-brand-green font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tất cả
              </button>

              {categories.map((cat, idx) => {
                const categoryId =
                  cat.ForumCatID || cat.CategoryID || cat.categoryId || cat.id;
                const categoryName =
                  cat.Name || cat.name || cat.CategoryName || cat.categoryName || 'Chủ đề';

                return (
                  <button
                    type="button"
                    key={categoryId || idx}
                    onClick={() => setSelectedCategory(categoryId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === categoryId
                        ? 'bg-brand-green/10 text-brand-green font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
              {error}
              <br />
              <span className="text-xs">Vui lòng thử đăng nhập lại hoặc tải lại trang.</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-green" />
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
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="font-bold text-gray-500">
                        {authorName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 items-center mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                          {categoryName}
                        </span>

                        <span className="text-xs text-gray-400">
                          • {formatDate(createdAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-brand-green transition-colors truncate">
                        {title}
                      </h3>

                      <div className="flex items-center gap-6 text-gray-500 text-sm flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <ThumbsUp size={16} />
                          {likeCount}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MessageCircle size={16} />
                          {commentCount} bình luận
                        </span>

                        <span className="text-xs">bởi {authorName}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}

          {!loading && posts.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              Chưa có bài viết nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
