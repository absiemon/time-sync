import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, message, Drawer } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import '../../assets/styles/home.css'

import axios from 'axios';
import { LoginOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';


function EmployeeAttendanceForm2({ onClose, open, Id, punchTime, punchLocation, todayAtten }) {

    const {user} = useStateContext();
    const { TextArea } = Input;
    const {punchOut, setPunchOut} = useStateContext();

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();

    const id = path.id
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
        if (todayAtten && todayAtten.length > 0) {
            form.resetFields();
            // console.log(todayAtten)
            // console.log(punchTime)
            // console.log(punchLocation)
            const signInDate = new Date(`2000-01-01 ${todayAtten[0]?.signin_time}`);
            const signOutDate = new Date(`2000-01-01 ${punchTime?.time}`);
            const timeDiffMillis = signOutDate.getTime() - signInDate.getTime();

            const timeDiff = Math.floor(timeDiffMillis / 1000 / 60 / 60);
            // console.log(timeDiff)

            form.setFieldsValue({
                emp_id: todayAtten[0]?.emp_id,
                signin_time: todayAtten[0]?.signin_time,
                signout_time: punchTime?.time,
                punchin_note: todayAtten[0]?.punchin_note,
                atten_date: todayAtten[0]?.atten_date,
                working_hour: timeDiff.toString(),
                place: 'office',
                location: punchLocation,
                device_info: todayAtten[0]?.device_info
            });
        }
        else {
            form.resetFields();
            const officeTime ="09:00 AM";
            const puncInTime = new Date(`2000-01-01 ${punchTime?.time}`);
            const actualTime = new Date(`2000-01-01 ${officeTime}`);
            if (puncInTime.getTime() > actualTime.getTime()) {
                form.setFieldsValue({
                    behaviour: 'late'
                })
            } 
            else if (puncInTime.getTime() < actualTime.getTime()) {
                form.setFieldsValue({
                    behaviour: 'early'
                })
            } 
            else {
                form.setFieldsValue({
                    behaviour: 'on-time'
                })
            }
            form.setFieldsValue({
                atten_date: punchTime?.date,
                place: 'office',
                emp_id: userData?.id,
                emp_name: user?.emp_name,
                signin_time: punchTime?.time,
                location: punchLocation && punchLocation,
                device_info: punchTime?.device_info
            })
        }
    }, [id, form, open]);


    const handleFinish = async () => {
        setLoading(true)
        const values = form.getFieldValue();

        try {
            if (todayAtten && todayAtten.length>0) {
                await axios.put(`http://localhost:8000/api/attendance/update-employee-attendance/${todayAtten[0].id}`, values).then((res) => {
                    setPunchOut(!punchOut)
                    setLoading(false)
                    onClose();
                    message.success('Punched out successfully');
                }).catch((err) => {
                    setLoading(false)
                    message.error('Error submitting form');
                })
            } else {
                // console.log(values)
                await axios.post('http://localhost:8000/api/attendance/create-employee-attendance', values).then((res) => {
                    setLoading(false)
                    onClose();
                    setPunchOut(!punchOut)
                    message.success('Punched in successfully');
                    // navigate.push("/employeeattendance")
                }).catch((err) => {
                    setLoading(false)
                    message.error('Error submitting form');
                })
            }
            form.resetFields();
        } catch (err) {
            message.error('Error submitting form');
        }
    };

    const handleFinishFailed = ({ errorFields }) => {
        form.scrollToField(errorFields[0].name);
    };

    return (
        <Drawer
            placement="top"
            mask={true}
            onClose={onClose}
            visible={open}
            width={100}
            height={600}
            rootClassName='attandance-drawer'
            title="Employee Attandance Form"
        >
            <div className="tabled" >
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace"
                        >
                            <div className="table-responsive" style={{ padding: "" }}>

                                <Form
                                    name="two_column_form"
                                    // onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    form={form}
                                >

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="Employee Id" name="emp_id" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="Employee Name" name="emp_name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>

                                        {todayAtten && todayAtten.length> 0 &&
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="" name="signout_time" labelAlign="left">
                                                <Card bordered={false} className="criclebox ">
                                                    <div className="number">
                                                        <Row align="middle" gutter={[30, 0]}>
                                                            <Col xs={6}>
                                                                <div className="icon-box-punch_atten"><LoginOutlined style={{ fontSize: '24px', color: '#fc6510' }} /></div>
                                                            </Col>
                                                            <Col xs={18}>
                                                                <div className='text'> Punch out time & date</div>
                                                                <div style={{ fontSize: '20px', fontWeight: '600' }}>Today ({punchTime && punchTime.time})</div>
                                                                <span>{todayAtten[0]?.atten_date.split('T')[0]}</span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            </Form.Item>
                                        </Col>}

                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="" name="signin_time" rules={[{ required: true }]} labelAlign="left">
                                                <Card bordered={false} className="criclebox ">
                                                    <div className="number">
                                                        <Row align="middle" gutter={[30, 0]}>
                                                            <Col xs={6}>
                                                                <div className="icon-box-punch_atten"><LoginOutlined style={{ fontSize: '24px', color: '#46c35f' }} /></div>
                                                            </Col>
                                                            <Col xs={18}>
                                                                <div className='text'> Punch in time & date</div>
                                                                <div style={{ fontSize: '20px', fontWeight: '600' }}>Today ({todayAtten?.length > 0 ? todayAtten[0].signin_time : (punchTime && punchTime.time)})</div>
                                                                <span> {punchTime?.date.split('T')[0]}</span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', }}>
                                            <Form.Item label="" name="location" rules={[{ required: true }]} labelAlign="left">
                                                <div className='location'>Ip address: <span style={{ color: '#8c8c8c', fontWeight: '600' }}>{punchLocation}</span></div>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row >
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', width: '100vw' }}>
                                            <Form.Item label="Punch in note" name="punchin_note" labelAlign="left">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="working_hour" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="device_info" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="atten_date" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="behaviour" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="place" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Item
                                            label=" "
                                            name=" "
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            {todayAtten && todayAtten.length> 0 ?
                                                <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "#fc6510" }} className='punch' loading={loading} onClick={handleFinish}>
                                                 Punch out
                                                 </Button>
                                            :   <Button type="primary" htmlType="submit" style={{ margin: "0px 10px",   backgroundColor: "limegreen" }} className='punch' loading={loading} onClick={handleFinish}>
                                                Punch in
                                                </Button>
                                            }

                                            <Button type="default" className='punch' style={{ backgroundColor: '#dbdbdb' }} onClick={()=> onClose()}>
                                                Cancel
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Drawer>

    );
}

export default EmployeeAttendanceForm2;
