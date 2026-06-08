import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { OUTLETS } from '../../shared/mockData';
import { Clock } from 'lucide-react';

export const Outlets: React.FC = () => {
  return (
    <ServerLayout title="Outlets Management">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {OUTLETS.map((outlet) => (
            <Card key={outlet.id} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{outlet.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{outlet.location}</p>
                </div>
                <Badge variant={outlet.status === 'online' ? 'success' : 'error'}>
                  {outlet.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Manager:</span>
                  <span className="text-white font-medium">{outlet.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sync Key:</span>
                  <span className="text-teal-400 font-mono text-xs">{outlet.syncKey}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} />
                  Last sync: {new Date(outlet.lastSync).toLocaleTimeString()}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Sync Status Overview</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Outlet</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Last Sync</TableCell>
                <TableCell header>Sync Frequency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {OUTLETS.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell className="font-semibold text-white">{outlet.name}</TableCell>
                  <TableCell>
                    <Badge variant={outlet.status === 'online' ? 'success' : 'error'}>
                      {outlet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(outlet.lastSync).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-400">Every 15 mins</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ServerLayout>
  );
};
