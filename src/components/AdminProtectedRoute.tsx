import React from 'react';
import { Navigate } from 'react-router-dom';
import { isCaisseAdmin } from '../services/caisseApiClient';

// Protège /admin et /admin/subscriptions avec la session caisse (PIN),
// distincte de l'auth membre utilisée par ProtectedRoute.
const AdminProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!isCaisseAdmin()) {
    return <Navigate to="/caisse" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
