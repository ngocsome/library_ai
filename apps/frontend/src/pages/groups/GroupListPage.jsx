import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Loader2,
  PlusCircle,
  Search,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createGroup, getGroups, joinGroup } from '../../services/groupService';

const emptyForm = () => ({
  name: '',
  subject: '',
  description: '',
});

const getGroupId = (group) => group.GroupID || group.groupId || group.id;
const getGroupName = (group) => group.Name || group.name || 'Nhóm học tập';
const getGroupSubject = (group) => group.Subject || group.subject || 'Chung';
const getGroupDescription = (group) =>
  group.Description || group.description || 'Chưa có mô tả cho nhóm này.';
const getMemberCount = (group) =>
  group.MemberCount ?? group.memberCount ?? group._count?.GroupMembers ?? 0;
const getIsPrivate = (group) => group.IsPrivate || group.isPrivate || false;

const CreateGroupModal = ({
  open,
  form,
  submitting,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                <Users size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Tạo nhóm học tập mới
                </h2>
                <p className="text-sm text-slate-500">
                  Tạo không gian trao đổi tài liệu và thảo luận với bạn bè.
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
                Tên nhóm <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Ví dụ: Nhóm ôn tập Java Spring Boot"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Chủ đề
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Ví dụ: Lập trình Java, Cơ sở dữ liệu, Ngoại ngữ..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Mô tả nhóm
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows="4"
                placeholder="Mô tả mục đích của nhóm..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-green/20 resize-none"
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
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Tạo nhóm
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

const GroupListPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [joiningId, setJoiningId] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load groups', error);
      toast.error('Không thể tải danh sách nhóm học tập');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setForm(emptyForm());
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên nhóm');
      return;
    }

    try {
      setSubmitting(true);

      const createdGroup = await createGroup({
        name: form.name.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });

      setGroups((prev) => [createdGroup, ...prev]);
      toast.success('Tạo nhóm học tập thành công');
      closeModal();
    } catch (error) {
      console.error('Create group failed', error);
      toast.error(error.response?.data?.message || 'Tạo nhóm thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinGroup = async (event, group) => {
    event.preventDefault();
    event.stopPropagation();

    const groupId = getGroupId(group);
    if (!groupId) {
      toast.error('Không tìm thấy ID nhóm');
      return;
    }

    try {
      setJoiningId(groupId);
      const response = await joinGroup(groupId);
      toast.success(response?.message || 'Tham gia nhóm thành công');
      await fetchGroups();
    } catch (error) {
      console.error('Join group failed', error);
      toast.error(error.response?.data?.message || 'Tham gia nhóm thất bại');
    } finally {
      setJoiningId(null);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const name = getGroupName(group).toLowerCase();
    const description = getGroupDescription(group).toLowerCase();
    const subject = getGroupSubject(group).toLowerCase();
    const keyword = searchTerm.trim().toLowerCase();

    return (
      !keyword ||
      name.includes(keyword) ||
      description.includes(keyword) ||
      subject.includes(keyword)
    );
  });

  return (
    <div className="container mx-auto px-6 pt-24 pb-12 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nhóm học tập</h1>
          <p className="text-gray-500 text-sm">
            Kết nối với những người bạn cùng chí hướng
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-brand-green text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm font-medium"
        >
          <PlusCircle size={20} />
          Tạo nhóm mới
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Tìm kiếm nhóm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-brand-green" />
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, idx) => {
            const groupId = getGroupId(group);
            const name = getGroupName(group);
            const description = getGroupDescription(group);
            const subject = getGroupSubject(group);
            const memberCount = getMemberCount(group);
            const isPrivate = getIsPrivate(group);
            const isJoining = String(joiningId) === String(groupId);

            return (
              <Link
                to={`/groups/${groupId}`}
                key={groupId || idx}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg">
                    <Users size={24} />
                  </div>

                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {isPrivate ? 'Riêng tư' : 'Công khai'}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {name}
                </h3>

                <p className="text-xs text-brand-green font-medium mb-2">
                  {subject}
                </p>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">
                    {memberCount} thành viên
                  </span>

                  <button
                    type="button"
                    onClick={(event) => handleJoinGroup(event, group)}
                    disabled={isJoining}
                    className="text-sm text-brand-green font-medium hover:underline disabled:opacity-60 flex items-center gap-1"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Đang tham gia
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Tham gia
                      </>
                    )}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20 bg-white rounded-xl border border-dashed border-gray-200">
          Chưa có nhóm học tập nào.
        </div>
      )}

      <CreateGroupModal
        open={modalOpen}
        form={form}
        submitting={submitting}
        onClose={closeModal}
        onChange={handleChange}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
};

export default GroupListPage;
