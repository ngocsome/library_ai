import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Edit,
  Eye,
  Loader2,
  Newspaper,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  createNews,
  deleteNews,
  getAdminNews,
  updateNews,
} from '../../services/newsService';

const emptyForm = {
  title: '',
  summary: '',
  content: '',
  thumbnailUrl: '',
  category: '',
  featured: false,
  status: 'PUBLISHED',
};

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const handleAdminSearch = (event) => {
      setSearchKeyword(event.detail?.value || '');
    };

    window.addEventListener('admin-global-search', handleAdminSearch);

    return () => {
      window.removeEventListener('admin-global-search', handleAdminSearch);
    };
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAdminNews();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi tải danh sách tin tức:', error);
      toast.error('Không thể tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return newsList;

    return newsList.filter((item) => {
      return (
        item.title?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword)
      );
    });
  }, [newsList, searchKeyword]);

  const stats = useMemo(() => {
    return {
      total: newsList.length,
      published: newsList.filter((item) => item.status === 'PUBLISHED').length,
      draft: newsList.filter((item) => item.status === 'DRAFT').length,
      featured: newsList.filter((item) => item.featured).length,
    };
  }, [newsList]);

  const openCreateModal = () => {
    setEditingNews(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (news) => {
    setEditingNews(news);
    setFormData({
      title: news.title || '',
      summary: news.summary || '',
      content: news.content || '',
      thumbnailUrl: news.thumbnailUrl || '',
      category: news.category || '',
      featured: Boolean(news.featured),
      status: news.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingNews(null);
    setFormData(emptyForm);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề tin tức');
      return false;
    }

    if (!formData.content.trim()) {
      toast.error('Vui lòng nhập nội dung tin tức');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        thumbnailUrl: formData.thumbnailUrl.trim(),
        category: formData.category.trim() || 'TIN TỨC',
        featured: formData.featured,
        status: formData.status,
      };

      if (editingNews) {
        await updateNews(editingNews.id, payload);
        toast.success('Cập nhật tin tức thành công');
      } else {
        await createNews(payload);
        toast.success('Thêm tin tức thành công');
      }

      closeModal();
      fetchNews();
    } catch (error) {
      console.error('Lỗi lưu tin tức:', error);
      toast.error(error.response?.data?.message || 'Không thể lưu tin tức');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (news) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa tin tức "${news.title}" không?`
    );

    if (!confirmDelete) return;

    try {
      await deleteNews(news.id);
      toast.success('Xóa tin tức thành công');
      fetchNews();
    } catch (error) {
      console.error('Lỗi xóa tin tức:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa tin tức');
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Chưa cập nhật';

    try {
      return new Date(dateValue).toLocaleDateString('vi-VN');
    } catch {
      return 'Chưa cập nhật';
    }
  };

  const getThumbnail = (item) => {
    return (
      item.thumbnailUrl ||
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700">
            <Newspaper size={16} />
            QUẢN LÝ TIN TỨC
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Tin tức
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Thêm, sửa, xóa và quản lý các bài viết hiển thị trên trang Tin tức.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <Plus size={18} />
          Thêm tin tức
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Tổng tin" value={stats.total} />
        <StatCard label="Đã xuất bản" value={stats.published} />
        <StatCard label="Bản nháp" value={stats.draft} />
        <StatCard label="Tin tiêu điểm" value={stats.featured} />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tiêu đề, mô tả, danh mục, trạng thái..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <button
            onClick={fetchNews}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tải lại
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            <span className="text-sm font-bold text-slate-500">
              Đang tải danh sách tin tức...
            </span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-4 text-lg font-black text-slate-900">
              Chưa có tin tức
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Hãy thêm tin tức đầu tiên để hiển thị ngoài trang người dùng.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Tin tức
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Tiêu điểm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Lượt xem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredNews.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={getThumbnail(item)}
                          alt={item.title}
                          className="h-16 w-20 rounded-2xl object-cover"
                        />

                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-sm font-black text-slate-900">
                            {item.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 max-w-md text-xs font-medium leading-5 text-slate-500">
                            {item.summary || 'Chưa có mô tả ngắn'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                        {item.category || 'TIN TỨC'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {item.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                          <Star size={13} />
                          Có
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Không
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-black text-slate-700">
                        <Eye size={16} className="text-slate-400" />
                        {item.viewCount || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
                          title="Sửa tin tức"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                          title="Xóa tin tức"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  {editingNews ? 'Cập nhật tin tức' : 'Thêm tin tức mới'}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Nhập thông tin bài viết để hiển thị ngoài trang tin tức.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-2xl bg-slate-100 p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(92vh-92px)] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề tin tức..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Danh mục
                  </label>

                  <input
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    placeholder="VD: THÔNG BÁO, KHÓA HỌC..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Trạng thái
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="PUBLISHED">Đã xuất bản</option>
                    <option value="DRAFT">Bản nháp</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Link ảnh đại diện
                  </label>

                  <input
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Mô tả ngắn
                  </label>

                  <textarea
                    value={formData.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    placeholder="Nhập mô tả ngắn cho tin tức..."
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Nội dung <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Nhập nội dung chi tiết tin tức..."
                    rows={10}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <label className="md:col-span-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />

                  <span className="text-sm font-black text-slate-700">
                    Đánh dấu là tin tiêu điểm
                  </span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}

                  {editingNews ? 'Lưu thay đổi' : 'Thêm tin tức'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
};

export default AdminNews;