import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from '../../services/groupService';

const emptyForm = {
  name: '',
  subject: '',
  description: '',
  visibility: 'PUBLIC',
};

const getGroupId = (group) =>
  group?.GroupID || group?.groupId || group?.id || group?.GroupId;

const getGroupName = (group) =>
  group?.Name || group?.name || group?.GroupName || group?.groupName || 'Chưa có tên';

const getGroupSubject = (group) =>
  group?.Subject || group?.subject || 'Chưa cập nhật';

const getGroupDescription = (group) =>
  group?.Description || group?.description || '';

const getGroupVisibility = (group) =>
  group?.Visibility || group?.visibility || 'PUBLIC';

const getGroupMemberCount = (group) =>
  Number(group?.MemberCount || group?.memberCount || group?.membersCount || 0);

const getGroupOwnerName = (group) =>
  group?.CreatedByName ||
  group?.createdByName ||
  group?.OwnerName ||
  group?.ownerName ||
  'Không rõ';

const AdminGroups = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách nhóm');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    const handleAdminSearch = (event) => {
      setSearchTerm(event.detail?.value || '');
    };

    window.addEventListener('admin-global-search', handleAdminSearch);
    return () => window.removeEventListener('admin-global-search', handleAdminSearch);
  }, []);

  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return groups.filter((group) => {
      const name = getGroupName(group).toLowerCase();
      const subject = getGroupSubject(group).toLowerCase();
      const description = getGroupDescription(group).toLowerCase();
      const ownerName = getGroupOwnerName(group).toLowerCase();
      const visibility = getGroupVisibility(group).toUpperCase();

      const matchKeyword =
        !keyword ||
        name.includes(keyword) ||
        subject.includes(keyword) ||
        description.includes(keyword) ||
        ownerName.includes(keyword);

      const matchVisibility =
        visibilityFilter === 'ALL' || visibility === visibilityFilter;

      return matchKeyword && matchVisibility;
    });
  }, [groups, searchTerm, visibilityFilter]);

  const stats = useMemo(() => {
    const publicGroups = groups.filter(
      (group) => getGroupVisibility(group).toUpperCase() === 'PUBLIC'
    ).length;

    const privateGroups = groups.filter(
      (group) => getGroupVisibility(group).toUpperCase() === 'PRIVATE'
    ).length;

    const totalMembers = groups.reduce(
      (sum, group) => sum + getGroupMemberCount(group),
      0
    );

    return {
      total: groups.length,
      publicGroups,
      privateGroups,
      totalMembers,
    };
  }, [groups]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingGroup(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setModalMode('edit');
    setFormData({
      name: getGroupName(group),
      subject: getGroupSubject(group) === 'Chưa cập nhật' ? '' : getGroupSubject(group),
      description: getGroupDescription(group),
      visibility: getGroupVisibility(group).toUpperCase(),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    resetForm();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên nhóm');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      visibility: formData.visibility,
    };

    try {
      setSubmitting(true);

      if (modalMode === 'edit') {
        const groupId = getGroupId(editingGroup);

        if (!groupId) {
          toast.error('Không tìm thấy ID nhóm');
          return;
        }

        await updateGroup(groupId, payload);
        toast.success('Cập nhật nhóm thành công');
      } else {
        await createGroup(payload);
        toast.success('Tạo nhóm thành công');
      }

      setModalOpen(false);
      resetForm();
      await fetchGroups();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Lưu nhóm thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    const groupId = getGroupId(group);
    const groupName = getGroupName(group);

    if (!groupId) {
      toast.error('Không tìm thấy ID nhóm');
      return;
    }

    const ok = window.confirm(
      `Bạn có chắc chắn muốn xóa nhóm "${groupName}" không?\n\nToàn bộ thành viên và tin nhắn trong nhóm cũng sẽ bị xóa.`
    );

    if (!ok) return;

    try {
      await deleteGroup(groupId);
      toast.success('Xóa nhóm thành công');
      setGroups((prev) =>
        prev.filter((item) => String(getGroupId(item)) !== String(groupId))
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa nhóm thất bại');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[420px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý nhóm học tập
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Admin có thể tạo, sửa hoặc xóa các nhóm học tập trong hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-900/20"
        >
          <Plus size={16} />
          Tạo nhóm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Tổng nhóm
            </p>
            <p className="text-xl font-bold text-slate-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Công khai
            </p>
            <p className="text-xl font-bold text-slate-900">{stats.publicGroups}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <EyeOff size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Riêng tư
            </p>
            <p className="text-xl font-bold text-slate-900">{stats.privateGroups}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              Thành viên
            </p>
            <p className="text-xl font-bold text-slate-900">{stats.totalMembers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên nhóm, môn học, chủ nhóm..."
            className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-red-500"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={visibilityFilter}
          onChange={(event) => setVisibilityFilter(event.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PUBLIC">Công khai</option>
          <option value="PRIVATE">Riêng tư</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nhóm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chủ nhóm
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thành viên
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredGroups.map((group) => {
                const groupId = getGroupId(group);
                const visibility = getGroupVisibility(group).toUpperCase();
                const isPrivate = visibility === 'PRIVATE';

                return (
                  <tr key={groupId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                          <Users size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {getGroupName(group)}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            ID: {groupId}
                          </p>
                          {getGroupDescription(group) && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {getGroupDescription(group)}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {getGroupSubject(group)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 font-medium">
                        {getGroupOwnerName(group)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isPrivate
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isPrivate ? <EyeOff size={13} /> : <Eye size={13} />}
                        {isPrivate ? 'Riêng tư' : 'Công khai'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {getGroupMemberCount(group)} thành viên
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(group)}
                          className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Sửa nhóm"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa nhóm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredGroups.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            Không tìm thấy nhóm học tập phù hợp.
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 pointer-events-auto"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {modalMode === 'edit' ? 'Sửa nhóm học tập' : 'Tạo nhóm học tập'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhóm sẽ hiển thị ở trang Nhóm học tập.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Tên nhóm <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nhóm học Java Spring Boot"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Môn học / Chủ đề
                  </label>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Java nâng cao, CSDL, ReactJS..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Mô tả ngắn về mục tiêu học tập của nhóm..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Quyền riêng tư
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  >
                    <option value="PUBLIC">Công khai</option>
                    <option value="PRIVATE">Riêng tư</option>
                  </select>
                </div>
              </div>

              <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors disabled:opacity-60"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-60"
                >
                  {submitting
                    ? 'Đang lưu...'
                    : modalMode === 'edit'
                      ? 'Cập nhật'
                      : 'Tạo nhóm'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGroups;