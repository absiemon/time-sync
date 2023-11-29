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
  EnvironmentOutlined,
  FilePdfOutlined,
  FolderViewOutlined,
  GiftOutlined,
  PhoneOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';

import axios from "axios";
import moment from "moment";
import avaterImg from '../../assets/images/avatar.png'

import { useParams } from "react-router-dom";
import './profile.css'
import { useStateContext } from "../../contexts/ContextProvider";

function Profile2() {
  const { Text } = Typography;
  const {user} = useStateContext();
  const [form] = Form.useForm();
  const [employee, setEmployee] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

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

    const fetchData = async () => {
      const result = await axios.get(`http://localhost:8000/api/auth/${user?.emp_id}/get`);
      const data = result?.data.data[0];
      setEmployee(data);
      setGenderValue(data.gender)
      
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        dob: moment(data.dob),
        address: data.address,
        gender: data.gender,
      })
    };
    fetchData();
  }, [fetchAgain])


  const handleSave = async() => {
    const obj = {
      name: form.getFieldValue('name'),
      email: form.getFieldValue('email'),
      gender: form.getFieldValue('gender'),
      dob: form?.getFieldValue('dob'),
      address: form.getFieldValue('address')
    }
    setEditLoading(true)

    try {
      await axios.put(`http://localhost:8000/api/auth/${employee?.emp_id}/update`, obj);
      setEditLoading(false)
      setEditOn(false)
      setFetchAgain(!fetchAgain)

      message.success('User data saved successfully');
      form.resetFields();
    } catch (err) {
      setEditLoading(false)
      message.error('Error submitting form');
    }

  }


  return (
    <div className="px-9 py-9">
      <Card sx={{ maxWidth: 345 }} bordered={false}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }} className="card-content">
          <Avatar size={64} className="avatar2" shape="square" 
          src={employee?.emp_image ? `https://time-sync.s3.ap-south-1.amazonaws.com/${employee?.emp_image}` : avaterImg} />

          <div className="avatar-info">
            <h3 className="text-2xl mb-2">{employee?.name}</h3>
            <p className="text-secondary">{employee?.email}</p>
            <p className="text-main">{employee?.emp_id}</p>
          </div>
          <Divider type="vertical" className="devider bg-secondary" />

          <div className="mb-3">
            <div className="col-info mb-4" style={{ gap: '10px' }}>
              <PhoneOutlined className="icon-info" />
              <div>
                <div >Contact</div>
                <div>{employee?.phone}</div>
              </div>
            </div>
            <div className="col-info" style={{ gap: '10px', marginTop: '10px' }}>
              <EnvironmentOutlined className="icon-info" />
              <div>
                <div >Address</div>
                <div>{
                employee?.address && employee?.address.length>0 ? 
                employee?.address 
                : 
                <p className="text-secondary">Not added yet</p>
                }
                </div>
              </div>
            </div>
          </div>
          <Divider type="vertical" className="devider bg-secondary" />

          <div className="mr-5">
            <div className="col-info mb-4" style={{ gap: '10px' }}>
              <CalendarOutlined className="icon-info" />
              <div>
                <div >Joined at</div>
                <div>{moment(employee?.created_at).format('MMM DD, YYYY')}</div>
              </div>
            </div>
            <div className="col-info" style={{ gap: '10px', marginTop: '10px' }}>
              <GiftOutlined className="icon-info" />
              <div>
                <div >Date of birth</div>
                <div>{employee?.dob ? 
                  moment(employee.dob).format('MMM DD, YYYY')
                  :
                  <p className="text-secondary">Not added yet</p>
                }
              </div>
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
            title="green iguana"
          />

          <CardContent style={{ position: 'relative' }}>
            <div className="details-card-div mb-5">
              <UserOutlined style={{ fontSize: '24px' }} />
            </div>
            <div className="flex justify-between my-12 cursor-pointer" role="button" onClick={() => { setSelected(1) }} style={{ color: `${selected === 1 ? '#03C9D7' : 'black'}` }}>
              <p className="h6">Personal Details</p>
              {selected === 1 && <RightOutlined style={{ marginBottom: '4px' }} />}
            </div>

          </CardContent>

        </Card>

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
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input  disabled={!editOn} />
              </Form.Item>
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
                <Input  type="email" disabled={!editOn} />
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
                <DatePicker className="datepicker" disabled={!editOn} />
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
                <Input  disabled={!editOn} />
              </Form.Item>

            </Form>

          </CardContent>

        </Card>
      </div>
    </div>
  );
}

export default Profile2;
