import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ServerLayout } from '../../layouts/ServerLayout';
import { Plus, Search } from 'lucide-react';
import { PRODUCTS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: '', category: '', stock: '' });

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', sku: '', price: '', category: '', stock: '' });
  };

  const categories = [...new Set(PRODUCTS.map(p => p.category))];

  return (
    <ServerLayout title="Inventory Management">
      <div className="space-y-6">
        {/* Header with Search and Add Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Add Product
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover className="p-4">
              <div className="mb-4 h-32 bg-slate-700/50 rounded-lg" />
              <h3 className="font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-sm text-slate-400 mb-2">SKU: {product.sku}</p>
              <p className="text-xl font-bold text-teal-400 mb-3">
                {CURRENCY} {product.price}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Stock: {product.stock}</span>
                <Badge variant={product.stock < 10 ? 'warning' : 'success'}>
                  {product.stock < 10 ? 'Low' : 'OK'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Product Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Product"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              label="SKU"
              placeholder="Enter SKU"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
            <Input
              label="Category"
              placeholder="Enter category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <Input
              label="Price"
              placeholder="Enter price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <Input
              label="Initial Stock"
              placeholder="Enter stock quantity"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
            <div className="flex gap-4 mt-6">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </Modal>
      </div>
    </ServerLayout>
  );
};
