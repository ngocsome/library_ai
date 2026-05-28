import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  Loader2,
  Lock,
  PlusCircle,
  Search,
  ShieldCheck,
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
  visibility: 'PUBLIC',
});

const getGroupId = (group) => group.GroupID || group.groupId || group.id;
const getGroupName = (group) => group.Name || group.name || 'Nhóm học tập';
const getGroupSubject = (group) => group.Subject || group.subject || 'Chung';
const getGroupDescription = (group) =>
  group.Description || group.description || 'Chưa có mô tả cho nhóm này.';

const getMemberCount = (group) =>
  group.MemberCount ?? group.memberCount ?? group._count?.GroupMembers ?? 0;

const getVisibility = (group) => {
  const visibility =
    group.Visibility ||
    group.visibility ||
    (group.IsPrivate || group.isPrivate ? 'PRIVATE' : 'PUBLIC');

  return String(visibility || 'PUBLIC').toUpperCase();
};

const getIsPrivate = (group) => getVisibility(group) === 'PRIVATE';

const getJoinStatus = (group) => {
  const status = group.JoinStatus || group.joinStatus || null;
  return status ? String(status).toUpperCase() : null;
};

const getJoined = (group) => {
  return Boolean(group.Joined ?? group.joined ?? false);
};

const getOwner = (group) => {
  return Boolean(group.Owner ?? group.owner ?? false);
};

const canOpenGroup = (group) => {
  const visibility = getVisibility(group);
  const joined = getJoined(group);
  const owner = getOwner(group);
  const joinStatus = getJoinStatus(group);

  if (owner) return true;
  if (joined) return true;
  if (joinStatus === 'APPROVED') return true;
  if (visibility === 'PUBLIC') return true;

  return false;
};

