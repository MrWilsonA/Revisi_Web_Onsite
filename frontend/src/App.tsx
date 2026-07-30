import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCreateIceCream from './pages/admin/AdminCreateIceCream';
import AdminTransactions from './pages/admin/AdminTransactions';

// Customer
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerShop from './pages/customer/CustomerShop';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerHistory from './pages/customer/CustomerHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create" element={<AdminCreateIceCream />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="shop" replace />} />
          <Route path="shop" element={<CustomerShop />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="history" element={<CustomerHistory />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;