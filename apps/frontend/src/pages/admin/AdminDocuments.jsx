import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  Download,
  Edit,
  Eye,
  FileBox,
  FileCode,
  FileText,
  Filter,
  Layers,
  MoreVertical,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  getDocuments,
  getCategories,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../../services/documentService';

const emptyForm = () => ({
  title: '',
  description: '',
  author: '',
  publishYear: String(new Date().getFullYear()),
  categoryId: '',
  accessLevel: 'Public',
});

const emptyFiles = () => ({
  document: null,
  thumbnail: null,
});

const getId = (doc) =>
  doc?.DocID || doc?.DocumentID || doc?.documentId || doc?.id || doc?._id;

const getTitle = (doc) =>
  doc?.Title || doc?.title || doc?.DocumentTitle || doc?.documentTitle || 'Không có tiêu đề';

const getDescription = (doc) =>
  doc?.Description || doc?.description || doc?.Summary || doc?.summary || '';

const getAuthor = (doc) =>
  doc?.Author || doc?.author || doc?.UploadedByName || doc?.uploadedByName || 'Ẩn danh';

const getCategoryId = (doc) =>
  doc?.CategoryID ||
  doc?.categoryId ||
  doc?.CategoryId ||
  doc?.category?.CategoryID ||
  doc?.category?.categoryId ||
  doc?.category?.id ||
  doc?.categories?.CategoryID ||
  doc?.categories?.categoryId ||
  doc?.categories?.id ||
  '';

const getCategoryName = (doc) =>
  doc?.CategoryName ||
  doc?.categoryName ||
  doc?.category?.Name ||
  doc?.category?.name ||
  doc?.category?.CategoryName ||
  doc?.category?.categoryName ||
  doc?.categories?.Name ||
  doc?.categories?.name ||
  doc?.categories?.CategoryName ||
  doc?.categories?.categoryName ||
  'Khác';

const getCategoryOptionId = (cat) =>
  cat?.CategoryID || cat?.categoryId || cat?.CategoryId || cat?.id;

const getCategoryOptionName = (cat) =>
  cat?.Name || cat?.name || cat?.CategoryName || cat?.categoryName || 'Chưa đặt tên';

const getFileType = (doc) =>
  String(doc?.FileType || doc?.fileType || doc?.Type || doc?.type || 'file').toLowerCase();

const getCreatedAt = (doc) =>
  doc?.CreatedAt || doc?.createdAt || doc?.created_at || doc?.UploadedAt || doc?.uploadedAt || null;

const getPublishYear = (doc) => {
  const value =
    doc?.PublishYear ||
    doc?.publishYear ||
    doc?.PublishedYear ||
    doc?.publishedYear ||
    doc?.Year ||
    doc?.year ||
    '';

  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
};

const getAccessLevel = (doc) =>
  String(doc?.AccessLevel || doc?.accessLevel || doc?.Visibility || doc?.visibility || 'Public');

const getViewCount = (doc) =>
  Number(doc?.ViewCount || doc?.viewCount || doc?.Views || doc?.views || 0);

const buildSafeDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const onlyNumberYear = (value) => value.replace(/[^0-9]/g, '').slice(0, 4);

