import React, { useContext, useEffect, useState } from "react";
import "./login2.css";
import { SiShopware } from "react-icons/si";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoLockOpenOutline } from "react-icons/io5";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, notification } from 'antd';
import { Link } from "react-router-dom";

const Login2 = () => {


  const { setUser } = useStateContext();
  // --------------[States]---------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)


  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'Login Fail',
      description:
        'Please check you email and password and try again',
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(
        "/auth/login",
        { email, password }
      );
      setLoading(false)
      window.location.reload();
    } catch (err) {
      setLoading(false)
      openNotificationWithIcon('error')
    }
  };

  useEffect(() => {
    document.body.classList.add("spinner")
    setTimeout(() => {
      document.body.classList.remove("spinner")
    }, 2000);
  }, []);


  return (
    <>
      {contextHolder}
      <div className="login">
        <div className="fixed-background"></div>
        <div className="login_container">
          <div className="login_row">
            {/* ------------Left side ------------- */}

            <div className="login_left">
              <div className="min-h-100 d-flex align-items-center login_left-flex">
                <div class="login_left-a">
                  <div>
                    <div style={{ marginBottom: "2rem" }}>
                      <h1 className="display-3 text-white login_left-h1">
                        Time Sync
                      </h1>
                    </div>
                    <p className="h6 text-white lh-1-5 mb-5 login_left-p">
                      This is a best tool for managing employee information
                      and their activity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------Left side end ------------- */}

            <div class="login_right">
              <div class="login_right-container sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
                <div class="sw-lg-50 px-5 login_right-content">
                  <div class="sh-11 login_right-logo">
                    <div className="login_right-logo-a">
                      <SiShopware className="login_right-logo-icon" />{" "}
                      <span>Time Sync</span>
                    </div>
                    <p style={{ color: "rgb(3, 201, 215)", fontSize: "12px", margin:"5px 0px 0px 46px"}}>
                      Best tool for managing Deals information
                      and their activity.
                    </p>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    <h2 class="login_right-h2">Welcome,</h2>
                    <h2 class="login_right-h2">let's get started!</h2>
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <p class="h6 login_right-p">
                      Please use your credentials to login.
                    </p>
                  </div>
                  <div>
                    <div id="loginForm" class="tooltip-end-bottom" novalidate >
                      <div class="mb-3 filled form-group tooltip-end-top login_right-form-inp">
                        <HiOutlineEnvelope className="login_right-logo-icon-inp" />
                        <input
                          class="login_right-form-inp-input"
                          placeholder="Email"
                          name="email"
                          autoComplete="off"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>
                      <div class="mb-3 filled form-group tooltip-end-top login_right-form-inp">
                        <IoLockOpenOutline className="login_right-logo-icon-inp" />
                        <input
                          class="login_right-form-inp-input"
                          name="password"
                          type="password"
                          placeholder="Password"
                          autoComplete="off"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button type="primary" htmlType="submit" className="punch" style={{backgroundColor: "rgb(3, 201, 215)" }} loading={loading} onClick={handleSubmit}>
                        Login
                      </Button>

                      <div className="mt-3 flex gap-2">
                        <p className="text-white"> Forget password?</p>
                        <Link to={"/auth/reset_password"} className="text-main"> reset</Link>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <p className="text-white"> Not have an account?</p>
                        <Link to={"/auth/signup"} className="text-main"> Sign up</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Right Side End --> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login2;
