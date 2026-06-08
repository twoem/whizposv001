import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { OutletLayout } from '../../layouts/OutletLayout';
import { TRANSACTIONS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Printer, Download } from 'lucide-react';

export const History: React.FC = () => {
  const [outletName] = React.useState(OUTLETS[0].name);
  const localTransactions = TRANSACTIONS.filter(t => t.outletId === OUTLETS[0].id);

  const handlePrint = (transactionId: string) => {
    console.log('Printing receipt for:', transactionId);
  };

  const handleDownload = (transactionId: string) => {
    console.log('Downloading receipt for:', transactionId);
  };

  return (
    <OutletLayout title={`Receipt History - ${outletName}`}>
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Total Receipts</p>
            <p className="text-3xl font-bold text-white">{localTransactions.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-teal-400">
              {CURRENCY} {localTransactions.reduce((sum, t) => sum + t.total, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Today's Date</p>
            <p className="text-3xl font-bold text-white">{new Date().toLocaleDateString()}</p>
          </Card>
        </div>

        {/* Receipts List */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Transaction Receipts</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Receipt ID</TableCell>
                <TableCell header>Items</TableCell>
                <TableCell header>Subtotal</TableCell>
                <TableCell header>Tax</TableCell>
                <TableCell header>Total</TableCell>
                <TableCell header>Payment Method</TableCell>
                <TableCell header>Time</TableCell>
                <TableCell header>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localTransactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-mono text-teal-400">{txn.id}</TableCell>
                  <TableCell className="text-slate-400">{txn.items.length}</TableCell>
                  <TableCell className="text-white">{CURRENCY} {txn.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-white">{CURRENCY} {txn.tax.toLocaleString()}</TableCell>
                  <TableCell className="text-white font-bold">{CURRENCY} {txn.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={txn.paymentMethod === 'cash' ? 'info' : 'success'}>
                      {txn.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(txn.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <button
                      onClick={() => handlePrint(txn.id)}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(txn.id)}
                      className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </OutletLayout>
  );
};
