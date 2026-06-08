import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { OUTLETS } from '../../shared/mockData';
import { Clock, MapPin, User, ArrowRight } from 'lucide-react';

export const Outlets: React.FC = () => {
  return (
    <ServerLayout title="Outlets Management">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {OUTLETS.map((outlet) => (
            <Link
              key={outlet.id}
              to={`/server/outlet/${outlet.id}`}
              className="transform transition-all hover:scale-105"
            >
              <Card hover className="p-6 cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{outlet.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                      <MapPin size={16} />
                      {outlet.location}
                    </p>
                  </div>
                  <Badge variant={outlet.status === 'online' ? 'success' : 'error'}>
                    {outlet.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <User size={16} />
                      Manager:
                    </span>
                    <span className="text-gray-900 font-medium">{outlet.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock size={16} />
                      Last Sync:
                    </span>
                    <span className="text-gray-900 font-mono text-xs">{new Date(outlet.lastSync).toLocaleTimeString()}</span>
                  </div>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group">
                      View Details
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sync Status Overview</h3>
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
                  <TableCell className="font-semibold text-gray-900">{outlet.name}</TableCell>
                  <TableCell>
                    <Badge variant={outlet.status === 'online' ? 'success' : 'error'}>
                      {outlet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(outlet.lastSync).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600">Every 15 mins</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ServerLayout>
  );
};
