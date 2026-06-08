import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { OutletLayout } from '../../layouts/OutletLayout';
import { useSyncStore } from '../../store/syncStore';
import { OUTLETS } from '../../shared/mockData';
import { Zap, CheckCircle, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection Status */}
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Connection Status</h3>

          <div className="space-y-6">
            <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              connectionStatus === 'connected'
                ? 'bg-green-50 border-green-200'
                : connectionStatus === 'syncing'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {connectionStatus === 'connected' && (
                  <>
                    <CheckCircle size={24} className="text-green-600" />
                    <span className="text-green-900 font-bold">Connected</span>
                  </>
                )}
                {connectionStatus === 'syncing' && (
                  <>
                    <Zap size={24} className="text-blue-600 animate-pulse" />
                    <span className="text-blue-900 font-bold">Syncing...</span>
                  </>
                )}
                {connectionStatus === 'pending' && (
                  <>
                    <AlertCircle size={24} className="text-amber-600" />
                    <span className="text-amber-900 font-bold">Pending Connection</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {connectionStatus === 'connected' && 'System is online and synced'}
                {connectionStatus === 'syncing' && 'Synchronizing data with server...'}
                {connectionStatus === 'pending' && 'Waiting for connection. Will sync when online.'}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                Last Sync:
              </div>
              <span className="font-mono text-gray-900 font-semibold">
                {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}
              </span>
            </div>

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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Sync Queue</h3>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff size={16} className="text-amber-600" />
                  <p className="text-amber-900 text-sm font-semibold">Pending</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi size={16} className="text-green-600" />
                  <p className="text-green-900 text-sm font-semibold">Completed</p>
                </div>
                <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200">
              {queue.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Queue is empty</p>
              ) : (
                <div className="space-y-2">
                  {queue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100">
                      <span className="text-gray-700 text-sm font-medium">{item.type}</span>
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
