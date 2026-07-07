import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
    <Header />
    
    <main className="main">
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
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