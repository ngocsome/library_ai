import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText,
  Globe2,
  GraduationCap,
  HelpCircle,
  LibraryBig,
  MessageSquare,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const stats = [
  {
    label: 'Tài liệu số',
    value: '1.200+',
    icon: BookOpen,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Chủ đề học tập',
    value: '30+',
    icon: Compass,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'Người dùng',
    value: '500+',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Hỗ trợ AI',
    value: '24/7',
    icon: Bot,
    color: 'bg-amber-50 text-amber-600',
  },
];

const newsItems = [
  {
    title: 'Hướng dẫn khai thác và sử dụng Thư viện AI',
    date: '25/05/2026',
    desc: 'Tìm hiểu cách tra cứu tài liệu, lưu yêu thích, tham gia diễn đàn và sử dụng AI hỗ trợ học tập.',
    tag: 'Hướng dẫn',
  },
  {
    title: 'Bổ sung bộ sưu tập tài liệu học tập mới',
    date: '22/05/2026',
    desc: 'Nhiều tài liệu mới về Java, Spring Boot, cơ sở dữ liệu, ngoại ngữ và kỹ năng mềm đã được cập nhật.',
    tag: 'Tài nguyên',
  },
  {
    title: 'Ra mắt không gian nhóm học tập trực tuyến',
    date: '20/05/2026',
    desc: 'Người dùng có thể tạo nhóm, trao đổi theo kênh, chia sẻ kiến thức và học tập cộng tác.',
    tag: 'Nhóm học tập',
  },
];

const guideItems = [
  'Đăng nhập bằng tài khoản cá nhân để sử dụng đầy đủ chức năng.',
  'Không chia sẻ tài khoản, tài liệu nội bộ hoặc nội dung vi phạm bản quyền.',
  'Bình luận, đăng bài và trao đổi học tập với thái độ văn minh.',
  'Tài liệu tải về chỉ phục vụ mục đích học tập, nghiên cứu.',
];

const serviceItems = [
  {
    title: 'Tra cứu tài liệu',
    desc: 'Tìm kiếm nhanh tài liệu theo tên, tác giả, chủ đề hoặc loại file.',
    icon: Search,
    path: '/library',
  },
  {
    title: 'Diễn đàn học tập',
    desc: 'Đặt câu hỏi, chia sẻ kinh nghiệm và thảo luận cùng cộng đồng.',
    icon: MessageSquare,
    path: '/forum',
  },
  {
    title: 'Nhóm học tập',
    desc: 'Tạo hoặc tham gia nhóm riêng để học tập, trao đổi theo chủ đề.',
    icon: Users,
    path: '/groups',
  },
  {
    title: 'AI hỗ trợ',
    desc: 'Nhận gợi ý, giải thích tài liệu và hỗ trợ học tập thông minh.',
    icon: Sparkles,
    path: '/ai',
  },
];

const collections = [
  {
    title: 'Công nghệ thông tin',
    count: '320 tài liệu',
    icon: FileText,
  },
  {
    title: 'Ngoại ngữ',
    count: '180 tài liệu',
    icon: Globe2,
  },
  {
    title: 'Kinh tế',
    count: '150 tài liệu',
    icon: GraduationCap,
  },
  {
    title: 'Kỹ năng mềm',
    count: '90 tài liệu',
    icon: Zap,
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-violet-200/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[130px] pointer-events-none" />

      <section className="container mx-auto px-6 pt-12 pb-10 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              NỀN TẢNG THƯ VIỆN SỐ THÔNG MINH
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Chào mừng đến với
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                Thư Viện AI
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
              Không gian học tập số giúp người dùng tra cứu tài liệu, theo dõi tin tức,
              tham gia diễn đàn, tạo nhóm học tập và sử dụng AI để hỗ trợ quá trình
              nghiên cứu hiệu quả hơn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
              >
                Vào thư viện
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/forum"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                Khám phá diễn đàn
                <MessageSquare size={17} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[32px] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-violet-200/50 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-16 h-16 rounded-2xl object-contain bg-white shadow-sm border border-slate-100"
                  />
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Trung tâm tri thức số
                    </h2>
                    <p className="text-sm text-slate-500 font-semibold mt-1">
                      Học tập • Nghiên cứu • Chia sẻ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}
                        >
                          <Icon size={19} />
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {item.value}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <LibraryBig size={20} className="text-emerald-600" />
                    Tổng quan thư viện
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Hệ thống hỗ trợ quản lý, tra cứu và khai thác tài liệu học tập.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Tra cứu nhanh',
                    desc: 'Tìm tài liệu theo từ khóa, chủ đề, tác giả hoặc loại file.',
                  },
                  {
                    title: 'Cộng đồng học tập',
                    desc: 'Trao đổi kiến thức qua diễn đàn và nhóm học tập riêng.',
                  },
                  {
                    title: 'AI thông minh',
                    desc: 'Hỗ trợ gợi ý tài liệu, giải thích nội dung và định hướng học tập.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-slate-50 border border-slate-100 p-5"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-3" />
                    <h3 className="font-black text-slate-800 text-sm mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Newspaper size={20} className="text-violet-600" />
                    Tin tức nổi bật
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Cập nhật thông tin mới về thư viện và tài nguyên học tập.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {newsItems.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-6 h-6 text-emerald-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                            {item.tag}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="font-black text-slate-900 text-sm md:text-base group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mt-1">
                          {item.desc}
                        </p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
                <BookOpen size={20} className="text-blue-600" />
                Tài nguyên - Bộ sưu tập
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {collections.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      to="/library"
                      className="rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:shadow-md transition-all p-5 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                        <Icon size={20} />
                      </div>
                      <h3 className="font-black text-sm text-slate-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold">
                        {item.count}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
                <ShieldCheck size={20} className="text-emerald-600" />
                Nội quy sử dụng
              </h2>

              <div className="space-y-3">
                {guideItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-violet-500/30 rounded-full blur-3xl" />
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-amber-300 mb-4" />
                <h2 className="text-xl font-black mb-2">
                  AI hỗ trợ học tập
                </h2>
                <p className="text-sm text-slate-300 font-medium leading-relaxed mb-5">
                  Sử dụng AI để gợi ý tài liệu, tóm tắt nội dung, giải thích khái niệm và định hướng nghiên cứu.
                </p>
                <Link
                  to="/ai"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors"
                >
                  Trải nghiệm AI
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8 pb-16 relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
            <HelpCircle size={20} className="text-amber-600" />
            Dịch vụ - Tiện ích
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-md p-5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={21} />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600">
                    Truy cập
                    <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;