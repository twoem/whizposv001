import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { DollarSign, Store, AlertCircle, Plus, ArrowUpRight, Users, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TRANSACTIONS, PRODUCTS, OUTLETS, USERS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

export const Dashboard: React.FC = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOutletModalOpen, setIsOutletModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const totalRevenue = TRANSACTIONS.reduce((sum, t) => sum + t.total, 0);
  const activeOutlets = OUTLETS.filter(o => o.status === 'online').length;
  const lowStockProducts = PRODUCTS.filter(p => p.stock < 10);
  const totalOrders = TRANSACTIONS.length;
  const totalUsers = USERS.length;

  const chartData = [
    { date: 'Mon', sales: 4000, revenue: 2400 },
    { date: 'Tue', sales: 3000, revenue: 1398 },
    { date: 'Wed', sales: 2000, revenue: 9800 },
    { date: 'Thu', sales: 2780, revenue: 3908 },
    { date: 'Fri', sales: 1890, revenue: 4800 },
    { date: 'Sat', sales: 2390, revenue: 3800 },
    { date: 'Sun', sales: 3490, revenue: 4300 },
  ];

  const categoryData = PRODUCTS.reduce((acc, p) => {
    const existing = acc.find(x => x.name === p.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `${CURRENCY} ${totalRevenue.toLocaleString()}`,
      subtitle: 'This week',
      icon: <DollarSign size={28} />,
      trend: 12.5,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Outlets',
      value: `${activeOutlets}/${OUTLETS.length}`,
      subtitle: 'Online now',
      icon: <Store size={28} />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      subtitle: 'This month',
      icon: <Activity size={28} />,
      trend: 8.2,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Team Members',
      value: totalUsers,
      subtitle: 'Active users',
      icon: <Users size={28} />,
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const topProducts = PRODUCTS.sort((a, b) => b.stock - a.stock).slice(0, 5);

  return (
    <ServerLayout title="Dashboard">
      <div className="space-y-8">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 text-sm"
          >
            <Plus size={20} />
            Add Product
          </Button>
          <Button
            onClick={() => setIsUserModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 text-sm"
          >
            <Plus size={20} />
            Add User
          </Button>
          <Button
            onClick={() => setIsOutletModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 text-sm"
          >
            <Plus size={20} />
            Add Outlet
          </Button>
          <Button
            onClick={() => setIsStockModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 text-sm"
          >
            <Plus size={20} />
            Update Stock
          </Button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <ArrowUpRight size={16} />
                    {stat.trend}%
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Sales Trend */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart - Product Categories */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Products by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom Section - Bar Chart & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-500" />
              Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900">Low Stock Items</p>
                <p className="text-xs text-yellow-700 mt-1">{lowStockProducts.length} products</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900">Offline Outlets</p>
                <p className="text-xs text-red-700 mt-1">{OUTLETS.length - activeOutlets} location(s)</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">Pending Orders</p>
                <p className="text-xs text-blue-700 mt-1">3 awaiting fulfillment</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>
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
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">{product.category}</TableCell>
                  <TableCell>
                    <span className="text-gray-900 font-semibold">{product.stock} units</span>
                  </TableCell>
                  <TableCell className="text-blue-600 font-semibold">{CURRENCY} {product.price}</TableCell>
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

        {/* Modals */}
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title="Add New Product"
          size="md"
        >
          <div className="space-y-4">
            <Input label="Product Name" placeholder="Enter product name" />
            <Input label="SKU" placeholder="Enter SKU" />
            <Input label="Category" placeholder="Enter category" />
            <Input label="Price" placeholder="Enter price" type="number" />
            <Input label="Stock Quantity" placeholder="Enter stock quantity" type="number" />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsProductModalOpen(false)}>Add Product</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          title="Add New User"
          size="md"
        >
          <div className="space-y-4">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" placeholder="Enter email" type="email" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsUserModalOpen(false)}>Add User</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isOutletModalOpen}
          onClose={() => setIsOutletModalOpen(false)}
          title="Add New Outlet"
          size="md"
        >
          <div className="space-y-4">
            <Input label="Outlet Name" placeholder="Enter outlet name" />
            <Input label="Location" placeholder="Enter location" />
            <Input label="Manager Name" placeholder="Enter manager name" />
            <Input label="Phone" placeholder="Enter phone number" />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsOutletModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsOutletModalOpen(false)}>Add Outlet</Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          title="Update Stock"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
              <select className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500">
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                ))}
              </select>
            </div>
            <Input label="New Stock Quantity" placeholder="Enter new quantity" type="number" />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsStockModalOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsStockModalOpen(false)}>Update Stock</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
