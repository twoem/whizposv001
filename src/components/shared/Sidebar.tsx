import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BarChart3, Package, Users, Truck, Store, FileText, Zap, DollarSign, Code } from 'lucide-react';
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
];

const OUTLET_MENU = [
  { label: 'POS', icon: Code, href: '/outlet/pos' },
  { label: 'Shift', icon: BarChart3, href: '/outlet/shift' },
  { label: 'History', icon: FileText, href: '/outlet/history' },
  { label: 'Inventory', icon: Package, href: '/outlet/inventory' },
  { label: 'Expenses', icon: DollarSign, href: '/outlet/expenses' },
  { label: 'Sync', icon: Zap, href: '/outlet/sync' },
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
    <div className="w-64 bg-slate-800 border-r border-slate-700 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white truncate">{BUSINESS_NAME}</h1>
        <p className="text-slate-400 text-xs mt-1">{variant === 'server' ? 'Admin Dashboard' : 'Point of Sale'}</p>
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
                  ? 'bg-teal-600/30 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
