import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../../services/common/notification/notificationService.js';
import { useSocket } from '../../../contexts/SocketContext.jsx';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const NotificationBadge = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const { socket, isConnected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingIntervalRef = useRef(null);
  const lastSocketEventRef = useRef(Date.now());
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

 
  useEffect(() => {
    const startPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      pollingIntervalRef.current = setInterval(() => {
        const timeSinceLastSocketEvent = Date.now() - lastSocketEventRef.current;
        
        if (timeSinceLastSocketEvent > 30000 || !isConnected) {
          fetchUnreadCount();
        }
      }, 15000);
    };

    startPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isConnected]);


  useEffect(() => {
    fetchUnreadCount();
  }, []);

 
  useEffect(() => {
    if (isConnected && socket) {
      fetchUnreadCount();
    }
  }, [isConnected, socket]);


  useEffect(() => {
    if (socket && isConnected) {
      const handleConnect = () => {
        lastSocketEventRef.current = Date.now();
        fetchUnreadCount();
      };
      
      const handleOrgNotification = (data) => {
        lastSocketEventRef.current = Date.now();
        
        if (Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/vite.svg'
          });
        }
        
        if (window.showToast) {
          window.showToast(data.title, data.message, data.type || 'info');
        }
        
        fetchUnreadCount();
      };

      const handleNotificationRead = (data) => {
        lastSocketEventRef.current = Date.now();
        
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount);
        } else {
          fetchUnreadCount();
        }
      };

      const handleAllNotificationsRead = (data) => {
        lastSocketEventRef.current = Date.now();
        
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount);
        } else {
          fetchUnreadCount();
        }
      };

      const handleAnyEvent = () => {
        lastSocketEventRef.current = Date.now();
      };

      socket.on('connect', handleConnect);
      socket.on('organization-notification', handleOrgNotification);
      socket.on('notification-read', handleNotificationRead);
      socket.on('all-notifications-read', handleAllNotificationsRead);
      socket.onAny(handleAnyEvent);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('organization-notification', handleOrgNotification);
        socket.off('notification-read', handleNotificationRead);
        socket.off('all-notifications-read', handleAllNotificationsRead);
        socket.offAny(handleAnyEvent);
      };
    }
  }, [socket, isConnected]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);


  useEffect(() => {
    window.refreshNotificationBadge = fetchUnreadCount;
    
    return () => {
      delete window.refreshNotificationBadge;
    };
  }, []);

 
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'notification-refresh') {
        fetchUnreadCount();
        localStorage.removeItem('notification-refresh');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
 
    const handleCustomRefresh = () => {
      fetchUnreadCount();
    };
    
    window.addEventListener('refreshNotificationBadge', handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshNotificationBadge', handleCustomRefresh);
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