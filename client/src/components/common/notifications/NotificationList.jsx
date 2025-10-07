import React, { useState, useEffect } from "react";
import { notificationService } from "../../../services/common/notification/notificationService.js";
import { useSocket } from "../../../contexts/SocketContext.jsx";
import { useTheme } from "../../../contexts/ThemeContext.jsx";

const NotificationList = () => {
  const { isDarkMode } = useTheme();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(pageNum, 10);

      if (response.success) {
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      setError("Không thể tải thông báo");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      // Update unread count
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Listen for real-time socket events
  useEffect(() => {
    if (socket) {
      // Listen for new notifications (commented out for emitToUser)
      // socket.on('new-notification', (data) => {
      //   console.log('📢 New notification received in list:', data);
      
      //   // Add new notification to the top of the list
      //   setNotifications(prev => [data.notification, ...prev]);
      //   setUnreadCount(data.unreadCount);
      
      //   // Show toast notification
      //   if (window.showToast) {
      //     window.showToast('success', 'Thông báo mới', data.notification.title);
      //   }
      // });
  
      // Listen for organization-wide notifications
      socket.on('organization-notification', (data) => {
        console.log('🏢 Organization notification received in list:', data);
        
        // Show toast notification
        if (window.showToast) {
          window.showToast('info', 'Thông báo tổ chức', data.title);
        }
        
        // Refresh the notification list to get updated data
        fetchNotifications();
        fetchUnreadCount();
      });
  
      // Listen for notification read events
      socket.on('notification-read', (data) => {
        setUnreadCount(data.unreadCount);
      });
  
      // Listen for all notifications read
      socket.on('all-notifications-read', (data) => {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(data.unreadCount);
      });
  
      return () => {
        // socket.off('new-notification');
        socket.off('organization-notification');
        socket.off('notification-read');
        socket.off('all-notifications-read');
      };
    }
  }, [socket]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "EVENT":
        return "🎉";
      case "SYSTEM":
        return "⚙️";
      default:
        return "📢";
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  if (loading && notifications.length === 0) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-6 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`${
              isDarkMode
                ? "bg-red-900/20 border-red-800"
                : "bg-red-50 border-red-200"
            } border rounded-lg p-4`}
          >
            <p className={`${isDarkMode ? "text-red-400" : "text-red-600"}`}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Thông báo
                {socket && (
                  <span
                    className={`ml-2 text-sm ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    🟢 Real-time
                  </span>
                )}
              </h1>
              {unreadCount > 0 && (
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mt-1`}
                >
                  Bạn có {unreadCount} thông báo chưa đọc
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } 
              border rounded-lg p-8 text-center`}
            >
              <div className="text-6xl mb-4">📭</div>
              <h3
                className={`text-lg font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Không có thông báo
              </h3>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } 
                  border rounded-lg p-4 transition-all hover:shadow-md
                  ${
                    !notification.isRead
                      ? isDarkMode
                        ? "bg-blue-900/20 border-blue-800"
                        : "bg-blue-50 border-blue-200"
                      : ""
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                      ${
                        notification.type === "EVENT"
                          ? isDarkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-100 text-green-600"
                          : notification.type === "SYSTEM"
                          ? isDarkMode
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-yellow-100 text-yellow-600"
                          : isDarkMode
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } mb-1`}
                        >
                          {notification.title}
                        </h3>
                        <div
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } whitespace-pre-line`}
                        >
                          {notification.message}
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {formatDate(notification.createdAt)}
                      </span>

                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`text-xs px-2 py-1 rounded transition-colors
                            ${
                              isDarkMode
                                ? "text-blue-400 hover:bg-blue-900/30"
                                : "text-blue-600 hover:bg-blue-50"
                            }`}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => fetchNotifications(page - 1)}
                disabled={page === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    page === 1
                      ? isDarkMode
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
              >
                Trước
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchNotifications(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        pageNum === page
                          ? "bg-blue-600 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => fetchNotifications(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    page === totalPages
                      ? isDarkMode
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
