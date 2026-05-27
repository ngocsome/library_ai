import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, BookOpen, Trash2, Compass } from 'lucide-react';
import {
  getFavorites,
  removeFavoriteDocument,
} from '../../services/documentService';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);

    try {
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e, documentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!documentId) {
      alert('Không tìm thấy ID tài liệu');
      return;
    }

    try {
      await removeFavoriteDocument(documentId);

      setFavorites((prev) =>
        prev.filter((doc) => {
          const id = doc.DocID || doc.DocumentID || doc.id;
          return id !== documentId;
        })
      );
    } catch (error) {
      console.error('Remove favorite failed', error);
      alert(error.response?.data?.message || 'Không thể xóa khỏi yêu thích');
    }
  };

  return (
    <div className="container mx-auto px-6 pt-36 pb-20 space-y-8 relative z-10 max-w-6xl">
      
      {/* Background Ambient Glow (Đốm sáng chiều sâu AI) */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-rose-200/10 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-200/10 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* Page Header Area */}
      <div className="flex items-center gap-4 mb-2 relative z-10">
        {/* Heart Icon bọc trong Glass Capsule phát sáng rực rỡ */}
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.2)] shrink-0 animate-pulse">
          <Heart size={22} fill="currentColor" />
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
            Tài liệu yêu thích
          </h1>
          <p className="text-xs text-slate-450 font-semibold mt-1.5 tracking-wide">
            Quản lý danh sách tài liệu nghiên cứu cá nhân bạn đã lưu trữ
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px] py-20">
          <Loader2 className="animate-spin text-brand-green w-10 h-10" />
        </div>
      ) : favorites.length > 0 ? (
        /* Favorites Grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
          {favorites.map((doc, idx) => {
            const documentId = doc.DocID || doc.DocumentID || doc.id;
            const title = doc.Title || doc.title || 'Không có tiêu đề';
            const author = doc.Author || doc.author || 'Tác giả không rõ';
            const categoryName =
              doc.Categories?.Name ||
              doc.CategoryName ||
              doc.categoryName ||
              'Chưa phân loại';
            const description =
              doc.Description ||
              doc.description ||
              'Chưa có mô tả cho tài liệu này.';
            const fileType = doc.FileType || doc.fileType || 'PDF';

            return (
              <div
                key={documentId || idx}
                className="group bg-white rounded-2xl border border-slate-200/50 hover:border-slate-250 overflow-hidden hover:shadow-lg transition-all duration-300 relative flex flex-col"
              >
                {/* Nút Xóa Yêu Thích dạng Hover Cyber Action */}
                <button
                  type="button"
                  onClick={(e) => handleRemoveFavorite(e, documentId)}
                  className="absolute top-3.5 right-3.5 p-2 bg-white/90 backdrop-blur-sm shadow-md rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 duration-300 z-20 cursor-pointer"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 size={15} />
                </button>

                <Link to={`/library/${documentId}`} className="flex flex-col h-full p-2.5">
                  {/* Cyber Bìa Sách Hologram 3D tương tự LibraryPage */}
                  <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 relative overflow-hidden flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    {/* Mạch Grid chìm */}
                    <div 
                      className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
                        backgroundSize: '12px 12px'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-transparent to-rose-500/10 pointer-events-none" />

                    <BookOpen className="w-12 h-12 text-emerald-500/30 group-hover:scale-105 group-hover:text-emerald-500/60 transition-all duration-500 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]" />

                    {/* Tag loại file in mờ */}
                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest px-2.5 py-1 bg-slate-900/60 backdrop-blur-md rounded-lg text-white border border-white/10 uppercase">
                      {fileType}
                    </span>
                  </div>

                  {/* Body Information */}
                  <div className="p-3 flex-1 flex flex-col">
                    {/* Category Label */}
                    <div className="text-[10px] text-brand-green font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Compass size={11} className="animate-spin-slow" />
                      {categoryName}
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-1 mb-1.5 group-hover:text-brand-green transition-colors">
                      {title}
                    </h3>

                    {/* Author */}
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mb-2">
                      Tác giả: {author}
                    </p>

                    {/* Description */}
                    <p className="text-slate-450 text-[11px] font-semibold line-clamp-2 leading-relaxed mt-auto">
                      {description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Tech Empty State */
        <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-[32px] border-2 border-dashed border-slate-200 p-8 shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center">
          {/* Tim 3D phao lơ lửng nghệ thuật */}
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full shadow-[0_0_25px_rgba(244,63,94,0.15)] mb-6 animate-float shrink-0">
            <Heart size={32} fill="currentColor" />
          </div>

          <h3 className="text-base font-black text-slate-850 uppercase tracking-widest mb-2">
            Chưa có tài liệu yêu thích
          </h3>

          <p className="text-xs font-semibold text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
            Danh sách của bạn đang trống. Hãy khám phá thư viện số và lưu trữ những tài liệu hữu ích nhất nhé!
          </p>

          <Link
            to="/library"
            className="px-6 py-3 bg-brand-green hover:bg-green-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(5,150,105,0.15)] hover:shadow-[0_6px_16px_rgba(5,150,105,0.25)] cursor-pointer active:scale-95"
          >
            Khám phá ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;