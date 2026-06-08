import React from 'react';
import { Sidebar } from '../components/shared/Sidebar';
import { Topbar } from '../components/shared/Topbar';

interface OutletLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const OutletLayout: React.FC<OutletLayoutProps> = ({ children, title = 'Outlet' }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="outlet" />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Topbar title={title} variant="outlet" />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
