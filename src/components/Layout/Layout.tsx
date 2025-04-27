import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Menu, X } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-20 bg-gray-900/50 transition-opacity duration-200 ease-in-out lg:hidden ${
        sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`} onClick={toggleSidebar} />
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white transition duration-200 ease-in-out dark:bg-gray-800 lg:static lg:inset-auto lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="lg:hidden absolute right-0 top-0 mr-2 mt-2 p-1">
          <button
            onClick={toggleSidebar}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar currentPath={location.pathname} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-600 focus:bg-gray-100 focus:outline-none lg:hidden dark:text-gray-300 dark:focus:bg-gray-700"
          >
            <Menu size={24} />
          </button>
        </TopBar>

        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 dark:bg-gray-900 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;