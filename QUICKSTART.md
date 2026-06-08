# Whiz POS - Quick Start Guide

## Running the Application

### Single Port (Development)
```bash
npm run dev
# Runs on http://localhost:3000 (Server Mode)
```

### Dual Port (Concurrent)
```bash
npm run dev
# Server Mode: http://localhost:3000 (Admin/Manager)
# Outlet Mode: http://localhost:3001 (Cashier/POS)
```

### Individual Modes
```bash
npm run dev:s   # Server only (port 3000)
npm run dev:o   # Outlet only (port 3001)
```

## Login Credentials

Access the application using the PIN keypad. Auto-submits when 4 digits entered.

### Admin
- **PIN**: 9999
- **Access**: Full server access
- **Can use**: Server dashboard + Outlet POS

### Manager
- **PIN**: 8888
- **Access**: Full server access
- **Can use**: Server dashboard + Outlet POS

### Cashier
- **PIN**: 1234
- **Access**: Outlet mode only
- **Blocked**: Server dashboard
- **Can use**: POS, Shift, History, Inventory, Expenses, Sync

**Note**: Server mode cashier login will show error: "Unauthorized: Admin & Manager Access Only" with shake animation

## Mode Switching

The app automatically detects which mode to load based on port:

| Port | Mode   | Interface           | Users                   |
|------|--------|---------------------|-------------------------|
| 3000 | Server | Admin Dashboard     | Admin, Manager, Cashier |
| 3001 | Outlet | Point of Sale       | Cashier, Manager, Admin |

You can manually test both modes by opening both ports in different browser tabs.

## Server Mode (Admin Dashboard)

### Dashboard (`/server/dashboard`)
- View KPI cards: Revenue, Active Outlets, Low Stock
- See top products and recent transactions
- Monitor outlet status

### Inventory (`/server/inventory`)
- Browse all products by category
- View stock levels and pricing
- Search by product name or SKU
- Add new products (mock modal)

### Suppliers (`/server/suppliers`)
- Manage supplier contacts
- Track products supplied
- View last order dates
- Add new suppliers (mock modal)

### Stock Transfers (`/server/transfers`)
- Create stock transfers
- Track transfer status (Pending, In Transit, Delivered)
- View warehouse to outlet distribution

### Outlets (`/server/outlets`)
- Monitor outlet status (Online/Offline)
- View manager assignments
- Check sync keys and last sync time
- Manage outlet operations

### Team (`/server/users`)
- Manage team members
- Assign roles (Admin, Manager, Cashier)
- Link users to outlets
- Track user status

### Reports (`/server/reports`)
- View transaction ledger
- Filter by payment method (Cash/M-PESA)
- Track revenue and tax collection
- Download reports (mock)

### Expenses (`/server/expenses`)
- Record business expenses
- Track expenses by category
- View expense trends
- Audit trail

## Outlet Mode (Point of Sale)

### POS (`/outlet/pos`)
1. **Browse Products**
   - Click category tabs to filter
   - Click products to add to cart
   - Products show availability

2. **Barcode Scanner**
   - Type/paste SKU in barcode field
   - Press Enter to add product
   - Auto-focuses after each scan

3. **Cart Management**
   - Adjust quantities with +/- buttons
   - Remove items with X button
   - See running total with tax (16%)

4. **Checkout**
   - Choose payment: Cash or M-PESA
   - Prints receipt (mock)
   - Clears cart on completion

### Shift (`/outlet/shift`)
1. **Opening Shift**
   - Click "Open New Shift"
   - Enter opening float amount
   - Confirms shift is active

2. **During Shift**
   - See current balance updates
   - Track all transactions

3. **Closing Shift**
   - Click "Close Shift & Generate Z-Report"
   - Generates daily report
   - View shift history

### History (`/outlet/history`)
- View all receipts from today
- Print or download receipt copies
- Track payment methods
- See transaction details

### Inventory (`/outlet/inventory`)
- Check current stock levels
- Search for products
- See stock status (In Stock, Low Stock, Out of Stock)
- View pricing

### Expenses (`/outlet/expenses`)
- Record petty cash expenses
- Categorize expenses (Cleaning, Supplies, etc.)
- Track daily spending
- View expense breakdown

### Sync (`/outlet/sync`)
- Monitor connection status (Connected/Offline/Syncing)
- View sync queue
- See pending vs completed syncs
- Force sync when needed
- Track last sync time

## Keyboard Shortcuts

### PIN Entry
- **0-9** Keys: Input digits
- **Backspace**: Delete last digit
- **Enter**: Submit PIN (auto-submits at 4 digits)

### POS
- **Enter**: Confirm barcode input
- **Tab**: Navigate form fields

## Mock Features

The following features are fully interactive but use mock data:

- ✓ Add Product (Inventory)
- ✓ Add Supplier (Suppliers)
- ✓ Create Transfer (Stock Transfers)
- ✓ Assign User (Team Management)
- ✓ Record Expense (Expenses)
- ✓ Open/Close Shift (Shift Management)
- ✓ Print Receipt (History)
- ✓ Download Report (Reports)
- ✓ Force Sync (Sync Panel)

Data persists in Zustand stores during the session but resets on refresh.

## Browser DevTools

Open Chrome DevTools to inspect:

```javascript
// Check current auth state
localStorage (not used - all in-memory)

// View Zustand stores in console:
// Uses React Query DevTools (if added)
```

## Production Build

```bash
npm run build
# Output: dist/ folder
# Ready for deployment

# Preview production build locally:
npm run preview
```

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors?**
```bash
npm run typecheck
# Shows all type issues
```

**Module not found?**
```bash
# Check import paths match actual files
# All imports should use .tsx or .ts extensions
```

## File Structure Quick Reference

```
Key files to edit:
- Styling: src/index.css (Tailwind only)
- Business name: src/shared/constants.ts (BUSINESS_NAME)
- Mock data: src/shared/mockData.ts
- Color theme: Tailwind config in constants
- Routes: src/app/router.tsx
```

## Performance Tips

- No unnecessary re-renders (functional components)
- Zustand for lightweight state (not Redux)
- Lucide React imported on demand
- Tailwind CSS purged in production
- Vite HMR for fast updates in dev

## Next Steps

To extend this system:

1. **Add Backend**: Connect to Supabase or your API
2. **Real Data**: Replace mockData.ts with API calls
3. **Authentication**: Integrate proper auth system
4. **Persistence**: Add local storage or database
5. **Offline Mode**: Implement service workers
6. **Printing**: Add receipt printer integration
7. **Payments**: Integrate M-PESA or Stripe
8. **Analytics**: Add charts and graphs

---

**Need help?** Check the full README.md for architecture details.
