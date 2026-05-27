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
  BookOpen,
  Sparkles,
  Compass,
} from 'lucide-react';

import { getDocumentById } from '../../services/documentService';

const BACKEND_ORIGIN = 'http://localhost:8080';

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

        const favoriteStatus =
          result?.Favorite ??
          result?.favorite ??
          result?.isFavorite ??
          result?.IsFavorite ??
          false;

        setIsFavorite(Boolean(favoriteStatus));
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

    let cleanUrl = String(url).replace(/\\/g, '/').trim();

    if (!cleanUrl) return '#';

    // Nếu backend đã trả về URL đầy đủ
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      // Sửa trường hợp dữ liệu cũ đang bị lưu port 5000
      if (cleanUrl.includes('localhost:5000')) {
        return cleanUrl.replace('http://localhost:5000', BACKEND_ORIGIN);
      }

      return cleanUrl;
    }

    // Nếu đường dẫn có chứa uploads/
    if (cleanUrl.includes('uploads/')) {
      cleanUrl = '/uploads/' + cleanUrl.split('uploads/')[1];
    }

    // Nếu chưa có dấu / ở đầu thì thêm vào
    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }

    return `${BACKEND_ORIGIN}${cleanUrl}`;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link tài liệu');
    } catch (error) {
      console.error('Share failed', error);
      alert('Không thể copy link tài liệu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="animate-spin text-brand-green w-10 h-10" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="text-center p-12 text-slate-500 font-bold bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-md w-full">
          Không tìm thấy tài liệu học tập phù hợp.
        </div>
      </div>
    );
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
  const fileUrl = doc.FileUrl || doc.fileUrl || doc.url || doc.Url || '#';
  const finalFileUrl = getFileUrl(fileUrl);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-250/20 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/15 to-transparent rounded-full filter blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top bar Actions */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/library"
            className="flex items-center gap-2 text-slate-450 hover:text-slate-800 font-bold text-xs tracking-wider uppercase transition-all duration-300 group hover:-translate-x-1"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Quay lại thư viện</span>
          </Link>

          <div className="flex gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 rounded-2xl border transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.15)]'
                  : 'bg-white border-slate-200/80 text-slate-400 hover:bg-slate-50 hover:text-slate-700'
              }`}
              title={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
            >
              <Heart
                size={18}
                fill={isFavorite ? 'currentColor' : 'none'}
                className="transition-transform duration-300"
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 bg-white border border-slate-200/80 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 active:scale-95 shadow-sm transition-all cursor-pointer"
              title="Chia sẻ tài liệu"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Detail Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] border border-slate-200/60">
              <div className="flex gap-2 mb-4">
                <span className="px-3.5 py-1.5 bg-emerald-50 text-brand-green text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100/50 shadow-sm flex items-center gap-1.5">
                  <Compass size={12} className="animate-spin-slow" />
                  {categoryName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug mb-5">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-bold text-slate-400 border-b border-slate-100 pb-5 mb-6">
                <span className="text-slate-650 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-150/40">
                  Tác giả:{' '}
                  <span className="font-extrabold text-slate-800">
                    {author}
                  </span>
                </span>

                <span className="flex items-center gap-1.5">
                  <Eye size={15} className="text-slate-350" />
                  {Number(viewCount).toLocaleString('vi-VN')} lượt xem
                </span>

                <span className="flex items-center gap-1.5 text-amber-500 bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-100/40">
                  <Star size={14} className="fill-current" />
                  4.5
                </span>
              </div>

              <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-3.5 flex items-center gap-2">
                <BookOpen size={15} className="text-brand-green" />
                Giới thiệu tài liệu
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4.5">
                <a
                  href={finalFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center active:scale-[0.98] ${
                    finalFileUrl === '#'
                      ? 'bg-slate-300 text-white pointer-events-none cursor-not-allowed'
                      : 'bg-brand-green hover:bg-green-700 text-white shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] cursor-pointer'
                  }`}
                >
                  Đọc ngay
                </a>

                <a
                  href={finalFileUrl}
                  download
                  className={`px-6 py-3.5 border rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] ${
                    finalFileUrl === '#'
                      ? 'border-slate-200 bg-slate-100 text-slate-400 pointer-events-none cursor-not-allowed'
                      : 'border-slate-200/85 bg-slate-50/20 hover:bg-slate-50 text-slate-700 cursor-pointer'
                  }`}
                >
                  <Download size={15} className="text-slate-400" />
                  Tải xuống
                </a>
              </div>
            </div>

            {/* Discussion Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] border border-slate-200/60">
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                <MessageSquare
                  size={16}
                  className="text-brand-green animate-pulse"
                />
                Thảo luận & Ghi chú
              </h3>

              <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center p-6">
                <MessageSquare size={28} className="text-slate-300 mb-2.5" />
                <p className="text-xs font-bold text-slate-450 uppercase tracking-wide">
                  Chưa có bình luận nào
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                  Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 shrink-0">
            {/* Preview Card */}
            <div className="bg-[#090D16] rounded-3xl aspect-[3/4.2] flex flex-col items-center justify-center text-white relative overflow-hidden shadow-lg border border-slate-800/40 group">
              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
                  backgroundSize: '16px 16px',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-transparent to-rose-500/10 pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-none">
                  Bản xem trước
                </p>
                <p className="text-xs text-slate-400/80 font-semibold mt-1">
                  Trực quan hóa tài liệu số
                </p>
              </div>

              <a
                href={finalFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-2 backdrop-blur-md group-hover:scale-105 transition-transform border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:border-emerald-500/30 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] ${
                  finalFileUrl === '#'
                    ? 'pointer-events-none cursor-not-allowed opacity-60'
                    : 'cursor-pointer'
                }`}
              >
                <Eye
                  size={24}
                  className="text-slate-200 group-hover:text-emerald-400 transition-colors"
                />
              </a>
            </div>

            {/* AI Copilot Chat Card */}
            <div className="relative rounded-3xl overflow-hidden p-6 text-center shadow-lg border border-slate-800/40 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a1526] via-[#1c0f2b] to-[#081816] backdrop-blur-[2px]" />

              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #fff 8%, transparent 9%)`,
                  backgroundSize: '12px 12px',
                }}
              />

              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3.5 animate-bounce" />

                <h3 className="text-xs font-black mb-2 text-white uppercase tracking-wider">
                  Trò chuyện cùng AI
                </h3>

                <p className="text-[11px] text-slate-350 mb-5 font-semibold leading-relaxed">
                  Bạn có thắc mắc gì về tài liệu học tập này? Hãy bắt đầu chat để AI tóm tắt hoặc giải đáp các thắc mắc nhanh gọn.
                </p>

                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all duration-300 cursor-pointer active:scale-95">
                  Bắt đầu chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;