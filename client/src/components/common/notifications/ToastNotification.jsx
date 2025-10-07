import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const ToastNotification = () => {
  const { isDarkMode } = useTheme();
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, message, duration = 5000) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    window.showToast = showToast;
    
    return () => {
      delete window.showToast;
    };
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return isDarkMode ? 'bg-green-800 border-green-600' : 'bg-green-100 border-green-400';
      case 'error':
        return isDarkMode ? 'bg-red-800 border-red-600' : 'bg-red-100 border-red-400';
      case 'warning':
        return isDarkMode ? 'bg-yellow-800 border-yellow-600' : 'bg-yellow-100 border-yellow-400';
      case 'info':
        return isDarkMode ? 'bg-blue-800 border-blue-600' : 'bg-blue-100 border-blue-400';
      default:
        return isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full ${getToastColor(toast.type)} border rounded-lg shadow-lg p-4 animate-slide-in-right`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 text-lg mr-3">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {toast.title}
              </h4>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;