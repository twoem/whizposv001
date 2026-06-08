import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, Zap } from 'lucide-react';
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
    <div className="h-20 bg-slate-800 border-b border-slate-700 ml-64 flex items-center justify-between px-8">
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <div className="flex items-center gap-6">
        {variant === 'outlet' && (
          <>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Cloud size={20} className="text-green-400" />
                  <span className="text-sm text-slate-300">Online</span>
                </>
              ) : (
                <>
                  <CloudOff size={20} className="text-red-400" />
                  <span className="text-sm text-slate-300">Offline</span>
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

        <div className="text-sm text-slate-400 font-mono">{time}</div>
      </div>
    </div>
  );
};
