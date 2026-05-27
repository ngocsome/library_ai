import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Link as LinkIcon,
  Image,
  Loader2,
  Cpu,
  MessageSquarePlus,
  Compass
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
    <div className="container mx-auto px-6 pt-32 pb-20 relative overflow-hidden max-w-4xl">
      
      {/* Background Ambient Glows (Đốm sáng chiều sâu công nghệ) */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-emerald-250/20 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/10 to-transparent rounded-full filter blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Nút Quay lại có hiệu ứng trượt nhẹ */}
        <Link
          to="/forum"
          className="flex items-center gap-2 text-slate-450 hover:text-slate-800 font-bold text-xs tracking-wider uppercase transition-all duration-300 mb-6 group hover:-translate-x-1"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại diễn đàn
        </Link>

        {/* Khung Soạn Thảo Kính Mờ Cyber Editor */}
        <div className="bg-white rounded-[28px] shadow-[0_12px_40px_rgba(15,23,42,0.03)] border border-slate-200/60 p-6 sm:p-8 relative overflow-hidden">
          
          <h1 className="text-xl sm:text-2xl font-black text-slate-850 mb-6 tracking-tight flex items-center gap-2.5">
            <MessageSquarePlus size={24} className="text-brand-green animate-pulse" />
            Tạo bài thảo luận mới
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tiêu đề bài viết */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu size={12} className="text-brand-green" />
                Tiêu đề bài viết
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all outline-none text-sm font-semibold text-slate-800 placeholder-slate-400"
                placeholder="Đặt câu hỏi hoặc chia sẻ trăn trở của bạn với cộng đồng..."
                required
              />
            </div>

            {/* Nội dung chi tiết */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquarePlus size={12} className="text-brand-green" />
                Nội dung chi tiết
              </label>

              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all outline-none resize-none text-sm font-semibold text-slate-800 placeholder-slate-400 leading-relaxed"
                placeholder="Mô tả chi tiết và kỹ càng hơn về vấn đề của bạn..."
                required
              />
            </div>

            {/* Chủ đề chọn lọc */}
            <div className="flex gap-4">
              <div className="w-full max-w-xs">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass size={12} className="text-brand-green" />
                  Chủ đề thảo luận
                </label>

                <select
                  className="w-full px-4.5 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green outline-none text-xs font-bold text-slate-700 bg-white transition-all cursor-pointer"
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                >
                  <option value="" className="font-bold">Chọn chủ đề phù hợp</option>

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
                      <option key={categoryId} value={categoryId} className="font-semibold">
                        {categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Chân soạn thảo (Rich Action Bar) */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-8">
              {/* Công cụ đính kèm */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="p-2.5 text-slate-400 hover:text-brand-green hover:bg-green-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-green-100/50 shadow-sm"
                  title="Đính kèm ảnh"
                >
                  <Image size={18} />
                </button>

                <button
                  type="button"
                  className="p-2.5 text-slate-400 hover:text-brand-green hover:bg-green-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-green-100/50 shadow-sm"
                  title="Chèn liên kết"
                >
                  <LinkIcon size={18} />
                </button>
              </div>

              {/* Nút Đăng Bài */}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brand-green hover:bg-green-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] transition-all flex items-center gap-2 disabled:bg-green-300 disabled:shadow-none group cursor-pointer active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={15} />
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    Đăng bài
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;