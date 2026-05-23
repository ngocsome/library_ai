import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  User,
  ArrowRight,
  Star,
  Clock,
  Grid,
  Layers,
  Sparkles,
  Bookmark,
  Mic,
  Search,
  X,
} from 'lucide-react';
import {
  getDocuments,
  getCategories,
  addFavoriteDocument,
  removeFavoriteDocument,
} from '../../services/documentService';
import logo from '../../assets/logo.png';

const getViewCount = (doc) =>
  Number(doc.ViewCount || doc.viewCount || doc.views || doc.Views || 0);

const getFileType = (doc) =>
  String(doc.FileType || doc.fileType || doc.type || doc.Type || 'file').toLowerCase();

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [docsRes, catsRes] = await Promise.all([
          getDocuments(selectedCategory ? { categoryId: selectedCategory } : {}),
          getCategories(),
        ]);

        setDocuments(Array.isArray(docsRes) ? docsRes : []);
        setCategories(Array.isArray(catsRes) ? catsRes : []);
      } catch (error) {
        console.error('Failed to fetch library data', error);
        setDocuments([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }

    setSearchParams(newParams);
  };

  const filteredDocs = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return documents;

    return documents.filter((doc) => {
      const title = doc.Title || doc.title || '';
      const author = doc.Author || doc.author || '';
      const description =
        doc.Description || doc.description || doc.Summary || doc.summary || '';
      const categoryName =
        doc.CategoryName ||
        doc.categoryName ||
        doc.Category?.Name ||
        doc.category?.name ||
        '';
      const fileType = doc.FileType || doc.fileType || '';

      return (
        title.toLowerCase().includes(keyword) ||
        author.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword) ||
        categoryName.toLowerCase().includes(keyword) ||
        fileType.toLowerCase().includes(keyword)
      );
    });
  }, [documents, searchTerm]);

  const libraryStats = useMemo(() => {
    const totalViews = documents.reduce((sum, doc) => sum + getViewCount(doc), 0);
    const fileTypeCount = new Set(
      documents.map((doc) => getFileType(doc)).filter(Boolean)
    ).size;

    return [
      {
        icon: BookOpen,
        value: documents.length,
        suffix: '+',
        label: 'Tài liệu',
      },
      {
        icon: Eye,
        value: totalViews,
        suffix: '',
        label: 'Lượt xem',
      },
      {
        icon: Layers,
        value: categories.length,
        suffix: '+',
        label: 'Danh mục',
      },
      {
        icon: Grid,
        value: fileTypeCount,
        suffix: '+',
        label: 'Loại file',
      },
    ];
  }, [documents, categories]);

  return (
    <div className="min-h-screen relative bg-slate-50">
      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] top-[-200px] left-1/2 transform -translate-x-1/2 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, rgba(248,250,252,0) 70%)',
          }}
        />

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-medium mb-6 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
            Thư viện số thế hệ mới 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900"
          >
            Kết Nối Tri Thức <br />
            <span className="gradient-text">Không Giới Hạn</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Khám phá kho tài liệu số, giáo trình và tài liệu học tập được phân loại
            theo danh mục. Tìm kiếm nhanh, lưu yêu thích và tải xuống dễ dàng
            trong quá trình học tập của bạn.
          </motion.p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2 group w-full md:w-auto justify-center"
            >
              Bắt đầu đọc ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-medium transition-all flex items-center gap-2 w-full md:w-auto justify-center shadow-sm hover:shadow-md group"
            >
              <Sparkles className="w-4 h-4 text-accent-500 group-hover:scale-110 transition-transform" />
              Gợi ý bởi AI
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {libraryStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-center space-x-3 bg-white rounded-lg px-4 py-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <stat.icon className="text-primary-600" size={20} />

                <div>
                  <div className="text-slate-900 font-bold text-sm">
                    {Number(stat.value || 0).toLocaleString('vi-VN')}
                    {stat.suffix}
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-20 relative z-10">
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Khám phá theo chủ đề
            </h2>

            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-primary-600 text-sm hover:text-accent-600 font-medium hover:underline"
            >
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat, idx) => {
              const categoryId = cat.CategoryID || cat.categoryId || cat.id;
              const categoryName =
                cat.Name || cat.CategoryName || cat.name || 'Chủ đề';

              const iconMap = {
                'Công nghệ thông tin': BookOpen,
                'Kinh tế': Grid,
                'Kinh tế & Quản trị': Grid,
                'Luật học': Layers,
                'Kỹ thuật & Công nghệ': Grid,
                'Ngoại ngữ': BookOpen,
                'Ngôn ngữ & Văn hóa': BookOpen,
                'Y học & Sức khỏe': Star,
                'Khoa học cơ bản': Layers,
                'Kỹ năng mềm': User,
              };

              const Icon = iconMap[categoryName] || Grid;

              return (
                <motion.div
                  key={categoryId || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(categoryId)}
                  className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group bg-white hover:bg-white ${
                    selectedCategory === categoryId
                      ? 'border-primary-500 ring-2 ring-primary-500/20'
                      : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                      selectedCategory === categoryId
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-500/10 text-primary-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-semibold text-slate-800 text-sm mb-1">
                    {categoryName}
                  </h3>

                  <span className="text-xs text-slate-500">Khám phá</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Mới & Nổi Bật
                </h2>

                {searchTerm && (
                  <p className="text-sm text-slate-500 mt-1">
                    Kết quả tìm kiếm cho:{' '}
                    <span className="font-semibold text-primary-600">
                      &quot;{searchTerm}&quot;
                    </span>
                  </p>
                )}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm trong thư viện..."
                  className="w-full bg-white border border-slate-200 text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-200 rounded-xl h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredDocs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDocs.map((doc, idx) => {
                  const documentId =
                    doc.DocID || doc.DocumentID || doc.documentId || doc.id;

                  return (
                    <DocumentCard
                      key={documentId || idx}
                      doc={doc}
                      index={idx}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-600 font-medium">
                  {searchTerm
                    ? `Không tìm thấy tài liệu phù hợp với "${searchTerm}".`
                    : 'Chưa có tài liệu nào.'}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-2xl p-6 bg-white">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5 text-primary-600" />
                Đang thịnh hành
              </h3>

              <div className="space-y-5">
                {filteredDocs.slice(0, 3).map((item, idx) => {
                  const documentId =
                    item.DocID || item.DocumentID || item.documentId || item.id;
                  const title = item.Title || item.title || 'Không có tiêu đề';
                  const author = item.Author || item.author || 'Tác giả không rõ';

                  return (
                    <Link
                      to={`/library/${documentId}`}
                      key={documentId || idx}
                      className="flex items-center gap-4 group cursor-pointer border-b border-slate-50 last:border-0 pb-3 last:pb-0"
                    >
                      <div className="font-bold text-2xl text-slate-300 group-hover:text-primary-600 transition-colors">
                        0{idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors text-sm truncate">
                          {title}
                        </h4>

                        <p className="text-xs text-slate-500 font-medium truncate">
                          {author}
                        </p>
                      </div>
                    </Link>
                  );
                })}

                {!loading && filteredDocs.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Không có tài liệu thịnh hành.
                  </p>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden p-6 text-center shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 to-accent-900/60 backdrop-blur-[2px]"></div>

              <div className="relative z-10">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3" />

                <h3 className="text-xl font-bold mb-2 text-white">
                  Gói Hội Viên Premium
                </h3>

                <p className="text-sm text-primary-50 mb-4 font-medium">
                  Truy cập không giới hạn, tải xuống offline và không quảng cáo.
                </p>

                <button
                  type="button"
                  className="px-4 py-2 bg-white text-primary-900 font-bold rounded-lg text-sm hover:bg-primary-50 transition-colors shadow-lg"
                >
                  Nâng cấp ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-200">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Chuyển đổi Text-to-Speech',
                desc: 'Nghe bất kỳ tài liệu nào với công nghệ AI giọng đọc tự nhiên, đa ngôn ngữ.',
                colorClass: 'bg-primary-100 text-primary-600',
              },
              {
                icon: Sparkles,
                title: 'Gợi ý thông minh',
                desc: 'Hệ thống phân tích thói quen đọc để đưa ra những tài liệu phù hợp nhất với bạn.',
                colorClass: 'bg-accent-100 text-accent-600',
              },
              {
                icon: Layers,
                title: 'Phân loại rõ ràng',
                desc: 'Tài liệu được sắp xếp theo danh mục, loại file và chủ đề để dễ tìm kiếm.',
                colorClass: 'bg-blue-100 text-blue-600',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center md:text-left p-4 hover:bg-white rounded-xl transition-colors"
              >
                <div
                  className={`w-12 h-12 ${feature.colorClass} rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain shadow-sm rounded-lg"
              />

              <span className="text-xl font-bold text-slate-900">
                Thư Viện AI
              </span>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed">
              Nền tảng thư viện số hỗ trợ học tập, tra cứu và quản lý tài liệu dễ dàng hơn.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-slate-900">Khám phá</h4>

            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Tài liệu mới
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Tài liệu nổi bật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Danh mục tài liệu
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-slate-900">Hỗ trợ</h4>

            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-slate-900">Đăng ký nhận tin</h4>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-700 placeholder-slate-400"
              />

              <button
                type="button"
                className="bg-primary-600 hover:bg-accent-600 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
          © 2024 Thư Viện AI. All rights reserved. Designed for the Future.
        </div>
      </footer>
    </div>
  );
};

const DocumentCard = ({ doc, index }) => {
  const [favorite, setFavorite] = useState(Boolean(doc.isFavorite));

  const documentId = doc.DocID || doc.DocumentID || doc.documentId || doc.id;
  const title = doc.Title || doc.title || 'Không có tiêu đề';
  const author = doc.Author || doc.author || 'Tác giả không rõ';
  const fileType = doc.FileType || doc.fileType || 'PDF';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!documentId) {
      alert('Không tìm thấy ID tài liệu');
      return;
    }

    try {
      if (favorite) {
        await removeFavoriteDocument(documentId);
        setFavorite(false);
      } else {
        await addFavoriteDocument(documentId);
        setFavorite(true);
      }
    } catch (error) {
      console.error('Favorite error:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật yêu thích');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Link
        to={`/library/${documentId}`}
        className="glass-card rounded-xl p-3 flex flex-col group cursor-pointer relative overflow-hidden bg-white hover:bg-white block"
      >
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 border border-slate-200 shadow-sm">
          {fileType}
        </div>

        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg mb-3 shadow-md bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-primary-300" />
          </div>
        </div>

        <h3 className="text-slate-800 font-bold text-base leading-tight mb-1 truncate group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        <p className="text-slate-500 text-sm mb-2 font-medium truncate">
          {author}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center text-accent-500 font-bold">
            <Star className="w-3 h-3 fill-current mr-1" />
            <span>4.8</span>
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            className={`transition-opacity p-1.5 rounded-full shadow-lg ${
              favorite
                ? 'opacity-100 bg-red-500 text-white'
                : 'opacity-0 group-hover:opacity-100 bg-primary-600 hover:bg-primary-500 text-white'
            }`}
            title={favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          >
            <Bookmark
              className="w-4 h-4"
              fill={favorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default LibraryPage;
