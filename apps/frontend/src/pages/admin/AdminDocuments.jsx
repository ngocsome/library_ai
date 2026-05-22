import React, { useState, useEffect } from 'react';
import {
  FileText,
  Trash2,
  Eye,
  Search,
  Download,
  Filter,
  MoreVertical,
  Calendar,
  Layers,
  ExternalLink,
  FileCode,
  FileBox,
  Upload,
  X as CloseIcon,
  Check,
  Pencil,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDocuments,
  getCategories,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../../services/documentService';
import { toast } from 'react-hot-toast';

const DocumentFormModal = ({
  type = 'upload',
  title,
  subtitle,
  icon,
  isOpen,
  onClose,
  onSubmit,
  submitLabel,
  formData,
  files,
  categories,
  isSubmitting,
  onInputChange,
  onPublishYearChange,
  onFileChange,
}) => {
  if (!isOpen) return null;

  const isEdit = type === 'edit';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                {icon}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {title}
                </h2>

                <p className="text-slate-500 text-sm">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
            >
              <CloseIcon size={20} className="text-slate-400" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Tiêu đề tài liệu
                </label>

                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={onInputChange}
                  placeholder="Ví dụ: Giáo trình Giải tích 1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Mô tả ngắn
                </label>

                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={onInputChange}
                  placeholder="Tóm tắt nội dung tài liệu..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Tác giả
                </label>

                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={onInputChange}
                  placeholder="Tên tác giả hoặc NXB"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Năm xuất bản
                </label>

                <input
                  type="text"
                  name="publishYear"
                  value={formData.publishYear}
                  onChange={onPublishYearChange}
                  placeholder="Ví dụ: 2024"
                  inputMode="numeric"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Danh mục
                </label>

                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={onInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm appearance-none"
                >
                  <option value="">Chọn danh mục</option>

                  {categories.map((cat) => {
                    const categoryId = cat.CategoryID || cat.categoryId || cat.id;

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

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Quyền truy cập
                </label>

                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={onInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none focus:bg-white transition-all text-sm appearance-none"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block">
                  {isEdit
                    ? 'Đổi tệp tài liệu nếu muốn'
                    : 'Tệp tài liệu PDF, Word, PowerPoint...'}
                </label>

                <div className="relative group/file">
                  <input
                    type="file"
                    name="document"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />

                  <div
                    className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                      files.document
                        ? 'border-primary-200 bg-primary-50/30'
                        : 'border-slate-200 bg-slate-50 group-hover/file:border-primary-400 group-hover/file:bg-slate-100'
                    }`}
                  >
                    {files.document ? (
                      <>
                        <Check className="text-primary-600" size={24} />

                        <span className="text-xs font-bold text-primary-700 text-center truncate w-full px-4">
                          {files.document.name}
                        </span>

                        <span className="text-[10px] text-primary-400">
                          Nhấp để thay đổi
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText className="text-slate-300" size={24} />

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isEdit
                            ? 'Giữ file cũ nếu không chọn'
                            : 'Chọn tệp tài liệu'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 block">
                  {isEdit ? 'Đổi ảnh thu nhỏ nếu muốn' : 'Ảnh thu nhỏ tùy chọn'}
                </label>

                <div className="relative group/thumb">
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />

                  <div
                    className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                      files.thumbnail
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50 group-hover/thumb:border-emerald-400 group-hover/thumb:bg-slate-100'
                    }`}
                  >
                    {files.thumbnail ? (
                      <>
                        <Check className="text-emerald-600" size={24} />

                        <span className="text-xs font-bold text-emerald-700 text-center truncate w-full px-4">
                          {files.thumbnail.name}
                        </span>

                        <span className="text-[10px] text-emerald-400">
                          Nhấp để thay đổi
                        </span>
                      </>
                    ) : (
                      <>
                        <Layers className="text-slate-300" size={24} />

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isEdit ? 'Giữ ảnh cũ nếu không chọn' : 'Chọn ảnh nền'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm disabled:opacity-50"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-900/20 text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {isEdit ? <Save size={18} /> : <Upload size={18} />}
                    {submitLabel}
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

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    publishYear: String(new Date().getFullYear()),
    categoryId: '',
    accessLevel: 'Public',
  });

  const [files, setFiles] = useState({
    document: null,
    thumbnail: null,
  });

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setCategories([]);
      toast.error('Không thể tải danh mục');
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      toast.error('Không thể tải danh sách tài liệu');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const getDocId = (doc) =>
    doc.DocID || doc.DocumentID || doc.documentId || doc.id;

  const getDocTitle = (doc) =>
    doc.Title ||
    doc.title ||
    doc.DocumentTitle ||
    doc.documentTitle ||
    'Không có tiêu đề';

  const getDocDescription = (doc) =>
    doc.Description || doc.description || doc.Summary || doc.summary || '';

  const getDocAuthor = (doc) =>
    doc.Author ||
    doc.author ||
    doc.UploadedByName ||
    doc.uploadedByName ||
    'Ẩn danh';

  const getDocCategoryId = (doc) =>
    doc.CategoryID ||
    doc.categoryId ||
    doc.categories?.CategoryID ||
    doc.categories?.id ||
    doc.category?.CategoryID ||
    doc.category?.id ||
    '';

  const getDocCategoryName = (doc) =>
    doc.CategoryName ||
    doc.categoryName ||
    doc.categories?.CategoryName ||
    doc.categories?.Name ||
    doc.category?.CategoryName ||
    doc.category?.Name ||
    doc.category?.name ||
    'Khác';

  const getDocFileType = (doc) =>
    (doc.FileType || doc.fileType || doc.Type || doc.type || 'file')
      .toString()
      .toLowerCase();

  const getDocCreatedAt = (doc) =>
    doc.CreatedAt ||
    doc.createdAt ||
    doc.created_at ||
    doc.UploadedAt ||
    doc.uploadedAt ||
    new Date();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      author: '',
      publishYear: String(new Date().getFullYear()),
      categoryId: '',
      accessLevel: 'Public',
    });

    setFiles({
      document: null,
      thumbnail: null,
    });

    setEditingDocument(null);
  };

  const openUploadModal = () => {
    resetForm();
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (isSubmitting) return;
    setIsUploadModalOpen(false);
    resetForm();
  };

  const openEditModal = (doc) => {
    setEditingDocument(doc);

    setFormData({
      title: getDocTitle(doc),
      description: getDocDescription(doc),
      author: getDocAuthor(doc) === 'Ẩn danh' ? '' : getDocAuthor(doc),
      publishYear: String(
        doc.PublishYear ||
          doc.publishYear ||
          doc.year ||
          new Date().getFullYear()
      ),
      categoryId: String(getDocCategoryId(doc) || ''),
      accessLevel: doc.AccessLevel || doc.accessLevel || 'Public',
    });

    setFiles({
      document: null,
      thumbnail: null,
    });

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isSubmitting) return;
    setIsEditModalOpen(false);
    resetForm();
  };

  const buildFormData = ({ includeDocumentRequired = false } = {}) => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề tài liệu');
      return null;
    }

    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục');
      return null;
    }

    if (includeDocumentRequired && !files.document) {
      toast.error('Vui lòng chọn tệp tài liệu');
      return null;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (files.document) {
      data.append('document', files.document);
    }

    if (files.thumbnail) {
      data.append('thumbnail', files.thumbnail);
    }

    return data;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const data = buildFormData({ includeDocumentRequired: true });
    if (!data) return;

    try {
      setIsSubmitting(true);

      await createDocument(data);

      toast.success('Tải lên tài liệu thành công!');
      setIsUploadModalOpen(false);
      resetForm();
      await fetchDocuments();
    } catch (error) {
      console.error('Upload failed', error);
      toast.error(error.response?.data?.message || 'Tải lên tài liệu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const docId = getDocId(editingDocument || {});

    if (!docId) {
      toast.error('Không tìm thấy ID tài liệu cần sửa');
      return;
    }

    const data = buildFormData({ includeDocumentRequired: false });
    if (!data) return;

    try {
      setIsSubmitting(true);

      await updateDocument(docId, data);

      toast.success('Cập nhật tài liệu thành công!');
      setIsEditModalOpen(false);
      resetForm();
      await fetchDocuments();
    } catch (error) {
      console.error('Update failed', error);
      toast.error(error.response?.data?.message || 'Cập nhật tài liệu thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublishYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');

    setFormData((prev) => ({
      ...prev,
      publishYear: value,
    }));
  };

  const handleDelete = async (docId) => {
    if (!docId) {
      toast.error('Không tìm thấy ID tài liệu');
      return;
    }

    const confirmDelete = window.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này? Thao tác này không thể hoàn tác.'
    );

    if (!confirmDelete) return;

    try {
      await deleteDocument(docId);

      setDocuments((prev) =>
        prev.filter((doc) => String(getDocId(doc)) !== String(docId))
      );

      toast.success('Đã xóa tài liệu thành công');
    } catch (error) {
      console.error('Delete failed', error);
      toast.error(error.response?.data?.message || 'Xóa tài liệu thất bại');
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const title = getDocTitle(doc).toLowerCase();
    const author = getDocAuthor(doc).toLowerCase();
    const categoryName = getDocCategoryName(doc).toLowerCase();
    const fileType = getDocFileType(doc).toLowerCase();
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return true;

    return (
      title.includes(keyword) ||
      author.includes(keyword) ||
      categoryName.includes(keyword) ||
      fileType.includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý tài liệu
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Duyệt, chỉnh sửa hoặc xóa các tài liệu số trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={16} />
            Xuất báo cáo
          </button>

          <button
            type="button"
            onClick={openUploadModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
          >
            <FileText size={16} />
            Tải lên tài liệu
          </button>
        </div>
      </div>

      <DocumentFormModal
        type="upload"
        title="Tải lên tài liệu mới"
        subtitle="Điền thông tin và chọn tệp để đưa lên hệ thống."
        icon={<Upload size={20} />}
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onSubmit={handleUpload}
        submitLabel="Bắt đầu tải lên"
        formData={formData}
        files={files}
        categories={categories}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onPublishYearChange={handlePublishYearChange}
        onFileChange={handleFileChange}
      />

      <DocumentFormModal
        type="edit"
        title="Sửa tài liệu"
        subtitle="Cập nhật thông tin tài liệu. Nếu không chọn file mới, hệ thống sẽ giữ file cũ."
        icon={<Pencil size={20} />}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleUpdate}
        submitLabel="Lưu thay đổi"
        formData={formData}
        files={files}
        categories={categories}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onPublishYearChange={handlePublishYearChange}
        onFileChange={handleFileChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Tổng tài liệu
            </p>

            <p className="text-xl font-bold text-slate-900">
              {documents.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <Eye size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Tổng lượt xem
            </p>

            <p className="text-xl font-bold text-slate-900">
              {documents
                .reduce((acc, d) => acc + (d.ViewCount || d.viewCount || 0), 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Layers size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Danh mục
            </p>

            <p className="text-xl font-bold text-slate-900">
              {
                new Set(
                  documents
                    .map((d) => d.CategoryID || d.categoryId || d.category?.id)
                    .filter(Boolean)
                ).size
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm theo tên tài liệu, tác giả, danh mục, loại file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all"
        >
          <Filter size={16} />
          Lọc nâng cao
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tên tài liệu
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Danh mục
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tác giả
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thống kê
                </th>

                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredDocs.map((doc, idx) => {
                  const docId = getDocId(doc);
                  const title = getDocTitle(doc);
                  const author = getDocAuthor(doc);
                  const categoryName = getDocCategoryName(doc);
                  const fileType = getDocFileType(doc);
                  const createdAt = getDocCreatedAt(doc);
                  const viewCount = doc.ViewCount || doc.viewCount || 0;

                  return (
                    <motion.tr
                      key={docId || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-white group-hover:text-primary-500 transition-all shrink-0">
                            {fileType === 'pdf' ? (
                              <FileText size={24} />
                            ) : fileType === 'docx' || fileType === 'doc' ? (
                              <FileCode size={24} />
                            ) : (
                              <FileBox size={24} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                              {title}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {fileType}
                              </span>

                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {categoryName}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {author?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <span className="text-xs text-slate-600 font-medium">
                            {author}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                            <Eye size={14} className="text-slate-400" />
                            {Number(viewCount).toLocaleString()}
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            Cập nhật gần nhất
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`/library/${docId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                            title="Xem chi tiết"
                          >
                            <ExternalLink size={18} />
                          </a>

                          <button
                            type="button"
                            onClick={() => openEditModal(doc)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Sửa tài liệu"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(docId)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa tài liệu"
                          >
                            <Trash2 size={18} />
                          </button>

                          <button
                            type="button"
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            title="Thêm thao tác"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-24 bg-slate-50/30">
            <FileText size={64} className="mx-auto text-slate-100 mb-4" />

            <h3 className="text-slate-900 font-bold">
              Không tìm thấy tài liệu
            </h3>

            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc lọc theo tiêu chí khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocuments;