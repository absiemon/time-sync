import React from "react";
import { useStateContext } from "./contexts/ContextProvider";
import { Navbar, Sidebar } from "./components";
const Layout = ({ children }) => {
  const { activeMenu } = useStateContext();
  return (
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
        <div style={{ background: "rgb(28, 31, 38)" }}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
