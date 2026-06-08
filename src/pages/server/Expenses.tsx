import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Badge } from '../../components/ui/Badge';
import { Plus, DollarSign, Tag } from 'lucide-react';
import { EXPENSES } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

export const Expenses: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });

  const handleAddExpense = () => {
    console.log('Adding expense:', newExpense);
    setIsAddModalOpen(false);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  const categories = [...new Set(EXPENSES.map(e => e.category))];
  const totalExpenses = EXPENSES.reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = categories.map(cat => ({
    category: cat,
    total: EXPENSES.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    count: EXPENSES.filter(e => e.category === cat).length
  }));

  return (
    <ServerLayout title="Expense Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <DollarSign size={20} className="text-red-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{CURRENCY} {totalExpenses.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Tag size={20} className="text-amber-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Categories</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{categories.length}</p>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Record Expense
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Expenses by Category</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Category</TableCell>
                <TableCell header>Count</TableCell>
                <TableCell header>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesByCategory.map((item) => (
                <TableRow key={item.category}>
                  <TableCell className="font-semibold text-gray-900">{item.category}</TableCell>
                  <TableCell className="text-gray-600">{item.count} expense(s)</TableCell>
                  <TableCell className="text-gray-900 font-semibold">
                    {CURRENCY} {item.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Expenses</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Date</TableCell>
                <TableCell header>Category</TableCell>
                <TableCell header>Description</TableCell>
                <TableCell header>Amount</TableCell>
                <TableCell header>Created By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {EXPENSES.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{expense.description}</TableCell>
                  <TableCell className="text-gray-900 font-semibold">
                    {CURRENCY} {expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600">{expense.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Expense"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Category"
              placeholder="e.g., Utilities, Maintenance"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            />
            <Input
              label="Amount"
              placeholder="Enter amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="Enter description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <div className="flex gap-4 mt-6">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddExpense}>Record Expense</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
