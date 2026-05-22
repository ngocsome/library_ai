import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Mic,
  Video,
  Loader2,
} from 'lucide-react';
import { getGroupChats, sendMessage } from '../../services/groupService';
import { useAuth } from '../../context/AuthContext';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const data = await getGroupChats(groupId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load chats', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e.key !== 'Enter') return;

    const content = newMessage.trim();

    if (!content) return;

    try {
      const msg = await sendMessage(groupId, content);

      const currentUserName =
        user?.FullName ||
        user?.fullName ||
        user?.Username ||
        user?.username ||
        'Bạn';

      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          AuthorName: msg.AuthorName || msg.authorName || currentUserName,
          UserID: msg.UserID || msg.userId || user?.UserID || user?.id,
          Content: msg.Content || msg.content || content,
          CreatedAt: msg.CreatedAt || msg.createdAt || new Date().toISOString(),
        },
      ]);

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Gửi tin nhắn thất bại');
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

  return (
    <div className="container mx-auto px-6 pt-24 pb-6 h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link to="/groups" className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Nhóm học tập
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-normal">
              Công khai
            </span>
          </h1>

          <p className="text-gray-500 text-xs text-brand-green">
            ● Trực tuyến
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex">
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex-col hidden md:flex">
          <div className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider">
            Kênh thảo luận
          </div>

          <div className="space-y-1 px-2">
            <button className="w-full text-left px-3 py-2 rounded bg-white shadow-sm text-gray-800 font-medium text-sm flex items-center gap-2">
              <span className="text-gray-400">#</span> Chung
            </button>

            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-600 font-medium text-sm flex items-center gap-2">
              <span className="text-gray-400">#</span> Hỏi-đáp
            </button>

            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-600 font-medium text-sm flex items-center gap-2">
              <span className="text-gray-400">#</span> Tài-liệu
            </button>
          </div>

          <div className="p-4 font-bold text-gray-600 text-xs uppercase tracking-wider mt-4">
            Phòng học (Voice)
          </div>

          <div className="space-y-1 px-2">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-600 font-medium text-sm flex items-center gap-2">
              <Mic size={16} /> Phòng học 1
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
            <span className="font-bold text-gray-700"># Chung</span>

            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                <Video size={20} />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                <Users size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-10">
                <Loader2 className="animate-spin inline text-brand-green" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </div>
            ) : (
              messages.map((msg, idx) => {
                const messageId = msg.ChatID || msg.id || idx;
                const content = msg.Content || msg.content || '';
                const authorName =
                  msg.Users?.FullName ||
                  msg.AuthorName ||
                  msg.authorName ||
                  'Người dùng';
                const userId = msg.UserID || msg.userId;
                const currentUserId = user?.UserID || user?.id;
                const createdAt =
                  msg.SentAt ||
                  msg.CreatedAt ||
                  msg.createdAt ||
                  msg.created_at;

                const isMine =
                  userId &&
                  currentUserId &&
                  String(userId) === String(currentUserId);

                return (
                  <div key={messageId} className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mt-1 ${
                        isMine
                          ? 'bg-brand-green/10 text-brand-green'
                          : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {authorName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-gray-800">
                          {isMine ? 'Bạn' : authorName}
                        </span>

                        <span className="text-xs text-gray-400">
                          {formatTime(createdAt)}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm">{content}</p>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleSendMessage}
              placeholder="Nhập tin nhắn đến #chung... (Enter để gửi)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;