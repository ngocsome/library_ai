import React, { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  Edit,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Unlock,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  createAdminUser,
  deleteAdminUser,
  getAllUsers,
  updateAdminUser,
  updateAdminUserStatus,
  updateUserStatus,
} from '../../services/adminService';

const getUserId = (user) =>
  user?.UserID || user?.userId || user?.id || user?.ID || user?._id;

const getFullName = (user) =>
  user?.FullName ||
  user?.fullName ||
  user?.name ||
  user?.Name ||
  user?.username ||
  user?.Username ||
  'Chưa có tên';

const getUsername = (user) =>
  user?.Username || user?.username || user?.email || user?.Email || 'unknown';

const getEmail = (user) => user?.Email || user?.email || 'Chưa có email';

const getRole = (user) => {
  const role =
    user?.RoleName ||
    user?.roleName ||
    user?.role ||
    user?.Role ||
    user?.roles?.[0]?.name ||
    user?.roles?.[0]?.Name ||
    user?.roles?.[0] ||
    'USER';

  return String(role).replace('ROLE_', '').toUpperCase();
};

const isUserActive = (user) => {
  const status = user?.Status || user?.status;

  if (typeof user?.enabled === 'boolean') return user.enabled;
  if (typeof user?.Enabled === 'boolean') return user.Enabled;
  if (typeof user?.active === 'boolean') return user.active;
  if (typeof user?.Active === 'boolean') return user.Active;

  if (!status) return true;

  const normalized = String(status).toLowerCase();
  return ['active', 'enabled', '1', 'true', 'hoạt động', 'dang_hoat_dong'].includes(normalized);
};

const getCreatedAt = (user) =>
  user?.CreatedAt || user?.createdAt || user?.created_at || user?.CreatedDate || user?.createdDate || null;

const emptyUserForm = () => ({
  fullName: '',
  username: '',
  email: '',
  password: '',
  role: 'USER',
});

const UserModal = ({ open, mode, form, submitting, onClose, onChange, onSubmit }) => {
  if (!open) return null;

  const isEdit = mode === 'edit';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                {isEdit ? <Edit size={22} /> : <UserPlus size={22} />}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEdit ? 'Sửa người dùng' : 'Thêm người dùng mới'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isEdit
                    ? 'Cập nhật thông tin tài khoản. Bỏ trống mật khẩu nếu không muốn đổi.'
                    : 'Tạo tài khoản mới trong hệ thống.'}
                </p>
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  required
                  placeholder="username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {isEdit ? 'Mật khẩu mới' : 'Mật khẩu'} {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  required={!isEdit}
                  minLength={form.password ? 6 : undefined}
                  placeholder={isEdit ? 'Bỏ trống nếu không đổi' : 'Tối thiểu 6 ký tự'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Vai trò</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
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
                className="flex-[2] py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-900/20 disabled:bg-primary-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {isEdit ? <Edit size={17} /> : <Plus size={17} />}
                    {isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyUserForm);
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách người dùng. Cần kiểm tra API /api/admin/users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === '1') {
      openCreateModal();
    }
  }, [location.search]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingUser(null);
    setForm(emptyUserForm());
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setForm({
      fullName: getFullName(user),
      username: getUsername(user),
      email: getEmail(user) === 'Chưa có email' ? '' : getEmail(user),
      password: '',
      role: getRole(user) || 'USER',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setModalMode('create');
    setEditingUser(null);
    setForm(emptyUserForm());

    const params = new URLSearchParams(location.search);
    if (params.has('create')) {
      params.delete('create');
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUser = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập đầy đủ họ tên, username và email');
      return;
    }

    if (modalMode === 'create' && !form.password.trim()) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    if (form.password && form.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };

      if (modalMode === 'edit') {
        const id = getUserId(editingUser);
        if (!id) {
          toast.error('Không tìm thấy ID người dùng');
          return;
        }

        await updateAdminUser(id, payload);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await createAdminUser(payload);
        toast.success('Tạo người dùng thành công');
      }

      closeModal();
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          (modalMode === 'edit' ? 'Cập nhật người dùng thất bại' : 'Tạo người dùng thất bại')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const id = getUserId(user);
    if (!id) {
      toast.error('Không tìm thấy ID người dùng');
      return;
    }

    const currentActive = isUserActive(user);
    const nextActive = !currentActive;
    const confirmMessage = nextActive
      ? `Bạn có chắc chắn muốn mở khóa tài khoản "${getUsername(user)}" không?`
      : `Bạn có chắc chắn muốn khóa tài khoản "${getUsername(user)}" không?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      if (updateAdminUserStatus) {
        await updateAdminUserStatus(id, nextActive);
      } else {
        await updateUserStatus(id, nextActive ? 'ACTIVE' : 'LOCKED');
      }

      setUsers((prev) =>
        prev.map((item) => {
          if (String(getUserId(item)) !== String(id)) return item;
          return {
            ...item,
            enabled: nextActive,
            Enabled: nextActive,
            status: nextActive ? 'ACTIVE' : 'LOCKED',
            Status: nextActive ? 'ACTIVE' : 'LOCKED',
          };
        })
      );

      toast.success(nextActive ? 'Đã mở khóa người dùng' : 'Đã khóa người dùng');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleDeleteUser = async (user) => {
    const id = getUserId(user);
    if (!id) {
      toast.error('Không tìm thấy ID người dùng');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = getUserId(currentUser);

    if (String(currentUserId) === String(id)) {
      toast.error('Không thể xóa chính tài khoản đang đăng nhập');
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng "${getUsername(user)}" không? Thao tác này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((item) => String(getUserId(item)) !== String(id)));
      toast.success('Xóa người dùng thành công');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
    }
  };

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const username = getUsername(user).toLowerCase();
      const email = getEmail(user).toLowerCase();
      const role = getRole(user).toLowerCase();
      const active = isUserActive(user);

      const matchesKeyword =
        !keyword ||
        fullName.includes(keyword) ||
        username.includes(keyword) ||
        email.includes(keyword) ||
        role.includes(keyword);

      const matchesRole = !roleFilter || role === roleFilter.toLowerCase();
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'ACTIVE' && active) ||
        (statusFilter === 'LOCKED' && !active);

      return matchesKeyword && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const activeUsers = users.filter((user) => isUserActive(user)).length;
  const lockedUsers = users.length - activeUsers;

  if (loading) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý tài khoản, vai trò và trạng thái hoạt động của người dùng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20"
          >
            <UserPlus size={16} />
            Thêm người dùng mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-xl font-bold text-slate-900">{users.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đang hoạt động</p>
            <p className="text-xl font-bold text-slate-900">{activeUsers}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Ban size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Đã khóa</p>
            <p className="text-xl font-bold text-slate-900">{lockedUsers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, username, email, vai trò..."
              className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="w-full lg:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full lg:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, index) => {
                const id = getUserId(user);
                const active = isUserActive(user);
                const role = getRole(user);
                const createdAt = getCreatedAt(user) ? new Date(getCreatedAt(user)) : null;

                return (
                  <motion.tr
                    key={id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-200 group-hover:bg-white group-hover:text-primary-600 transition-all shrink-0">
                          <User size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{getFullName(user)}</p>
                          <p className="text-xs text-slate-400 truncate">@{getUsername(user)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={15} className="text-slate-400" />
                        {getEmail(user)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          role === 'ADMIN'
                            ? 'bg-violet-50 text-violet-700 border-violet-100'
                            : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}
                      >
                        <Shield size={13} />
                        {role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}
                      >
                        {active ? <CheckCircle2 size={13} /> : <Lock size={13} />}
                        {active ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {createdAt && !Number.isNaN(createdAt.getTime())
                        ? createdAt.toLocaleDateString('vi-VN')
                        : 'Chưa rõ'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-xl transition-all ${
                            active
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {active ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>

                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Sửa người dùng"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit size={18} />
                        </button>

                        <button
                          type="button"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Xóa người dùng"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-24 bg-slate-50/30">
            <Users size={64} className="mx-auto text-slate-100 mb-4" />
            <h3 className="text-slate-900 font-bold">Không tìm thấy người dùng</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
            </p>
          </div>
        )}
      </div>

      <UserModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        submitting={submitting}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSubmitUser}
      />
    </div>
  );
};

export default AdminUsers;
