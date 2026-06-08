import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Badge } from '../../components/ui/Badge';
import { TRANSACTIONS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Filter, DollarSign, Receipt, TrendingUp } from 'lucide-react';

export const Reports: React.FC = () => {
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = filterType === 'all'
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.paymentMethod === filterType);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTax = filteredTransactions.reduce((sum, t) => sum + t.tax, 0);

  return (
    <ServerLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <DollarSign size={20} className="text-blue-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{CURRENCY} {totalAmount.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Tax Collected</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{CURRENCY} {totalTax.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Receipt size={20} className="text-amber-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Transactions</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filteredTransactions.length}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-500" />
            {['all', 'cash', 'mpesa'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {type === 'all' ? 'All' : type === 'cash' ? 'Cash' : 'M-PESA'}
              </button>
            ))}
          </div>
        </Card>

        {/* Transaction Details */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transaction Ledger</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Transaction ID</TableCell>
                <TableCell header>Outlet</TableCell>
                <TableCell header>Items</TableCell>
                <TableCell header>Subtotal</TableCell>
                <TableCell header>Tax</TableCell>
                <TableCell header>Total</TableCell>
                <TableCell header>Payment</TableCell>
                <TableCell header>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-blue-600 font-semibold">{txn.id}</TableCell>
                  <TableCell className="text-gray-700">{txn.outletId}</TableCell>
                  <TableCell className="text-gray-600">{txn.items.length}</TableCell>
                  <TableCell className="text-gray-900 font-semibold">{CURRENCY} {txn.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">{CURRENCY} {txn.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-900 font-bold">{CURRENCY} {txn.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={txn.paymentMethod === 'cash' ? 'info' : 'success'}>
                      {txn.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
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
