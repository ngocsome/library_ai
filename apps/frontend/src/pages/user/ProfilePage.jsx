import React, { useEffect, useState } from 'react';
import {
  Check,
  Clock,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Save,
  User,
  X,
  Calendar,
  KeyRound,
  FileCode2,
  ShieldCheck,
  Cpu,
  Compass
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  changePassword,
  getProfile,
  getUserActivity,
  updateProfile,
} from '../../services/userService';

const getProfileId = (profile) => profile?.UserID || profile?.userId || profile?.id;

const getFullName = (profile) =>
  profile?.FullName ||
  profile?.fullName ||
  profile?.name ||
  profile?.Name ||
  'Chưa cập nhật tên';

const getUsername = (profile) =>
  profile?.Username ||
  profile?.username ||
  profile?.Email ||
  profile?.email ||
  'Chưa cập nhật';

const getEmail = (profile) => profile?.Email || profile?.email || 'Chưa cập nhật email';

const getDepartment = (profile) =>
  profile?.Department ||
  profile?.department ||
  profile?.Faculty ||
  profile?.faculty ||
  'Chưa cập nhật khoa';

const getMajor = (profile) =>
  profile?.Major ||
  profile?.major ||
  profile?.Specialization ||
  profile?.specialization ||
  'Chưa cập nhật';

const getRoleName = (profile) => {
  const role =
    profile?.Roles?.RoleName ||
    profile?.roles?.RoleName ||
    profile?.roleName ||
    profile?.RoleName ||
    profile?.role ||
    profile?.Role ||
    'Thành viên';

  return String(role).replace('ROLE_', '');
};

const formatDate = (value) => {
  if (!value) return 'Chưa rõ';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa rõ';

  return date.toLocaleDateString('vi-VN');
};

