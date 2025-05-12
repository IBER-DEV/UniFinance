import React from 'react';
import { 
  Home, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  PiggyBank, 
  BarChart3, 
  BellRing, 
  CalendarClock, 
  Lightbulb,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface SidebarProps {
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const { signOut, user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Ingresos', href: '/income', icon: ArrowDownToLine },
    { name: 'Gastos', href: '/expenses', icon: ArrowUpFromLine },
    { name: 'Ahorro', href: '/savings', icon: PiggyBank },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Alerta', href: '/alerts', icon: BellRing },
    { name: 'Calendario', href: '/calendar', icon: CalendarClock },
    { name: 'Tips', href: '/tips', icon: Lightbulb },
  ];

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-16 flex-shrink-0 items-center px-4">
        <Link to="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
          UniFinance
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="group block">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <span className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300">
                    {user?.email?.[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;