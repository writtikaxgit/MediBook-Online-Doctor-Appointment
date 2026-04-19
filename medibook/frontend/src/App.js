import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import Toast    from './components/Toast';
import './index.css';

// Lazy-load pages
const Home              = React.lazy(() => import('./pages/Home'));
const Login             = React.lazy(() => import('./pages/Login'));
const Register          = React.lazy(() => import('./pages/Register'));
const Doctors           = React.lazy(() => import('./pages/Doctors'));
const BookAppointment   = React.lazy(() => import('./pages/BookAppointment'));
const PatientDashboard  = React.lazy(() => import('./pages/PatientDashboard'));
const DoctorDashboard   = React.lazy(() => import('./pages/DoctorDashboard'));
const AdminDashboard    = React.lazy(() => import('./pages/AdminDashboard'));

const Loader = () => (
  <div className="spinner-wrap">
    <div className="spinner" />
  </div>
);

/* Route guard */
const Protected = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin')  return <AdminDashboard />;
  if (user.role === 'doctor') return <DoctorDashboard />;
  return <PatientDashboard />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/doctors"  element={<Doctors />} />
          <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/book/:id" element={<Protected><BookAppointment /></Protected>} />
          <Route path="/dashboard" element={<Protected><DashboardRouter /></Protected>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toast />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
