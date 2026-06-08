import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { PRODUCTS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Search } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outletName] = useState(OUTLETS[0].name);

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OutletLayout title={`Stock Inventory - ${outletName}`}>
      <div className="space-y-6">
        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Inventory Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="mb-4 h-32 bg-slate-700/50 rounded-lg" />
              <h3 className="font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-xs text-slate-400 mb-3">SKU: {product.sku}</p>
              <div className="space-y-2">
                <p className="text-teal-400 font-bold">{CURRENCY} {product.price}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">{product.stock}</span>
                  <span className="text-slate-400 text-xs">in stock</span>
                </div>
                <Badge
                  variant={
                    product.stock === 0
                      ? 'error'
                      : product.stock < 10
                      ? 'warning'
                      : 'success'
                  }
                >
                  {product.stock === 0
                    ? 'Out of Stock'
                    : product.stock < 10
                    ? 'Low Stock'
                    : 'In Stock'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Total Items</p>
            <p className="text-3xl font-bold text-white">{filteredProducts.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-400">
              {filteredProducts.filter(p => p.stock < 10 && p.stock > 0).length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-slate-400 text-sm mb-2">Out of Stock</p>
            <p className="text-3xl font-bold text-red-400">
              {filteredProducts.filter(p => p.stock === 0).length}
            </p>
          </Card>
        </div>
      </div>
    </OutletLayout>
  );
};
