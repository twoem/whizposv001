import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
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
                  <TableCell className="font-mono text-blue-600 font-semibold">{transfer.id}</TableCell>
                  <TableCell className="text-gray-700">{transfer.from}</TableCell>
                  <TableCell className="text-gray-700">{transfer.to}</TableCell>
                  <TableCell className="flex items-center gap-2 text-gray-700">
                    <Package size={16} className="text-gray-500" />
                    {transfer.items} units
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{transfer.date}</TableCell>
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
          <div className="space-y-4">
            <Input label="From Location" placeholder="Source warehouse or outlet" />
            <Input label="To Location" placeholder="Destination outlet" />
            <Input label="Product" placeholder="Select product" />
            <Input label="Quantity" placeholder="Enter quantity" type="number" />
            <div className="flex gap-4 mt-6">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddModalOpen(false)}>Create Transfer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
