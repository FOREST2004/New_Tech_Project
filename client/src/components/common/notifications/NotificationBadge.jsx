import React, { useState, useEffect } from 'react';
import { notificationService } from '../../../services/common/notification/notificationService.js';
import { useSocket } from '../../../contexts/SocketContext.jsx';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const NotificationBadge = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Listen for real-time socket events
  useEffect(() => {
    if (socket) {
      // Listen for new notifications
    //   socket.on('new-notification', (data) => {
    //     console.log('📢 New notification received:', data);
    //     setUnreadCount(data.unreadCount);
        
    //     // Show browser notification if permission granted
    //     if (Notification.permission === 'granted') {
    //       new Notification(data.notification.title, {
    //         body: data.notification.message.split('\n')[0], // First line only
    //         icon: '/vite.svg'
    //       });
    //     }
    //   });

      // Listen for organization-wide notifications
      socket.on('organization-notification', (data) => {
        console.log('🏢 Organization notification received:', data);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/vite.svg'
          });
        }
        
        // Show toast notification if available
        if (window.showToast) {
          window.showToast(data.title, data.message, data.type || 'info');
        }
        
        // Refresh unread count
        fetchUnreadCount();
      });

      // Listen for notification read events
      socket.on('notification-read', (data) => {
        console.log('✅ Notification marked as read:', data);
        setUnreadCount(data.unreadCount);
      });

      // Listen for all notifications read
      socket.on('all-notifications-read', (data) => {
        console.log('✅ All notifications marked as read');
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

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Expose refresh function globally for other components to use
  useEffect(() => {
    window.refreshNotificationBadge = fetchUnreadCount;
    
    return () => {
      delete window.refreshNotificationBadge;
    };
  }, []);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default NotificationBadge;