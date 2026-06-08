export const BUSINESS_NAME = "WHIZPOINT SOLUTIONS";

export const THEME = "light";

export const PIN_MAP = {
  "9999": "admin",
  "8888": "manager",
  "1234": "cashier"
} as const;

export const PIN_NAME_MAP = {
  "9999": "Admin User",
  "8888": "Manager User",
  "1234": "Cashier 1"
} as const;

export const TAX_RATE = 0.16;

export const CURRENCY = "KSH";

export const PAYMENT_METHODS = {
  CASH: 'cash',
  MPESA: 'mpesa'
} as const;

export const OUTLET_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline'
} as const;

export const SHIFT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed'
} as const;

export const TRANSFER_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered'
} as const;
