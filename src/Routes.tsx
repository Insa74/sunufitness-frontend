import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from './pages/Home';
import ReservationPage from './pages/Reservation';
import MemberPage from './pages/Member';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/member" element={<MemberPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;