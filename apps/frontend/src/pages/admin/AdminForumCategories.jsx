import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit3,
  Hash,
  MessageSquare,
  Palette,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import {
  createForumCategory,
  deleteForumCategory,
  getForumCategories,
  getPosts,
  updateForumCategory,
} from '../../services/forumService';

const emptyForm = {
  name: '',
  description: '',
  color: '#10b981',
};

const colorOptions = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#14b8a6',
  '#64748b',
];

const getCategoryId = (category) =>
  category?.CategoryID || category?.categoryId || category?.id || category?.CategoryId;

const getCategoryName = (category) =>
  category?.Name || category?.name || category?.CategoryName || category?.categoryName || 'Chưa có tên';

const getCategoryDescription = (category) =>
  category?.Description || category?.description || '';

const getCategoryColor = (category) =>
  category?.Color || category?.color || '#10b981';

const getPostCategoryId = (post) =>
  post?.CategoryID ||
  post?.categoryId ||
  post?.CategoryId ||
  post?.category?.id ||
  post?.Category?.Id;

const AdminForumCategories = () => {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoryData, postData] = await Promise.all([
        getForumCategories(),
        getPosts(),
      ]);

      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setPosts(Array.isArray(postData) ? postData : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu chủ đề diễn đàn');
      setCategories([]);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleAdminSearch = (event) => {
      setSearchTerm(event.detail?.value || '');
    };

    window.addEventListener('admin-global-search', handleAdminSearch);
    return () => window.removeEventListener('admin-global-search', handleAdminSearch);
  }, []);

  const postCountByCategory = useMemo(() => {
    return posts.reduce((result, post) => {
      const categoryId = getPostCategoryId(post);

      if (!categoryId) return result;

      result[String(categoryId)] = (result[String(categoryId)] || 0) + 1;
      return result;
    }, {});
  }, [posts]);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return categories;

    return categories.filter((category) => {
      const name = getCategoryName(category).toLowerCase();
      const description = getCategoryDescription(category).toLowerCase();
      const color = getCategoryColor(category).toLowerCase();

      return (
        name.includes(keyword) ||
        description.includes(keyword) ||
        color.includes(keyword)
      );
    });
  }, [categories, searchTerm]);

  const stats = useMemo(() => {
    const totalPosts = Object.values(postCountByCategory).reduce(
      (sum, value) => sum + value,
      0
    );

    const emptyCategories = categories.filter(
      (category) => !postCountByCategory[String(getCategoryId(category))]
    ).length;

    return {
      totalCategories: categories.length,
      totalPosts,
      emptyCategories,
    };
  }, [categories, postCountByCategory]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalMode('edit');
    setFormData({
      name: getCategoryName(category),
      description: getCategoryDescription(category),
      color: getCategoryColor(category),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setModalOpen(false);
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên chủ đề');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color || '#10b981',
    };

    try {
      setSubmitting(true);

      if (modalMode === 'edit') {
        const categoryId = getCategoryId(editingCategory);

        if (!categoryId) {
          toast.error('Không tìm thấy ID chủ đề');
          return;
        }

        await updateForumCategory(categoryId, payload);
        toast.success('Cập nhật chủ đề diễn đàn thành công');
      } else {
        await createForumCategory(payload);
        toast.success('Thêm chủ đề diễn đàn thành công');
      }

      setModalOpen(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Lưu chủ đề thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const categoryId = getCategoryId(category);
    const categoryName = getCategoryName(category);

    if (!categoryId) {
      toast.error('Không tìm thấy ID chủ đề');
      return;
    }

    const postCount = postCountByCategory[String(categoryId)] || 0;

    if (postCount > 0) {
      toast.error(
        `Không thể xóa vì chủ đề "${categoryName}" đang có ${postCount} bài viết`
      );
      return;
    }

    const ok = window.confirm(
      `Bạn có chắc chắn muốn xóa chủ đề diễn đàn "${categoryName}" không?`
    );

    if (!ok) return;

    try {
      await deleteForumCategory(categoryId);

      setCategories((prev) =>
        prev.filter((item) => String(getCategoryId(item)) !== String(categoryId))
      );

      toast.success('Đã xóa chủ đề diễn đàn');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa chủ đề thất bại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý chủ đề diễn đàn
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Admin có thể thêm, sửa hoặc xóa các chủ đề hiển thị ở trang Diễn đàn.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-900/20"
        >
          <Plus size={16} />
          Thêm chủ đề
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <Tags size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Tổng chủ đề
            </p>
            <p className="text-xl font-bold text-slate-900">
              {stats.totalCategories}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Bài viết đã gắn
            </p>
            <p className="text-xl font-bold text-slate-900">
              {stats.totalPosts}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Hash size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Chưa có bài viết
            </p>
            <p className="text-xl font-bold text-slate-900">
              {stats.emptyCategories}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên chủ đề, mô tả, màu..."
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Màu
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Số bài viết
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category) => {
                const categoryId = getCategoryId(category);
                const categoryName = getCategoryName(category);
                const categoryDescription = getCategoryDescription(category);
                const categoryColor = getCategoryColor(category);
                const postCount = postCountByCategory[String(categoryId)] || 0;

                return (
                  <tr key={categoryId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm"
                          style={{ backgroundColor: categoryColor }}
                        >
                          <Hash size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {categoryName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: {categoryId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {categoryDescription || 'Chưa có mô tả'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-lg border border-slate-200 shadow-sm"
                          style={{ backgroundColor: categoryColor }}
                        />
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          {categoryColor}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {postCount} bài viết
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Sửa chủ đề"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={postCount > 0}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={
                            postCount > 0
                              ? 'Không thể xóa chủ đề đang có bài viết'
                              : 'Xóa chủ đề'
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            Không tìm thấy chủ đề diễn đàn phù hợp.
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 pointer-events-auto"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'edit'
                      ? 'Sửa chủ đề diễn đàn'
                      : 'Thêm chủ đề diễn đàn'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Chủ đề sẽ hiển thị ở menu bên trái trang Diễn đàn.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Tên chủ đề <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hỏi đáp học tập, Chia sẻ tài liệu..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Mô tả
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Mô tả ngắn về chủ đề diễn đàn này..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    Màu chủ đề
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`w-9 h-9 rounded-xl border-2 transition-all ${
                          formData.color === color
                            ? 'border-slate-900 scale-110 shadow-md'
                            : 'border-white shadow-sm hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}

                    <div className="flex items-center gap-2 ml-0 md:ml-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      <input
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="#10b981"
                        className="w-28 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors disabled:opacity-60"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? 'Đang lưu...'
                    : modalMode === 'edit'
                      ? 'Cập nhật'
                      : 'Thêm mới'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminForumCategories;