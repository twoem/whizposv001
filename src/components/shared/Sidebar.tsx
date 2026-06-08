import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BarChart3, Package, Users, Truck, Store, FileText, Zap, DollarSign, Code, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { BUSINESS_NAME } from '../../shared/constants';

interface SidebarProps {
  variant: 'server' | 'outlet';
}

const SERVER_MENU = [
  { label: 'Dashboard', icon: BarChart3, href: '/server/dashboard' },
  { label: 'Inventory', icon: Package, href: '/server/inventory' },
  { label: 'Suppliers', icon: Users, href: '/server/suppliers' },
  { label: 'Stock Transfers', icon: Truck, href: '/server/transfers' },
  { label: 'Outlets', icon: Store, href: '/server/outlets' },
  { label: 'Team', icon: Users, href: '/server/users' },
  { label: 'Reports', icon: FileText, href: '/server/reports' },
  { label: 'Expenses', icon: DollarSign, href: '/server/expenses' },
  { label: 'Settings', icon: Settings, href: '/server/settings' },
];

const OUTLET_MENU = [
  { label: 'POS', icon: Code, href: '/outlet/pos' },
  { label: 'Shift', icon: BarChart3, href: '/outlet/shift' },
  { label: 'History', icon: FileText, href: '/outlet/history' },
  { label: 'Inventory', icon: Package, href: '/outlet/inventory' },
  { label: 'Expenses', icon: DollarSign, href: '/outlet/expenses' },
  { label: 'Sync', icon: Zap, href: '/outlet/sync' },
  { label: 'Settings', icon: Settings, href: '/outlet/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ variant }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const menu = variant === 'server' ? SERVER_MENU : OUTLET_MENU;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 truncate">{BUSINESS_NAME}</h1>
        <p className="text-gray-500 text-xs mt-1">{variant === 'server' ? 'Admin Dashboard' : 'Point of Sale'}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
