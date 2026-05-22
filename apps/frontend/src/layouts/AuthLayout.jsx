import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-green/10 -skew-y-3 origin-top-left -z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -z-0"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative z-10 border border-gray-100">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 p-1 shadow-sm">
                <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          <h1 className="text-2xl font-bold text-brand-green">Library AI </h1>
          <p className="text-gray-500 text-sm mt-1">Hệ thống Thư viện số & Học tập</p>
        </div>
        
        <Outlet />
        
        <div className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Library AI . All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
