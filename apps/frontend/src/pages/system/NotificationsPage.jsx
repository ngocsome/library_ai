import React, { useState, useEffect } from 'react';
import {
  Bell,
  Loader2,
  CheckCheck,
  Trash2,
  MessageSquare,
  BookOpen,
  Info,
} from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../services/notificationService';

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);

    try {
      const data = await getNotifications();
      setNotifs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load notifications', error);
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleRead = async (id) => {
    if (!id) return;

    try {
      await markAsRead(id);

      setNotifs((prev) =>
        prev.map((notif) => {
          const notifId = notif.NotifID || notif.id;

          if (notifId === id) {
            return {
              ...notif,
              IsRead: true,
              isRead: true,
            };
          }

          return notif;
        })
      );
    } catch (error) {
      console.error('Failed to mark read', error);
      alert(error.response?.data?.message || 'Không thể đánh dấu đã đọc');
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllAsRead();

      setNotifs((prev) =>
        prev.map((notif) => ({
          ...notif,
          IsRead: true,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error('Failed to mark all read', error);
      alert(error.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    if (!id) return;

    try {
      await deleteNotification(id);

      setNotifs((prev) =>
        prev.filter((notif) => {
          const notifId = notif.NotifID || notif.id;
          return notifId !== id;
        })
      );
    } catch (error) {
      console.error('Failed to delete notification', error);
      alert(error.response?.data?.message || 'Không thể xóa thông báo');
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'Không rõ thời gian';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Không rõ thời gian';
    }

    return date.toLocaleString('vi-VN');
  };

  const getIconByType = (type, isRead) => {
    const iconClass = 'w-5 h-5';

    switch (type) {
      case 'DOCUMENT':
        return <BookOpen className={iconClass} />;
      case 'FORUM':
        return <MessageSquare className={iconClass} />;
      case 'SYSTEM':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const unreadCount = notifs.filter((notif) => {
    const isRead = notif.IsRead ?? notif.isRead ?? false;
    return !isRead;
  }).length;

  return (
    <div className="container mx-auto px-6 pt-36 pb-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg relative">
              <Bell size={24} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>

              <p className="text-gray-500 text-sm">
                Theo dõi các cập nhật mới nhất trong hệ thống
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReadAll}
            disabled={unreadCount === 0}
            className="text-sm text-brand-green font-medium hover:underline disabled:text-gray-400 disabled:hover:no-underline flex items-center gap-1"
          >
            <CheckCheck size={16} />
            Đánh dấu tất cả là đã đọc
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-green" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {notifs.length > 0 ? (
              notifs.map((notif) => {
                const notifId = notif.NotifID || notif.id;
                const title = notif.Title || notif.title || 'Thông báo';
                const message =
                  notif.Message || notif.message || 'Không có nội dung';
                const type = notif.Type || notif.type || 'SYSTEM';
                const isRead = notif.IsRead ?? notif.isRead ?? false;
                const createdAt =
                  notif.CreatedAt || notif.createdAt || notif.created_at;

                return (
                  <div
                    key={notifId}
                    onClick={() => handleRead(notifId)}
                    className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !isRead ? 'bg-green-50/50' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        !isRead
                          ? 'bg-brand-green text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {getIconByType(type, isRead)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h4
                          className={`text-sm mb-1 ${
                            !isRead
                              ? 'font-bold text-gray-800'
                              : 'font-medium text-gray-600'
                          }`}
                        >
                          {title}
                        </h4>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, notifId)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Xóa thông báo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">
                        {message}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(createdAt)}
                      </p>
                    </div>

                    {!isRead && (
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 shrink-0"></div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-gray-500">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />

                <h3 className="text-lg font-medium text-gray-600">
                  Không có thông báo mới
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Khi có cập nhật mới, thông báo sẽ hiển thị tại đây.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;