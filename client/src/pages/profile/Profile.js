/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Avatar,
} from "antd";

import {

  FilePdfOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";

import BgProfile from "../../assets/images/bg-profile.jpg";

import axios from "axios";
import moment from "moment";
import ProfileLeave from "./ProfileLeave";
import ProfileIssue from "./ProfileIssue";
import ProfileContract from "./ProfileContract";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

function Profile() {
  const path = useParams();
  const navigate = useHistory();
  const [employee, setEmployee] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [employeeContract, setEmployeeContract] = useState([])
  const [empPassport, setEmpPassport] = useState({});
  const [emp, setEmp] = useState({ email: "", emp_cv: "", emp_image: "", phone: "", emp_contract:"" });
  const [user, setUser] = useState();

  useEffect(() => {
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if(id){
      Id = id;
    }
    else{
      Id = userData?.userId
    }
    setUser(userData);
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:8000/api/employee/get-single-employee/${Id}`);
      setFetchAgain(!fetchAgain)
      setEmployee(result?.data[0]);
      setEmp({
        ...emp,
        email: result?.data[0]?.email && JSON.parse(result?.data[0]?.email).key,
        emp_cv: result?.data[0]?.emp_cv && JSON.parse(result?.data[0]?.emp_cv)[0],
        emp_image: result?.data[0]?.emp_image && JSON.parse(result?.data[0]?.emp_image)[0],
        phone: result?.data[0]?.phone && JSON.parse(result?.data[0]?.phone).key
      });
    };
    fetchData();
  }, [])

  useEffect(()=>{
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if(id){
      Id = id;
    }
    else{
      Id = userData?.userId
    }
      setUser(userData);
      const fetchData = async () => {
        const result = await axios.get(`http://localhost:8000/api/employee-contract/get-employee-contract/${Id}`);
        setEmployeeContract(result.data);
        setEmp((prev)=>{
          return {...prev, emp_contract: result?.data[0]?.contract_attachment && JSON.parse(result?.data[0]?.contract_attachment)[0]}
        });
      };
      fetchData();
  }, [])

  useEffect(()=>{
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if(id){
      Id = id;
    }
    else{
      Id = userData?.userId
    }
      const fetchData = async () => {
        const result = await axios.get(`http://localhost:8000/api/passport/get/${Id}`);
        setEmpPassport(result.data);
      };
      fetchData();
  }, [])


  const handleView = (filename) => {
    const url = `https://vimpexltd.com/vimpexltd.com/vimpexsoftware/${filename}`;
    window.open(url, '_blank');
  }

  const handleEdit = ()=>{
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if(id){
      Id = id;
    }
    else{
      Id = userData?.userId
    }
    navigate.push(`/employeesform/${Id}`)
  }

  const diffInDate = (date) => {
    const currentDate = new Date(); // Current date
    const specificDate = new Date(date);
    const differenceInMilliseconds = specificDate - currentDate;
    
    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    return Math.abs(differenceInDays);
  }
 

  const pencil = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
        className="fill-gray-7"
      ></path>
      <path
        d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
        className="fill-gray-7"
      ></path>
    </svg>,
  ];
  

  return (
    <>
      <div
        className="profile-nav-bg"
        style={{ backgroundImage: "url(" + BgProfile + ")" }}
      ></div>

      <Card
        className="card-profile-head"
        bodyStyle={{ display: "none" }}
        title={
          <Row justify="space-between" align="middle" gutter={[24, 0]}>
            <Col span={24} md={12} className="col-info">
              <Avatar.Group>
                <Avatar size={74} shape="square" src={`https://vimpexltd.com/vimpexltd.com/vimpexsoftware/${emp?.emp_image}`} />

                <div className="avatar-info">
                  <h4 className="font-semibold m-0">{employee?.emp_name}</h4>
                  <p>{employee?.designation}</p>
                </div>
              </Avatar.Group>
            </Col>
            {/* <Col
              span={24}
              md={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">OVERVIEW</Radio.Button>
                <Radio.Button value="b">TEAMS</Radio.Button>
                <Radio.Button value="c">PROJECTS</Radio.Button>
              </Radio.Group>
            </Col> */}
          </Row>
        }
      ></Card>

      <Row gutter={[24, 0]}>

        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Profile Information</h6>}
            className="header-solid h-full card-profile-information"
            extra={<Button type="link" onClick={handleEdit}>{pencil}</Button>}
            style={{ width: '74vw' }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16, }}
          >
            
            <hr className="my-18" />
            <div style={{ display: "flex" }}>

              <Descriptions title="">

                <Descriptions.Item label="Full Name" span={3}>
                  {employee?.emp_name}
                </Descriptions.Item>
                <Descriptions.Item label="Mobile" span={3}>
                  {emp?.phone}
                </Descriptions.Item>
                
              </Descriptions>
              <Descriptions>
              <Descriptions.Item label="Email" span={3}>
                  {emp?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Location" span={3}>
                  {employee?.address}
                </Descriptions.Item>
                
              </Descriptions>
            </div>

          </Card>
        </Col>

      </Row>

      <Row gutter={[24, 0]}>

        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Employee Details</h6>}
            className="header-solid h-full card-profile-information"
            style={{ width: '74vw' }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16, }}
          >
            
            <hr className="my-18" />
            <div style={{ display: "flex" }}>

              <Descriptions title="">
                <Descriptions.Item label="Department" span={3}>
                  {employee?.department}
                </Descriptions.Item>
                <Descriptions.Item label="Designation" span={3}>
                  {employee?.designation}
                </Descriptions.Item>
                <Descriptions.Item label="Joining Date" span={3}>
                  {moment(employee?.joining_date).format('MMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Service term" span={3}>
                  {diffInDate(employee?.joining_date)} days
                </Descriptions.Item>
              </Descriptions>

              <Descriptions>
                <Descriptions.Item label="Employee CV" span={3}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height:'30px', width:'200px', backgroundColor:'#e6e6e6', padding: '10px', borderRadius:'6px', }}>
                      <FilePdfOutlined />
                      <div>{emp?.emp_cv}</div>
                      <FolderViewOutlined style={{ cursor: 'pointer' }} onClick={()=>handleView(emp?.emp_cv)} />
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Employee Contract" span={3}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height:'30px', width:'200px', backgroundColor:'#e6e6e6', padding: '10px', borderRadius:'6px', }}>
                      <FilePdfOutlined />
                      <div>{emp?.contract_attachment}</div>
                      <FolderViewOutlined style={{ cursor: 'pointer' }} onClick={()=>handleView(emp?.contract_attachment)} />
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="Contract validity" span={3}>
                  {employeeContract.length>0 && moment(employeeContract[0]?.last_date).format('MMM DD, YYYY')}
                </Descriptions.Item>
                
              </Descriptions>
            </div>

          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>

        <Col span={24} md={8} className="mb-24">
          <Card
            bordered={false}
            title={<h6 className="font-semibold m-0">Personal Information</h6>}
            className="header-solid h-full card-profile-information"
            style={{ width: '74vw' }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 16, }}
          >
            
            <hr className="my-18" />
            <div style={{ display: "flex" }}>

              <Descriptions title="">

                <Descriptions.Item label="Passport Id" span={3}>
                  {empPassport?.passport_id}
                </Descriptions.Item>
                <Descriptions.Item label="Passport Issue Date" span={3}>
                  {empPassport?.passport_issued && moment(empPassport.passport_issued).format('MMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Passport Expiry Date" span={3}>
                  {empPassport?.passport_expired && moment(empPassport.passport_expired).format('MMM DD, YYYY')}
                </Descriptions.Item>
                
                <Descriptions.Item label="FromC Id" span={3}>
                  {empPassport?.formc_id}
                </Descriptions.Item>
                <Descriptions.Item label="FromC Issue Date" span={3}>
                  {empPassport?.formc_issued && moment(empPassport.formc_issued).format('MMM DD, YYYY')}
                </Descriptions.Item>
                
              </Descriptions>
              <Descriptions>
                  <Descriptions.Item label="FromC Expiry Date" span={3}>
                    {empPassport?.formc_expired && moment(empPassport.formc_expired).format('MMM DD, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Visa Id" span={3}>
                    {empPassport?.visa_id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Visa Issue Date" span={3}>
                    {empPassport?.visa_issued && moment(empPassport.visa_issued).format('MMM DD, YYYY')}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label="Visa Expiry Date" span={3}>
                    {empPassport?.visa_expired  && moment(empPassport.visa_expired).format('MMM DD, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="DOB" span={3}>
                  {employee?.dob && moment(employee.dob).format('MMM DD, YYYY')}
                  </Descriptions.Item>
                
              </Descriptions>
            </div>

          </Card>
        </Col>

      </Row>

      <Card
        bordered={false}
        className="header-solid mb-24"
        title={
          <>
            <h6 className="font-semibold">Employee Leave</h6>
          </>
        }
      >
        <div style={{ display: "flex" }}>

          <Descriptions title="Leave details">

            <Descriptions.Item label="Remaining Annual Leave" span={3}>
              {employee?.annual_leave}
            </Descriptions.Item>
            <Descriptions.Item label="Remaining Medical Leave" span={3}>
              {employee?.medical_leave}
            </Descriptions.Item>
            <Descriptions.Item label="Remaining Casula Leave" span={3}>
              {employee?.casual_leave}
            </Descriptions.Item>
            
          </Descriptions>
          
        </div>
      </Card>
      <ProfileLeave />
      <ProfileIssue />
      {/* <ProfileContract /> */}
    </>
  );
}

export default Profile;
