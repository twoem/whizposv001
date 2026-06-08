import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OutletLayout } from '../../layouts/OutletLayout';
import { useCartStore } from '../../store/cartStore';
import { PRODUCTS, OUTLETS } from '../../shared/mockData';
import { CURRENCY } from '../../shared/constants';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';

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
              placeholder="Scan barcode or search product..."
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 font-semibold ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                hover
                className="p-4 cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleAddProduct(product)}
              >
                <div className="mb-3 h-24 bg-gray-100 rounded-lg border border-gray-200" />
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-blue-600 font-bold mb-2">{CURRENCY} {product.price}</p>
                <Badge variant={product.stock > 0 ? 'success' : 'error'}>
                  {product.stock} available
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-blue-600" />
              <h3 className="font-bold text-gray-900 text-lg">CART</h3>
            </div>
            <p className="text-gray-500 text-xs mt-1 font-medium">{cashierName}</p>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No items in cart</p>
              </div>
            ) : (
              items.map((cartItem) => {
                const { product } = getCartItem(cartItem.productId);
                if (!product) return null;
                return (
                  <div key={cartItem.productId} className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <span className="text-gray-900 font-medium text-sm">{product.name}</span>
                      <button
                        onClick={() => removeItem(cartItem.productId)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(cartItem.productId, cartItem.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded transition-colors duration-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-gray-900 font-bold">{cartItem.quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItem.productId, cartItem.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-1 rounded transition-colors duration-200"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-blue-600 font-bold text-sm">
                        {CURRENCY} {(cartItem.price * cartItem.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Totals */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{CURRENCY} {getSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (16%):</span>
              <span className="font-semibold text-amber-600">{CURRENCY} {getTax().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg border-t border-gray-200 pt-3">
              <span>TOTAL:</span>
              <span className="text-blue-600">{CURRENCY} {getTotal().toLocaleString()}</span>
            </div>

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
                className="w-full text-red-600"
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
