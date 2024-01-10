import React, { useEffect, lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Home } from "./pages";
import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";
import Login from "./pages/auth/Login2.jsx";
import { Spin, message } from "antd";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import Profile2 from "./pages/profile/Profile2";

import Pipeline from "./pages/pipelines/Pipeline";
import PipelineForm from "./pages/pipelines/PipelineForm";
import Sales_pipelines from "./pages/pipeline view/Sales_pipelines";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

const Persons = lazy(() => import("./pages/persons/Persons"));
const PersonsForm = lazy(() => import("./pages/persons/PersonsForm"));
const Organization = lazy(() =>
  import("./pages/organization/Person_Organization")
);
const OrganizationForm = lazy(() =>
  import("./pages/organization/OrganizationForm")
);
const Proposal = lazy(() => import("./pages/proposal/Proposal"));
const ProposalForm = lazy(() => import("./pages/proposal/ProposalForm"));

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://timesync-2fmv.onrender.com/api';
// axios.defaults.baseURL = 'http://localhost:8000/api';

const App = () => {
  const navigate = useNavigate()
  const { setUser, user } = useStateContext();
  const { activeMenu} = useStateContext();
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
          navigate("/")
        }
        else{
          navigate("/auth/login")
        }
      })
      .catch((err) => {
        setLoading(false);
        navigate("/auth/login")
      });
  }, []);


  return (
    <>
      {isAuthenticated && user ? (
        <div className="dark:bg-main-dark-bg">
          <div
            className="sidebar fixed "
            style={{
              width: activeMenu ? "17vw" : "6vw",
              background: "#252932",
              height: "100%",
              transition: "width .25s ease-in-out",
            }}
          >
            <Sidebar />
          </div>
          <div
            className="main_section"
            style={{
              background: "#1c1f26",
              width: activeMenu ? "calc(100% - 17vw)" : "calc(100% - 6vw)",
              marginLeft: activeMenu ? "17vw" : "6vw",
              transition: "width .25s ease-in-out,margin .25s ease-in-out",
              height: "100vh",
            }}
          >
            <div
              className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full"
              style={{
                background: "#252932",
                position: "sticky",
                top: "0",
                zIndex: 1000,
              }}
            >
              <Navbar />
            </div>
            <div style={{ background: "rgb(28, 31, 38)" }}>
              <Routes >
                {/* dashboard  */}
                <Route path="/" element={<Home />} />

                <Route
                  path="/persons"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                       <Persons />
                    </Suspense>
                  }
                />
                <Route
                  path="/persons/create"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                     <PersonsForm />
                    </Suspense>
                  }
                />
                <Route
                  path="/persons/create/:id"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                      <PersonsForm />
                    </Suspense>
                  }
                />

                <Route
                  path="/organization"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                      <Organization />
                    </Suspense>
                  }
                />
                <Route
                  path="/organization/create"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                       <OrganizationForm />
                    </Suspense>
                  }
                />
                <Route
                  path="/organization/create/:id"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                     <OrganizationForm />
                    </Suspense>
                  }
                />

                <Route
                  path="/proposal"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                      <Proposal />
                    </Suspense>
                  }
                />
                <Route
                  path="/proposal/create"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                      <ProposalForm />
                    </Suspense>
                  }
                />
                <Route
                  path="/proposal/create/:id"
                  element={
                    <Suspense
                      fallback={
                        <div className="spinner_tone">
                          <Spin />
                        </div>
                      }
                    >
                       <ProposalForm />
                    </Suspense>
                  }
                />

                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/pipeline/create" element={<PipelineForm />} />
                <Route path="/pipeline/create/:id" element={<PipelineForm />} />
                <Route path="/pipeline/view" element={<Sales_pipelines />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/user/my_profile" element={<Profile2 />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </div>
      ) : loading ? (
        <LoadingPage />
      ) : (
        // <Login />
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Register />} />
          <Route path="/auth/reset_password" element={<ResetPassword />} />
          {/* <Login /> */}
        </Routes>
      )}
    </>
  );
};

export default App;
