import React from 'react';
import { BarChart2, Clock, Calendar } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Thống kê học tập</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Clock size={24} />
                <h3 className="font-bold">Thời gian học</h3>
             </div>
             <p className="text-3xl font-bold text-gray-800">24.5 <span className="text-sm text-gray-500 font-normal">giờ</span></p>
             <p className="text-xs text-gray-400 mt-1">Tuần này</p>
          </div>
          
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-3 text-green-600 mb-2">
                <BarChart2 size={24} />
                <h3 className="font-bold">Tài liệu đã đọc</h3>
             </div>
             <p className="text-3xl font-bold text-gray-800">12 <span className="text-sm text-gray-500 font-normal">tài liệu</span></p>
             <p className="text-xs text-gray-400 mt-1">+3 so với tuần trước</p>
          </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <div className="flex items-center gap-3 text-purple-600 mb-2">
                <Calendar size={24} />
                <h3 className="font-bold">Chuỗi ngày học</h3>
             </div>
             <p className="text-3xl font-bold text-gray-800">5 <span className="text-sm text-gray-500 font-normal">ngày</span></p>
             <p className="text-xs text-gray-400 mt-1">Cố gắng lên!</p>
          </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96 flex flex-col items-center justify-center text-gray-400">
          Biểu đồ chi tiết (Mock)
       </div>
    </div>
  );
};

export default AnalyticsPage;
