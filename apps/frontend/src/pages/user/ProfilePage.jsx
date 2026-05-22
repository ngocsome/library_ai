import React, { useState, useEffect } from 'react';
import { User, Lock, Clock, GraduationCap, MapPin, Mail, Camera, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { getProfile, getUserActivity } from '../../services/userService';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, activityData] = await Promise.all([
             getProfile(),
             getUserActivity()
        ]);
        setProfile(profileData);
        setActivities(activityData || []);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-green" /></div>;
  if (!profile) return <div className="text-center p-10">Không tải được thông tin.</div>;

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-green to-teal-500"></div>
         
         <div className="relative pt-16 px-4 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
                    <User size={64} className="text-gray-400" />
                </div>
                {/* <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow text-gray-600 hover:text-brand-green transition-colors">
                    <Camera size={16} />
                </button> */}
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{profile.FullName}</h1>
                <p className="text-gray-500">{profile.Department || 'Chưa cập nhật khoa'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><MapPin size={16} /> Việt Nam</span>
                    <span className="flex items-center gap-1"><Mail size={16} /> {profile.Email}</span>
                    <span className="flex items-center gap-1"><GraduationCap size={16} /> {profile.Roles?.RoleName || 'Thành viên'}</span>
                </div>
            </div>

            <div className="flex gap-3 mb-2">
                {/* Buttons could be hooked up later */}
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                    Đổi mật khẩu
                </button>
                <button className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors">
                    Chỉnh sửa
                </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
             <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'info' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
            >
                <User size={18} /> Thông tin chung
             </button>
             <button 
                onClick={() => setActiveTab('activity')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${activeTab === 'activity' ? 'bg-white text-brand-green shadow-sm' : 'text-gray-600 hover:bg-white/50'}`}
            >
                <Clock size={18} /> Lịch sử hoạt động
             </button>
             {/* Security tab skipped for now */}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
             {activeTab === 'info' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <h3 className="font-bold text-lg text-gray-800 pb-4 border-b">Thông tin cá nhân</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</label>
                            <div className="font-medium text-gray-800">{profile.Username}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Chuyên ngành</label>
                            <div className="font-medium text-gray-800">{profile.Major || 'Chưa cập nhật'}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Ngày tham gia</label>
                            <div className="font-medium text-gray-800">{new Date(profile.CreatedAt).toLocaleDateString()}</div>
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Giới thiệu bản thân</label>
                            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                                {profile.Bio || 'Chưa có thông tin giới thiệu.'}
                            </p>
                        </div>
                    </div>
                </div>
             )}

             {activeTab === 'activity' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <h3 className="font-bold text-lg text-gray-800 pb-4 border-b">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? activities.map(act => (
                            <div key={act.LogID} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-medium text-sm">{act.Description}</p>
                                    <p className="text-gray-500 text-xs mt-1">{new Date(act.Timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500">Chưa có hoạt động nào.</p>
                        )}
                    </div>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
