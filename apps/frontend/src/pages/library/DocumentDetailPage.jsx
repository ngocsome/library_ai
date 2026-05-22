import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Share2,
  Download,
  MessageSquare,
  Heart,
  Eye,
  Loader2,
} from 'lucide-react';

import { getDocumentById } from '../../services/documentService';

const DocumentDetailPage = () => {
  const { docId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);

      try {
        const result = await getDocumentById(docId);
        setDoc(result);
      } catch (error) {
        console.error('Failed to load document', error);
        setDoc(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  const getFileUrl = (url) => {
    if (!url || url === '#') return '#';

    let cleanUrl = String(url).replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    if (cleanUrl.includes('uploads/')) {
      cleanUrl = '/uploads/' + cleanUrl.split('uploads/')[1];
    }

    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }

    return `http://localhost:5000${cleanUrl}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-brand-green" size={40} />
      </div>
    );
  }

  if (!doc) {
    return <div className="text-center py-20">Không tìm thấy tài liệu</div>;
  }

  const title = doc.Title || doc.title || 'Không có tiêu đề';
  const author = doc.Author || doc.author || 'Tác giả không rõ';
  const description =
    doc.Description || doc.description || 'Chưa có mô tả cho tài liệu này.';
  const categoryName =
    doc.CategoryName ||
    doc.categoryName ||
    doc.Categories?.Name ||
    doc.category?.name ||
    'Chưa phân loại';
  const viewCount = doc.ViewCount ?? doc.viewCount ?? 0;
  const fileUrl = doc.FileUrl || doc.fileUrl || '#';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/library"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại thư viện</span>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-brand-green/10 text-brand-green text-xs font-semibold rounded">
                  {categoryName}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-6">
                <span className="font-medium text-gray-700">
                  Tác giả: {author}
                </span>

                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  {viewCount} lượt xem
                </span>

                <span className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  4.5
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">Giới thiệu</h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                {description}
              </p>

              <div className="flex gap-3">
                <a
                  href={getFileUrl(fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-brand-green text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-center"
                >
                  Đọc ngay
                </a>

                <a
                  href={getFileUrl(fileUrl)}
                  download
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
                  Tải xuống
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Thảo luận & Ghi chú
              </h3>

              <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl aspect-[3/4] flex flex-col items-center justify-center text-white relative overflow-hidden shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                <p className="text-sm font-medium opacity-80">Xem trước</p>
              </div>

              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2 backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                <Eye size={32} />
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Hỏi đáp với AI?</h3>

              <p className="text-indigo-100 text-sm mb-4">
                Bạn có thắc mắc về tài liệu này? AI có thể giúp bạn tóm tắt hoặc
                trả lời câu hỏi.
              </p>

              <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors">
                Bắt đầu chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;