
import { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  Descriptions,
  Avatar,
  Radio,
  Divider,
  Typography,
  Form,
  Input,
  DatePicker,
  message,
} from "antd";

import {

  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FilePdfOutlined,
  FolderViewOutlined,
  GiftOutlined,
  IdcardOutlined,
  PhoneOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";

import avaterImg from '../../assets/images/avatar.png'

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';

import axios from "axios";
import moment from "moment";
import ProfileLeave from "./ProfileLeave";
// import ProfileIssue from "./ProfileIssue";
// import ProfileContract from "./ProfileContract";
import { useParams } from "react-router-dom";
import './profile.css'
import ProfileDocs from "./ProfileDocs";
// import ProfileEmployeeCard from "./ProfileEmployeeCard";
import ProfileAttendance from "./ProfileAttendance";
import EmergencyContact from "./Emergency_contact";
// import ProfilePassport from "./ProfilePassport";

function Profile3() {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const path = useParams();
  // const navigate = useHistory();
  const [employee, setEmployee] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);
  // const [employeeContract, setEmployeeContract] = useState([])
  // const [empPassport, setEmpPassport] = useState({});
  const [emp, setEmp] = useState({ email: "", emp_cv: "", emp_image: "", phone: "", emp_contract: "" });
  const [user, setUser] = useState();
  const [selected, setSelected] = useState(1);

  const [genderValue, setGenderValue] = useState("Male");
  const [editOn, setEditOn] = useState(false);
  const [editLoading, setEditLoading] = useState(false)

  const onChange = (e) => {
    setGenderValue(e.target.value);
    form.setFieldsValue({
      gender: e.target.value
    })

  };

  useEffect(() => {
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if (id) {
      Id = id;
    }
    else {
      Id = userData?.userId
    }
    setUser(userData);
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:8000/api/employee/get-single-employee/${Id}`);
      setEmployee(result?.data[0]);
      setEmp({
        ...emp,
        email: result?.data[0]?.login_email,
        emp_cv: result?.data[0]?.emp_cv,
        emp_image: result?.data[0]?.emp_image,
      });

      setGenderValue(result?.data[0]?.gender)

      form.setFieldsValue({
        emp_name: result?.data[0]?.emp_name,
        login_email: result?.data[0]?.login_email,
        dob: moment(result?.data[0]?.dob),
        address: result?.data[0]?.address,
        gender: result?.data[0]?.gender,
      })
    };
    fetchData();
  }, [fetchAgain])

  // useEffect(() => {
  //   const id = path.id;
  //   const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  //   let Id;
  //   if (id) {
  //     Id = id;
  //   }
  //   else {
  //     Id = userData?.userId
  //   }
  //   setUser(userData);
  //   const fetchData = async () => {
  //     const result = await axios.get(`http://localhost:8000/api/employee-contract/get-employee-contract/${Id}`);
  //     setEmployeeContract(result.data);
  //     setEmp((prev) => {
  //       return { ...prev, emp_contract: result?.data[0]?.contract_attachment && JSON.parse(result?.data[0]?.contract_attachment)[0] }
  //     });
  //   };
  //   fetchData();
  // }, [])

  // useEffect(() => {
  //   const id = path.id;
  //   const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  //   let Id;
  //   if (id) {
  //     Id = id;
  //   }
  //   else {
  //     Id = userData?.userId
  //   }
  //   const fetchData = async () => {
  //     const result = await axios.get(`http://localhost:8000/api/passport/get/${Id}`);
  //     setEmpPassport(result.data);
  //   };
  //   fetchData();
  // }, [])


  // const handleView = (filename) => {
  //   const url = `https://vimpexltd.com/vimpexltd.com/vimpexsoftware/${filename}`;
  //   window.open(url, '_blank');
  // }

  // const handleEdit = () => {
  //   const id = path.id;
  //   const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
  //   let Id;
  //   if (id) {
  //     Id = id;
  //   }
  //   else {
  //     Id = userData?.userId
  //   }
  //   navigate.push(`/employeesform/${Id}`)
  // }

  // const diffInDate = (date) => {
  //   const currentDate = new Date(); // Current date
  //   const specificDate = new Date(date);
  //   const differenceInMilliseconds = specificDate - currentDate;

  //   // Convert milliseconds to days
  //   const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  //   return Math.abs(differenceInDays);
  // }

  const handleSave = async() => {
    const obj = {
      emp_name: form.getFieldValue('emp_name'),
      login_email: form.getFieldValue('login_email'),
      gender: form.getFieldValue('gender'),
      dob: form?.getFieldValue('dob'),
      address: form.getFieldValue('address')
    }
    setEditLoading(true)

    try {
      await axios.put(`http://localhost:8000/api/employee/update-employee/${employee?.id}`, obj);
      setEditLoading(false)
      setEditOn(false)
      setFetchAgain(!fetchAgain)

      message.success('Employee data saved successfully');
      form.resetFields();
    } catch (err) {
      setEditLoading(false)
      message.error('Error submitting form');
    }

  }

  return (
    <div className="px-9 py-9">

      <Card sx={{ maxWidth: 345 }}  bordered={false}>

        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }} className="card-content">

        <Avatar size={64} className="avatar2" shape="square" 
          src={emp.emp_image ? `https://superdolphins.com/superdolphins.com/superdolphinsltd/${emp?.emp_image}` : avaterImg} />

          <div className="avatar-info">
            <h3 className="text-2xl mb-2">{employee?.emp_name}</h3>
            <p className="text-secondary">{employee?.designation}</p>
            <p className="text-secondary">{employee?.login_email}</p>
            <p className="text-main">{employee?.role}</p>
          </div>
          <Divider type="vertical" className="devider bg-secondary" />

          <div className="mb-3">
            <div className="col-info mb-4" style={{ gap: '18px' }}>
              <IdcardOutlined  className="icon-info" />
              <div>
                <div>Department</div>
                <div>{employee?.department}</div>
              </div>
            </div>
            <div className="col-info" style={{ gap: '18px', marginTop: '10px' }}>
              <ClockCircleOutlined  className="icon-info" />
              <div>
                <div >Work shift</div>
                <div>Regular work shift</div>
              </div>
            </div>
          </div>
          <Divider type="vertical" className="devider" />

          <div className="mr-5">
            <div className="col-info mb-4" style={{ gap: '18px' }}>
              <DollarOutlined className="icon-info" />
              <div>
                <div >Salary</div>
                <div>₹ 30,000</div>
              </div>
            </div>
            <div className="col-info" style={{ gap: '18px', marginTop: '10px' }}>
              <CalendarOutlined className="icon-info" />
              <div>
                <div>Joining date</div>
                <div>{moment(employee?.joining_date).format('MMM DD, YYYY')}</div>
              </div>
            </div>
          </div>
        </CardContent>

      </Card>

      <div className="personal-details">

        <Card style={{ width: '30%', marginTop: '2rem' }} className="details-card" bordered={false}>
          <CardMedia
            sx={{ height: 140, backgroundColor: '#ecf7ff' }}
            className="card-media"
          />

          <CardContent style={{ position: 'relative' }}>
            <div className="details-card-div mb-5">
              <UserOutlined style={{ fontSize: '24px' }} className="text-main"/>
            </div>
            <div className="flex justify-between mb-5 mt-12" role="button" onClick={() => { setSelected(1) }} style={{ color: `${selected === 1 ? '#03C9D7' : '#CCCCCC'}` }}>
              <p className="h6">Personal Details</p>
              {selected === 1 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>
            
            <div className="flex justify-between mb-5" role="button" onClick={() => { setSelected(3) }} style={{ color: `${selected === 3 ? '#03C9D7' : '#CCCCCC'}` }}>
              <p className="h6">Leave</p>
              {selected === 3 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>
            <div className="flex justify-between mb-5" role="button" onClick={() => { setSelected(4) }} style={{ color: `${selected === 4 ? '#03C9D7' : '#CCCCCC'}` }}>
              <p className="h6">Documents</p>
              {selected === 4 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>
           
            <div className="flex justify-between mb-5" role="button" onClick={() => { setSelected(6) }} style={{ color: `${selected === 6 ? '#03C9D7' : '#CCCCCC'}` }}>
              <p className="h6">Attendance</p>
              {selected === 6 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>

            <div className="flex justify-between mb-5" role="button" onClick={() => { setSelected(7) }} style={{ color: `${selected === 7 ? '#03C9D7' : '#CCCCCC'}` }}>
              <p className="h6">Emergency Contact</p>
              {selected === 7 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>
            
          </CardContent>

        </Card>

        {selected=== 1 &&
        <Card style={{ width: '70%', marginTop: '2rem' }} className="details-card" bordered={false}>
          <CardMedia
            sx={{ height: 60, backgroundColor: '#ecf7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}
            className="card-media"
          >
             <p className="mt-3 text-lg">Personal Details</p>
            {!editOn ? <Button type="primary"  className="bg-main punch" onClick={() => setEditOn(true)}> Edit</Button>
              : <Button type="primary"  className="bg-main punch" onClick={handleSave} loading={editLoading}> Save</Button>}

          </CardMedia>

          <CardContent className="mt-4">
            <Form
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
              form={form}
            >
              <Form.Item
                className="username"
                label="Name"
                name="emp_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input placeholder="Name" disabled={!editOn} />
              </Form.Item>
              <Form.Item
                className="username"
                label="Email"
                name="login_email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input placeholder="Email" type="email" disabled={!editOn} />
              </Form.Item>
              <Form.Item
                className="username"
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Radio.Group size="large" onChange={onChange} value={genderValue} disabled={!editOn}>
                  <Radio value="Male" >Male</Radio>
                  <Radio value="Female">Female</Radio>

                </Radio.Group>
              </Form.Item>

              <Form.Item
                className="username"
                label="Date of birth"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "Please input your Date of birth",
                  },
                ]}
              >
                <DatePicker placeholder='dob' className="datepicker" disabled={!editOn} />
              </Form.Item>
              <Form.Item
                className="username"
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address",
                  },
                ]}
                labelAlign="left"
              >
                <Input placeholder='address' disabled={!editOn} />
              </Form.Item>

            </Form>

          </CardContent>

        </Card>}
        {selected===3 && <ProfileLeave/>}
        {selected===4 && <ProfileDocs employee={employee}/>}
        {/* {selected===5 && <ProfileEmployeeCard/>} */}
        {selected===6 && <ProfileAttendance/>}
        {selected===7 && <EmergencyContact/>}
      </div>
    </div>
  );
}

export default Profile3;
