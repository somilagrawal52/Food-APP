import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Restaurants from "./pages/Restaurants";
import Restaurant from "./pages/Restaurant";
import Food from "./pages/Food";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import { getAuth } from "./lib/api";

function RootRoute() {
  const auth = getAuth();
  if (auth?.user?.userType === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Home />;
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/food/:id" element={<Food />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Layout>
  );
}

export default App;
