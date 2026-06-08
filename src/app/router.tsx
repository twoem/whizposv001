import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/auth/Login';

// Server Pages
import { Dashboard } from '../pages/server/Dashboard';
import { Inventory as ServerInventory } from '../pages/server/Inventory';
import { Suppliers } from '../pages/server/Suppliers';
import { Transfers } from '../pages/server/Transfers';
import { Outlets } from '../pages/server/Outlets';
import { Users } from '../pages/server/Users';
import { Reports } from '../pages/server/Reports';
import { Expenses as ServerExpenses } from '../pages/server/Expenses';
import { Settings as ServerSettings } from '../pages/server/Settings';

// Outlet Pages
import { POS } from '../pages/outlet/POS';
import { Shift } from '../pages/outlet/Shift';
import { History } from '../pages/outlet/History';
import { Inventory as OutletInventory } from '../pages/outlet/Inventory';
import { Expenses as OutletExpenses } from '../pages/outlet/Expenses';
import { Sync } from '../pages/outlet/Sync';
import { Settings as OutletSettings } from '../pages/outlet/Settings';

import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export const Router = () => {
  const { isAuthenticated, mode } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {mode === 'server' ? (
        <>
          <Route path="/server/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/server/inventory" element={<ProtectedRoute><ServerInventory /></ProtectedRoute>} />
          <Route path="/server/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
          <Route path="/server/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
          <Route path="/server/outlets" element={<ProtectedRoute><Outlets /></ProtectedRoute>} />
          <Route path="/server/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/server/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/server/expenses" element={<ProtectedRoute><ServerExpenses /></ProtectedRoute>} />
          <Route path="/server/settings" element={<ProtectedRoute><ServerSettings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/server/dashboard" />} />
        </>
      ) : (
        <>
          <Route path="/outlet/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
          <Route path="/outlet/shift" element={<ProtectedRoute><Shift /></ProtectedRoute>} />
          <Route path="/outlet/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/outlet/inventory" element={<ProtectedRoute><OutletInventory /></ProtectedRoute>} />
          <Route path="/outlet/expenses" element={<ProtectedRoute><OutletExpenses /></ProtectedRoute>} />
          <Route path="/outlet/sync" element={<ProtectedRoute><Sync /></ProtectedRoute>} />
          <Route path="/outlet/settings" element={<ProtectedRoute><OutletSettings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/outlet/pos" />} />
        </>
      )}
    </Routes>
  );
};
