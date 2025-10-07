import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

const ThemeToggle = ({ variant = 'default', size = 'default' }) => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  if (variant === 'simple') {
    return (
      <button
        onClick={toggleTheme}
        className={`${sizeClasses[size]} rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-200 flex items-center justify-center group`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <FiSun className={`${iconSizes[size]} text-warning-500 group-hover:text-warning-600 transition-colors`} />
        ) : (
          <FiMoon className={`${iconSizes[size]} text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-700 dark:group-hover:text-secondary-300 transition-colors`} />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button
          className={`${sizeClasses[size]} rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all duration-200 flex items-center justify-center`}
          title="Theme options"
        >
          {isDark ? (
            <FiMoon className={`${iconSizes[size]} text-secondary-600 dark:text-secondary-400`} />
          ) : (
            <FiSun className={`${iconSizes[size]} text-warning-500`} />
          )}
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-large border border-secondary-200 dark:border-secondary-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                theme === 'light' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
              }`}
            >
              <FiSun className="w-4 h-4" />
              Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                theme === 'dark' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
              }`}
            >
              <FiMoon className="w-4 h-4" />
              Dark Mode
            </button>
            <button
              onClick={() => {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                setTheme(systemTheme);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            >
              <FiMonitor className="w-4 h-4" />
              System
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${sizeClasses[size]} relative rounded-full bg-secondary-200 dark:bg-secondary-700 transition-all duration-300 flex items-center justify-center group overflow-hidden`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-secondary-600 to-secondary-800' 
          : 'bg-gradient-to-r from-warning-200 to-warning-300'
      }`} />
      
      <div className={`relative z-10 transition-all duration-300`}>
        {isDark ? (
          <FiMoon className={`${iconSizes[size]} text-white transition-all duration-300`} />
        ) : (
          <FiSun className={`${iconSizes[size]} text-warning-600 transition-all duration-300`} />
        )}
      </div>
      
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150" />
    </button>
  );
};

export default ThemeToggle;
