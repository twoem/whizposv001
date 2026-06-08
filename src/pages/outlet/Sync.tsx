import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { OutletLayout } from '../../layouts/OutletLayout';
import { useSyncStore } from '../../store/syncStore';
import { OUTLETS } from '../../shared/mockData';
import { Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const Sync: React.FC = () => {
  const [outletName] = useState(OUTLETS[0].name);
  const { queue, isSyncing, lastSyncTime, setIsSyncing, addToQueue, setLastSyncTime } = useSyncStore();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'syncing' | 'pending'>('connected');

  useEffect(() => {
    const handleOnline = () => setConnectionStatus('connected');
    const handleOffline = () => setConnectionStatus('pending');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleForceSync = () => {
    setIsSyncing(true);
    setConnectionStatus('syncing');

    setTimeout(() => {
      setIsSyncing(false);
      setConnectionStatus('connected');
      setLastSyncTime(new Date().toISOString());
    }, 2000);
  };

  const handleAddToQueue = () => {
    addToQueue({
      id: `sync-${Date.now()}`,
      type: 'transaction',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  };

  const pendingCount = queue.filter(item => item.status === 'pending').length;
  const completedCount = queue.filter(item => item.status === 'completed').length;

  return (
    <OutletLayout title={`Sync & Connection - ${outletName}`}>
      <div className="grid grid-cols-2 gap-8">
        {/* Connection Status */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Connection Status</h3>

          <div className="space-y-6">
            {/* Status Indicator */}
            <div className={`p-6 rounded-lg border-2 ${
              connectionStatus === 'connected'
                ? 'bg-green-500/10 border-green-500/30'
                : connectionStatus === 'syncing'
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {connectionStatus === 'connected' && (
                  <>
                    <CheckCircle size={24} className="text-green-400" />
                    <span className="text-green-400 font-bold">Connected</span>
                  </>
                )}
                {connectionStatus === 'syncing' && (
                  <>
                    <Zap size={24} className="text-blue-400 animate-pulse" />
                    <span className="text-blue-400 font-bold">Syncing...</span>
                  </>
                )}
                {connectionStatus === 'pending' && (
                  <>
                    <AlertCircle size={24} className="text-yellow-400" />
                    <span className="text-yellow-400 font-bold">Pending Connection</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-300">
                {connectionStatus === 'connected' && 'System is online and synced'}
                {connectionStatus === 'syncing' && 'Synchronizing data with server...'}
                {connectionStatus === 'pending' && 'Waiting for connection. Will sync when online.'}
              </p>
            </div>

            {/* Last Sync Time */}
            <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={18} />
                Last Sync:
              </div>
              <span className="font-mono text-white">
                {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}
              </span>
            </div>

            {/* Force Sync Button */}
            <Button
              onClick={handleForceSync}
              disabled={isSyncing}
              size="lg"
              className="w-full flex items-center justify-center"
            >
              <Zap size={20} className="mr-2" />
              {isSyncing ? 'Syncing...' : 'Force Sync Now'}
            </Button>
          </div>
        </Card>

        {/* Sync Queue */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Sync Queue</h3>

          <div className="space-y-6">
            {/* Queue Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm font-semibold">Pending</p>
                <p className="text-3xl font-bold text-white mt-2">{pendingCount}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 text-sm font-semibold">Completed</p>
                <p className="text-3xl font-bold text-white mt-2">{completedCount}</p>
              </div>
            </div>

            {/* Queue Items */}
            <div className="bg-slate-700/50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Queue is empty</p>
              ) : (
                <div className="space-y-2">
                  {queue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-slate-600/50 rounded">
                      <span className="text-slate-300 text-sm">{item.type}</span>
                      <Badge
                        variant={
                          item.status === 'completed'
                            ? 'success'
                            : item.status === 'syncing'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Queue Button */}
            <Button
              onClick={handleAddToQueue}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Simulate Queue Item
            </Button>
          </div>
        </Card>
      </div>
    </OutletLayout>
  );
};
