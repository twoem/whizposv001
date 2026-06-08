import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Badge } from '../../components/ui/Badge';
import { Plus, Phone, Mail } from 'lucide-react';
import { SUPPLIERS } from '../../shared/mockData';

export const Suppliers: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '' });

  const handleAddSupplier = () => {
    console.log('Adding supplier:', newSupplier);
    setIsAddModalOpen(false);
    setNewSupplier({ name: '', phone: '', email: '' });
  };

  return (
    <ServerLayout title="Suppliers">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Add Supplier
          </Button>
        </div>

        <Card className="p-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Supplier Name</TableCell>
                <TableCell header>Contact</TableCell>
                <TableCell header>Products</TableCell>
                <TableCell header>Last Order</TableCell>
                <TableCell header>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SUPPLIERS.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-semibold text-white">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={16} />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={16} />
                        {supplier.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{supplier.products.length} items</Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(supplier.lastOrderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Supplier"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Supplier Name"
              placeholder="Enter supplier name"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="Enter phone number"
              value={newSupplier.phone}
              onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="Enter email address"
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
            />
            <div className="flex gap-4 mt-6">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
