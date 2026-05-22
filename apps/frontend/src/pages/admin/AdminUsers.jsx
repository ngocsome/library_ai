import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, updateUserStatus } from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
        try {
            await updateUserStatus(userId, newStatus);
            setUsers(users.map(u => u.UserID === userId ? { ...u, Status: newStatus } : u));
            toast.success(`Đã ${newStatus === 'Active' ? 'mở khóa' : 'khóa'} người dùng`);
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại');
        }
    };

    const filteredUsers = users.filter(user => 
        user.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[400px] flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
                    <p className="text-slate-500 text-sm mt-1">Quản lý thông tin và phân quyền cho tất cả thành viên trong hệ thống.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} /> Xuất CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20">
                        <Users size={16} /> Thêm thành viên
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên, email hoặc tài khoản..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all flex-1 md:flex-none justify-center">
                        <Filter size={16} /> Lọc
                    </button>
                    <div className="text-sm text-slate-400 px-2">
                        {filteredUsers.length} kết quả
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence>
                                {filteredUsers.map((user, idx) => (
                                    <motion.tr 
                                        key={user.UserID}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-200 overflow-hidden">
                                                    {user.Avatar ? <img src={user.Avatar} alt="" /> : user.FullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-none">{user.FullName}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{user.Email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full w-fit border border-slate-200/50">
                                                <Shield size={12} />
                                                {user.RoleID === 1 ? 'Quản trị' : user.RoleID === 2 ? 'Giảng viên' : 'Sinh viên'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                user.Status === 'Active' 
                                                ? 'bg-green-50 text-green-700 border-green-100' 
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.Status === 'Active' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                                {user.Status === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                <Calendar size={14} />
                                                {new Date(user.CreatedAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleStatusToggle(user.UserID, user.Status)}
                                                    className={`p-2 rounded-lg transition-all ${
                                                        user.Status === 'Active' 
                                                        ? 'text-red-500 hover:bg-red-50' 
                                                        : 'text-green-500 hover:bg-green-50'
                                                    }`}
                                                    title={user.Status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
                                                >
                                                    {user.Status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-20 bg-slate-50/30">
                        <Users size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-medium">Không tìm thấy người dùng phù hợp</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