const EditProfileModal = ({ open, form, submitting, onClose, onChange, onSubmit }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-lg p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-white/20 overflow-hidden"
        >
          {/* Header Modal */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center border border-brand-green/20 shadow-sm">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Chỉnh sửa hồ sơ</h2>
                <p className="text-xs text-slate-500 mt-0.5">Cập nhật thông tin cá nhân của bạn trên hệ thống.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-50 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                required
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800 font-semibold placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800 font-semibold placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Chuyên ngành
              </label>
              <input
                name="major"
                value={form.major}
                onChange={onChange}
                placeholder="Ví dụ: Công nghệ thông tin, Kỹ thuật phần mềm..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800 font-semibold placeholder-slate-400"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3.5 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-brand-green hover:bg-green-700 text-white text-xs font-bold shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] disabled:bg-green-300 disabled:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ChangePasswordModal = ({ open, form, submitting, onClose, onChange, onSubmit }) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-lg p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-white/20 overflow-hidden"
        >
          {/* Header Modal */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center border border-brand-green/20 shadow-sm">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-tight">Đổi mật khẩu</h2>
                <p className="text-xs text-slate-500 mt-0.5">Vui lòng thiết lập mật khẩu mạnh để bảo vệ tài khoản.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-50 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mật khẩu cũ <span className="text-red-500">*</span>
              </label>
              <input
                name="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={onChange}
                required
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={onChange}
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nhập lại mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                required
                minLength={6}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all text-slate-800"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3.5 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-brand-green hover:bg-green-700 text-white text-xs font-bold shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] disabled:bg-green-300 disabled:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang đổi...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    major: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileData, activityData] = await Promise.all([
        getProfile(),
        getUserActivity(),
      ]);

      setProfile(profileData);
      setActivities(Array.isArray(activityData) ? activityData : []);
    } catch (error) {
      console.error('Failed to load profile', error);
      toast.error('Không tải được thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEditModal = () => {
    setEditForm({
      fullName: getFullName(profile) === 'Chưa cập nhật tên' ? '' : getFullName(profile),
      email: getEmail(profile) === 'Chưa cập nhật email' ? '' : getEmail(profile),
      major: getMajor(profile) === 'Chưa cập nhật' ? '' : getMajor(profile),
    });
    setEditOpen(true);
  };

  const closeEditModal = () => {
    if (submittingEdit) return;
    setEditOpen(false);
  };

  const openPasswordModal = () => {
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordOpen(true);
  };

  const closePasswordModal = () => {
    if (submittingPassword) return;
    setPasswordOpen(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    if (!editForm.fullName.trim() || !editForm.email.trim()) {
      toast.error('Vui lòng nhập họ tên và email');
      return;
    }

    try {
      setSubmittingEdit(true);

      const updatedProfile = await updateProfile({
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        major: editForm.major.trim(),
      });

      const mergedProfile = {
        ...profile,
        ...updatedProfile,
        fullName: updatedProfile?.fullName || updatedProfile?.FullName || editForm.fullName.trim(),
        FullName: updatedProfile?.FullName || updatedProfile?.fullName || editForm.fullName.trim(),
        email: updatedProfile?.email || updatedProfile?.Email || editForm.email.trim(),
        Email: updatedProfile?.Email || updatedProfile?.email || editForm.email.trim(),
        major: updatedProfile?.major || updatedProfile?.Major || editForm.major.trim(),
        Major: updatedProfile?.Major || updatedProfile?.major || editForm.major.trim(),
      };

      setProfile(mergedProfile);

      const oldUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...oldUser,
          fullName: mergedProfile.fullName,
          FullName: mergedProfile.FullName,
          email: mergedProfile.email,
          Email: mergedProfile.Email,
          major: mergedProfile.major,
          Major: mergedProfile.Major,
        })
      );

      toast.success('Cập nhật hồ sơ thành công');
      closeEditModal();
    } catch (error) {
      console.error('Update profile failed', error);
      toast.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp');
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    try {
      setSubmittingPassword(true);

      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success('Đổi mật khẩu thành công');
      closePasswordModal();
    } catch (error) {
      console.error('Change password failed', error);
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSubmittingPassword(false);
    }
  };

  const getInitialName = () => {
    const name = getFullName(profile);
    if (name === 'Chưa cập nhật tên') return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[350px] p-10">
        <Loader2 className="animate-spin text-brand-green w-10 h-10" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-12 text-slate-500 font-bold bg-white rounded-3xl border border-slate-200/60 shadow-md max-w-xl mx-auto">
        Không tải được thông tin hồ sơ của bạn. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      {/* Profile Header Banner Card (Thiết kế AI High-Tech) */}
      <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(15,23,42,0.03)] border border-slate-200/60 overflow-hidden relative">
        
        {/* Banner Gradient chuyển màu Công nghệ & Họa tiết Lưới Điện Tử chìm */}
        <div className="absolute top-0 left-0 w-full h-44 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative overflow-hidden">
          {/* Cyber Lưới chấm công nghệ chìm */}
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 10%, transparent 11%)`,
              backgroundSize: '16px 16px'
            }}
          />
          {/* Đốm sáng phát quang tạo chiều sâu */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-300/40 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-emerald-400/30 rounded-full filter blur-3xl pointer-events-none" />
        </div>

        {/* Bố cục Avatar và các khối thông tin sau khi được tách biệt cân đối */}
        <div className="relative pt-24 pb-8 px-8 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full lg:w-auto">
            {/* Avatar cực lớn với vòng viền phát quang kép 3D */}
            <div className="relative shrink-0 -mt-16 md:-mt-20 z-10">
              <div className="w-32 h-32 rounded-full border-[6px] border-white bg-slate-50 shadow-[0_12px_24px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden transition-transform duration-500 hover:scale-105">
                {profile?.Avatar || profile?.avatar ? (
                  <img src={profile.Avatar || profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-brand-green to-emerald-400 flex items-center justify-center text-white font-black text-4xl tracking-tight shadow-[inset_0_2px_10px_rgba(0,0,0,0.15)]">
                    {getInitialName()}
                  </div>
                )}
              </div>
              {/* Green active pulse dot công nghệ */}
              <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-white rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse"></span>
            </div>

            {/* Thông tin Meta người dùng phân cấp rõ ràng */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {getFullName(profile)}
              </h1>
              <p className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
                <Cpu size={12} className="text-brand-green animate-pulse" />
                {getDepartment(profile)}
              </p>
              
              {/* Badges dạng kén nhộng trong suốt sang xịn */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-4 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 rounded-full border border-slate-200/50 transition-colors">
                  <MapPin size={13} className="text-slate-400" /> Việt Nam
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 rounded-full border border-slate-200/50 transition-colors">
                  <Mail size={13} className="text-slate-400" /> {getEmail(profile)}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-brand-green rounded-full border border-emerald-100/50 shadow-sm">
                  <ShieldCheck size={13} /> {getRoleName(profile)}
                </span>
              </div>
            </div>
          </div>

          {/* Cụm Nút Hành Động được bố trí chuẩn xác, tránh bị che khuất */}
          <div className="flex flex-row gap-3 w-full sm:w-auto shrink-0 justify-center">
            <button
              type="button"
              onClick={openPasswordModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 border border-slate-200/80 hover:bg-slate-50 rounded-2xl font-bold text-xs text-slate-700 transition-all cursor-pointer active:scale-[0.97] shadow-sm hover:shadow"
            >
              <KeyRound size={14} className="text-slate-400" />
              Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={openEditModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-brand-green hover:bg-green-700 text-white rounded-2xl font-bold text-xs transition-all shadow-[0_4px_14px_rgba(5,150,105,0.2)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.3)] cursor-pointer active:scale-[0.97]"
            >
              <User size={14} />
              Chỉnh sửa
            </button>
          </div>

        </div>
      </div>

      {/* Grid Content: Cột trái Menu Tab dạng Cyber Capsule - Cột phải Nội dung Kính mờ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Cột trái: Tab Navigation */}
        <div className="space-y-2 shrink-0 bg-white/60 backdrop-blur-md p-2 rounded-3xl border border-slate-200/40 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-white text-brand-green shadow-sm border border-slate-200/50'
                : 'text-slate-550 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            <User size={15} className={activeTab === 'info' ? 'text-brand-green' : 'text-slate-400'} />
            Thông tin chung
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-white text-brand-green shadow-sm border border-slate-200/50'
                : 'text-slate-550 hover:bg-white/50 hover:text-slate-900'
            }`}
          >
            <Clock size={15} className={activeTab === 'activity' ? 'text-brand-green' : 'text-slate-400'} />
            Lịch sử hoạt động
          </button>
        </div>

        {/* Cột phải: Content Panel bọc trong Glass Card cao cấp */}
        <div className="lg:col-span-3">
          {activeTab === 'info' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] border border-slate-200/60 p-6 space-y-6"
            >
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center gap-2.5">
                <Compass size={18} className="text-brand-green animate-spin-slow" />
                Tổng quan hồ sơ dữ liệu
              </h3>

              {/* Grid 4 thẻ thông tin được bọc trong High-tech Card mờ mịn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tên đăng nhập */}
                <div className="p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm border border-slate-200/40 hover:border-slate-200 transition-all duration-300 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-200/40 flex items-center justify-center text-slate-500 shrink-0">
                    <User size={16} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Tên đăng nhập
                    </label>
                    <div className="text-sm font-bold text-slate-800">{getUsername(profile)}</div>
                  </div>
                </div>

                {/* Chuyên ngành */}
                <div className="p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm border border-slate-200/40 hover:border-slate-200 transition-all duration-300 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-green-50 text-brand-green flex items-center justify-center shrink-0 border border-green-100/50">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Chuyên ngành
                    </label>
                    <div className="text-sm font-bold text-slate-800">{getMajor(profile)}</div>
                  </div>
                </div>

                {/* Ngày tham gia */}
                <div className="p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm border border-slate-200/40 hover:border-slate-200 transition-all duration-300 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-650 flex items-center justify-center shrink-0 border border-teal-100/50">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Ngày tham gia
                    </label>
                    <div className="text-sm font-bold text-slate-800">
                      {formatDate(profile.CreatedAt || profile.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Mã người dùng */}
                <div className="p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:shadow-sm border border-slate-200/40 hover:border-slate-200 transition-all duration-300 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-200/40 flex items-center justify-center text-slate-500 shrink-0">
                    <FileCode2 size={16} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Mã số thành viên
                    </label>
                    <div className="text-sm font-bold text-slate-800 font-mono tracking-wide">
                      {getProfileId(profile) || 'Chưa rõ'}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.03)] border border-slate-200/60 p-6 space-y-6"
            >
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 flex items-center gap-2.5">
                <Clock size={18} className="text-brand-green" />
                Dòng thời gian hoạt động hệ thống
              </h3>

              {/* Timeline mạch điện tử phát sáng nghệ thuật */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-[1.5px] before:bg-slate-200/80">
                {activities.length > 0 ? (
                  activities.map((act, index) => {
                    const title = act.Title || act.title || act.Description || act.description || 'Hoạt động';
                    const description = act.Description || act.description || act.type || act.Type || '';
                    const time = act.Timestamp || act.timestamp || act.createdAt || act.CreatedAt;

                    return (
                      <div
                        key={act.LogID || act.id || index}
                        className="relative flex gap-4 items-start p-3.5 rounded-2xl hover:bg-slate-50 hover:shadow-sm border border-transparent hover:border-slate-150/50 transition-all duration-300 group"
                      >
                        {/* Timeline Dot (Node nhấp nháy 3D phát quang cực đẹp) */}
                        <div className="absolute -left-[20px] top-[22px] w-3.5 h-3.5 rounded-full bg-white border-[3px] border-brand-green shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10 group-hover:scale-110 group-hover:border-emerald-500 transition-all" />
                        
                        <div className="mt-0.5 w-9 h-9 rounded-xl bg-slate-100 text-slate-550 group-hover:bg-green-50 group-hover:text-brand-green flex items-center justify-center shrink-0 transition-colors">
                          <Clock size={15} />
                        </div>
                        <div>
                          <p className="text-slate-800 font-bold text-sm tracking-tight leading-none mb-1.5">{title}</p>
                          {description && (
                            <p className="text-slate-500 text-xs font-semibold mb-2 leading-relaxed">{description}</p>
                          )}
                          <p className="text-slate-450 text-[10px] font-bold tracking-wider uppercase">
                            {time ? new Date(time).toLocaleString('vi-VN') : 'Vừa cập nhật'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-sm font-semibold pl-2">Chưa có hoạt động nào được ghi nhận trên hệ thống.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
        
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editOpen}
        form={editForm}
        submitting={submittingEdit}
        onClose={closeEditModal}
        onChange={handleEditChange}
        onSubmit={handleUpdateProfile}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={passwordOpen}
        form={passwordForm}
        submitting={submittingPassword}
        onClose={closePasswordModal}
        onChange={handlePasswordChange}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};

export default ProfilePage;