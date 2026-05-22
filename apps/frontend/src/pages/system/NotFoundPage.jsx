import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col text-center p-4">
      <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
         <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
      </div>
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 -mt-10 mb-4">Trang không tồn tại</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        <Home size={20} />
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