const getActionText = (group) => {
  const visibility = getVisibility(group);
  const joined = getJoined(group);
  const owner = getOwner(group);
  const joinStatus = getJoinStatus(group);

  if (owner) return 'Quản lý';
  if (joined || joinStatus === 'APPROVED') return 'Vào nhóm';
  if (joinStatus === 'PENDING') return 'Đang chờ duyệt';
  if (joinStatus === 'REJECTED') return 'Gửi lại yêu cầu';
  if (visibility === 'PRIVATE') return 'Yêu cầu tham gia';

  return 'Tham gia';
};

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
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Tạo nhóm học tập
                </h2>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  Bắt đầu một không gian học tập cộng tác mới
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Tên nhóm <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Ví dụ: Nhóm ôn tập Java Spring Boot"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Chủ đề
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Ví dụ: Lập trình Java, Cơ sở dữ liệu, Ngoại ngữ..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Loại nhóm
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    form.visibility === 'PUBLIC'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="PUBLIC"
                    checked={form.visibility === 'PUBLIC'}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Globe2 size={17} />
                    Công khai
                  </div>
                  <p className="text-xs mt-1 opacity-80">
                    Ai cũng có thể tham gia ngay.
                  </p>
                </label>

                <label
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    form.visibility === 'PRIVATE'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value="PRIVATE"
                    checked={form.visibility === 'PRIVATE'}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Lock size={17} />
                    Riêng tư
                  </div>
                  <p className="text-xs mt-1 opacity-80">
                    Cần chủ nhóm/admin duyệt.
                  </p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Mô tả nhóm
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                placeholder="Mô tả mục đích và nội dung của nhóm..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-lg transition-all disabled:bg-emerald-300 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    <span>Tạo nhóm</span>
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
  const navigate = useNavigate();

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
        visibility: form.visibility || 'PUBLIC',
      });

      setGroups((prev) => [createdGroup, ...prev]);
      toast.success('Tạo nhóm học tập thành công');
      closeModal();
      await fetchGroups();
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

    const joined = getJoined(group);
    const owner = getOwner(group);
    const joinStatus = getJoinStatus(group);

    if (owner || joined || joinStatus === 'APPROVED') {
      navigate(`/groups/${groupId}`);
      return;
    }

    if (joinStatus === 'PENDING') {
      toast('Yêu cầu tham gia của bạn đang chờ duyệt');
      return;
    }

    try {
      setJoiningId(groupId);

      const response = await joinGroup(groupId);
      const status = response?.status || response?.Status;

      toast.success(response?.message || 'Đã gửi yêu cầu tham gia');

      setGroups((prev) =>
        prev.map((item) => {
          const itemId = getGroupId(item);

          if (String(itemId) !== String(groupId)) return item;

          return {
            ...item,
            joinStatus: status || item.joinStatus,
            JoinStatus: status || item.JoinStatus,
            joined: String(status).toUpperCase() === 'APPROVED',
            Joined: String(status).toUpperCase() === 'APPROVED',
          };
        })
      );

      await fetchGroups();
    } catch (error) {
      console.error('Join group failed', error);
      toast.error(error.response?.data?.message || 'Tham gia nhóm thất bại');
    } finally {
      setJoiningId(null);
    }
  };

  const handleOpenGroup = (group) => {
    const groupId = getGroupId(group);

    if (!groupId) {
      toast.error('Không tìm thấy ID nhóm');
      return;
    }

    if (canOpenGroup(group)) {
      navigate(`/groups/${groupId}`);
      return;
    }

    const joinStatus = getJoinStatus(group);

    if (joinStatus === 'PENDING') {
      toast('Nhóm này đang chờ chủ nhóm/admin duyệt bạn tham gia');
      return;
    }

    toast('Bạn cần được duyệt trước khi xem nội dung nhóm');
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-6 pt-[15px] pb-16">
        <div className="mb-12 space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Nhóm học tập
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Tìm kiếm và tham gia nhóm học tập, hoặc tạo không gian riêng cho mình
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm nhóm, chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg transition-all hover:shadow-emerald-200 hover:shadow-lg"
            >
              <PlusCircle size={20} />
              <span>Tạo nhóm mới</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
              <p className="text-slate-600 font-medium">
                Đang tải danh sách nhóm...
              </p>
            </div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredGroups.map((group, idx) => {
              const groupId = getGroupId(group);
              const name = getGroupName(group);
              const description = getGroupDescription(group);
              const subject = getGroupSubject(group);
              const memberCount = getMemberCount(group);
              const isPrivate = getIsPrivate(group);
              const visibility = getVisibility(group);
              const joined = getJoined(group);
              const owner = getOwner(group);
              const joinStatus = getJoinStatus(group);
              const isJoining = String(joiningId) === String(groupId);
              const allowedToOpen = canOpenGroup(group);
              const actionText = getActionText(group);

              const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-emerald-500 to-teal-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-blue-500',
              ];

              const gradientClass = colors[idx % colors.length];

              return (
                <motion.div
                  key={groupId || idx}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  onClick={() => handleOpenGroup(group)}
                  className={`group h-full bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${
                    allowedToOpen
                      ? 'cursor-pointer border-slate-200'
                      : 'cursor-default border-slate-200/80'
                  }`}
                >
                  <div
                    className={`h-32 bg-gradient-to-br ${gradientClass} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                      <div className="absolute top-2 right-2 w-32 h-32 bg-white rounded-full blur-3xl" />
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
                      {isPrivate ? (
                        <Lock size={13} className="text-slate-600" />
                      ) : (
                        <Globe2 size={13} className="text-slate-600" />
                      )}
                      <span className="text-xs font-semibold text-slate-700">
                        {visibility === 'PRIVATE' ? 'Riêng tư' : 'Công khai'}
                      </span>
                    </div>

                    {owner && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">
                          Chủ nhóm
                        </span>
                      </div>
                    )}

                    {!owner && joinStatus === 'PENDING' && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-amber-50/95 backdrop-blur px-3 py-1.5 rounded-full">
                        <Clock3 size={13} className="text-amber-600" />
                        <span className="text-xs font-bold text-amber-700">
                          Chờ duyệt
                        </span>
                      </div>
                    )}

                    {!owner && (joined || joinStatus === 'APPROVED') && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-emerald-50/95 backdrop-blur px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">
                          Đã tham gia
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 flex flex-col">
                    <div className="mb-4">
                      <h3
                        className={`font-bold text-lg text-slate-900 line-clamp-2 transition-colors ${
                          allowedToOpen ? 'group-hover:text-emerald-600' : ''
                        }`}
                      >
                        {name}
                      </h3>
                    </div>

                    <div className="mb-4 flex-1">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                        {subject}
                      </p>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-slate-400" />
                        <span className="text-sm font-semibold text-slate-600">
                          {memberCount}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => handleJoinGroup(event, group)}
                        disabled={isJoining || joinStatus === 'PENDING'}
                        className={`text-sm font-semibold disabled:opacity-70 flex items-center gap-1.5 transition-colors ${
                          joinStatus === 'PENDING'
                            ? 'text-amber-600'
                            : owner || joined || joinStatus === 'APPROVED'
                              ? 'text-emerald-600 hover:text-emerald-700'
                              : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        {isJoining ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Đang xử lý</span>
                          </>
                        ) : joinStatus === 'PENDING' ? (
                          <>
                            <Clock3 size={14} />
                            <span>{actionText}</span>
                          </>
                        ) : owner || joined || joinStatus === 'APPROVED' ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>{actionText}</span>
                          </>
                        ) : isPrivate ? (
                          <>
                            <Lock size={14} />
                            <span>{actionText}</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>{actionText}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Users size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Chưa có nhóm học tập
            </h3>
            <p className="text-slate-600 font-medium mb-6">
              {searchTerm
                ? 'Không tìm thấy nhóm phù hợp với tìm kiếm của bạn'
                : 'Hãy tạo nhóm đầu tiên hoặc đợi nhóm mới được thêm vào'}
            </p>

            {!searchTerm && (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
              >
                <PlusCircle size={18} />
                Tạo nhóm đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

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