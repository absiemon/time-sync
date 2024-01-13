import React, { lazy, Suspense} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "../App.css";

import { Spin } from "antd";

const Login = lazy(() => import("../pages/auth/Login2.jsx"));
const Register = lazy(() => import("../pages/auth/Register"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:8000/api';

const AuthRoutes = () => {
  return (
    <>
      <Routes>
        <Route
          path="/auth/login"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/auth/reset_password"
          element={
            <Suspense
              fallback={
                <div className="spinner_tone">
                  <Spin />
                </div>
              }
            >
              <ResetPassword />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};

export default AuthRoutes;
