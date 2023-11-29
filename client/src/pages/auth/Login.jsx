import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./login.css";
import { useStateContext } from "../../contexts/ContextProvider";
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
const { Title, Text } = Typography;
const { Footer, Content } = Layout;

const Login = () => {
  const { setUser } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState("password");

  const onFinish = async (values) => {
    const email = values.email;
    const password = values.password;
    // e.preventDefault();
    setLoading(true);
    // setFetch(true);
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });
      setLoading(false);
      message.success("Login Sccessful");
      setUser(res.data);

      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload();
    } catch (err) {
      setLoading(false);
      message.error(err?.response?.data?.error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Layout
        className="layout-default layout-signin"
        style={{ backgroundColor: "#272b35", height:'100vh' }}
      >
        <div
          className="mt-8 mb-4"
          style={{ textAlign: "center", fontSize: "48px", fontWeight: "400" }}
        >
          SuperDolphin
        </div>
        <Content className="signin">
          <Row gutter={[]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              // md={{ span: 12 }}
            >
              <Title className="mb-15" style={{ textAlign: "center" }}>
                Login
              </Title>
              {/* <Title className="font-regular text-muted" level={4}>
                  Enter your email and password to sign in
                </Title> */}
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input placeholder="Password" type={visible} />
                </Form.Item>

                {visible === "password" ? (
                  <EyeOutlined
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "210px",
                      cursor: "pointer",
                      color:'white'
                    }}
                    onClick={() => {
                      setVisible("text");
                    }}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "210px",
                      cursor: "pointer",
                      color:'white'
                    }}
                    onClick={() => {
                      setVisible("password");
                    }}
                  />
                )}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="punch"
                    style={{
                      backgroundColor: "rgb(3, 201, 215)",
                      width: "100%" 
                    }}
                    loading={loading}
                  >
                    Login
                  </Button>
                  
                </Form.Item>

                <Form.Item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                    marginTop: "-17px",
                  }}
                >
                  
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
        <Footer></Footer>
      </Layout>
    </>
  );
};

export default Login;
