import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { useCartStore } from '../../store/cartStore';
import { PRODUCTS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Plus, Minus, X } from 'lucide-react';

export const POS: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Coffee');
  const [barcode, setBarcode] = useState('');
  const [cashierName] = useState('Cashier 1');
  const [outletName] = useState(OUTLETS[0].name);
  const { items, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getTax, getTotal } = useCartStore();

  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddProduct = (product: typeof PRODUCTS[0]) => {
    if (product.stock > 0) {
      addItem({
        productId: product.id,
        quantity: 1,
        price: product.price
      });
    }
  };

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode) {
      const product = PRODUCTS.find(p => p.sku === barcode);
      if (product && product.stock > 0) {
        handleAddProduct(product);
      }
      setBarcode('');
    }
  };

  const getCartItem = (productId: string) => {
    const item = items.find(i => i.productId === productId);
    const product = PRODUCTS.find(p => p.id === productId);
    return { item, product };
  };

  const handlePayment = (method: 'cash' | 'mpesa') => {
    console.log(`Payment of ${CURRENCY} ${getTotal()} via ${method.toUpperCase()}`);
    clearCart();
  };

  return (
    <OutletLayout title={`POS - ${outletName}`}>
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Products */}
        <div className="col-span-2 space-y-4 overflow-y-auto">
          {/* Barcode Scanner */}
          <Card className="p-4 sticky top-0 z-10">
            <Input
              placeholder="Scan barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleBarcodeInput}
              autoFocus
            />
          </Card>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                hover
                className="p-4 cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleAddProduct(product)}
              >
                <div className="mb-3 h-24 bg-slate-700/50 rounded-lg" />
                <h4 className="font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-teal-400 font-bold mb-2">{CURRENCY} {product.price}</p>
                <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                  {product.stock} available
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-teal-600/30 to-teal-500/20 border-b border-slate-700 p-4">
            <h3 className="font-bold text-white text-lg">CART</h3>
            <p className="text-slate-400 text-xs mt-1">{cashierName}</p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No items in cart</p>
              </div>
            ) : (
              items.map((cartItem) => {
                const { product } = getCartItem(cartItem.productId);
                if (!product) return null;
                return (
                  <div key={cartItem.productId} className="bg-slate-700/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-white font-medium text-sm">{product.name}</span>
                      <button
                        onClick={() => removeItem(cartItem.productId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                          className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-white font-bold">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.productId, cartItem.quantity + 1)}
                          className="bg-slate-600 hover:bg-slate-700 text-white p-1 rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-teal-400 font-bold text-sm">
                        {CURRENCY} {(cartItem.price * cartItem.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Totals */}
          <div className="border-t border-slate-700 p-4 space-y-3">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span>{CURRENCY} {getSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax (16%):</span>
              <span className="text-yellow-400">{CURRENCY} {getTax().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-slate-700 pt-3">
              <span>TOTAL:</span>
              <span className="text-teal-400">{CURRENCY} {getTotal().toLocaleString()}</span>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-2 mt-4">
              <Button
                onClick={() => handlePayment('cash')}
                disabled={items.length === 0}
                size="lg"
                className="w-full"
              >
                Cash Payment
              </Button>
              <Button
                onClick={() => handlePayment('mpesa')}
                disabled={items.length === 0}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                M-PESA Payment
              </Button>
              <Button
                onClick={() => clearCart()}
                disabled={items.length === 0}
                variant="ghost"
                size="lg"
                className="w-full text-red-400"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OutletLayout>
  );
};
