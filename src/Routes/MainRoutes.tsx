import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Collection from "../pages/collection/Collection";
import DetailProduct from "../pages/detail-product/DetailProduct";
import Home from "../pages/home/Home";
import Search from "../pages/search/Search";
import SignUp from "../pages/signup/SignUp";
import Login from "../pages/login/Login";
import { useAppSelector } from "../hooks/useAppSelector";
import About from "../pages/about/About";
import Checkout from "../pages/checkout/Checkout";

const MainRoutes = () => {
  const user = useAppSelector((state) => state.user.userName)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:collection/:category" element={<Collection />} />
      <Route path="/:collection/:category/:id" element={<DetailProduct/>} />
      <Route path="search" element={<Search />}/>
      <Route path="about" element={<About />} />
      <Route path="checkout" element={<Checkout/>}/>
      <Route path='login' element={user?<Navigate to='/' replace/>:<Login />}/>
      <Route path='signup' element={user?<Navigate to='/' replace/>:<SignUp />}/>
    </Routes>
  );
};

export default MainRoutes;
