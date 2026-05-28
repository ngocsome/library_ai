import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Mic,
  Video,
  Loader2,
  Hash,
  Send,
  FileText,
  HelpCircle,
  Lock,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import {
  getGroupById,
  getGroupChats,
  sendMessage,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  leaveGroup,
} from '../../services/groupService';
import { useAuth } from '../../context/AuthContext';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [groupLoading, setGroupLoading] = useState(true);
  const [lockedMessage, setLockedMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');

  const [requestsOpen, setRequestsOpen] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [processingMemberId, setProcessingMemberId] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const channels = [
    {
      id: 'general',
      name: 'Chung',
      icon: Hash,
      description: 'Kênh chính',
    },
    {
      id: 'qa',
      name: 'Hỏi-đáp',
      icon: HelpCircle,
      description: 'Đặt câu hỏi',
    },
    {
      id: 'docs',
      name: 'Tài-liệu',
      icon: FileText,
      description: 'Chia sẻ tài liệu',
    },
  ];

  const voiceRooms = [
    { id: '1', name: 'Phòng học 1', members: 3 },
    { id: '2', name: 'Phòng học 2', members: 0 },
  ];

  const getGroupName = () => {
    return group?.Name || group?.name || 'Nhóm học tập';
  };

  const getCurrentUserName = () => {
    return (
      user?.FullName ||
      user?.fullName ||
      user?.Username ||
      user?.username ||
      'Bạn'
    );
  };

  const getCurrentUserId = () => {
    return (
      user?.UserID ||
      user?.userId ||
      user?.Id ||
      user?.id ||
      user?.idUser
    );
  };

  const getUserRole = () => {
    return String(user?.Role || user?.role || '').toUpperCase();
  };

  const isAdmin = () => {
    return getUserRole() === 'ADMIN';
  };

  const isOwner = () => {
    const ownerFromBackend = Boolean(group?.Owner ?? group?.owner ?? false);

    const createdById =
      group?.CreatedBy ||
      group?.createdBy ||
      group?.CreatedById ||
      group?.createdById ||
      group?.createdByID ||
      group?.CreatedByID;

    const currentUserId = getCurrentUserId();

    const ownerById =
      createdById &&
      currentUserId &&
      String(createdById) === String(currentUserId);

    return ownerFromBackend || ownerById;
  };

  const canManageRequests = () => {
    return isOwner() || isAdmin();
  };

  const getJoinStatus = () => {
    const status = group?.JoinStatus || group?.joinStatus || null;
    return status ? String(status).toUpperCase() : null;
  };

  const isApprovedMember = () => {
    const joined = Boolean(group?.Joined ?? group?.joined ?? false);
    const status = getJoinStatus();

    return joined || status === 'APPROVED' || isOwner() || isAdmin();
  };

  const canLeaveGroup = () => {
    const joined = Boolean(group?.Joined ?? group?.joined ?? false);
    const status = getJoinStatus();

    return !isOwner() && !isAdmin() && (joined || status === 'APPROVED');
  };

  const getChannelLabel = (channelId) => {
    return channels.find((channel) => channel.id === channelId)?.name || 'Chung';
  };

  const getChannelDescription = (channelId) => {
    return channels.find((channel) => channel.id === channelId)?.description || '';
  };

  const getChannelIcon = (channelId) => {
    return channels.find((channel) => channel.id === channelId)?.icon || Hash;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGroup = async () => {
    try {
      setGroupLoading(true);
      const data = await getGroupById(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Failed to load group', error);
      setGroup(null);
    } finally {
      setGroupLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      setLockedMessage('');
      const data = await getGroupChats(groupId, activeChannel);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load chats', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Không thể tải tin nhắn nhóm';

      setMessages([]);
      setLockedMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = async (showAlert = true) => {
    try {
      setRequestsLoading(true);

      const data = await getJoinRequests(groupId);
      const requests = Array.isArray(data) ? data : [];

      setJoinRequests(requests);
      setRequestCount(requests.length);
    } catch (error) {
      console.error('Failed to load join requests', error);

      if (showAlert) {
        alert(error.response?.data?.message || 'Không thể tải yêu cầu tham gia');
      }

      setJoinRequests([]);
      setRequestCount(0);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    if (group && canManageRequests()) {
      fetchJoinRequests(false);
    }
  }, [group]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchChats();

    const interval = setInterval(fetchChats, 5000);

    return () => clearInterval(interval);
  }, [groupId, activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e?.key && (e.key !== 'Enter' || e.shiftKey)) return;

    const content = newMessage.trim();

    if (!content) return;

    if (lockedMessage || !isApprovedMember()) {
      alert('Bạn cần được duyệt để gửi tin nhắn trong nhóm');
      return;
    }

    try {
      const msg = await sendMessage(groupId, content, activeChannel);

      const currentUserName = getCurrentUserName();
      const currentUserId = getCurrentUserId();

      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          AuthorName: msg.AuthorName || msg.authorName || currentUserName,
          authorName: msg.authorName || msg.AuthorName || currentUserName,
          UserID: msg.UserID || msg.userId || currentUserId,
          userId: msg.userId || msg.UserID || currentUserId,
          Content: msg.Content || msg.content || content,
          content: msg.content || msg.Content || content,
          CreatedAt: msg.CreatedAt || msg.createdAt || new Date().toISOString(),
          createdAt: msg.createdAt || msg.CreatedAt || new Date().toISOString(),
          Channel: msg.Channel || msg.channel || activeChannel,
          channel: msg.channel || msg.Channel || activeChannel,
        },
      ]);

      setNewMessage('');

      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message', error);
      alert(error.response?.data?.message || 'Gửi tin nhắn thất bại');
    }
  };

  const handleChangeChannel = (channelId) => {
    if (channelId === activeChannel) return;

    setActiveChannel(channelId);
    setNewMessage('');

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleLeaveGroup = async () => {
    if (isOwner()) {
      alert('Chủ nhóm không thể rời nhóm. Hãy chuyển quyền hoặc xóa nhóm.');
      return;
    }

    const confirmed = window.confirm('Bạn có chắc muốn rời nhóm này không?');

    if (!confirmed) return;

    try {
      setLeaving(true);

      const result = await leaveGroup(groupId);

      alert(result?.message || 'Bạn đã rời nhóm thành công');

      navigate('/groups');
    } catch (error) {
      console.error('Leave group failed', error);
      alert(error.response?.data?.message || 'Rời nhóm thất bại');
    } finally {
      setLeaving(false);
    }
  };

  const openRequestsModal = async () => {
    setRequestsOpen(true);
    await fetchJoinRequests(true);
  };

  const closeRequestsModal = () => {
    if (processingMemberId) return;
    setRequestsOpen(false);
  };

  const handleApproveRequest = async (memberId) => {
    try {
      setProcessingMemberId(memberId);
      const result = await approveJoinRequest(groupId, memberId);

      alert(result?.message || 'Đã duyệt yêu cầu tham gia');

      setJoinRequests((prev) =>
        prev.filter((item) => {
          const id = item.MemberID || item.memberId || item.id;
          return String(id) !== String(memberId);
        })
      );

      setRequestCount((prev) => Math.max(0, prev - 1));

      await fetchGroup();
    } catch (error) {
      console.error('Approve request failed', error);
      alert(error.response?.data?.message || 'Duyệt yêu cầu thất bại');
    } finally {
      setProcessingMemberId(null);
    }
  };

  const handleRejectRequest = async (memberId) => {
    const confirmed = window.confirm('Bạn có chắc muốn từ chối yêu cầu này?');

    if (!confirmed) return;

    try {
      setProcessingMemberId(memberId);
      const result = await rejectJoinRequest(groupId, memberId);

      alert(result?.message || 'Đã từ chối yêu cầu tham gia');

      setJoinRequests((prev) =>
        prev.filter((item) => {
          const id = item.MemberID || item.memberId || item.id;
          return String(id) !== String(memberId);
        })
      );

      setRequestCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Reject request failed', error);
      alert(error.response?.data?.message || 'Từ chối yêu cầu thất bại');
    } finally {
      setProcessingMemberId(null);
    }
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ActiveChannelIcon = getChannelIcon(activeChannel);

  if (groupLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={36} />
          <p className="text-sm font-semibold text-slate-500">
            Đang tải thông tin nhóm...
          </p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm max-w-md">
          <Lock className="mx-auto text-slate-400 mb-3" size={36} />
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Không tìm thấy nhóm
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Nhóm học tập này không tồn tại hoặc đã bị gỡ bỏ.
          </p>
          <Link
            to="/groups"
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700"
          >
            <ArrowLeft size={16} />
            Quay lại danh sách nhóm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
        <Link
          to="/groups"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-emerald-600" />
          </div>

          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              {getGroupName()}
            </h1>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              ● Nhóm học tập
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {canLeaveGroup() && (
            <button
              type="button"
              onClick={handleLeaveGroup}
              disabled={leaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-60"
            >
              {leaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              <span>Rời nhóm</span>
            </button>
          )}

          {canManageRequests() && (
            <button
              type="button"
              onClick={openRequestsModal}
              className="relative inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors"
            >
              <ShieldCheck size={16} />
              <span>Yêu cầu tham gia</span>

              {requestCount > 0 && (
                <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {requestCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white/60 backdrop-blur border-r border-slate-200 flex-col hidden md:flex shadow-sm">
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Kênh thảo luận
              </div>

              <div className="space-y-1">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  const isActive = activeChannel === channel.id;

                  return (
                    <button
                      key={channel.id}
                      onClick={() => handleChangeChannel(channel.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 group ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-medium text-sm">
                        {channel.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-4 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Phòng học (Voice)
              </div>

              <div className="space-y-1">
                {voiceRooms.map((room) => (
                  <button
                    key={room.id}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Mic
                      size={16}
                      className="text-slate-400 group-hover:text-emerald-600"
                    />

                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-medium text-sm truncate">
                        {room.name}
                      </span>

                      {room.members > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded ml-2 shrink-0">
                          {room.members}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-100/60 hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                {getCurrentUserName()?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {getCurrentUserName()}
                </p>
                <p className="text-xs text-slate-500 truncate">Online</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white/60 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ActiveChannelIcon size={18} className="text-emerald-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {getChannelLabel(activeChannel)}
                </h2>
                <p className="text-xs text-slate-500">
                  {getChannelDescription(activeChannel)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {canLeaveGroup() && (
                <button
                  type="button"
                  onClick={handleLeaveGroup}
                  disabled={leaving}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-60"
                  title="Rời nhóm"
                >
                  {leaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  <span>Rời nhóm</span>
                </button>
              )}

              {canManageRequests() && (
                <button
                  type="button"
                  onClick={openRequestsModal}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                  title="Yêu cầu tham gia"
                >
                  <ShieldCheck size={16} />
                  <span>Yêu cầu tham gia</span>

                  {requestCount > 0 && (
                    <span className="min-w-[19px] h-[19px] px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                      {requestCount}
                    </span>
                  )}
                </button>
              )}

              <button className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors">
                <Video size={18} />
              </button>

              <button className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors">
                <Users size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {lockedMessage ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm max-w-md">
                  <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-amber-600" size={30} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Chưa thể xem nội dung nhóm
                  </h3>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {lockedMessage}
                  </p>

                  <div className="flex justify-center gap-3">
                    <Link
                      to="/groups"
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                    >
                      Quay lại
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setLoading(true);
                        fetchGroup();
                        fetchChats();
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <RefreshCw size={14} />
                      Tải lại
                    </button>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                  <p className="text-slate-500 text-sm">
                    Đang tải tin nhắn...
                  </p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3">
                    <ActiveChannelIcon className="text-slate-400" size={28} />
                  </div>

                  <p className="text-slate-700 font-semibold mb-1">
                    Chào mừng đến #{getChannelLabel(activeChannel)}
                  </p>

                  <p className="text-slate-500 text-sm">
                    Hãy bắt đầu cuộc trò chuyện của bạn!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const messageId = msg.ChatID || msg.chatId || msg.id || idx;
                const content = msg.Content || msg.content || '';
                const authorName =
                  msg.Users?.FullName ||
                  msg.AuthorName ||
                  msg.authorName ||
                  'Người dùng';
                const userId = msg.UserID || msg.userId;
                const currentUserId = getCurrentUserId();
                const createdAt =
                  msg.SentAt ||
                  msg.sentAt ||
                  msg.CreatedAt ||
                  msg.createdAt ||
                  msg.created_at;

                const isMine =
                  userId &&
                  currentUserId &&
                  String(userId) === String(currentUserId);

                return (
                  <div
                    key={`${messageId}-${idx}`}
                    className="flex gap-4 group hover:bg-slate-100/40 px-4 py-2 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        isMine
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                          : 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white'
                      }`}
                    >
                      {authorName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className={`font-semibold text-sm ${
                            isMine ? 'text-emerald-700' : 'text-slate-900'
                          }`}
                        >
                          {isMine ? 'Bạn' : authorName}
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatTime(createdAt)}
                        </span>
                      </div>

                      <p className="text-slate-700 text-sm break-words whitespace-pre-line">
                        {content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {!lockedMessage && (
            <div className="border-t border-slate-200 bg-white/60 backdrop-blur p-6 shrink-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(
                        e.target.scrollHeight,
                        120
                      )}px`;
                    }}
                    onKeyDown={handleSendMessage}
                    placeholder={`Viết tin nhắn đến #${getChannelLabel(
                      activeChannel
                    ).toLowerCase()}...`}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-slate-900 placeholder-slate-400 resize-none max-h-24 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSendMessage({})}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Nhấn{' '}
                <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 ml-1">
                  Enter
                </kbd>{' '}
                để gửi •{' '}
                <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 ml-1">
                  Shift + Enter
                </kbd>{' '}
                để xuống dòng
              </p>
            </div>
          )}
        </div>
      </div>

      {requestsOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Yêu cầu tham gia nhóm
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Duyệt hoặc từ chối người dùng đang chờ vào nhóm.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeRequestsModal}
                disabled={Boolean(processingMemberId)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {requestsLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-emerald-600" size={30} />
                  <p className="text-sm font-semibold text-slate-500">
                    Đang tải yêu cầu...
                  </p>
                </div>
              ) : joinRequests.length === 0 ? (
                <div className="py-16 text-center">
                  <UserCheck className="mx-auto text-slate-300 mb-3" size={36} />
                  <h3 className="font-bold text-slate-800">
                    Không có yêu cầu nào
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Hiện chưa có người dùng nào đang chờ duyệt.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map((request) => {
                    const memberId =
                      request.MemberID || request.memberId || request.id;
                    const fullName =
                      request.FullName ||
                      request.fullName ||
                      request.Username ||
                      request.username ||
                      'Người dùng';
                    const username = request.Username || request.username || '';
                    const email = request.Email || request.email || '';
                    const joinedAt = request.JoinedAt || request.joinedAt;
                    const processing =
                      String(processingMemberId) === String(memberId);

                    return (
                      <div
                        key={memberId}
                        className="rounded-2xl border border-slate-200 p-4 flex items-center gap-4"
                      >
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-black">
                          {fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 truncate">
                            {fullName}
                          </h3>

                          <p className="text-xs text-slate-500 truncate">
                            {username}
                            {email ? ` • ${email}` : ''}
                          </p>

                          <p className="text-[11px] text-slate-400 mt-1">
                            Gửi yêu cầu lúc {formatTime(joinedAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRejectRequest(memberId)}
                            disabled={processing}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <UserX size={14} />
                            Từ chối
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApproveRequest(memberId)}
                            disabled={processing}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <UserCheck size={14} />
                            )}
                            Duyệt
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => fetchJoinRequests(true)}
                disabled={requestsLoading || Boolean(processingMemberId)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Tải lại danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailPage;