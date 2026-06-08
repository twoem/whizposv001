import { Product, Outlet, User, Supplier, Transaction, Expense, ShiftRecord } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    sku: 'ESP-001',
    price: 150,
    category: 'Coffee',
    stock: 45,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Latte',
    sku: 'LAT-001',
    price: 200,
    category: 'Coffee',
    stock: 32,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Cappuccino',
    sku: 'CAP-001',
    price: 200,
    category: 'Coffee',
    stock: 28,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Americano',
    sku: 'AME-001',
    price: 120,
    category: 'Coffee',
    stock: 50,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Croissant',
    sku: 'CRO-001',
    price: 180,
    category: 'Pastry',
    stock: 15,
    imageUrl: 'https://images.pexels.com/photos/33406/croissant-bread-pastry-food.jpg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'Sandwich',
    sku: 'SAN-001',
    price: 280,
    category: 'Food',
    stock: 22,
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    name: 'Bottled Water',
    sku: 'WAT-001',
    price: 80,
    category: 'Beverage',
    stock: 120,
    imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    name: 'Orange Juice',
    sku: 'OJU-001',
    price: 150,
    category: 'Beverage',
    stock: 35,
    imageUrl: 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '9',
    name: 'Chocolate Cake',
    sku: 'CHO-001',
    price: 250,
    category: 'Pastry',
    stock: 8,
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '10',
    name: 'Muffin',
    sku: 'MUF-001',
    price: 120,
    category: 'Pastry',
    stock: 18,
    imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

export const OUTLETS: Outlet[] = [
  {
    id: 'out-1',
    name: 'Nairobi CBD',
    location: 'Kimathi Street, Nairobi',
    manager: 'John Kimani',
    status: 'online',
    lastSync: new Date(Date.now() - 5 * 60000).toISOString(),
    syncKey: 'sync_key_1'
  },
  {
    id: 'out-2',
    name: 'Westlands',
    location: 'Westlands Mall, Nairobi',
    manager: 'Sarah Kipchoge',
    status: 'online',
    lastSync: new Date(Date.now() - 15 * 60000).toISOString(),
    syncKey: 'sync_key_2'
  },
  {
    id: 'out-3',
    name: 'Kilimani',
    location: 'The Junction, Kilimani',
    manager: 'Michael Ochieng',
    status: 'offline',
    lastSync: new Date(Date.now() - 2 * 3600000).toISOString(),
    syncKey: 'sync_key_3'
  },
  {
    id: 'out-4',
    name: 'Lavington',
    location: 'Lavington Center, Nairobi',
    manager: 'Grace Mutua',
    status: 'online',
    lastSync: new Date(Date.now() - 10 * 60000).toISOString(),
    syncKey: 'sync_key_4'
  },
];

export const USERS: User[] = [
  {
    id: 'u-1',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@whizpoint.com',
  },
  {
    id: 'u-2',
    name: 'Manager User',
    role: 'manager',
    email: 'manager@whizpoint.com',
  },
  {
    id: 'u-3',
    name: 'Cashier 1',
    role: 'cashier',
    email: 'cashier1@whizpoint.com',
    outletId: 'out-1'
  },
  {
    id: 'u-4',
    name: 'Cashier 2',
    role: 'cashier',
    email: 'cashier2@whizpoint.com',
    outletId: 'out-2'
  },
  {
    id: 'u-5',
    name: 'Cashier 3',
    role: 'cashier',
    email: 'cashier3@whizpoint.com',
    outletId: 'out-3'
  },
];

export const SUPPLIERS: Supplier[] = [
  {
    id: 's-1',
    name: 'Kenya Coffee Traders',
    phone: '+254 712 345 678',
    email: 'contact@kct.co.ke',
    products: ['1', '2', '3', '4'],
    lastOrderDate: new Date(Date.now() - 7 * 24 * 3600000).toISOString()
  },
  {
    id: 's-2',
    name: 'Bakers Valley Ltd',
    phone: '+254 722 456 789',
    email: 'sales@bakersvally.co.ke',
    products: ['5', '6', '9', '10'],
    lastOrderDate: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  },
  {
    id: 's-3',
    name: 'Beverages Plus',
    phone: '+254 733 567 890',
    email: 'info@bevplus.co.ke',
    products: ['7', '8'],
    lastOrderDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    outletId: 'out-1',
    items: [
      { productId: '1', quantity: 2, price: 150 },
      { productId: '5', quantity: 1, price: 180 }
    ],
    subtotal: 480,
    tax: 76.8,
    total: 556.8,
    paymentMethod: 'cash',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    cashier: 'Cashier 1'
  },
  {
    id: 't-2',
    outletId: 'out-2',
    items: [
      { productId: '2', quantity: 1, price: 200 },
      { productId: '7', quantity: 2, price: 80 }
    ],
    subtotal: 360,
    tax: 57.6,
    total: 417.6,
    paymentMethod: 'mpesa',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    cashier: 'Cashier 2'
  },
  {
    id: 't-3',
    outletId: 'out-1',
    items: [
      { productId: '3', quantity: 1, price: 200 },
      { productId: '8', quantity: 1, price: 150 }
    ],
    subtotal: 350,
    tax: 56,
    total: 406,
    paymentMethod: 'cash',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    cashier: 'Cashier 1'
  },
];

export const EXPENSES: Expense[] = [
  {
    id: 'e-1',
    category: 'Utilities',
    amount: 5000,
    description: 'Electricity bill',
    outletId: 'out-1',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdBy: 'John Kimani'
  },
  {
    id: 'e-2',
    category: 'Maintenance',
    amount: 2500,
    description: 'Machine servicing',
    outletId: 'out-2',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    createdBy: 'Sarah Kipchoge'
  },
  {
    id: 'e-3',
    category: 'Supplies',
    amount: 1200,
    description: 'Cups and napkins',
    outletId: 'out-1',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    createdBy: 'John Kimani'
  },
];

export const SHIFT_RECORDS: ShiftRecord[] = [
  {
    id: 'shift-1',
    outletId: 'out-1',
    cashier: 'Cashier 1',
    openingFloat: 10000,
    closingBalance: 15450,
    openedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    closedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    status: 'closed'
  },
  {
    id: 'shift-2',
    outletId: 'out-1',
    cashier: 'Cashier 1',
    openingFloat: 15450,
    closingBalance: 0,
    openedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    status: 'open'
  },
];
