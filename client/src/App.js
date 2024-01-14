import React, { useEffect, useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

import { Footer } from "./components/index.jsx";
import Layout from "./Layout.jsx";
import LoadingPage from "./LoadingPage.js";
import AuthRoutes from "./routes/AuthRouter.jsx";
import GeneralRoutes from "./routes/GeneralRouter.jsx";

import { useStateContext } from "./contexts/ContextProvider.js";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://timesync-2fmv.onrender.com/api';
// axios.defaults.baseURL = "http://localhost:8000/api";

const App = () => {
  const navigate = useNavigate();
  const { setUser, user } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/auth/profile")
      .then((res) => {
        setLoading(false);
        if (res.data.login_status) {
          setIsAuthenticated(true);
          setUser(res.data?.user);
          const user = localStorage.getItem("user");
          if (!user) {
            localStorage.setItem("user", res.data?.user);
            navigate("/");
          }
        } else {
          navigate("/auth/login");
        }
      })
      .catch((err) => {
        setLoading(false);
        navigate("/auth/login");
      });
  }, []);

  return (
    <>
      {isAuthenticated && user ? (
        <Layout>
          <GeneralRoutes />
          <Footer />
        </Layout>
      ) : loading ? (
        <LoadingPage />
      ) : (
        <AuthRoutes />
      )}
    </>
  );
};

export default App;
