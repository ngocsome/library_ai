import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Eye,
  Search,
  Newspaper,
  ArrowRight,
  Star,
  Loader2,
} from 'lucide-react';
import { getNews, getFeaturedNews } from '../../services/newsService';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const [newsData, featuredData] = await Promise.all([
        getNews(),
        getFeaturedNews(),
      ]);

      setNewsList(Array.isArray(newsData) ? newsData : []);
      setFeaturedNews(Array.isArray(featuredData) ? featuredData : []);
    } catch (error) {
      console.error('Lỗi tải tin tức:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = newsList
      .map((item) => item.category)
      .filter(Boolean);

    return ['ALL', ...new Set(uniqueCategories)];
  }, [newsList]);

  const filteredNews = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return newsList.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.title?.toLowerCase().includes(keyword) ||
        item.summary?.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword);

      const matchCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchKeyword && matchCategory;
    });
  }, [newsList, searchKeyword, selectedCategory]);

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-100">
          <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
          <span className="text-sm font-bold text-slate-600">
            Đang tải tin tức...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white shadow-[0_20px_60px_rgba(79,70,229,0.25)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black backdrop-blur">
                <Newspaper size={16} />
                TIN TỨC THƯ VIỆN AI
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Tin tức & cập nhật mới nhất
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/80">
                Theo dõi các thông báo, khóa học, tài nguyên học tập và hoạt
                động mới nhất từ hệ thống Thư viện AI.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
              <p className="text-xs font-bold text-white/70">Tổng số tin</p>
              <p className="mt-1 text-3xl font-black">{newsList.length}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />

                  <input
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Tìm kiếm tin tức..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'ALL' ? 'Tất cả danh mục' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredNews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-black text-slate-800">
                  Chưa có tin tức phù hợp
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredNews.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="group grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:grid-cols-[260px_1fr]"
                  >
                    <div className="h-56 overflow-hidden bg-slate-100 md:h-full">
                      <img
                        src={getThumbnail(item)}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                          {item.category || 'TIN TỨC'}
                        </span>

                        {item.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                            <Star size={13} />
                            Tiêu điểm
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                          <CalendarDays size={14} />
                          {formatDate(item.createdAt)}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                          <Eye size={14} />
                          {item.viewCount || 0}
                        </span>
                      </div>

                      <h2 className="text-xl font-black leading-snug text-slate-900 transition group-hover:text-violet-600">
                        {item.title}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm font-medium leading-7 text-slate-500">
                        {item.summary || 'Chưa có mô tả ngắn cho tin tức này.'}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-violet-600">
                        Xem chi tiết
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
                <Star className="h-5 w-5 text-amber-500" />
                Tin tiêu điểm
              </h3>

              {featuredNews.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">
                  Chưa có tin tiêu điểm.
                </p>
              ) : (
                <div className="space-y-4">
                  {featuredNews.slice(0, 5).map((item) => (
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

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-900">
                Danh mục tin tức
              </h3>

              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                      selectedCategory === category
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-700'
                    }`}
                  >
                    {category === 'ALL' ? 'Tất cả danh mục' : category}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;