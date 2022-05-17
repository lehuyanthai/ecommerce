import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { useAppSelector } from "../hooks/useAppSelector";
import About from "../pages/about/About";
import AddProduct from "../pages/add-product/AddProduct";
import Admin from "../pages/admin/Admin";
import Checkout from "../pages/checkout/Checkout";
import Collection from "../pages/collection/Collection";
import Dashboard from "../pages/dashboard/Dashboard";
import DetailProduct from "../pages/detail-product/DetailProduct";
import EditProduct from "../pages/edit-product/EditProduct";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Orders from "../pages/orders/Orders";
import Products from "../pages/products/Products";
import PurchaseHistory from "../pages/purchase-history/PurchaseHistory";
import Search from "../pages/search/Search";
import SignUp from "../pages/signup/SignUp";
import Users from "../pages/users/Users";

const MainRoutes = () => {
  const user = useAppSelector((state) => state.user.userEmail);
  const isAdmin = user === "admin@gmail.com";
  if (isAdmin)
    return (
      <Routes>
        <Route path="/" element={<Admin />}>
          <Route index element={<Dashboard/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/addproduct" element={<AddProduct/>} />
          <Route path="/products/:id" element={<EditProduct/>} />
          <Route path="/users" element={<Users/>} />
          <Route path="/orders" element={<Orders/>} />
        </Route>
      </Routes>
    );
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:collection/:category" element={<Collection />} />
        <Route path="/:collection/:category/:id" element={<DetailProduct />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="history" element={user?<PurchaseHistory />:<Navigate to="/" replace />} />
        <Route
          path="login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="signup"
          element={user ? <Navigate to="/" replace /> : <SignUp />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default MainRoutes;
