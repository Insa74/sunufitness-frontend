import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import HomePage from './pages/Home';
import ServicesPage from './pages/Services';
import PaymentPage from './pages/Payment';
import ReservationPage from './pages/Reservation';
import MemberPage from './pages/Member';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
        <Route path="/member" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/about' element={<About />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;