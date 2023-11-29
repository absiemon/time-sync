import React, { useContext, useEffect, useState } from "react";
import "./login2.css";
import { SiShopware } from "react-icons/si";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoLockOpenOutline } from "react-icons/io5";
import axios from "axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button, notification } from 'antd';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate()
  const { setUser } = useStateContext();
  // --------------[States]---------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false)


  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'Login Fail',
      description:
        'Please check you email and password and try again',
    });
  };

  const handlePhoneChange = (value, country)=>{
    const phone = value.split(country.dialCode)[1];
    const finalPhoneNo = '+' + country.dialCode + " " + phone;
    setPhoneNumber(finalPhoneNo);
    setPhoneInput(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/create",
        { email, password, name, phone: phoneNumber }
      ).then((res)=>{
        setLoading(false)
        window.location.reload();
        navigate("/")
      }).catch((err)=>{
        setLoading(false)

      })
     
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
                      This is a best too for managing employee information
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
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <h2 class="login_right-h2">Welcome,</h2>
                    <h2 class="login_right-h2">let's get started!</h2>
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <p class="h6 login_right-p">
                      Please create credentials to signin.
                    </p>
                  </div>
                  <div>
                    <div id="loginForm" class="tooltip-end-bottom" novalidate >
                      <div class="mb-3 filled form-group tooltip-end-top login_right-form-inp">
                        <HiOutlineEnvelope className="login_right-logo-icon-inp" />
                        <input
                          class="login_right-form-inp-input"
                          placeholder="Name"
                          name="name"
                          autoComplete="off"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                      </div>
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
                      <div class="mb-3 filled form-group tooltip-end-top login_right-form-inp">
                        <PhoneInput
                            style={{ marginBottom: '10px' }}
                            country={'in'}
                            prefix="+"
                            value={phoneInput}
                            onChange={(value, country) => handlePhoneChange(value, country)}
                            inputStyle={{
                                backgroundColor:'#292929',
                                height: "46px",
                                width: "337px",
                                color: "white",
                                border:'none'
                            }}
                            dropdownStyle={{
                                backgroundColor: "#272b35",
                                color: "white",
                                top: "-70px",
                                left: "-58px"
                            }}
                            buttonStyle={{
                                backgroundColor: "#272b35",
                                border: 'none'
                            }}
                            containerClass='phone-container'
                            searchClass='search-class'
                        />
                      </div>

                      <Button type="primary" htmlType="submit" className="punch" style={{backgroundColor: "rgb(3, 201, 215)" }} loading={loading} onClick={handleSubmit}>
                        Sign in
                      </Button>
                      <div className="mt-3 flex gap-2">
                        <p className="text-white"> Already have an account?</p>
                        <Link to={"/auth/login"} className="text-main"> login in</Link>
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

export default Register;
