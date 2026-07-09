import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";
import MobileBottomNav from "./components/MobileBottomNav";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Header />
      <MobileBottomNav />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin-login" element={<Login />} />

          <Route path="/login" element={<Navigate to="/admin-login" />} />
          <Route path="/register" element={<Navigate to="/" />} />

          <Route path="/my-orders" element={<MyOrders />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;