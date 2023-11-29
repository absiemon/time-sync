import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineUser } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";

import { BiDollarCircle } from "react-icons/bi";
import {
  LuBriefcase,
  LuCalendarCheck,
  LuLayoutDashboard,
} from "react-icons/lu";
import { BsStopwatch } from "react-icons/bs";
import { TfiAnnouncement } from "react-icons/tfi";
import { FaRegHandshake } from "react-icons/fa";
import { RiExchangeDollarFill } from "react-icons/ri";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, user } =
    useStateContext();
  const location = useLocation();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 text-white text-md m-2 br-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 text-md text-gray-700 m-2 br-2";

  return (
      <>
        <div
          className="flex justify-between items-center fixed pl-2.5 sidebar_header"
          style={{
            background: "#2b303b",
            width: activeMenu ? "17vw": '6vw',
            height: "70px",
            minWidth: "17vw",
            overflow: "hidden",
            transition: 'width 0.2s ease',
          }}
        >
          <Link
            to="/"
            onClick={handleCloseSideBar}
            className="items-center gap-3 ml-3 mt-5 mb-5 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <SiShopware className="login_right-logo-icon"/> 
            <span className={`text-primary ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}>Time Sync</span>
          </Link>
        </div>

        <div
          className="mt-20 relative sidebar_content"
          style={{ minWidth: "6vw", overflow: "hidden", height:'86vh', overflowY:'scroll' }}
        >
          <NavLink
            to={`/`}
            key="home"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/" ? activeLink : normalLink} nav-link`}
          >
            <span className="p-2 bg-myblack rounded-sm">
              <LuLayoutDashboard style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm 
                  ${location.pathname === "/" ? "text-primary" : "text-secondary"}
                  ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              Home
            </span>
          </NavLink>

          {/* {user && user.role === "admin" && (
            <NavLink
              to={`/employee`}
              key="employee"
              onClick={handleCloseSideBar}
              
              className={`${location.pathname === "/employee" ? activeLink : normalLink} nav-link`}
            >
              <span className="p-2 bg-myblack rounded-sm">
                <FiUsers style={{ fontSize: "20px" }} />
              </span>
              <span
                className={`capitalize text-sm ${
                  location.pathname === "/employee"
                    ? "text-primary" : "text-secondary"
                }
                ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                All Employees
              </span>
            </NavLink>
          )}

          {user && user.role === "admin" && (
            <NavLink
              to={`/employee/designation`}
              key="designation"
              onClick={handleCloseSideBar}
              
              className={`${location.pathname === "/employee/designation" ? activeLink : normalLink} nav-link`}

            >
              <span className="p-2 bg-myblack rounded-sm">
                <AiOutlineUser style={{ fontSize: "20px" }} />
              </span>
              <span
                className={`capitalize text-sm ${
                  location.pathname === "/employee/designation"
                    ? "text-primary" : "text-secondary"
                }
                ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                Designation
              </span>
            </NavLink>
          )}

          {user && user.role === "admin" && (
            <NavLink
              to={`/employee/department`}
              key="department"
              onClick={handleCloseSideBar}
              
              className={`${location.pathname === "/employee/department" ? activeLink : normalLink} nav-link`}

            >
              <span className="p-2 bg-myblack rounded-sm">
                <LuBriefcase style={{ fontSize: "20px" }} />
              </span>
              <span
                className={`capitalize text-sm ${
                  location.pathname === "/employee/department"
                    ? "text-primary" : "text-secondary"
                }
                ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                Departments
              </span>
            </NavLink>
          )}

          <NavLink
            to={`/leave/status`}
            key="leave"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/leave/status" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <BsStopwatch style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/leave/status"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              Leave Status
            </span>
          </NavLink>

          <NavLink
            to={`/leave/requests`}
            key="leave_requests"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/leave/requests" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <BsStopwatch style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/leave/requests"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              Leave Request
            </span>
          </NavLink>

          <NavLink
            to={`/attendance/lists`}
            key="leave"
            onClick={handleCloseSideBar}

            className={`${location.pathname === "/attendance/lists" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <LuCalendarCheck style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/attendance/lists"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              Attendance lists
            </span>
          </NavLink>

          {user && user.role === "admin" && (
            <NavLink
              to={`/announcement`}
              key="announcement"
              onClick={handleCloseSideBar}
            
              className={`${location.pathname === "/announcement" ? activeLink : normalLink} nav-link`}

            >
              <span className="p-2 bg-myblack rounded-sm">
                <TfiAnnouncement style={{ fontSize: "20px" }} />
              </span>
              <span
                className={`capitalize text-sm ${
                  location.pathname === "/announcement"
                    ? "text-primary" : "text-secondary"
                }
                ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                {" "}
                Announcements
              </span>
            </NavLink>
          )} */}

          <NavLink
            to={`/pipeline`}
            key="pipeline"
            onClick={handleCloseSideBar}
           
            className={`${location.pathname === "/pipeline" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <RiExchangeDollarFill style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/pipeline"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              {" "}
              Pipeline
            </span>
          </NavLink>

          <NavLink
            to={`/pipeline/view`}
            key="pipeline/view"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/pipeline/view" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <BiDollarCircle style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/pipeline/view"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              {" "}
              Pipeline View
            </span>
          </NavLink>

          <NavLink
            to={`/persons`}
            key="persons"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/persons" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <FiUsers style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/persons"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              {" "}
              Persons
            </span>
          </NavLink>

          <NavLink
            to={`/organization`}
            key="organization"
            onClick={handleCloseSideBar}
            
            className={`${location.pathname === "/organization" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <LuBriefcase style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/organization"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              Organization
            </span>
          </NavLink>

          <NavLink
            to={`/proposal`}
            key="proposal"
            onClick={handleCloseSideBar}
            className={`${location.pathname === "/proposal" ? activeLink : normalLink} nav-link`}

          >
            <span className="p-2 bg-myblack rounded-sm">
              <FaRegHandshake style={{ fontSize: "20px" }} />
            </span>
            <span
              className={`capitalize text-sm ${
                location.pathname === "/proposal"
                  ? "text-primary" : "text-secondary"
              }
              ${!activeMenu && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              {" "}
              Proposal list
            </span>
          </NavLink>
        </div>
      </>
  );
};

export default Sidebar;
