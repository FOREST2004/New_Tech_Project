import React, { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../../../services/common/notification/notificationService.js';
import { useSocket } from '../../../contexts/SocketContext.jsx';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const NotificationBadge = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const { unreadCount, notificationTrigger } = useSocket();

 
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