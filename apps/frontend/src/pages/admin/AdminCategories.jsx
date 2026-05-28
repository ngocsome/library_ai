import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Edit3,
  Grid,
  Layers,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getDocuments,
  updateCategory,
} from '../../services/documentService';

const emptyForm = {
  name: '',
  description: '',
  icon: '',
};

const getCategoryId = (category) =>
  category?.id || category?.categoryId || category?.CategoryID || category?.CategoryId;

const getCategoryName = (category) =>
  category?.name || category?.Name || category?.CategoryName || category?.categoryName || 'Chưa có tên';

const getCategoryDescription = (category) =>
  category?.description || category?.Description || category?.categoryDescription || '';

const getCategoryIcon = (category) =>
  category?.icon || category?.Icon || category?.categoryIcon || '';

const getDocumentCategoryId = (doc) =>
  doc?.categoryId || doc?.CategoryID || doc?.CategoryId || doc?.category?.id || doc?.Category?.Id;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
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
      const [categoryData, documentData] = await Promise.all([
        getCategories(),
        getDocuments(),
      ]);

      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setDocuments(Array.isArray(documentData) ? documentData : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu chủ đề');
      setCategories([]);
      setDocuments([]);
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

  const documentCountByCategory = useMemo(() => {
    return documents.reduce((result, doc) => {
      const categoryId = getDocumentCategoryId(doc);
      if (!categoryId) return result;
      result[String(categoryId)] = (result[String(categoryId)] || 0) + 1;
      return result;
    }, {});
  }, [documents]);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;

    return categories.filter((category) => {
      const name = getCategoryName(category).toLowerCase();
      const description = getCategoryDescription(category).toLowerCase();
      const icon = getCategoryIcon(category).toLowerCase();
      return name.includes(keyword) || description.includes(keyword) || icon.includes(keyword);
    });
  }, [categories, searchTerm]);

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
      icon: getCategoryIcon(category),
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      icon: formData.icon.trim(),
    };

    try {
      setSubmitting(true);

      if (modalMode === 'edit') {
        const categoryId = getCategoryId(editingCategory);
        if (!categoryId) {
          toast.error('Không tìm thấy ID chủ đề');
          return;
        }
        await updateCategory(categoryId, payload);
        toast.success('Cập nhật chủ đề thành công');
      } else {
        await createCategory(payload);
        toast.success('Thêm chủ đề thành công');
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

    const count = documentCountByCategory[String(categoryId)] || 0;
    if (count > 0) {
      toast.error(`Không thể xóa vì chủ đề "${categoryName}" đang có ${count} tài liệu`);
      return;
    }

    const ok = window.confirm(`Bạn có chắc chắn muốn xóa chủ đề "${categoryName}" không?`);
    if (!ok) return;

    try {
      await deleteCategory(categoryId);
      setCategories((prev) => prev.filter((item) => String(getCategoryId(item)) !== String(categoryId)));
      toast.success('Đã xóa chủ đề');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa chủ đề thất bại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý chủ đề</h1>
          <p className="text-slate-500 text-sm mt-1">
            Thêm, sửa hoặc xóa các chủ đề đang hiển thị ở trang Thư viện.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
        >
          <Plus size={16} />
          Thêm chủ đề
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Tags size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng chủ đề</p>
            <p className="text-xl font-bold text-slate-900">{categories.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tài liệu đã gắn</p>
            <p className="text-xl font-bold text-slate-900">
              {Object.values(documentCountByCategory).reduce((sum, value) => sum + value, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Layers size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Chưa có tài liệu</p>
            <p className="text-xl font-bold text-slate-900">
              {categories.filter((cat) => !documentCountByCategory[String(getCategoryId(cat))]).length}
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
            placeholder="Tìm theo tên chủ đề, mô tả, icon..."
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Chủ đề</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số tài liệu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category) => {
                const categoryId = getCategoryId(category);
                const count = documentCountByCategory[String(categoryId)] || 0;

                return (
                  <tr key={categoryId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                          <Grid size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{getCategoryName(category)}</p>
                          <p className="text-xs text-slate-400 mt-0.5">ID: {categoryId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {getCategoryDescription(category) || 'Chưa có mô tả'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {count} tài liệu
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Sửa chủ đề"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={count > 0 ? 'Không thể xóa chủ đề đang có tài liệu' : 'Xóa chủ đề'}
                          disabled={count > 0}
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
            Không tìm thấy chủ đề phù hợp.
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
            onMouseDown={closeModal}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onMouseDown={(event) => event.stopPropagation()}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'edit' ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Chủ đề sẽ hiển thị ở mục “Khám phá theo chủ đề”.
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

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Tên chủ đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Marketing, Lập trình Web, Toán cao cấp..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
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
                    placeholder="Mô tả ngắn về nhóm tài liệu của chủ đề này..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Icon / mã icon
                  </label>
                  <input
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Có thể để trống"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
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
                  className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Đang lưu...' : modalMode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;