# Whizpoint Solutions POS — Frontend Documentation

> **Purpose:** Complete reference for frontend developers and backend engineers integrating this UI.
> Everything here maps directly to what exists in the codebase at `/src/`.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Structure](#2-project-structure)
3. [Authentication & Routing](#3-authentication--routing)
4. [State Management](#4-state-management)
5. [Shared Types & Data Models](#5-shared-types--data-models)
6. [UI Component Library](#6-ui-component-library)
7. [Layouts](#7-layouts)
8. [Server Mode Pages](#8-server-mode-pages)
9. [Outlet Mode Pages](#9-outlet-mode-pages)
10. [API Integration Guide](#10-api-integration-guide)
11. [Database Schema Reference](#11-database-schema-reference)
12. [Missing / Stub Features](#12-missing--stub-features)
13. [Environment & Build](#13-environment--build)

---

## 1. Architecture Overview

```
Browser (Port 3000)  →  Server Mode  →  Admin Dashboard
Browser (Port 3001)  →  Outlet Mode  →  Point of Sale Terminal
```

- **Single codebase, dual-mode** — one Vite app, port detection at runtime determines which UI to load.
- **Auth gate** — all routes require a valid PIN login. Unauthenticated users are redirected to `/`.
- **Mock data only** — no backend calls exist yet. All data lives in `src/shared/mockData.ts`.
- **State** — Zustand stores in `src/store/`. No Redux, no React Context for business data.
- **Styling** — Tailwind CSS only. No CSS modules, no inline style objects (except minor shadow overrides).

---

## 2. Project Structure

```
src/
├── app/
│   ├── App.tsx            # Root component; detects port and sets mode
│   ├── router.tsx         # Route tree; splits server vs outlet routes
│   └── providers.tsx      # Wrapper for future context providers
│
├── layouts/
│   ├── ServerLayout.tsx   # Fixed sidebar + topbar for server mode
│   └── OutletLayout.tsx   # Fixed sidebar + topbar for outlet mode
│
├── components/
│   ├── ui/                # Generic reusable components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   └── shared/            # App-specific components
│       ├── Keypad.tsx     # Numeric PIN keypad
│       ├── PinDots.tsx    # PIN entry dot indicators
│       ├── Sidebar.tsx    # Navigation sidebar
│       └── Topbar.tsx     # Header bar with clock, user, status
│
├── pages/
│   ├── auth/
│   │   └── Login.tsx
│   ├── server/            # Admin-only pages (port 3000)
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Suppliers.tsx
│   │   ├── Transfers.tsx
│   │   ├── Outlets.tsx
│   │   ├── OutletDetail.tsx
│   │   ├── Users.tsx
│   │   ├── Reports.tsx
│   │   ├── Expenses.tsx
│   │   └── Settings.tsx
│   └── outlet/            # Cashier pages (port 3001)
│       ├── POS.tsx
│       ├── Shift.tsx
│       ├── History.tsx
│       ├── Inventory.tsx
│       ├── Expenses.tsx
│       ├── Sync.tsx
│       └── Settings.tsx
│
├── store/
│   ├── authStore.ts       # Role, userName, mode, isAuthenticated
│   ├── cartStore.ts       # POS cart items + computed totals
│   └── syncStore.ts       # Offline sync queue
│
└── shared/
    ├── types.ts           # All TypeScript interfaces
    ├── constants.ts       # PIN_MAP, PIN_NAME_MAP, TAX_RATE, CURRENCY
    └── mockData.ts        # Static seed data for all entities
```

---

## 3. Authentication & Routing

### Login Flow

```
User enters 4-digit PIN
→ validatePin() in src/pages/auth/Login.tsx
→ checks PIN_MAP (constants.ts) for role
→ checks mode: server mode blocks 'cashier' role
→ setRole(), setUserName(), setAuthenticated(true) in authStore
→ navigate to /server/dashboard  OR  /outlet/pos
```

### PIN Map (`src/shared/constants.ts`)

| PIN  | Role    | Name         | Server Access | Outlet Access |
|------|---------|--------------|---------------|---------------|
| 9999 | admin   | Admin User   | Yes           | Yes           |
| 8888 | manager | Manager User | Yes           | Yes           |
| 1234 | cashier | Cashier 1    | No (blocked)  | Yes           |

> **Backend note:** Replace PIN_MAP and PIN_NAME_MAP with an API call to `POST /auth/login` that returns `{ role, name, token }`. Store the JWT in authStore alongside role/userName.

### Route Protection

`ProtectedRoute` in `src/app/router.tsx` checks `isAuthenticated`. If false → redirect to `/`.

The router also hard-switches route trees based on `mode`:
- `mode === 'server'` → renders `/server/*` routes only
- `mode === 'outlet'` → renders `/outlet/*` routes only

### Mode Detection (`src/app/App.tsx`)

```ts
const port = window.location.port;
const mode = port === '3000' ? 'server' : 'outlet';
setMode(mode);
```

> **Backend note:** For production deployments where both modes share the same port/domain, replace this with a config endpoint or environment variable (`VITE_APP_MODE`).

---

## 4. State Management

All stores are in `src/store/` using [Zustand](https://github.com/pmndrs/zustand).

### `authStore.ts`

| Field           | Type                            | Description                        |
|-----------------|---------------------------------|------------------------------------|
| `role`          | `UserRole \| null`              | Current user's role                |
| `userName`      | `string \| null`                | Display name of logged-in user     |
| `mode`          | `'server' \| 'outlet'`          | Which interface is active          |
| `isAuthenticated` | `boolean`                     | Whether a valid PIN has been entered |

**Actions:** `setRole`, `setUserName`, `setMode`, `setAuthenticated`, `logout`

> `logout()` clears `role`, `userName`, and `isAuthenticated`. Mode is preserved.

### `cartStore.ts`

| Field     | Type         | Description              |
|-----------|--------------|--------------------------|
| `items`   | `CartItem[]` | Items currently in cart  |

**Actions:**
- `addItem(item)` — adds item or increments qty if product already in cart
- `removeItem(productId)` — removes item entirely
- `updateQuantity(productId, qty)` — updates qty; removes item if qty reaches 0
- `clearCart()` — empties cart

**Computed:**
- `getSubtotal()` — sum of `price × quantity` for all items
- `getTax()` — `subtotal × TAX_RATE` (16%), rounded to 2dp
- `getTotal()` — `subtotal + tax`

### `syncStore.ts`

| Field          | Type           | Description                        |
|----------------|----------------|------------------------------------|
| `queue`        | `SyncItem[]`   | Offline transaction queue          |
| `isSyncing`    | `boolean`      | Whether a sync is in progress      |
| `lastSyncTime` | `string \| null` | ISO timestamp of last sync       |

**SyncItem shape:**
```ts
{ id: string; type: string; status: 'pending' | 'syncing' | 'completed' | 'failed'; timestamp: string }
```

**Actions:** `addToQueue`, `removeFromQueue`, `setIsSyncing`, `setLastSyncTime`, `clearQueue`

---

## 5. Shared Types & Data Models

File: `src/shared/types.ts`

### `UserRole`
```ts
type UserRole = 'admin' | 'manager' | 'cashier'
```

### `User`
```ts
interface User {
  id: string
  name: string
  role: UserRole
  email: string
  outletId?: string    // null for admin/manager HQ users
}
```

### `Product`
```ts
interface Product {
  id: string
  name: string
  sku: string          // unique barcode/scanner key
  price: number        // in KSH
  category: string
  stock: number        // total units across all outlets
  imageUrl?: string    // Pexels URL
}
```

### `CartItem`
```ts
interface CartItem {
  productId: string
  quantity: number
  price: number        // unit price at time of sale (snapshot)
}
```

### `Transaction`
```ts
interface Transaction {
  id: string
  outletId: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'mpesa'
  timestamp: string    // ISO 8601
  cashier: string      // cashier's display name
}
```

### `Outlet`
```ts
interface Outlet {
  id: string
  name: string
  location: string
  manager: string
  status: 'online' | 'offline'
  lastSync: string     // ISO 8601
  syncKey: string      // unique key for sync authentication
}
```

### `Supplier`
```ts
interface Supplier {
  id: string
  name: string
  phone: string
  email: string
  products: string[]   // array of product IDs they supply
  lastOrderDate: string
}
```

### `StockTransfer`
```ts
interface StockTransfer {
  id: string
  fromLocation: string
  toOutlet: string
  items: CartItem[]
  status: 'pending' | 'in_transit' | 'delivered'
  createdAt: string
}
```

### `Expense`
```ts
interface Expense {
  id: string
  category: string     // e.g. 'Utilities', 'Maintenance', 'Supplies'
  amount: number
  description: string
  outletId: string
  createdAt: string
  createdBy: string    // user name
}
```

### `ShiftRecord`
```ts
interface ShiftRecord {
  id: string
  outletId: string
  cashier: string
  openingFloat: number
  closingBalance: number
  openedAt: string
  closedAt?: string    // undefined if shift still open
  status: 'open' | 'closed'
}
```

---

## 6. UI Component Library

All components are in `src/components/ui/` and are fully generic — no business logic inside.

### `Button`
```tsx
<Button variant="primary" size="md" loading={false} disabled={false}>
  Label
</Button>
```
| Prop      | Values                                      | Default     |
|-----------|---------------------------------------------|-------------|
| `variant` | `primary` `secondary` `ghost` `danger`     | `primary`   |
| `size`    | `sm` `md` `lg`                              | `md`        |
| `loading` | `boolean`                                   | `false`     |

### `Card`
```tsx
<Card hover className="p-6">content</Card>
```
| Prop    | Values    | Effect                                       |
|---------|-----------|----------------------------------------------|
| `hover` | `boolean` | Adds blue border + shadow on hover           |

### `Badge`
```tsx
<Badge variant="success">In Stock</Badge>
```
| Variant   | Color   | Typical Use               |
|-----------|---------|---------------------------|
| `primary` | Blue    | General labels            |
| `success` | Green   | Online, Active, In Stock  |
| `warning` | Amber   | Low Stock, Pending        |
| `error`   | Red     | Offline, Out of Stock     |
| `info`    | Cyan    | Payment methods, info     |

### `Input`
```tsx
<Input label="Email" error="Required" type="email" placeholder="..." />
```
Wraps `<input>` with label + error message. Forwards all HTML input attributes via `ref`.

### `Modal`
```tsx
<Modal isOpen={bool} onClose={fn} title="Title" size="md">
  content
</Modal>
```
| `size` | Max Width  |
|--------|------------|
| `sm`   | 384px      |
| `md`   | 672px      |
| `lg`   | 896px      |

### `Table` / `TableHead` / `TableBody` / `TableRow` / `TableCell`
```tsx
<Table>
  <TableHead><TableRow><TableCell header>Col</TableCell></TableRow></TableHead>
  <TableBody><TableRow><TableCell>Value</TableCell></TableRow></TableBody>
</Table>
```
Pass `header` prop to `TableCell` to render a `<th>` instead of `<td>`.

---

### Shared Components

#### `Sidebar` (`src/components/shared/Sidebar.tsx`)
- Props: `variant: 'server' | 'outlet'`
- Renders navigation menu from `SERVER_MENU` or `OUTLET_MENU` arrays
- Active route highlighted via `useLocation().pathname.startsWith(href)`
- Logout button calls `logout()` from authStore + `window.location.href = '/'`

#### `Topbar` (`src/components/shared/Topbar.tsx`)
- Props: `title: string`, `variant?: 'server' | 'outlet'`
- Shows: page title, current date, user avatar + name + role, notification bell, live clock
- Outlet variant additionally shows: online/offline indicator, pending sync count badge
- User avatar: initials from `userName`, gradient blue circle

#### `Keypad` (`src/components/shared/Keypad.tsx`)
- Props: `onInput`, `onDelete`, `onSubmit`, `disabled?`, `shake?`
- 3×4 grid: digits 1–9, Clear (C), 0, Backspace (⌫), VERIFY ACCESS button
- `shake` prop triggers CSS `animate-shake` animation (defined in `index.css`)

#### `PinDots` (`src/components/shared/PinDots.tsx`)
- Props: `length: number`, `maxLength?: number` (default 4)
- Renders filled/empty dot indicators for PIN entry

---

## 7. Layouts

### `ServerLayout` (`src/layouts/ServerLayout.tsx`)
```tsx
<ServerLayout title="Page Title">
  {/* page content */}
</ServerLayout>
```
Structure: `flex h-screen` → fixed `<Sidebar variant="server" />` (w-64) + `flex-col` main area → `<Topbar variant="server" />` (h-16, sticky) + scrollable `<main>` (p-8).

### `OutletLayout` (`src/layouts/OutletLayout.tsx`)
Same structure as ServerLayout but passes `variant="outlet"` to Sidebar and Topbar, enabling the online/sync indicators.

---

## 8. Server Mode Pages

> Base path: `http://localhost:3000` — accessible to `admin` and `manager` roles only.

---

### 8.1 Login — `/`
**File:** `src/pages/auth/Login.tsx`

Two-column layout:
- **Left:** Branding panel with business name, feature bullets, background image (Pexels).
- **Right:** White card with PIN dot indicators, numeric keypad, error display, demo credential hints.

**Backend integration point:**
```
POST /api/auth/login
Body:  { pin: string }
Returns: { role: UserRole, name: string, token: string, outletId?: string }
```
Replace `validatePin()` with this call. Store JWT in authStore; attach to all subsequent API requests.

---

### 8.2 Dashboard — `/server/dashboard`
**File:** `src/pages/server/Dashboard.tsx`

**Sections:**
| Section            | Description                                          |
|--------------------|------------------------------------------------------|
| Quick Actions      | 4 buttons: Add Product, Add User, Add Outlet, Update Stock — each opens a modal |
| KPI Cards (4)      | Total Revenue, Active Outlets, Total Orders, Team Members |
| Sales Trend Chart  | Native SVG line chart (7-day Sales vs Revenue)       |
| Category Pie Chart | Native SVG pie — product count per category          |
| Weekly Bar Chart   | Native SVG bar — Sales vs Revenue per day            |
| System Alerts      | Low Stock count, Offline Outlets count, Pending Orders |
| Top Products Table | Top 5 by stock: name, SKU, category, stock, price, status |

**Modals (all mock — no save):**
- Add Product: name, SKU, category, price, stock qty
- Add User: name, email, role dropdown
- Add Outlet: name, location, manager, phone
- Update Stock: product dropdown, new quantity

**Backend integration points:**
```
GET  /api/dashboard/stats        → { revenue, activeOutlets, totalOrders, teamCount }
GET  /api/dashboard/sales-trend  → [{ date, sales, revenue }] × 7 days
GET  /api/products/top           → Product[] top 5
GET  /api/alerts                 → { lowStock, offlineOutlets, pendingOrders }
POST /api/products               → create product
POST /api/users                  → create user
POST /api/outlets                → create outlet
PATCH /api/products/:id/stock    → update stock
```

---

### 8.3 Inventory — `/server/inventory`
**File:** `src/pages/server/Inventory.tsx`

**Features:**
- Search by name or SKU (client-side filter on mock data)
- Category tabs (All + dynamic categories from product list)
- Product grid (4 cols) — image placeholder, name, SKU, price, stock count, Low/OK badge
- Add Product modal (name, SKU, category, price, initial stock)

**Missing (stub only):**
- Edit product — no modal exists
- Delete product — no button exists
- Actual product images — placeholder `div` shown instead of `<img>`

**Backend integration points:**
```
GET    /api/products?search=&category=   → Product[]
POST   /api/products                     → Product
PATCH  /api/products/:id                 → Product
DELETE /api/products/:id
```

---

### 8.4 Suppliers — `/server/suppliers`
**File:** `src/pages/server/Suppliers.tsx`

**Features:**
- Table: Supplier Name, Contact (phone + email), Products (count badge), Last Order Date
- Add Supplier modal: name, phone, email

**Missing:**
- Edit supplier
- Delete supplier
- View products supplied (linked list)
- Order history per supplier

**Backend integration points:**
```
GET    /api/suppliers      → Supplier[]
POST   /api/suppliers      → Supplier
PATCH  /api/suppliers/:id  → Supplier
DELETE /api/suppliers/:id
```

---

### 8.5 Stock Transfers — `/server/transfers`
**File:** `src/pages/server/Transfers.tsx`

**Features:**
- Table: Transfer ID, From, To, Items count, Date, Status badge (Pending/In Transit/Delivered)
- Create Transfer modal: from location, to location, product, quantity

**Status values:** `pending` | `in_transit` | `delivered`

**Missing:**
- Edit/cancel transfer
- Status update buttons
- Transfer items breakdown

**Backend integration points:**
```
GET    /api/transfers           → StockTransfer[]
POST   /api/transfers           → StockTransfer
PATCH  /api/transfers/:id/status  Body: { status }
```

---

### 8.6 Outlets — `/server/outlets`
**File:** `src/pages/server/Outlets.tsx`

**Features:**
- 2-column card grid — each card is a `<Link>` to `/server/outlet/:id`
- Cards show: name, location, manager, last sync time, online/offline badge
- Hover scale animation (1.05x)
- Sync Status table at bottom: outlet, status badge, last sync timestamp, sync frequency

**Backend integration points:**
```
GET /api/outlets   → Outlet[]
```

---

### 8.7 Outlet Detail — `/server/outlet/:id`
**File:** `src/pages/server/OutletDetail.tsx`

**Features:**
- Back button → `/server/outlets`
- Info cards: Location, Manager, Last Sync, Revenue (from transactions)
- Quick actions: Edit Outlet, Add Stock, Add Product, Delete (danger)
- Recent Transactions table: ID, items count, total, payment method, cashier, time
- Stock at Outlet table: product name, SKU, category, stock (mock random), status

**Modals:**
- Edit Outlet: name, location, manager, status dropdown
- Add Stock: product dropdown, quantity
- Add Product: product dropdown, initial quantity, retail price

**Backend integration points:**
```
GET    /api/outlets/:id                       → Outlet
GET    /api/outlets/:id/transactions          → Transaction[]
GET    /api/outlets/:id/stock                 → { productId, stock }[]
PATCH  /api/outlets/:id                       → Outlet
POST   /api/outlets/:id/stock                 → add stock to outlet
POST   /api/outlets/:id/products              → assign product to outlet
DELETE /api/outlets/:id
```

---

### 8.8 Team Management — `/server/users`
**File:** `src/pages/server/Users.tsx`

**Features (fully interactive, local state):**
- Summary stat cards: count per role (admin/manager/cashier) + total
- Search bar: filter by name, email, or role
- Table: avatar initials, name, role badge, email, assigned outlet, PIN (masked), status toggle, edit/delete actions
- Status toggle: click status badge to flip active ↔ inactive
- Add User modal: name, email, role dropdown, outlet dropdown, PIN (4-digit, digits only), status
- Edit User modal: same form pre-populated
- Delete confirmation modal with warning

**Data source:** Initialised from `USERS` mock data + local React state (changes survive navigation within session only).

> This page has full local CRUD. When connecting to a backend, replace local state with API calls.

**Backend integration points:**
```
GET    /api/users                    → User[]
POST   /api/users                    Body: { name, email, role, outletId?, pin }
PATCH  /api/users/:id                Body: { name?, email?, role?, outletId?, pin?, status? }
DELETE /api/users/:id
PATCH  /api/users/:id/status         Body: { status: 'active' | 'inactive' }
POST   /api/users/:id/reset-pin      Body: { newPin }
```

---

### 8.9 Reports — `/server/reports`
**File:** `src/pages/server/Reports.tsx`

**Features:**
- Summary KPI cards: Total Revenue, Tax Collected, Transaction Count
- Filter buttons: All / Cash / M-PESA
- Transaction Ledger table: ID, Outlet, Items count, Subtotal, Tax, Total, Payment Method, Time

**Missing:**
- Date range filter
- Export to CSV/PDF
- Per-outlet report breakdown
- Detailed transaction drill-down (expand items)

**Backend integration points:**
```
GET /api/transactions?paymentMethod=&from=&to=&outletId=   → Transaction[]
GET /api/reports/summary?from=&to=                         → { revenue, tax, count }
GET /api/reports/export?format=csv&from=&to=               → file download
```

---

### 8.10 Expenses — `/server/expenses`
**File:** `src/pages/server/Expenses.tsx`

**Features:**
- KPI cards: Total Expenses, Category Count
- Expenses by Category table: category, count, total amount
- Recent Expenses table: date, category badge, description, amount, created by
- Record Expense modal: category, amount, description

**Backend integration points:**
```
GET    /api/expenses              → Expense[]
POST   /api/expenses              Body: { category, amount, description, outletId }
DELETE /api/expenses/:id
```

---

### 8.11 Server Settings — `/server/settings`
**File:** `src/pages/server/Settings.tsx`

**Sections & Fields:**

**Business Information**
| Field            | Input Type | Notes                    |
|------------------|------------|--------------------------|
| Business Name    | text       |                          |
| Business Phone   | text       |                          |
| Business Email   | email      |                          |
| Tax Rate (%)     | number     | Default: 16              |
| Business Address | text       |                          |

**Print Settings**
| Field             | Input Type | Options                                                           |
|-------------------|------------|-------------------------------------------------------------------|
| Default Printer   | text       |                                                                   |
| Print Mode        | select     | Receipt (58mm), **Receipt (80mm)**, Bill (A4), Both (Thermal+A4) |
| Paper Size        | text       |                                                                   |
| Duplicate Copies  | number     |                                                                   |
| Auto-print toggle | checkbox   |                                                                   |

**Email Notifications**
| Field                    | Input Type | Notes           |
|--------------------------|------------|-----------------|
| Enable Notifications     | checkbox   |                 |
| Daily Sales Reports      | checkbox   |                 |
| Low Stock Alerts         | checkbox   |                 |
| Recipient Email          | email      |                 |

**API & Integrations**
| Field              | Input Type | Notes                      |
|--------------------|------------|----------------------------|
| API Key            | password   |                            |
| Webhook URL        | text       |                            |
| Sync Interval (min)| number     | Default: 15                |

**Backend integration points:**
```
GET   /api/settings          → { business, print, email, api }
PATCH /api/settings/business
PATCH /api/settings/print
PATCH /api/settings/email
PATCH /api/settings/api
```

---

## 9. Outlet Mode Pages

> Base path: `http://localhost:3001` — accessible to all roles.

---

### 9.1 POS — `/outlet/pos`
**File:** `src/pages/outlet/POS.tsx`

**Layout:** 2/3 product area + 1/3 cart sidebar.

**Product Area:**
- Barcode scanner input — type/paste SKU, press Enter to add to cart
- Category tabs — dynamic from products list
- Product grid — image placeholder, name, price, stock badge; click to add to cart

**Cart Sidebar:**
- Header with cashier name
- Items list: product name, quantity ± buttons, line total, remove (X) button
- Totals: Subtotal, Tax (16%), Total
- Payment buttons: Cash Payment, M-PESA Payment
- Clear Cart button

**State:** `cartStore` (Zustand) — persists within session; clears on payment.

**Payment handler:** Currently logs to console and calls `clearCart()`. No transaction is created.

**Backend integration points:**
```
GET  /api/products?outletId=    → Product[] (only products assigned to this outlet)
POST /api/transactions          Body: { outletId, items, paymentMethod, cashier }
                                Returns: Transaction (with receipt ID)
```

---

### 9.2 Shift Management — `/outlet/shift`
**File:** `src/pages/outlet/Shift.tsx`

**Left card — Current Shift:**
- If shift open: shows status badge, open time, opening float, estimated current balance
- If closed: "No Active Shift" + Open New Shift button
- Open flow: enter float amount → Open Shift
- Close flow: Click "Close Shift & Generate Z-Report" → closes shift

**Right card — Shift History:**
- List of all shifts: cashier, status badge, open/close times, opening float, closing balance

**Backend integration points:**
```
GET  /api/shifts?outletId=&status=open    → ShiftRecord (current)
GET  /api/shifts?outletId=                → ShiftRecord[] (history)
POST /api/shifts                          Body: { outletId, cashier, openingFloat }
PATCH /api/shifts/:id/close               Body: { closingBalance }
```

---

### 9.3 Receipt History — `/outlet/history`
**File:** `src/pages/outlet/History.tsx`

**Features:**
- Summary cards: Total Receipts, Total Revenue, Today's Date
- Transactions table: Receipt ID, Cashier, Items count, Subtotal, Tax, Total, Payment Method badge, Time, Print + Download buttons

**Print/Download:** Currently `console.log` only — no printer or file generation.

**Backend integration points:**
```
GET /api/transactions?outletId=&date=today   → Transaction[]
GET /api/transactions/:id/receipt             → receipt PDF/HTML
```

---

### 9.4 Inventory View — `/outlet/inventory`
**File:** `src/pages/outlet/Inventory.tsx`

**Features:**
- Search bar (name or SKU)
- Product grid: image placeholder, name, SKU, price, stock count, status badge
- Summary cards at bottom: Total Items, Low Stock count, Out of Stock count

**Backend integration points:**
```
GET /api/products?outletId=&search=   → Product[] (outlet-specific stock levels)
```

---

### 9.5 Petty Cash Expenses — `/outlet/expenses`
**File:** `src/pages/outlet/Expenses.tsx`

**Features:**
- KPI cards: Total Expenses, Category Count (outlet-filtered)
- Category Breakdown table
- Recent Expenses table
- Record Expense modal: category, amount, description

**Backend integration points:**
```
GET  /api/expenses?outletId=       → Expense[]
POST /api/expenses                 Body: { category, amount, description, outletId, createdBy }
```

---

### 9.6 Sync & Connection — `/outlet/sync`
**File:** `src/pages/outlet/Sync.tsx`

**Features:**
- Connection status card: Connected / Syncing / Pending states with colour coding
- Last Sync timestamp
- Force Sync button (simulates 2s sync then sets `lastSyncTime`)
- Sync Queue card: Pending / Completed counts
- Queue items list with status badges
- "Simulate Queue Item" button for testing

**Sync states:** Connected (green), Syncing (blue + pulse), Pending (amber)

**Backend integration points:**
```
POST /api/sync/force               → triggers full sync
GET  /api/sync/queue?outletId=     → SyncItem[]
POST /api/sync/queue               Body: SyncItem (add item)
PATCH /api/sync/queue/:id          Body: { status }
```

---

### 9.7 Outlet Settings — `/outlet/settings`
**File:** `src/pages/outlet/Settings.tsx`

**Sections & Fields:**

**Receipt Print Settings**
| Field               | Input Type | Options                                                             |
|---------------------|------------|---------------------------------------------------------------------|
| Default Printer     | text       |                                                                     |
| Print Mode          | select     | Receipt (58mm), **Receipt (80mm)**, Bill (A4), Invoice (A4)        |
| Duplicate Copies    | number     |                                                                     |
| Receipt Header Text | text       |                                                                     |
| Receipt Footer Text | text       |                                                                     |
| Auto-print toggle   | checkbox   |                                                                     |

**Cashier Settings**
| Field                      | Input Type | Notes               |
|----------------------------|------------|---------------------|
| Cashier Name               | text       |                     |
| Register Number            | text       |                     |
| Daily Starting Float (KSH) | number     |                     |
| Auto-logout After (min)    | number     |                     |
| Enable Auto-logout         | checkbox   |                     |

**Display Settings**
| Field                | Input Type | Options                    |
|----------------------|------------|----------------------------|
| Font Size            | select     | Small, Medium, Large       |
| Currency             | select     | KSH, USD, EUR              |
| Show Product Images  | checkbox   |                            |
| Show Product Prices  | checkbox   |                            |

**Offline & Sync Settings**
| Field                               | Input Type | Notes       |
|-------------------------------------|------------|-------------|
| Enable Offline Mode                 | checkbox   | Experimental |
| Auto-sync When Online               | checkbox   |             |
| Sync on WiFi Only                   | checkbox   |             |
| Retry Failed Syncs                  | checkbox   |             |

---

## 10. API Integration Guide

### Replacing Mock Data

All mock data lives in `src/shared/mockData.ts` as exported constants (`PRODUCTS`, `OUTLETS`, `USERS`, etc.). To connect a real backend:

1. Create a service layer at `src/services/` (e.g. `src/services/products.ts`).
2. Replace direct imports of mock constants with hook calls (React Query recommended).
3. Pass real data into the same component props/state that currently receive mock data.

**Example pattern:**
```ts
// src/services/products.ts
export async function getProducts(params?: { search?: string; category?: string }) {
  const res = await fetch(`/api/products?${new URLSearchParams(params)}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<Product[]>;
}
```

### Authentication Header

Once JWT auth is implemented, attach the token to every request:
```ts
const headers = {
  'Authorization': `Bearer ${authStore.getState().token}`,
  'Content-Type': 'application/json',
};
```

### Supabase Client

The project already has `@supabase/supabase-js` installed. Credentials are in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Create `src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

## 11. Database Schema Reference

Derived from `src/shared/types.ts`. All IDs should be UUIDs in production.

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin','manager','cashier')),
  email       TEXT UNIQUE NOT NULL,
  pin_hash    TEXT,            -- bcrypt hash of 4-digit PIN
  outlet_id   UUID REFERENCES outlets(id),
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Outlets
CREATE TABLE outlets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT,
  manager     TEXT,
  status      TEXT DEFAULT 'online' CHECK (status IN ('online','offline')),
  last_sync   TIMESTAMPTZ,
  sync_key    TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  sku         TEXT UNIQUE NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  category    TEXT NOT NULL,
  stock       INTEGER DEFAULT 0,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Outlet stock (per-outlet inventory)
CREATE TABLE outlet_stock (
  outlet_id   UUID REFERENCES outlets(id),
  product_id  UUID REFERENCES products(id),
  stock       INTEGER DEFAULT 0,
  PRIMARY KEY (outlet_id, product_id)
);

-- Suppliers
CREATE TABLE suppliers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  last_order_date TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Supplier products (many-to-many)
CREATE TABLE supplier_products (
  supplier_id  UUID REFERENCES suppliers(id),
  product_id   UUID REFERENCES products(id),
  PRIMARY KEY (supplier_id, product_id)
);

-- Transactions
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id       UUID REFERENCES outlets(id),
  cashier         TEXT NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL,
  tax             NUMERIC(10,2) NOT NULL,
  total           NUMERIC(10,2) NOT NULL,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('cash','mpesa')),
  timestamp       TIMESTAMPTZ DEFAULT now()
);

-- Transaction items
CREATE TABLE transaction_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  product_id     UUID REFERENCES products(id),
  quantity       INTEGER NOT NULL,
  unit_price     NUMERIC(10,2) NOT NULL
);

-- Expenses
CREATE TABLE expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id   UUID REFERENCES outlets(id),
  category    TEXT NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Shifts
CREATE TABLE shifts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id        UUID REFERENCES outlets(id),
  cashier          TEXT NOT NULL,
  opening_float    NUMERIC(10,2) NOT NULL,
  closing_balance  NUMERIC(10,2) DEFAULT 0,
  opened_at        TIMESTAMPTZ DEFAULT now(),
  closed_at        TIMESTAMPTZ,
  status           TEXT DEFAULT 'open' CHECK (status IN ('open','closed'))
);

-- Stock transfers
CREATE TABLE stock_transfers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location TEXT NOT NULL,
  to_outlet_id  UUID REFERENCES outlets(id),
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_transit','delivered')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Stock transfer items
CREATE TABLE stock_transfer_items (
  transfer_id UUID REFERENCES stock_transfers(id),
  product_id  UUID REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  PRIMARY KEY (transfer_id, product_id)
);

-- Settings (key/value per section)
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 12. Missing / Stub Features

The following features have UI shells but no functional implementation. Prioritise these for backend work:

### Critical (blocks real usage)
| Feature              | Location                          | What's Needed                                      |
|----------------------|-----------------------------------|----------------------------------------------------|
| POS payment saves    | `outlet/POS.tsx` `handlePayment`  | `POST /api/transactions` with full cart payload    |
| Shift open/close     | `outlet/Shift.tsx`                | `POST /api/shifts`, `PATCH /api/shifts/:id/close`  |
| Product images       | Inventory + POS                   | Replace `<div>` placeholder with `<img src={product.imageUrl}` |
| All modal saves      | Dashboard + all server pages      | Wire form state to API calls; show success/error   |

### High Priority
| Feature                   | Location               | Notes                                           |
|---------------------------|------------------------|-------------------------------------------------|
| Edit product              | `server/Inventory`     | No edit modal exists yet                        |
| Delete product            | `server/Inventory`     | No delete button exists                         |
| Edit/delete supplier      | `server/Suppliers`     | Read-only after creation                        |
| Transfer status updates   | `server/Transfers`     | No status change buttons                        |
| Receipt print/download    | `outlet/History`       | Buttons call console.log only                   |
| Real sync queue           | `outlet/Sync`          | Queue is ephemeral; needs persistent store      |
| Reports date filter       | `server/Reports`       | No date range UI exists                         |

### Nice to Have
| Feature                 | Notes                                                       |
|-------------------------|-------------------------------------------------------------|
| Change calculation      | POS cash payment — show change due                         |
| M-PESA confirmation     | Show STK push / await confirmation before clearing cart    |
| X-Report (mid-shift)    | Interim shift report without closing                       |
| CSV/PDF export          | Reports + Expenses pages                                   |
| Product bulk import     | CSV upload for inventory                                   |
| Customer management     | Currently no customer entity anywhere                      |
| Discounts / coupons     | No discount field in cart                                  |
| Refunds / voids         | No refund flow in transaction history                      |

---

## 13. Environment & Build

### Dev Scripts
```bash
npm run dev:s    # Server mode on http://localhost:3000
npm run dev:o    # Outlet mode on http://localhost:3001
npm run dev      # Both concurrently
npm run build    # Production build → dist/
npm run typecheck  # tsc --noEmit (strict mode)
npm run lint     # eslint
```

### Environment Variables (`.env`)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
All `VITE_*` prefixed vars are exposed to the browser bundle. Never put secrets here — use Supabase Edge Functions or a backend proxy for API keys.

### Build Output
- Bundle: ~286 KB (77 KB gzip) — no recharts dependency, uses native SVG charts
- 1524 modules, TypeScript strict mode, 0 errors

### Key Dependencies
| Package            | Version  | Purpose                    |
|--------------------|----------|----------------------------|
| react              | 18.3.x   | UI framework               |
| react-router-dom   | 6.26.x   | Client-side routing        |
| zustand            | 4.5.x    | State management           |
| @supabase/supabase-js | 2.57.x | Backend client (ready, unused) |
| lucide-react       | 0.344.x  | Icon library               |
| tailwindcss        | 3.4.x    | Utility CSS                |
| concurrently       | 9.1.x    | Run dual dev servers       |

> `recharts` is listed in package.json but **not installed** — the dashboard uses native SVG charts instead. Safe to remove from package.json.

---

*Last updated: 2026-06-08*
