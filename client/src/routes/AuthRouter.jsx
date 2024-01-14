import React from "react";
import { Routes, Route } from "react-router-dom";

import "../App.css";

import Login from "../pages/auth/Login2.jsx";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";

const AuthRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Register />} />
        <Route path="/auth/reset_password" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default AuthRoutes;
