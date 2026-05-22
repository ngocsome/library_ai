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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <User size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Chỉnh sửa hồ sơ</h2>
                <p className="text-sm text-slate-500">Cập nhật thông tin cá nhân của bạn.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                required
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Chuyên ngành
              </label>
              <input
                name="major"
                value={form.major}
                onChange={onChange}
                placeholder="Ví dụ: Công nghệ thông tin, Kỹ thuật phần mềm..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-brand-green hover:bg-green-700 text-white text-sm font-bold shadow-lg disabled:bg-green-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} />
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Lock size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Đổi mật khẩu</h2>
                <p className="text-sm text-slate-500">Nhập mật khẩu cũ và mật khẩu mới.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mật khẩu cũ <span className="text-red-500">*</span>
              </label>
              <input
                name="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={onChange}
                required
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-2xl bg-brand-green hover:bg-green-700 text-white text-sm font-bold shadow-lg disabled:bg-green-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang đổi...
                  </>
                ) : (
                  <>
                    <Check size={18} />
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

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center p-10">Không tải được thông tin.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-green to-teal-500" />

        <div className="relative pt-16 px-4 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
              <User size={64} className="text-gray-400" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{getFullName(profile)}</h1>
            <p className="text-gray-500">{getDepartment(profile)}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> Việt Nam
              </span>
              <span className="flex items-center gap-1">
                <Mail size={16} /> {getEmail(profile)}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap size={16} /> {getRoleName(profile)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mb-2">
            <button
              type="button"
              onClick={openPasswordModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              Đổi mật khẩu
            </button>
            <button
              type="button"
              onClick={openEditModal}
              className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
              activeTab === 'info'
                ? 'bg-white text-brand-green shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <User size={18} /> Thông tin chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors font-medium ${
              activeTab === 'activity'
                ? 'bg-white text-brand-green shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            <Clock size={18} /> Lịch sử hoạt động
          </button>
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'info' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="font-bold text-lg text-gray-800 pb-4 border-b">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tên đăng nhập
                  </label>
                  <div className="font-medium text-gray-800">{getUsername(profile)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Chuyên ngành
                  </label>
                  <div className="font-medium text-gray-800">{getMajor(profile)}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Ngày tham gia
                  </label>
                  <div className="font-medium text-gray-800">
                    {formatDate(profile.CreatedAt || profile.createdAt)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Mã người dùng
                  </label>
                  <div className="font-medium text-gray-800">{getProfileId(profile) || 'Chưa rõ'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h3 className="font-bold text-lg text-gray-800 pb-4 border-b">
                Hoạt động gần đây
              </h3>

              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((act, index) => {
                    const title = act.Title || act.title || act.Description || act.description || 'Hoạt động';
                    const description = act.Description || act.description || act.type || act.Type || '';
                    const time = act.Timestamp || act.timestamp || act.createdAt || act.CreatedAt;

                    return (
                      <div
                        key={act.LogID || act.id || index}
                        className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                      >
                        <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium text-sm">{title}</p>
                          {description && (
                            <p className="text-gray-500 text-xs mt-1">{description}</p>
                          )}
                          <p className="text-gray-400 text-xs mt-1">
                            {time ? new Date(time).toLocaleString('vi-VN') : 'Vừa cập nhật'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Chưa có hoạt động nào.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        form={editForm}
        submitting={submittingEdit}
        onClose={closeEditModal}
        onChange={handleEditChange}
        onSubmit={handleUpdateProfile}
      />

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