const DocumentModal = ({
  open,
  mode,
  formData,
  files,
  categories,
  submitting,
  onClose,
  onSubmit,
  onChange,
  onYearChange,
  onFileChange,
}) => {
  if (!open) return null;

  const isEdit = mode === 'edit';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                {isEdit ? <Edit size={20} /> : <Upload size={20} />}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEdit ? 'Sửa tài liệu' : 'Tải lên tài liệu mới'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isEdit
                    ? 'Cập nhật thông tin tài liệu. Không chọn file mới thì giữ file cũ.'
                    : 'Điền thông tin và chọn file để thêm tài liệu vào hệ thống.'}
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

          <form onSubmit={onSubmit} className="p-6 max-h-[72vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tên tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  required
                  placeholder="Ví dụ: Giáo trình Java"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  rows="3"
                  placeholder="Nhập mô tả ngắn cho tài liệu..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tác giả
                </label>
                <input
                  name="author"
                  value={formData.author}
                  onChange={onChange}
                  placeholder="Tên tác giả"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Năm xuất bản
                </label>
                <input
                  name="publishYear"
                  value={formData.publishYear}
                  onChange={onYearChange}
                  inputMode="numeric"
                  placeholder="2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => {
                    const id = getCategoryOptionId(cat);
                    return (
                      <option key={id} value={id}>
                        {getCategoryOptionName(cat)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Quyền truy cập
                </label>
                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {isEdit ? 'Đổi file tài liệu nếu muốn' : 'File tài liệu *'}
                </label>
                <label className="relative block cursor-pointer">
                  <input
                    type="file"
                    name="document"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className={`min-h-[105px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 px-4 text-center transition-all ${
                      files.document
                        ? 'border-primary-300 bg-primary-50 text-primary-700'
                        : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-primary-300 hover:bg-primary-50/40'
                    }`}
                  >
                    {files.document ? <Check size={24} /> : <FileText size={24} />}
                    <span className="text-xs font-bold line-clamp-2">
                      {files.document
                        ? files.document.name
                        : isEdit
                        ? 'Không chọn sẽ giữ file cũ'
                        : 'Chọn file tài liệu'}
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ảnh thu nhỏ
                </label>
                <label className="relative block cursor-pointer">
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div
                    className={`min-h-[105px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 px-4 text-center transition-all ${
                      files.thumbnail
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    {files.thumbnail ? <Check size={24} /> : <Layers size={24} />}
                    <span className="text-xs font-bold line-clamp-2">
                      {files.thumbnail ? files.thumbnail.name : 'Chọn ảnh thu nhỏ'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-7 flex gap-3">
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
                className="flex-[2] py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-900/20 disabled:bg-primary-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {isEdit ? <Edit size={17} /> : <Upload size={17} />}
                    {isEdit ? 'Lưu thay đổi' : 'Tải lên tài liệu'}
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

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    fileType: '',
    accessLevel: '',
    yearFrom: '',
    yearTo: '',
    sortBy: 'newest',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [files, setFiles] = useState(emptyFiles);
  const [submitting, setSubmitting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách tài liệu');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh mục');
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleAdminSearch = (event) => {
      setSearchTerm(event.detail?.value || '');
    };

    window.addEventListener('admin-global-search', handleAdminSearch);
    return () => window.removeEventListener('admin-global-search', handleAdminSearch);
  }, []);

  const resetForm = () => {
    setFormData(emptyForm());
    setFiles(emptyFiles());
    setEditingDoc(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setModalMode('edit');
    setFormData({
      title: getTitle(doc),
      description: getDescription(doc),
      author: getAuthor(doc) === 'Ẩn danh' ? '' : getAuthor(doc),
      publishYear: String(getPublishYear(doc) || new Date().getFullYear()),
      categoryId: String(getCategoryId(doc) || ''),
      accessLevel: getAccessLevel(doc),
    });
    setFiles(emptyFiles());
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

  const handleYearChange = (event) => {
    const value = onlyNumberYear(event.target.value);
    setFormData((prev) => ({ ...prev, publishYear: value }));
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    if (!selectedFiles?.[0]) return;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const buildFormData = (requireFile) => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên tài liệu');
      return null;
    }

    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục');
      return null;
    }

    if (requireFile && !files.document) {
      toast.error('Vui lòng chọn file tài liệu');
      return null;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description || '');
    payload.append('author', formData.author || '');
    payload.append('publishYear', formData.publishYear || '');
    payload.append('categoryId', formData.categoryId);
    payload.append('accessLevel', formData.accessLevel || 'Public');

    if (files.document) payload.append('document', files.document);
    if (files.thumbnail) payload.append('thumbnail', files.thumbnail);

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isEdit = modalMode === 'edit';
    const payload = buildFormData(!isEdit);
    if (!payload) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const docId = getId(editingDoc);
        if (!docId) {
          toast.error('Không tìm thấy ID tài liệu');
          return;
        }
        await updateDocument(docId, payload);
        toast.success('Cập nhật tài liệu thành công');
      } else {
        await createDocument(payload);
        toast.success('Tải lên tài liệu thành công');
      }

      setModalOpen(false);
      resetForm();
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || (isEdit ? 'Cập nhật thất bại' : 'Tải lên thất bại'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doc) => {
    const docId = getId(doc);
    if (!docId) {
      toast.error('Không tìm thấy ID tài liệu');
      return;
    }

    const ok = window.confirm(`Bạn có chắc chắn muốn xóa tài liệu "${getTitle(doc)}" không?`);
    if (!ok) return;

    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((item) => String(getId(item)) !== String(docId)));
      toast.success('Đã xóa tài liệu');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa tài liệu thất bại');
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const fixedValue = name === 'yearFrom' || name === 'yearTo' ? onlyNumberYear(value) : value;
    setFilters((prev) => ({ ...prev, [name]: fixedValue }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      categoryId: '',
      fileType: '',
      accessLevel: '',
      yearFrom: '',
      yearTo: '',
      sortBy: 'newest',
    });
    window.dispatchEvent(new CustomEvent('admin-global-search', { detail: { value: '' } }));
  };

  const filteredDocs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    const yearFrom = filters.yearFrom ? Number(filters.yearFrom) : null;
    const yearTo = filters.yearTo ? Number(filters.yearTo) : null;

    return documents
      .filter((doc) => {
        const title = getTitle(doc).toLowerCase();
        const author = getAuthor(doc).toLowerCase();
        const categoryName = getCategoryName(doc).toLowerCase();
        const fileType = getFileType(doc).toLowerCase();
        const accessLevel = getAccessLevel(doc).toLowerCase();
        const publishYear = getPublishYear(doc);
        const categoryId = String(getCategoryId(doc) || '');

        const matchKeyword =
          !keyword ||
          title.includes(keyword) ||
          author.includes(keyword) ||
          categoryName.includes(keyword) ||
          fileType.includes(keyword) ||
          accessLevel.includes(keyword) ||
          String(publishYear || '').includes(keyword);

        const matchCategory = !filters.categoryId || categoryId === String(filters.categoryId);
        const matchType = !filters.fileType || fileType === filters.fileType.toLowerCase();
        const matchAccess = !filters.accessLevel || accessLevel === filters.accessLevel.toLowerCase();
        const matchYearFrom = !yearFrom || (publishYear !== null && publishYear >= yearFrom);
        const matchYearTo = !yearTo || (publishYear !== null && publishYear <= yearTo);

        return matchKeyword && matchCategory && matchType && matchAccess && matchYearFrom && matchYearTo;
      })
      .sort((a, b) => {
        const aDate = buildSafeDate(getCreatedAt(a));
        const bDate = buildSafeDate(getCreatedAt(b));

        switch (filters.sortBy) {
          case 'oldest':
            return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
          case 'viewsDesc':
            return getViewCount(b) - getViewCount(a);
          case 'titleAsc':
            return getTitle(a).localeCompare(getTitle(b), 'vi');
          case 'titleDesc':
            return getTitle(b).localeCompare(getTitle(a), 'vi');
          case 'newest':
          default:
            return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
        }
      });
  }, [documents, searchTerm, filters]);

  const uniqueFileTypes = useMemo(
    () => [...new Set(documents.map((doc) => getFileType(doc)).filter(Boolean))],
    [documents]
  );

  const activeFilterCount = [
    searchTerm,
    filters.categoryId,
    filters.fileType,
    filters.accessLevel,
    filters.yearFrom,
    filters.yearTo,
  ].filter(Boolean).length;

  const handleExportReport = () => {
    const headers = ['Tên tài liệu', 'Danh mục', 'Tác giả', 'Loại file', 'Năm xuất bản', 'Quyền truy cập', 'Lượt xem'];
    const rows = filteredDocs.map((doc) => [
      getTitle(doc),
      getCategoryName(doc),
      getAuthor(doc),
      getFileType(doc).toUpperCase(),
      getPublishYear(doc) || '',
      getAccessLevel(doc),
      getViewCount(doc),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bao-cao-tai-lieu-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Đã xuất báo cáo');
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý tài liệu</h1>
          <p className="text-slate-500 text-sm mt-1">Duyệt, chỉnh sửa hoặc xóa các tài liệu số trong hệ thống.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Xuất báo cáo
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
          >
            <Upload size={16} />
            Tải lên tài liệu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng tài liệu</p>
            <p className="text-xl font-bold text-slate-900">{documents.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Eye size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng lượt xem</p>
            <p className="text-xl font-bold text-slate-900">{documents.reduce((sum, doc) => sum + getViewCount(doc), 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Layers size={20} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Danh mục</p>
            <p className="text-xl font-bold text-slate-900">{new Set(documents.map((doc) => getCategoryId(doc)).filter(Boolean)).size}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên tài liệu, tác giả, danh mục, loại file..."
              className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedFilter((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              showAdvancedFilter || activeFilterCount > 0
                ? 'bg-primary-50 text-primary-700 border border-primary-100'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Filter size={16} />
            Lọc nâng cao
            {activeFilterCount > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary-600 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showAdvancedFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
                <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => {
                    const id = getCategoryOptionId(cat);
                    return <option key={id} value={id}>{getCategoryOptionName(cat)}</option>;
                  })}
                </select>

                <select name="fileType" value={filters.fileType} onChange={handleFilterChange} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="">Tất cả loại file</option>
                  {uniqueFileTypes.map((type) => <option key={type} value={type}>{type.toUpperCase()}</option>)}
                </select>

                <select name="accessLevel" value={filters.accessLevel} onChange={handleFilterChange} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="">Tất cả quyền</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Premium">Premium</option>
                </select>

                <input name="yearFrom" value={filters.yearFrom} onChange={handleFilterChange} inputMode="numeric" placeholder="Từ năm" className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20" />
                <input name="yearTo" value={filters.yearTo} onChange={handleFilterChange} inputMode="numeric" placeholder="Đến năm" className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20" />

                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="viewsDesc">Lượt xem cao</option>
                  <option value="titleAsc">Tên A-Z</option>
                  <option value="titleDesc">Tên Z-A</option>
                </select>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>Đang hiển thị <b>{filteredDocs.length}</b> / {documents.length} tài liệu</span>
                <button type="button" onClick={resetFilters} className="text-primary-600 hover:text-primary-700 font-semibold">Xóa bộ lọc</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên tài liệu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tác giả</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thống kê</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc, index) => {
                const id = getId(doc);
                const type = getFileType(doc);
                const createdAt = buildSafeDate(getCreatedAt(doc));

                return (
                  <motion.tr
                    key={id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-white group-hover:text-primary-500 transition-all shrink-0">
                          {type === 'pdf' ? <FileText size={24} /> : type === 'doc' || type === 'docx' ? <FileCode size={24} /> : <FileBox size={24} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">{getTitle(doc)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{type}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar size={10} />
                              {createdAt ? createdAt.toLocaleDateString('vi-VN') : 'Chưa rõ ngày'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {getCategoryName(doc)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {getAuthor(doc).charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{getAuthor(doc)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                          <Eye size={14} className="text-slate-400" />
                          {getViewCount(doc).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">Cập nhật gần nhất</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => openEditModal(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Sửa tài liệu">
                          <Edit size={18} />
                        </button>
                        <button type="button" onClick={() => handleDelete(doc)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Xóa tài liệu">
                          <Trash2 size={18} />
                        </button>
                        <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" title="Thêm thao tác">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-24 bg-slate-50/30">
            <FileText size={64} className="mx-auto text-slate-100 mb-4" />
            <h3 className="text-slate-900 font-bold">Không tìm thấy tài liệu</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
          </div>
        )}
      </div>

      <DocumentModal
        open={modalOpen}
        mode={modalMode}
        formData={formData}
        files={files}
        categories={categories}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onYearChange={handleYearChange}
        onFileChange={handleFileChange}
      />
    </div>
  );
};

export default AdminDocuments;
