import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Link as LinkIcon,
  Image,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPost, getForumCategories } from '../../services/forumService';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getForumCategories();
        const list = Array.isArray(data) ? data : [];

        setCategories(list);

        if (list.length > 0) {
          const firstCategoryId =
            list[0].ForumCatID ||
            list[0].CategoryID ||
            list[0].id;

          setSelectedCat(firstCategoryId || '');
        }
      } catch (error) {
        console.error('Failed to fetch forum categories', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }

    setLoading(true);

    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        categoryId: selectedCat || null,
      });

      navigate('/forum');
    } catch (error) {
      console.error('Create post failed', error);
      alert(error.response?.data?.message || 'Lỗi tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/forum"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Quay lại diễn đàn
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Tạo bài thảo luận mới
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài viết
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                placeholder="Đặt câu hỏi hoặc chia sẻ trăn trở của bạn..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung chi tiết
              </label>

              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none resize-none"
                placeholder="Mô tả kỹ hơn về vấn đề..."
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chủ đề
                </label>

                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                >
                  <option value="">Chọn chủ đề</option>

                  {categories.map((cat) => {
                    const categoryId =
                      cat.ForumCatID ||
                      cat.CategoryID ||
                      cat.id;

                    const categoryName =
                      cat.Name ||
                      cat.name ||
                      cat.CategoryName ||
                      cat.categoryName ||
                      'Chưa đặt tên';

                    return (
                      <option key={categoryId} value={categoryId}>
                        {categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <Image size={20} />
                </button>

                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <LinkIcon size={20} />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                Đăng bài
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;