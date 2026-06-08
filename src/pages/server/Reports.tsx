import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Badge } from '../../components/ui/Badge';
import { TRANSACTIONS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Filter } from 'lucide-react';

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
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-white">{CURRENCY} {totalAmount.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Tax Collected</p>
            <p className="text-3xl font-bold text-teal-400">{CURRENCY} {totalTax.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Transactions</p>
            <p className="text-3xl font-bold text-white">{filteredTransactions.length}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-slate-400" />
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('cash')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'cash'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setFilterType('mpesa')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'mpesa'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              M-PESA
            </button>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Transaction Ledger</h3>
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
                  <TableCell className="font-mono text-teal-400">{txn.id}</TableCell>
                  <TableCell className="text-slate-300">{txn.outletId}</TableCell>
                  <TableCell className="text-slate-400">{txn.items.length}</TableCell>
                  <TableCell className="text-white">{CURRENCY} {txn.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-white">{CURRENCY} {txn.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-teal-400 font-semibold">{CURRENCY} {txn.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={txn.paymentMethod === 'cash' ? 'info' : 'success'}>
                      {txn.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
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
