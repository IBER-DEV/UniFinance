import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';

interface TopBarProps {
  children?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const unreadAlerts = mockAlerts.filter(alert => !alert.read).length;

  return (
    <header className="z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {children}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
          <div className="relative">
            <button className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700">
              <Bell className="h-6 w-6" />
              {unreadAlerts > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger-500 text-xs font-bold text-white">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;