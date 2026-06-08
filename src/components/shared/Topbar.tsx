import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useSyncStore } from '../../store/syncStore';

interface TopbarProps {
  title: string;
  variant?: 'server' | 'outlet';
}

export const Topbar: React.FC<TopbarProps> = ({ title, variant = 'outlet' }) => {
  const [time, setTime] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const { queue } = useSyncStore();
  const pendingCount = queue.filter(item => item.status === 'pending').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="h-20 bg-white border-b border-gray-200 ml-64 flex items-center justify-between px-8 shadow-sm transition-all duration-300">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-600 mt-0.5 font-medium">Welcome to Whizpoint Solutions</p>
      </div>

      <div className="flex items-center gap-6">
        {variant === 'outlet' && (
          <>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold transition-all duration-300 ${
              isOnline
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              {isOnline ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                  <span className="text-sm">Online</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-sm">Offline</span>
                </>
              )}
            </div>

            {pendingCount > 0 && (
              <Badge variant="warning">
                <Zap size={14} className="mr-1" />
                {pendingCount} pending
              </Badge>
            )}
          </>
        )}

        <div className="text-sm text-gray-700 font-mono bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 font-semibold">{time}</div>
      </div>
    </div>
  );
};
