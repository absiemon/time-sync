import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, message, Drawer, TimePicker, DatePicker } from "antd";
import { } from "react-router-dom";
import { Select } from 'antd';
import '../../assets/styles/home.css'

import axios from 'axios';
// import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useStateContext } from '../../contexts/ContextProvider';


function EmployeeAttendanceForm({ onClose, open, Id, setFetchAgain, fetchAgain }) {

    const [form] = Form.useForm();
    const { user } = useStateContext();

    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([])


    useEffect(() => {

        if (Id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/attendance/get-single-employee-attendance/${Id}`);
                    const data = res.data[0];
                    console.log(data)
                    form.setFieldsValue({
                        emp_id: data.emp_id,
                        emp_name: data.emp_name,
                        atten_date: moment(data.atten_date),
                        signin_time: moment(data?.signin_time, 'h:mm A'),
                        signout_time: moment(data?.signout_time, 'h:mm A'),
                        working_hour: data?.working_hour,
                        behaviour: data?.behaviour,
                        punchin_note: data?.punchin_note,
                    });
                } catch (err) {
                    message.error('Error retrieving employee attendance data');
                }
            };
            fetchData();
        }
        else {
            if (user?.role !== 'admin') {
                form.setFieldsValue({
                    emp_name: user?.emp_name,
                    emp_id: user?.id
                })
            }
        }
    }, [form, open]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.role === 'admin') {
                const result = await axios.get(`http://localhost:8000/api/employee/get-employee`);
                setEmployees(result.data);
            }
        };
        fetchData();
    }, []);

    const handleEmployeeSelect = (value) => {
        employees.map((employee) => {
            if (employee.emp_name === value) {
                form.setFieldsValue({
                    emp_id: employee.id
                })
            }
        })
    }

    const findBehavoir = (punchTime) => {
        const officeTime = "09:00 AM";
        const puncInTime = new Date(`2000-01-01 ${punchTime}`);
        const actualTime = new Date(`2000-01-01 ${officeTime}`);
        if (puncInTime.getTime() > actualTime.getTime()) {
            return 'late'
        }
        else if (puncInTime.getTime() < actualTime.getTime()) {
            return 'early'
        }
        else {
            return 'on-time'
        }
    }

    const calWorkingHour = (signin_time, signout_time) => {
        const signInDate = new Date(`2000-01-01 ${signin_time}`);
        const signOutDate = new Date(`2000-01-01 ${signout_time}`);
        const timeDiffMillis = signOutDate.getTime() - signInDate.getTime();

        const timeDiff = Math.floor(timeDiffMillis / 1000 / 60 / 60);
        return timeDiff;
    }

    const handleFinish = async (values) => {

        setLoading(true);
        try {
            if (Id) {
                await axios.put(`http://localhost:8000/api/attendance/update-employee-attendance/${Id}`, values).then((res) => {
                    onClose();
                    navigate.push("/employeeattendance")
                }).catch((err) => {
                    message.error('Error submitting form');
                })
            } else {
                const signInTime = moment(new Date(values.signin_time)).format('LT')
                const signOutTime = moment(new Date(values.signout_time)).format('LT')
                const behaviour = findBehavoir(signInTime);
                const workingHour = calWorkingHour(signInTime, signOutTime);

                const obj = {
                    signin_time: signInTime,
                    signout_time: signOutTime,
                    behaviour: behaviour,
                    atten_date: values.atten_date,
                    punchin_note: values.punchin_note,
                    working_hour: workingHour,
                    emp_id: values.emp_id,
                    emp_name: values.emp_name
                }
                // console.log(obj)

                await axios.post('http://localhost:8000/api/attendance/create-employee-attendance', obj).then((res) => {
                    setLoading(false);
                    onClose();
                    setFetchAgain(!fetchAgain)
                }).catch((err) => {
                    setLoading(false);
                    message.error('Error submitting form');
                })
            }
            message.success('Employee Attendance data saved successfully');
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
                            <div className="table-responsive" style={{ padding: "20px 20px" }}>
                                <Form
                                    name="two_column_form"
                                    onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    form={form}
                                >
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Employee Name" name="emp_name" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    defaultValue="select employee"
                                                    popupClassName='select-dropdown'
                                                    onChange={handleEmployeeSelect}
                                                    disabled={user?.role !== 'admin'}
                                                    options={
                                                        employees.map((emp) => {
                                                            return (
                                                                {
                                                                    value: emp.emp_name,
                                                                    label: emp.emp_name,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="Employee id" name="emp_id" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled={user?.role !== 'admin'}/>
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Signin time" name="signin_time" rules={[{ required: true }]} labelAlign="left">
                                                <TimePicker use12Hours format="h:mm a" className='datepicker' />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', }}>
                                            <Form.Item label="Signout time" name="signout_time" rules={[{ required: true }]} labelAlign="left">
                                                <TimePicker use12Hours format="h:mm a" className='datepicker' />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Attendance Date" name="atten_date" rules={[{ required: true }]} labelAlign="left">
                                                <DatePicker className='datepicker' />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', width: '100vw' }}>
                                            <Form.Item label="Punch in note" name="punchin_note" labelAlign="left">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="Working hour" name="working_hour" labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="behaviour" labelAlign="left">
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
                                            <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading}>
                                                Submit
                                            </Button>

                                            <Button type="default" className='punch bg-white' onClick={() => onClose()}>
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

export default EmployeeAttendanceForm;
