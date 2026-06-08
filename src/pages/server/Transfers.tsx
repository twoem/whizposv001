import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Plus, Package } from 'lucide-react';

const mockTransfers = [
  {
    id: 't-1',
    from: 'Main Warehouse',
    to: 'Nairobi CBD',
    items: 15,
    status: 'delivered',
    date: '2026-06-08'
  },
  {
    id: 't-2',
    from: 'Main Warehouse',
    to: 'Westlands',
    items: 8,
    status: 'in_transit',
    date: '2026-06-08'
  },
  {
    id: 't-3',
    from: 'Main Warehouse',
    to: 'Kilimani',
    items: 12,
    status: 'pending',
    date: '2026-06-07'
  },
];

export const Transfers: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const statusVariant = {
    pending: 'warning' as const,
    in_transit: 'info' as const,
    delivered: 'success' as const,
  };

  return (
    <ServerLayout title="Stock Transfers">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Create Transfer
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Transfer ID</TableCell>
                <TableCell header>From</TableCell>
                <TableCell header>To</TableCell>
                <TableCell header>Items</TableCell>
                <TableCell header>Date</TableCell>
                <TableCell header>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-mono text-teal-400">{transfer.id}</TableCell>
                  <TableCell className="text-slate-300">{transfer.from}</TableCell>
                  <TableCell className="text-slate-300">{transfer.to}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Package size={16} className="text-slate-400" />
                    {transfer.items} units
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">{transfer.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[transfer.status as keyof typeof statusVariant]}>
                      {transfer.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Stock Transfer"
          size="md"
        >
          <div className="space-y-4 p-6">
            <p className="text-slate-300">Transfer form mock interface</p>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
