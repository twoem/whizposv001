import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { ServerLayout } from '../../layouts/ServerLayout';
import { DollarSign, Store, AlertCircle, Plus, ArrowUpRight, Users, Activity, TrendingUp } from 'lucide-react';
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

const salesData = [
  { day: 'Mon', sales: 4000, revenue: 2400 },
  { day: 'Tue', sales: 3000, revenue: 1398 },
  { day: 'Wed', sales: 5200, revenue: 9800 },
  { day: 'Thu', sales: 2780, revenue: 3908 },
  { day: 'Fri', sales: 4890, revenue: 4800 },
  { day: 'Sat', sales: 6390, revenue: 3800 },
  { day: 'Sun', sales: 3490, revenue: 4300 },
];

const maxSales = Math.max(...salesData.map(d => d.sales));
const maxRevenue = Math.max(...salesData.map(d => d.revenue));

function LineChartSVG() {
  const w = 500;
  const h = 200;
  const pad = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const salesPoints = salesData.map((d, i) => ({
    x: pad.left + (i / (salesData.length - 1)) * innerW,
    y: pad.top + (1 - d.sales / maxSales) * innerH,
  }));
  const revenuePoints = salesData.map((d, i) => ({
    x: pad.left + (i / (salesData.length - 1)) * innerW,
    y: pad.top + (1 - d.revenue / maxRevenue) * innerH,
  }));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad.left} y1={pad.top + t * innerH}
          x2={pad.left + innerW} y2={pad.top + t * innerH}
          stroke="#e5e7eb" strokeWidth="1"
        />
      ))}
      <path d={toPath(salesPoints)} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={toPath(revenuePoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
      {salesPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
      ))}
      {revenuePoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#10b981" />
      ))}
      {salesData.map((d, i) => {
        const x = pad.left + (i / (salesData.length - 1)) * innerW;
        return (
          <text key={i} x={x} y={h - 8} textAnchor="middle" fontSize="11" fill="#9ca3af">{d.day}</text>
        );
      })}
    </svg>
  );
}

function BarChartSVG() {
  const w = 500;
  const h = 200;
  const pad = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const barW = (innerW / salesData.length) * 0.32;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad.left} y1={pad.top + t * innerH} x2={pad.left + innerW} y2={pad.top + t * innerH} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {salesData.map((d, i) => {
        const cx = pad.left + (i + 0.5) * (innerW / salesData.length);
        const sh = (d.sales / maxSales) * innerH;
        const rh = (d.revenue / maxRevenue) * innerH;
        return (
          <g key={i}>
            <rect x={cx - barW - 2} y={pad.top + innerH - sh} width={barW} height={sh} fill="#3b82f6" rx="4" />
            <rect x={cx + 2} y={pad.top + innerH - rh} width={barW} height={rh} fill="#10b981" rx="4" />
            <text x={cx} y={h - 8} textAnchor="middle" fontSize="11" fill="#9ca3af">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PieChartSVG({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = -Math.PI / 2;
  const cx = 90;
  const cy = 90;
  const r = 70;

  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      path: `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`,
      color: COLORS[i % COLORS.length],
      name: d.name,
      value: d.value,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 180 180" className="w-36 h-36 flex-shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="space-y-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-gray-600">{s.name}</span>
            <span className="font-bold text-gray-900 ml-auto pl-2">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
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

  const categoryData = PRODUCTS.reduce((acc, p) => {
    const existing = acc.find(x => x.name === p.category);
    if (existing) existing.value += 1;
    else acc.push({ name: p.category, value: 1 });
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `${CURRENCY} ${totalRevenue.toLocaleString()}`,
      subtitle: 'This week',
      icon: <DollarSign size={22} />,
      trend: 12.5,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Outlets',
      value: `${activeOutlets}/${OUTLETS.length}`,
      subtitle: 'Online now',
      icon: <Store size={22} />,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      subtitle: 'This month',
      icon: <Activity size={22} />,
      trend: 8.2,
      color: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Team Members',
      value: totalUsers,
      subtitle: 'Active users',
      icon: <Users size={22} />,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const topProducts = [...PRODUCTS].sort((a, b) => b.stock - a.stock).slice(0, 5);

  return (
    <ServerLayout title="Dashboard">
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Product', onClick: () => setIsProductModalOpen(true) },
            { label: 'Add User', onClick: () => setIsUserModalOpen(true) },
            { label: 'Add Outlet', onClick: () => setIsOutletModalOpen(true) },
            { label: 'Update Stock', onClick: () => setIsStockModalOpen(true) },
          ].map(({ label, onClick }) => (
            <Button key={label} onClick={onClick} className="flex items-center justify-center gap-2 h-11 text-sm">
              <Plus size={16} />
              {label}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} />
                    {stat.trend}%
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs">{stat.subtitle}</p>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Sales Trend</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded-full" />Sales</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded-full" />Revenue</span>
              </div>
            </div>
            <div className="h-48">
              <LineChartSVG />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-900">By Category</h3>
              <p className="text-xs text-gray-400 mt-0.5">Product distribution</p>
            </div>
            <PieChartSVG data={categoryData} />
          </Card>
        </div>

        {/* Bar Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Weekly Performance</h3>
                <p className="text-xs text-gray-400 mt-0.5">Sales vs Revenue</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 bg-blue-500 inline-block rounded" />Sales</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 bg-emerald-500 inline-block rounded" />Revenue</span>
              </div>
            </div>
            <div className="h-48">
              <BarChartSVG />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              System Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-amber-900">Low Stock</p>
                  <p className="text-xs text-amber-600 mt-0.5">{lowStockProducts.length} products need restocking</p>
                </div>
                <span className="text-xl font-bold text-amber-500">{lowStockProducts.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-red-900">Offline Outlets</p>
                  <p className="text-xs text-red-600 mt-0.5">{OUTLETS.length - activeOutlets} location(s) down</p>
                </div>
                <span className="text-xl font-bold text-red-500">{OUTLETS.length - activeOutlets}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-blue-900">Pending Orders</p>
                  <p className="text-xs text-blue-600 mt-0.5">Awaiting fulfillment</p>
                </div>
                <span className="text-xl font-bold text-blue-500">3</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Top Products</h3>
              <p className="text-xs text-gray-400 mt-0.5">Ranked by stock level</p>
            </div>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Product</TableCell>
                <TableCell header>SKU</TableCell>
                <TableCell header>Category</TableCell>
                <TableCell header>Stock</TableCell>
                <TableCell header>Unit Price</TableCell>
                <TableCell header>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">{product.category}</TableCell>
                  <TableCell><span className="font-semibold text-gray-900">{product.stock} units</span></TableCell>
                  <TableCell className="text-blue-600 font-semibold">{CURRENCY} {product.price}</TableCell>
                  <TableCell>
                    {product.stock < 10
                      ? <Badge variant="warning">Low Stock</Badge>
                      : <Badge variant="success">In Stock</Badge>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Modals */}
        <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Add New Product" size="md">
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

        <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Add New User" size="md">
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

        <Modal isOpen={isOutletModalOpen} onClose={() => setIsOutletModalOpen(false)} title="Add New Outlet" size="md">
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

        <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title="Update Stock" size="md">
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
