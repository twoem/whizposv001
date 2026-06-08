import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { OutletLayout } from '../../layouts/OutletLayout';
import { TRANSACTIONS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Printer, Download, Receipt, DollarSign, Calendar } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Receipt size={20} className="text-blue-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Receipts</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{localTransactions.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {CURRENCY} {localTransactions.reduce((sum, t) => sum + t.total, 0).toLocaleString()}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Calendar size={20} className="text-amber-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Today's Date</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
          </Card>
        </div>

        {/* Receipts List */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transaction Receipts</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Receipt ID</TableCell>
                <TableCell header>Cashier</TableCell>
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
                  <TableCell className="font-mono text-blue-600 font-semibold">{txn.id}</TableCell>
                  <TableCell className="text-gray-700 font-medium">{txn.cashier}</TableCell>
                  <TableCell className="text-gray-600">{txn.items.length}</TableCell>
                  <TableCell className="text-gray-900">{CURRENCY} {txn.subtotal.toLocaleString()}</TableCell>
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
                  <TableCell className="flex gap-2">
                    <button
                      onClick={() => handlePrint(txn.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors duration-200"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(txn.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors duration-200"
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
