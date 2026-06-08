import React, { useEffect, useState } from 'react';
import { Zap, Bell, Calendar, Clock, Wifi, WifiOff } from 'lucide-react';
import { useSyncStore } from '../../store/syncStore';
import { useAuthStore } from '../../store/authStore';

interface TopbarProps {
  title: string;
  variant?: 'server' | 'outlet';
}

export const Topbar: React.FC<TopbarProps> = ({ title, variant = 'outlet' }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const { queue } = useSyncStore();
  const { role } = useAuthStore();
  const pendingCount = queue.filter(item => item.status === 'pending').length;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20" style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)' }}>
      {/* Left: Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 leading-tight truncate">{title}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar size={11} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-medium">{date}</span>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Connection status — outlet only */}
        {variant === 'outlet' && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
            isOnline
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
              : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            {isOnline
              ? <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><Wifi size={12} />Online</>
              : <><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /><WifiOff size={12} />Offline</>
            }
          </div>
        )}

        {/* Pending sync badge */}
        {variant === 'outlet' && pendingCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
            <Zap size={11} />
            {pendingCount}
          </div>
        )}

        {/* Role chip */}
        {role && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700 capitalize">
            {role}
          </div>
        )}

        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs font-mono font-semibold text-gray-700 tabular-nums">{time}</span>
        </div>
      </div>
    </div>
  );
};
