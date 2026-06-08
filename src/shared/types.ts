export type UserRole = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  outletId?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  outletId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'mpesa';
  timestamp: string;
  cashier: string;
}

export interface Outlet {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: 'online' | 'offline';
  lastSync: string;
  syncKey: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  products: string[];
  lastOrderDate: string;
}

export interface StockTransfer {
  id: string;
  fromLocation: string;
  toOutlet: string;
  items: CartItem[];
  status: 'pending' | 'in_transit' | 'delivered';
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  outletId: string;
  createdAt: string;
  createdBy: string;
}

export interface ShiftRecord {
  id: string;
  outletId: string;
  cashier: string;
  openingFloat: number;
  closingBalance: number;
  openedAt: string;
  closedAt?: string;
  status: 'open' | 'closed';
}
