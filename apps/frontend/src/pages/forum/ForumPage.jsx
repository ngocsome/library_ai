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
        setError(error.message || 'Không thể tải dữ liệu');
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
                  cat.ForumCatID || cat.CategoryID || cat.id;
                const categoryName =
                  cat.Name || cat.name || cat.CategoryName || 'Chủ đề';

                return (
                  <button
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
              (Vui lòng thử đăng nhập lại)
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-brand-green" />
            </div>
          ) : (
            posts.map((post, idx) => {
              const postId = post.PostID || post.id;
              const title = post.Title || post.title || 'Không có tiêu đề';
              const categoryName =
                post.ForumCategories?.Name ||
                post.CategoryName ||
                post.categoryName ||
                'Chung';
              const authorName =
                post.Users?.FullName ||
                post.AuthorName ||
                post.authorName ||
                'Ẩn danh';
              const createdAt =
                post.CreatedAt || post.createdAt || post.created_at;
              const likeCount = post.Upvotes ?? post.LikeCount ?? post.likeCount ?? 0;
              const comments = post.Comments || post.comments || [];
              const commentCount =
                post._count?.ForumComments ?? comments.length ?? 0;

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

                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                          {categoryName}
                        </span>

                        <span className="text-xs text-gray-400">
                          • {formatDate(createdAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-brand-green transition-colors">
                        {title}
                      </h3>

                      <div className="flex items-center gap-6 text-gray-500 text-sm">
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