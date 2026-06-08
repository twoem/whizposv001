import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { OutletLayout } from '../../layouts/OutletLayout';
import { Plus } from 'lucide-react';
import { EXPENSES, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

export const Expenses: React.FC = () => {
  const [outletName] = useState(OUTLETS[0].name);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', description: '' });

  const localExpenses = EXPENSES.filter(e => e.outletId === OUTLETS[0].id);
  const totalExpenses = localExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = () => {
    console.log('Adding petty cash expense:', newExpense);
    setIsAddModalOpen(false);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  const categories = [...new Set(localExpenses.map(e => e.category))];

  return (
    <OutletLayout title={`Petty Cash - ${outletName}`}>
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Total Expenses</p>
            <p className="text-4xl font-bold text-white">{CURRENCY} {totalExpenses.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Categories</p>
            <p className="text-4xl font-bold text-teal-400">{categories.length}</p>
          </Card>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Record Expense
          </Button>
        </div>

        {/* Expenses by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Breakdown by Category</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Category</TableCell>
                <TableCell header>Count</TableCell>
                <TableCell header>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => {
                const categoryExpenses = localExpenses.filter(e => e.category === cat);
                const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                return (
                  <TableRow key={cat}>
                    <TableCell className="font-semibold text-white">{cat}</TableCell>
                    <TableCell className="text-slate-400">{categoryExpenses.length}</TableCell>
                    <TableCell className="text-white font-semibold">
                      {CURRENCY} {categoryTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Recent Expenses */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Expenses</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Time</TableCell>
                <TableCell header>Category</TableCell>
                <TableCell header>Description</TableCell>
                <TableCell header>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(expense.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{expense.description}</TableCell>
                  <TableCell className="text-white font-semibold">
                    {CURRENCY} {expense.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Add Expense Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Petty Cash Expense"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Category"
              placeholder="e.g., Cleaning, Supplies"
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
              placeholder="What was this expense for?"
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
    </OutletLayout>
  );
};
