import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, InputNumber } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, Space } from 'antd';
import { Allcountry } from "../../assets/json/country";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import axios from 'axios';
import moment from 'moment';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';

// const { Option } = Select;

function PersonsForm() {
    const {user} = useStateContext();
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const [organizations, setOrganizations] = useState([])
    const [country, setCountry] = useState();
    const [emailsArr, setEmailsArr] = useState([""]);
    const [phoneInputArr, setPhoneInputArr] = useState([""])
    const [loading, setLoading] = useState(false)
    const id = path.id;

    const leadGroup = ["Hot Lead", "Warm Lead", "Cold Lead"]

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/persons/${id}/get`);
                    const data = res.data.data[0];
                    data.phone && data.phone.length > 0 && setPhoneInputArr(JSON.parse(data?.phone));
                    data.email && data.email.length > 0 && setEmailsArr(JSON.parse(data?.email));

                    form.setFieldsValue({
                        name: data.name,
                        lead_group: data.lead_group,
                        organization: data.organization,
                        owner: data.owner,
                        country: data?.country,
                        area: data?.area,
                        city: data?.city,
                        state: data?.state,
                        zipcode: data?.zipcode
                    });
                } catch (err) {
                    message.error('Error retrieving supplier input data');
                }
            };
            fetchData();
        }
    }, [id, form]);


    const handleChg = (value, index) => {
        setPhoneInputArr((prev) => {
            const updatedInput = [...prev];
            updatedInput[index] = value;
            form.setFieldsValue({
                phone: JSON.stringify(updatedInput)
            })
            return updatedInput;
        })
    }

    const handleEmail = (value, index) => {
        console.log(value, index)
        setEmailsArr((prev) => {
            const updatedInput = [...prev];
            updatedInput[index] = value.target.value;
            form.setFieldsValue({
                email: JSON.stringify(updatedInput)
            })
            return updatedInput;
        })
    }


    const handlePhoneIncrease = () => {
        setPhoneInputArr((prev) => {
            return [...prev, ""];
        })
    }


    const handleEmailIncrease = () => {
        setEmailsArr((prev) => {
            return [...prev, ""];
        })
    }

    const handleDecrese = (field) => {
        if (field === 'phone') {
            if (phoneInputArr.length < 2) return;
            setPhoneInputArr((prev) => {
                const newArr = [...prev];
                newArr.pop();
                form.setFieldsValue({
                    phone: JSON.stringify(newArr)
                })
                return newArr;
            })
        }

        else if (field === 'email') {
            if (emailsArr.length < 2) return;
            setEmailsArr((prev) => {
                const newArr = [...prev];
                newArr.pop();
                form.setFieldsValue({
                    email: JSON.stringify(newArr)
                })
                return newArr;
            })
        }
    }

    const handleFinish = async () => {
        setLoading(true);
        const values = {...form.getFieldValue(), emp_id: user?.emp_id}
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/persons/${id}/update`, values);
                navigate("/persons")
            } else {
                await axios.post('http://localhost:8000/api/persons/create', values);
                navigate("/persons")
            }
            setLoading(false);
            message.success('Persons data saved successfully');
            form.resetFields();
        } catch (err) {
            setLoading(false);
            message.error('Error submitting form');
        }
    };

    const handleFinishFailed = ({ errorFields }) => {
        form.scrollToField(errorFields[0].name);
    };

    return (
        <>
            <div className="tabled px-9 py-9">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24 antd-card"
                            title={id ? "Persons Form Edit" : "Persons Input Form"}
                            extra={
                                <>

                                    <Link to="/persons">
                                        <Button type="primary" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} className='punch'>
                                            Back
                                        </Button>
                                    </Link>
                                </>
                            }
                        >
                            <div className="table-responsive" style={{ padding: "20px 20px" }}>

                                <Form
                                    name="two_column_form"
                                    // onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    form={form}
                                >

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Name" name="name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Lead group" name="lead_group" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                     defaultValue="select lead group"
                                                     popupClassName='select-dropdown'
                                                    styles={{
                                                        height: '40px',
                                                        borderRadius: "6px"
                                                    }}
                                                    // onChange={(value) => { setDepartment(value) }}
                                                    options={
                                                        leadGroup.map((p) => {
                                                            return (
                                                                {
                                                                    value: p,
                                                                    label: p,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Contact Number" name="phone_number" rules={[{ required: true }]}>
                                                {phoneInputArr.map((val, index) => {
                                                    return (
                                                        <PhoneInput
                                                            style={{ marginBottom: '10px' }}
                                                            country={'in'}
                                                            value={val}
                                                            onChange={(value) => handleChg(value, index)}
                                                            inputClass='phone-input'
                                                            dropdownClass='phone-dropdown'
                                                            containerClass='phone-container'
                                                            searchClass='search-class'
                                                            buttonClass='phone-button'
                                                        />
                                                    )
                                                })}
                                                
                                                <div style={{ display: 'flex', gap: '10px', fontSize: '20px', color: '#03C9D7' }}>
                                                    <PlusCircleOutlined onClick={handlePhoneIncrease} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('phone') }} />
                                                </div>
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                                                {emailsArr.map((val, index) => {
                                                    return (
                                                        <Input style={{ padding: '11px', marginBottom: '10px' }} key={index} value={val} onChange={(value) => { handleEmail(value, index) }} />
                                                    )
                                                })}
                                                <div style={{  display: 'flex', gap: '10px', fontSize: '20px', color: '#03C9D7'  }}>
                                                    <PlusCircleOutlined onClick={handleEmailIncrease} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('email') }} />
                                                </div>
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Owner" name="owner">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px", color:'#CCCCCC' }}>Address details</h2>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Country" name="country" labelAlign="left">
                                                <Select
                                                    defaultValue={country}
                                                    style={{ marginBottom: '10px' }}
                                                    // onChange={(value) => { handleCountry(value, index) }}
                                                    options={Allcountry}
                                                />
                                                {/* <div style={{ display: 'flex', gap: '5px' }}>
                                                    <PlusCircleOutlined onClick={handleIncreaseCountry} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('country') }} />
                                                </div> */}

                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Area" name="area" labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="City" name="city">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="State" name="state">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Zip code" name="zipcode">
                                                <Input style={{ padding: '11px' }} />
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
                                            <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading} onClick={handleFinish}>
                                                Submit
                                            </Button>

                                            <Link to="/persons">
                                                <Button type="default" className="punch bg-white">
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </Form.Item>
                                    </div>
                                </Form>

                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default PersonsForm;
