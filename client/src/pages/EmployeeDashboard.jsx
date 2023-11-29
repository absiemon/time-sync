import { FieldTimeOutlined, LoadingOutlined, LoginOutlined } from "@ant-design/icons";
import { Col, Divider } from "antd";
import React, { useEffect } from "react";
import "./employees/style.css";
import { useStateContext } from "../contexts/ContextProvider";
import moment from "moment";
import Announcement from "./announcement/Announcement";

function EmployeeDashboard({todayAtten, allData}) {
    const {  user } = useStateContext();
    
    useEffect(()=>{
        console.log(todayAtten)
    },[])

    const getCurrentTimePeriod = ()=> {
        const currentTime = moment();
        const morningStart = moment('06:00:00', 'HH:mm:ss');
        const afternoonStart = moment('12:00:00', 'HH:mm:ss');
        const eveningStart = moment('17:00:00', 'HH:mm:ss');
        const nightStart = moment('22:00:00', 'HH:mm:ss');
      
        if (currentTime.isBetween(morningStart, afternoonStart)) {
          return 'Morning';
        } else if (currentTime.isBetween(afternoonStart, eveningStart)) {
          return 'Afternoon';
        } else if (currentTime.isBetween(eveningStart, nightStart)) {
          return 'Evening';
        } else {
          return 'Night';
        }
    }
    const getBehaviour = ()=>{
        const currentTime = moment();
        const nineAM = moment('09:00:00', 'HH:mm:ss');
        if(currentTime.isAfter(nineAM)){
            return 'late';
        }
        else if(currentTime.isSame(nineAM)){
            return 'on time';
        }
        else{
            return 'early';
        }
    }

  return (
    <div className="mt-4">
      <div className="flex gap-4 info_tab">
        <div style={{ width: "65%" }} className="info_tab_one">
          {/* first half */}
          <div bordered={false} className="cardbg rounded-sm px-6 py-6">
            <header className="flex gap-40 relative">
              <div>
                <p className="text-primary">Hi, {user?.emp_name}</p>
                <p className="text-primary text-xl">
                  Good {getCurrentTimePeriod()}!{" "}
                  <span className="text-base ">you are {(todayAtten && todayAtten.length>0) ? todayAtten[0]?.behaviour : getBehaviour()} today!</span>
                </p>
              </div>
              <div
                className="bg-main px-4 h-8 flex items-center rounded-l-md absolute"
                style={{ right: "-23px" }}
              >
                {" "}
                {(todayAtten && todayAtten.length>0) ? todayAtten[0]?.behaviour.charAt(0).toUpperCase() + todayAtten[0]?.behaviour.slice(1) : getBehaviour()}
              </div>
            </header>
            <footer className="flex mt-12 info_tab_footer">
              <div className="flex gap-3">
                <div className="icon-box-punch">
                  <LoginOutlined
                    style={{ fontSize: "24px", color: "#46c35f" }}
                  />
                </div>
                <Col xs={18} className="mt-2">
                  <div>{(todayAtten && todayAtten.length>0) ? todayAtten[0]?.signin_time : "Not yet"}</div>
                  <div className="text-secondary"> Punch in time</div>
                </Col>
              </div>
              <div className="flex gap-3">
                <div className="icon-box-punch">
                  <LoginOutlined
                    style={{ fontSize: "24px", color: "#fc6510" }}
                  />
                </div>
                <Col xs={18} className="mt-2">
                    <div>{(todayAtten && todayAtten.length>0 && todayAtten[0]?.signout_time) ? todayAtten?.signout_time  : "Not yet"}</div>
                  <div className="text-secondary"> Punch out time</div>
                </Col>
              </div>
            </footer>
          </div>

          <div className="flex gap-5 mt-4 card_level">
            {/* card Level-1 */}
            <div className=" flex cardbg rounded-sm px-6 py-6 gap-3 card_level_box" style={{width:'50%'}}>
              {/* card-1 */}
              <div>
                <p className="text-xl">24</p>
                <p className="text-sm">Total leave allowance</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-main rounded-sm"></p>
                  <p>paid-12</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-green-500 rounded-sm"></p>
                  <p>Un paid-12</p>
                </div>
              </div>
            </div>

            <div className=" flex cardbg rounded-sm px-6 py-6 gap-3 card_level_box" style={{width:'50%'}}>
              {/* card-2 */}
              <div>
                <p className="text-xl">0</p>
                <p className="text-sm">Total leave taken</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-main rounded-sm"></p>
                  <p>paid- 0</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-green-500 rounded-sm"></p>
                  <p>Un paid- 0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-5 mt-4 card_level">
            {/* card level-2 */}
            <div className=" flex cardbg rounded-sm px-6 py-6 gap-3 card_level_box" style={{width:'50%'}}>
              {/* card-1 */}
              <div>
                <p className="text-xl">24</p>
                <p className="text-sm">Total leave available</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-main rounded-sm"></p>
                  <p>paid- 12</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-green-500 rounded-sm"></p>
                  <p>Un paid- 12</p>
                </div>
              </div>
            </div>

            <div className=" flex cardbg rounded-sm px-6 py-6 gap-3 card_level_box" style={{width:'50%'}}>
              {/* card-2 */}
              <div>
                <p className="text-xl">0</p>
                <p className="text-sm">Leave request pending</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-main rounded-sm"></p>
                  <p>paid- 0</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="h-3 w-3 bg-green-500 rounded-sm"></p>
                  <p>Un paid- 0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cardbg rounded-sm info_tab_one" style={{ width: "40%" }}>
          {/* second half(Time log) */}
          <header className="px-2 py-2 text-xl"> Time log</header>
          <Divider className="bg-secondary" />
          <div className="px-6 py-6">
            <header className="text-lg">Today</header>
            <Divider className="bg-secondary divider" />
            <div className="flex gap-8">
              <div className="text-sm">
                <p>{(todayAtten && todayAtten.length>0 && todayAtten[0]?.working_hour) ? todayAtten[0].working_hour : "0 hours"}</p>
                <p>worked</p>
              </div>
              <div className="text-sm">
              <p>{(todayAtten && todayAtten.length>0 && todayAtten[0]?.break_time) ? todayAtten[0].break_time : "00:00"}</p>
                <p>Break</p>
              </div>
            </div>
            <header className="text-lg mt-6">This month</header>
            <Divider className="bg-secondary divider" />

            <div className=" flex cardbg rounded-sm items-center gap-4">
              <div
                className="h-12 w-12 flex justify-center items-center rounded-sm"
                style={{ backgroundColor: "#03C9D7" }}
              >
                <FieldTimeOutlined className="text-2xl" />
              </div>
              <div>
                <p className="text-xl">{allData ? allData?.total_hours: <LoadingOutlined />} h</p>
                <p className="text-sm">Total worked</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <Announcement/>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
