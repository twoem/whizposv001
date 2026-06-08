import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { PRODUCTS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Search, Package, AlertTriangle, XCircle } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outletName] = useState(OUTLETS[0].name);

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStock = filteredProducts.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStock = filteredProducts.filter(p => p.stock === 0).length;

  return (
    <OutletLayout title={`Stock Inventory - ${outletName}`}>
      <div className="space-y-6">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="mb-4 h-32 bg-gray-100 rounded-lg border border-gray-200" />
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-3">SKU: {product.sku}</p>
              <div className="space-y-2">
                <p className="text-blue-600 font-bold">{CURRENCY} {product.price}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-bold text-lg">{product.stock}</span>
                  <span className="text-gray-500 text-xs font-medium">in stock</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Package size={20} className="text-blue-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Items</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{filteredProducts.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Low Stock</p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{lowStock}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle size={20} className="text-red-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Out of Stock</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
          </Card>
        </div>
      </div>
    </OutletLayout>
  );
};
