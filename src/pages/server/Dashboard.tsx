import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { TrendingUp, DollarSign, Store, AlertCircle } from 'lucide-react';
import { TRANSACTIONS, PRODUCTS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

export const Dashboard: React.FC = () => {
  const totalRevenue = TRANSACTIONS.reduce((sum, t) => sum + t.total, 0);
  const activeOutlets = OUTLETS.filter(o => o.status === 'online').length;
  const lowStockProducts = PRODUCTS.filter(p => p.stock < 10);

  const topProducts = PRODUCTS
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  return (
    <ServerLayout title="Dashboard">
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-white">{CURRENCY} {totalRevenue.toLocaleString()}</p>
                <p className="text-teal-400 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp size={16} />
                  +12.5% vs yesterday
                </p>
              </div>
              <DollarSign size={32} className="text-teal-500/30" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Active Outlets</p>
                <p className="text-4xl font-bold text-white">{activeOutlets}/{OUTLETS.length}</p>
                <p className="text-green-400 text-sm mt-2">All systems operational</p>
              </div>
              <Store size={32} className="text-green-500/30" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Low Stock Items</p>
                <p className="text-4xl font-bold text-white">{lowStockProducts.length}</p>
                <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} />
                  Require reorder
                </p>
              </div>
              <AlertCircle size={32} className="text-yellow-500/30" />
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Top Products (Stock Levels)</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Product</TableCell>
                <TableCell header>SKU</TableCell>
                <TableCell header>Category</TableCell>
                <TableCell header>Stock Level</TableCell>
                <TableCell header>Unit Price</TableCell>
                <TableCell header>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-slate-200">{product.name}</TableCell>
                  <TableCell className="text-slate-400">{product.sku}</TableCell>
                  <TableCell className="text-slate-400">{product.category}</TableCell>
                  <TableCell>
                    <span className="text-white font-semibold">{product.stock} units</span>
                  </TableCell>
                  <TableCell className="text-teal-400">{CURRENCY} {product.price}</TableCell>
                  <TableCell>
                    {product.stock < 10 ? (
                      <Badge variant="warning">Low Stock</Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
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
              {TRANSACTIONS.slice(0, 5).map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-teal-400">{txn.id}</TableCell>
                  <TableCell className="text-slate-400">{txn.items.length} item(s)</TableCell>
                  <TableCell className="text-white font-semibold">{CURRENCY} {txn.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={txn.paymentMethod === 'cash' ? 'info' : 'success'}>
                      {txn.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">{txn.cashier}</TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(txn.timestamp).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </ServerLayout>
  );
};
