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
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import About from './pages/About';
import AdminDashboard from './pages/Admin';
import AdminSubscriptions from './pages/Admin/Subscriptions';
import AdminCoaches from './pages/Admin/Coaches';
import AdminSchedule from './pages/Admin/Schedule';
import CaissePage from './pages/Caisse';
import ScanPage from './pages/Scan';
import MyQrPage from './pages/MyQr';


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/subscriptions" element={<AdminProtectedRoute><AdminSubscriptions /></AdminProtectedRoute>} />
        <Route path="/admin/coaches" element={<AdminProtectedRoute><AdminCoaches /></AdminProtectedRoute>} />
        <Route path="/admin/schedule" element={<AdminProtectedRoute><AdminSchedule /></AdminProtectedRoute>} />
        <Route path="/caisse" element={<CaissePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/reservation" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
        <Route path="/member" element={<ProtectedRoute><MemberPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path='/about' element={<About />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/mon-qr/:token" element={<MyQrPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;