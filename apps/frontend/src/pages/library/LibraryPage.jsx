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
  Compass,
  Cpu,
  Zap,
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
        color: 'text-emerald-500 bg-emerald-500/10',
      },
      {
        icon: Eye,
        value: totalViews,
        suffix: '',
        label: 'Lượt xem',
        color: 'text-blue-500 bg-blue-500/10',
      },
      {
        icon: Layers,
        value: categories.length,
        suffix: '+',
        label: 'Danh mục',
        color: 'text-purple-500 bg-purple-500/10',
      },
      {
        icon: Grid,
        value: fileTypeCount,
        suffix: '+',
        label: 'Loại file',
        color: 'text-amber-500 bg-amber-500/10',
      },
    ];
  }, [documents, categories]);

  return (
    <div className="min-h-screen relative bg-[#f8fafc] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-250/20 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-0 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200/10 to-transparent rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #000 8%, transparent 9%)`,
          backgroundSize: '24px 24px',
        }}
      />

      <header className="relative pt-[15px] pb-16 px-6 overflow-hidden z-10">
        <div className="container mx-auto relative text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/60 text-slate-700 text-xs font-bold mb-6 shadow-sm"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            THƯ VIỆN SỐ THẾ HỆ MỚI AI 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-[1.15] text-slate-800 tracking-tight"
          >
            Kết Nối Tri Thức <br />
            <span className="gradient-text font-black tracking-normal">
              Không Giới Hạn
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-semibold"
          >
            Khám phá kho tài liệu số, giáo trình và tài liệu học tập được phân loại thông minh. Tìm kiếm nhanh, lưu yêu thích và tải xuống dễ dàng phục vụ quá trình nghiên cứu của bạn.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 bg-brand-green hover:bg-green-700 text-white rounded-2xl font-bold text-xs shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] flex items-center gap-2 group w-full sm:w-auto justify-center transition-all cursor-pointer"
            >
              Bắt đầu đọc ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 w-full sm:w-auto justify-center shadow-sm hover:shadow group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-rose-500 group-hover:animate-pulse" />
              Gợi ý bởi AI
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {libraryStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="flex items-center space-x-3.5 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-slate-200/50 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-105 transition-transform`}
                >
                  <stat.icon size={18} />
                </div>

                <div className="text-left">
                  <div className="text-slate-800 font-extrabold text-sm leading-none mb-1">
                    {Number(stat.value || 0).toLocaleString('vi-VN')}
                    {stat.suffix}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
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
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Compass size={18} className="text-brand-green animate-spin-slow" />
              Khám phá theo chủ đề
            </h2>

            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-brand-green text-xs hover:text-green-700 font-bold tracking-wider uppercase transition-colors cursor-pointer"
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
                'Công nghệ thông tin': Cpu,
                'Kinh tế': Grid,
                'Kinh tế & Quản trị': Grid,
                'Luật học': Layers,
                'Kỹ thuật & Công nghệ': Cpu,
                'Ngoại ngữ': BookOpen,
                'Ngôn ngữ & Văn hóa': BookOpen,
                'Y học & Sức khỏe': Star,
                'Khoa học cơ bản': Layers,
                'Kỹ năng mềm': User,
              };

              const Icon = iconMap[categoryName] || Grid;
              const isSelected = selectedCategory === categoryId;

              return (
                <motion.div
                  key={categoryId || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedCategory(categoryId)}
                  className={`p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer group bg-white border transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-green shadow-[0_4px_20px_rgba(5,150,105,0.15)] ring-4 ring-brand-green/5'
                      : 'border-slate-200/60 shadow-[0_4px_16px_rgba(15,23,42,0.01)] hover:shadow-md'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
                      isSelected
                        ? 'bg-brand-green text-white shadow-sm shadow-green-500/20'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-green-50 group-hover:text-brand-green'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-slate-800 text-xs mb-1.5 truncate max-w-full">
                    {categoryName}
                  </h3>

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-brand-green transition-colors">
                    Khám phá
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-200/60 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={18} className="text-brand-green" />
                  Mới & Nổi Bật
                </h2>

                {searchTerm && (
                  <p className="text-xs font-semibold text-slate-450 mt-1">
                    Kết quả tìm kiếm cho:{' '}
                    <span className="font-bold text-brand-green">
                      &quot;{searchTerm}&quot;
                    </span>
                  </p>
                )}
              </div>

              <div className="relative w-full md:w-72 group">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-brand-green transition-colors" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm tài liệu học tập..."
                  className="w-full bg-white border border-slate-200 text-xs font-semibold rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 transition-all text-slate-700 placeholder-slate-400 shadow-sm"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-slate-200/80 rounded-2xl aspect-[3/4.2] w-full animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredDocs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center shadow-sm">
                <p className="text-slate-500 text-sm font-semibold">
                  {searchTerm
                    ? `Không tìm thấy tài liệu phù hợp với "${searchTerm}".`
                    : 'Chưa có tài liệu nào trong hệ thống.'}
                </p>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="mt-4 px-5 py-2.5 bg-brand-green hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.02)]">
              <h3 className="text-sm font-black mb-6 uppercase tracking-wider flex items-center gap-2 text-slate-800">
                <Clock className="w-4.5 h-4.5 text-brand-green animate-pulse" />
                Đang thịnh hành
              </h3>

              <div className="space-y-4">
                {filteredDocs.slice(0, 3).map((item, idx) => {
                  const documentId =
                    item.DocID || item.DocumentID || item.documentId || item.id;
                  const title = item.Title || item.title || 'Không có tiêu đề';
                  const author = item.Author || item.author || 'Tác giả không rõ';

                  return (
                    <Link
                      to={`/library/${documentId}`}
                      key={documentId || idx}
                      className="flex items-center gap-4 group cursor-pointer border-b border-slate-100 last:border-0 pb-3 last:pb-0 relative overflow-hidden"
                    >
                      <div className="font-black text-2xl text-slate-200/80 group-hover:text-emerald-500 transition-colors shrink-0 font-mono">
                        0{idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-700 group-hover:text-brand-green transition-colors text-xs truncate">
                          {title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">
                          {author}
                        </p>
                      </div>
                    </Link>
                  );
                })}

                {!loading && filteredDocs.length === 0 && (
                  <p className="text-xs text-slate-400 font-semibold">
                    Không có dữ liệu tài liệu thịnh hành.
                  </p>
                )}
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden p-6 text-center shadow-lg group border border-slate-800/40">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c1612] via-[#0f172a] to-[#1e111a] backdrop-blur-[2px]"></div>

              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #fff 8%, transparent 9%)`,
                  backgroundSize: '12px 12px',
                }}
              />

              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3.5 animate-bounce" />

                <h3 className="text-base font-black mb-2 text-white uppercase tracking-wider">
                  Hội Viên Premium
                </h3>

                <p className="text-xs text-slate-350 mb-4 font-semibold leading-relaxed">
                  Truy cập không giới hạn, tải tài liệu offline và trải nghiệm không quảng cáo.
                </p>

                <button
                  type="button"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Nâng cấp ngay
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-200/60">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Text-to-Speech AI',
                desc: 'Lắng nghe nội dung tài liệu với giọng đọc AI tự nhiên, chuyển ngôn ngữ dễ dàng.',
                colorClass: 'bg-emerald-50 text-brand-green border-emerald-100',
              },
              {
                icon: Sparkles,
                title: 'Gợi ý thông minh',
                desc: 'Thuật toán máy học tự động gợi ý tài liệu phù hợp nhất theo hành vi đọc của bạn.',
                colorClass: 'bg-rose-50 text-rose-500 border-rose-100',
              },
              {
                icon: Layers,
                title: 'Phân loại đa tầng',
                desc: 'Phân lớp dữ liệu tài liệu trực quan giúp việc định hướng thông tin cực nhanh.',
                colorClass: 'bg-blue-50 text-blue-500 border-blue-100',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="text-center md:text-left p-5 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200/40 hover:shadow-sm transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 ${feature.colorClass} border rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0 shadow-sm`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-extrabold mb-2 text-slate-800 uppercase tracking-wide">
                  {feature.title}
                </h3>

                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200/60 py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 object-contain shadow-sm rounded-lg"
              />
              <span className="text-base font-extrabold text-slate-800">
                Thư Viện AI
              </span>
            </div>

            <p className="text-slate-450 text-xs font-semibold leading-relaxed">
              Nền tảng thư viện số thông minh hỗ trợ người dùng tra cứu, phân loại tài liệu nghiên cứu thời gian thực.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-slate-800">
              Khám phá
            </h4>

            <ul className="space-y-2 text-xs font-semibold text-slate-450">
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Tài liệu mới
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Tài liệu nổi bật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Danh mục tài liệu
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-slate-800">
              Hỗ trợ
            </h4>

            <ul className="space-y-2 text-xs font-semibold text-slate-450">
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-green transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-slate-800">
              Đăng ký nhận bản tin
            </h4>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-slate-700 placeholder-slate-400 font-semibold"
              />

              <button
                type="button"
                className="bg-brand-green hover:bg-green-700 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 pt-8 border-t border-slate-200/60 text-center text-slate-400 text-xs font-semibold">
          © 2026 Thư Viện AI. All rights reserved. Designed for the Future.
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/library/${documentId}`}
        className="rounded-2xl p-2.5 flex flex-col group cursor-pointer relative overflow-hidden bg-white border border-slate-200/50 hover:border-slate-250 hover:shadow-lg transition-all duration-300 block"
      >
        <div className="absolute top-4 right-4 z-10 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-white tracking-widest">
          {fileType}
        </div>

        <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-xl mb-3 shadow-[0_4px_10px_rgba(0,0,0,0.03)] bg-gradient-to-br from-slate-950 to-slate-900">
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
              backgroundSize: '14px 14px',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-transparent to-rose-500/10 pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-emerald-500/30 group-hover:scale-110 group-hover:text-emerald-500/60 transition-all duration-500 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          </div>
        </div>

        <h3 className="text-slate-800 font-extrabold text-xs leading-snug mb-1 truncate group-hover:text-brand-green transition-colors">
          {title}
        </h3>

        <p className="text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-wider truncate">
          {author}
        </p>

        <div className="mt-auto flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-50 pt-2">
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-current mr-1" />
            <span>4.8</span>
          </div>

          <button
            type="button"
            onClick={handleFavorite}
            className={`transition-all duration-300 p-1.5 rounded-xl ${
              favorite
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                : 'bg-slate-100 hover:bg-brand-green hover:text-white text-slate-400'
            }`}
            title={favorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          >
            <Bookmark
              className="w-3.5 h-3.5"
              fill={favorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default LibraryPage;