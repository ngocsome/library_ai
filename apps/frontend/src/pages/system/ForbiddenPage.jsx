import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center mt-20">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
         <ShieldAlert size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">403 - Truy cập bị từ chối</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là sự nhầm lẫn.
      </p>
      <Link 
        to="/" 
        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default ForbiddenPage;
