import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Plus } from 'lucide-react';
import { USERS, OUTLETS } from '../../shared/mockData';

export const Users: React.FC = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const roleVariant = {
    admin: 'info' as const,
    manager: 'primary' as const,
    cashier: 'success' as const,
  };

  return (
    <ServerLayout title="Team Management">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsAssignModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Assign User
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Team Members</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Name</TableCell>
                <TableCell header>Role</TableCell>
                <TableCell header>Email</TableCell>
                <TableCell header>Assigned Outlet</TableCell>
                <TableCell header>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {USERS.map((user) => {
                const outlet = OUTLETS.find(o => o.id === user.outletId);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-semibold text-white">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role]}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400">{user.email}</TableCell>
                    <TableCell className="text-slate-400">
                      {outlet ? outlet.name : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign User to Outlet"
          size="md"
        >
          <div className="space-y-4 p-6">
            <p className="text-slate-300">User assignment form - mock interface</p>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
