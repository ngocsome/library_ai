import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, BookOpen, Trash2 } from 'lucide-react';
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
    <div className="container mx-auto px-6 pt-36 pb-12 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-red-100 text-red-500 rounded-lg">
          <Heart size={24} fill="currentColor" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tài liệu yêu thích
          </h1>

          <p className="text-gray-500 text-sm">
            Quản lý danh sách tài liệu bạn đã lưu
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-green" />
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                <button
                  type="button"
                  onClick={(e) => handleRemoveFavorite(e, documentId)}
                  className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-full text-red-500 hover:bg-red-50 z-10"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/library/${documentId}`}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-300 group-hover:scale-110 transition-transform duration-300" />

                    <span className="absolute top-2 left-2 text-xs px-2 py-1 bg-white/90 rounded-md font-bold text-slate-700 border border-slate-200">
                      {fileType}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="text-xs text-brand-green font-medium mb-1">
                      {categoryName}
                    </div>

                    <h3 className="font-semibold text-gray-800 line-clamp-1 mb-2 group-hover:text-brand-green transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs text-gray-400 mb-2">
                      Tác giả: {author}
                    </p>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />

          <h3 className="text-lg font-medium text-gray-600">
            Chưa có tài liệu yêu thích
          </h3>

          <p className="text-gray-500 mb-6">
            Hãy khám phá thư viện và lưu lại những tài liệu hay nhé!
          </p>

          <Link
            to="/library"
            className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Khám phá ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;