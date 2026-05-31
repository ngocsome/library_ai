import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Loader2,
  Newspaper,
  Star,
} from 'lucide-react';
import { getFeaturedNews, getNewsById } from '../../services/newsService';

const NewsDetailPage = () => {
  const { newsId } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [newsId]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);

      const [newsData, featuredData] = await Promise.all([
        getNewsById(newsId),
        getFeaturedNews(),
      ]);

      setNews(newsData);
      setFeaturedNews(Array.isArray(featuredData) ? featuredData : []);
    } catch (error) {
      console.error('Lỗi tải chi tiết tin tức:', error);
      setNews(null);
    } finally {
      setLoading(false);
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
      item?.thumbnailUrl ||
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop'
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-100">
          <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
          <span className="text-sm font-bold text-slate-600">
            Đang tải chi tiết tin tức...
          </span>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <Newspaper className="mx-auto h-14 w-14 text-slate-300" />

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Không tìm thấy tin tức
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Tin tức này có thể đã bị xóa hoặc không còn được xuất bản.
          </p>

          <button
            onClick={() => navigate('/news')}
            className="mt-6 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
          >
            Quay về trang tin tức
          </button>
        </div>
      </div>
    );
  }

  const relatedFeatured = featuredNews.filter((item) => item.id !== news.id);

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-black text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-violet-600"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <article className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <div className="h-[260px] overflow-hidden bg-slate-100 md:h-[420px]">
              <img
                src={getThumbnail(news)}
                alt={news.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-7 md:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-violet-50 px-4 py-1.5 text-xs font-black text-violet-700">
                  {news.category || 'TIN TỨC'}
                </span>

                {news.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-black text-amber-700">
                    <Star size={14} />
                    Tin tiêu điểm
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400">
                  <CalendarDays size={16} />
                  {formatDate(news.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400">
                  <Eye size={16} />
                  {news.viewCount || 0} lượt xem
                </span>
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl">
                {news.title}
              </h1>

              {news.summary && (
                <p className="mt-5 rounded-3xl bg-slate-50 p-5 text-base font-semibold leading-8 text-slate-600">
                  {news.summary}
                </p>
              )}

              <div className="prose prose-slate mt-8 max-w-none">
                <div className="whitespace-pre-line text-base font-medium leading-8 text-slate-700">
                  {news.content}
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-900">
                Thông tin bài viết
              </h3>

              <div className="space-y-3 text-sm font-semibold text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Danh mục</span>
                  <span className="font-black text-violet-600">
                    {news.category || 'Tin tức'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Ngày đăng</span>
                  <span className="font-black text-slate-800">
                    {formatDate(news.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Lượt xem</span>
                  <span className="font-black text-slate-800">
                    {news.viewCount || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
                <Star className="h-5 w-5 text-amber-500" />
                Tin tiêu điểm
              </h3>

              {relatedFeatured.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">
                  Chưa có tin tiêu điểm khác.
                </p>
              ) : (
                <div className="space-y-4">
                  {relatedFeatured.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      to={`/news/${item.id}`}
                      className="group flex gap-3"
                    >
                      <img
                        src={getThumbnail(item)}
                        alt={item.title}
                        className="h-16 w-20 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-black leading-5 text-slate-800 group-hover:text-violet-600">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs font-bold text-slate-400">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/news"
              className="block rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-sm font-bold text-white/70">
                Xem thêm thông tin
              </p>
              <h3 className="mt-1 text-xl font-black">Quay lại trang tin tức</h3>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;