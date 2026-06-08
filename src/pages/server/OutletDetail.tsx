import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { ArrowLeft, Edit, Trash2, Plus, MapPin, User, Clock } from 'lucide-react';
import { OUTLETS, PRODUCTS, TRANSACTIONS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

export const OutletDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const outlet = OUTLETS.find(o => o.id === id);
  const outletTransactions = TRANSACTIONS.filter(t => t.outletId === id);
  const outletRevenue = outletTransactions.reduce((sum, t) => sum + t.total, 0);

  if (!outlet) {
    return (
      <ServerLayout title="Outlet Not Found">
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Outlet not found</p>
          <Button onClick={() => navigate('/server/outlets')}>Back to Outlets</Button>
        </Card>
      </ServerLayout>
    );
  }

  return (
    <ServerLayout title={`Outlet: ${outlet.name}`}>
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/server/outlets')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{outlet.name}</h1>
          <Badge variant={outlet.status === 'online' ? 'success' : 'error'}>
            {outlet.status.toUpperCase()}
          </Badge>
        </div>

        {/* Outlet Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">Location</p>
                <p className="text-lg font-bold text-gray-900 flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5" />
                  {outlet.location}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Manager</p>
              <p className="text-lg font-bold text-gray-900 flex items-start gap-2">
                <User size={18} className="mt-0.5" />
                {outlet.manager}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Last Sync</p>
              <p className="text-lg font-bold text-gray-900 flex items-start gap-2">
                <Clock size={18} className="mt-0.5" />
                {new Date(outlet.lastSync).toLocaleTimeString()}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Revenue</p>
              <p className="text-lg font-bold text-blue-600">
                {CURRENCY} {outletRevenue.toLocaleString()}
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2"
          >
            <Edit size={18} />
            Edit Outlet
          </Button>
          <Button
            onClick={() => setIsAddStockModalOpen(true)}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Stock
          </Button>
          <Button
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </Button>
          <Button variant="danger" className="flex items-center justify-center gap-2">
            <Trash2 size={18} />
            Delete
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
          {outletTransactions.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No transactions yet</p>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>Transaction ID</TableCell>
                  <TableCell header>Items</TableCell>
                  <TableCell header>Total</TableCell>
                  <TableCell header>Payment</TableCell>
                  <TableCell header>Cashier</TableCell>
                  <TableCell header>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outletTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-blue-600">{txn.id}</TableCell>
                    <TableCell className="text-gray-600">{txn.items.length} item(s)</TableCell>
                    <TableCell className="text-gray-900 font-semibold">{CURRENCY} {txn.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={txn.paymentMethod === 'cash' ? 'info' : 'success'}>
                        {txn.paymentMethod.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{txn.cashier}</TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(txn.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Outlet Stock */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Stock at This Outlet</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Product</TableCell>
                <TableCell header>SKU</TableCell>
                <TableCell header>Category</TableCell>
                <TableCell header>Stock</TableCell>
                <TableCell header>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PRODUCTS.slice(0, 8).map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">{product.category}</TableCell>
                  <TableCell>
                    <span className="text-gray-900 font-semibold">{Math.floor(Math.random() * 100)} units</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'warning'}>
                      {Math.random() > 0.5 ? 'In Stock' : 'Low'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Modals */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Outlet"
          size="md"
        >
          <div className="space-y-4">
            <Input label="Outlet Name" defaultValue={outlet.name} />
            <Input label="Location" defaultValue={outlet.location} />
            <Input label="Manager Name" defaultValue={outlet.manager} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isAddStockModalOpen}
          onClose={() => setIsAddStockModalOpen(false)}
          title="Add Stock"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500">
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <Input label="Quantity" placeholder="Enter quantity" type="number" />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsAddStockModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddStockModalOpen(false)}>Add Stock</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          title="Add Product to Outlet"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500">
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <Input label="Initial Quantity" placeholder="Enter initial quantity" type="number" />
            <Input label="Retail Price" placeholder="Enter retail price" type="number" />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsAddProductModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddProductModalOpen(false)}>Add Product</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
