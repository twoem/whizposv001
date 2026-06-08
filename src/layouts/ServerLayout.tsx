import React from 'react';
import { Sidebar } from '../components/shared/Sidebar';
import { Topbar } from '../components/shared/Topbar';

interface ServerLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const ServerLayout: React.FC<ServerLayoutProps> = ({ children, title = 'Dashboard' }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar variant="server" />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Topbar title={title} variant="server" />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
