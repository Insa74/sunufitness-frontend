import React from 'react';
import { Navigate } from 'react-router-dom';
import { isCaisseStaff } from '../services/caisseApiClient';

// Protège /coach/membres avec la session caisse (PIN), ouverte au coach
// en plus de l'admin/super_admin (contrairement à AdminProtectedRoute).
const CoachProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!isCaisseStaff()) {
    return <Navigate to="/caisse" replace />;
  }

  return children;
};

export default CoachProtectedRoute;
