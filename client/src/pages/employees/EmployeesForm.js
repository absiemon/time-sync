import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, Select, } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Country, State, City } from 'country-state-city';

import {
    DeleteOutlined,
    FilePdfOutlined,
    FolderViewOutlined,
    LoadingOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import TextArea from 'antd/es/input/TextArea';
// const { Option } = Select;

function EmployeesForm() {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const id = path.id
    const [uploadedEmpCv, setUploadedEmpCv] = useState();
    const [uploadedEmpImage, setUploadedEmpImage] = useState();
    const [uploadedEmpCertificates, setUploadedEmpCertificates] = useState([]);

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const [buttonLoading, setButtonLoading] = useState(false);
    const [imgUploadValue, setImageUploadValue] = useState("")

    const [phoneInputArr, setPhoneInputArr] = useState([""])
    const [emailArr, setEmailArr] = useState([""])

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/employee/get-single-employee/${id}`);
                    const data = res.data?.data[0];
                    data?.emp_image && data?.emp_image.length > 0 && setUploadedEmpImage(data?.emp_image);
                    data?.emp_cv && data?.emp_cv.length > 0 && setUploadedEmpCv(data?.emp_cv)
                    data?.certificates && data?.certificates.length > 0 && setUploadedEmpCertificates(JSON.parse(data?.certificates));

                    data.phone && data.phone.length > 0 && setPhoneInputArr(JSON.parse(data?.phone));
                    data.email && data.email.length > 0 && setEmailArr(JSON.parse(data?.email));

                    form.setFieldsValue({
                        emp_name: data.emp_name,
                        department: data.department,
                        designation: data.designation,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        address2: data?.address2,
                        country: data?.country,
                        state: data?.state,
                        city: data?.city,
                        login_email: data.login_email,
                        password: data.password,
                        role: data.role,
                        dob: moment(data.dob),
                        joining_date: moment(data.joining_date),
                        service_terms: data.service_terms,
                        emp_image: data?.emp_image,
                        emp_cv: data?.emp_cv,
                        certificates: data?.certificates,
                        total_leave: data.total_leave,
                    });
                } catch (err) {
                    message.error('Error in fetching data');
                }
            };
            fetchData();
        }
    }, [id, form]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:8000/api/department/get`);
            setDepartments(result.data);
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:8000/api/designation/get`);
            setDesignations(result.data);
        };
        fetchData();
    }, []);

    const handleCountrySelect = (value) => {
        form.setFieldsValue({
            country: Country.getCountryByCode(value).name
        })
        setSelectedCountry(value)
    }
    // onchange of phone input.
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
        // console.log(value, index)
        setEmailArr((prev) => {
            const updatedInput = [...prev];
            updatedInput[index] = value.target.value;
            form.setFieldsValue({
                email: JSON.stringify(updatedInput)
            })
            return updatedInput;
        })
    }
    const handleEmailIncrease = () => {
        setEmailArr((prev) => {
            return [...prev, ""];
        })
    }
    const handlePhoneIncrease = () => {
        setPhoneInputArr((prev) => {
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
            if (emailArr.length < 2) return;
            setEmailArr((prev) => {
                const newArr = [...prev];
                newArr.pop();
                form.setFieldsValue({
                    email: JSON.stringify(newArr)
                })
                return newArr;
            })
        }
    }

    const handleFileUpload = (e, type) => {
        e.preventDefault();
        const files = e.target.files;  // contains array of seleted files from the system.
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
        setSelectedImage(null)
        if(type === 'emp_img') setLoading1(true)
        if(type === 'emp_cv') setLoading2(true)
        if(type === 'emp_certificates') setLoading3(true)

        axios.post('http://localhost:8000/api/employee/upload-files', data).then((res) => {
            const lableData = res.data;

            if (type === 'emp_img') {
                form.setFieldsValue({ upload_emp_img: "" });
                form.setFieldsValue({ emp_image: lableData[0] });
                setUploadedEmpImage(lableData[0]);
                setLoading1(false)
            }
            else if (type === 'emp_cv') {
                form.setFieldsValue({ upload_emp_cv: "" });
                form.setFieldsValue({ emp_cv: lableData[0] });
                setUploadedEmpCv(lableData[0]);
                setLoading2(false)
            }
            else if (type === 'emp_certificates') {
                const prevValue = form.getFieldsValue('certificates').certificates;
                if (prevValue) {
                    const arr1 = JSON.parse(prevValue);
                    const arr2 = lableData;
                    const newArr = [...arr1, ...arr2];
                    form.setFieldsValue({ certificates: JSON.stringify(newArr) });
                }
                else {
                    form.setFieldsValue({ certificates: JSON.stringify(lableData) });
                }
                setUploadedEmpCertificates([...uploadedEmpCertificates, ...res.data]);
                setLoading3(false)
            }

        }).catch((err) => {

            message.error('Error Uploading files');
            setLoading1(false)
            setLoading2(false)
            setLoading3(false)
        })
    }

    const handleFileDelete = (fname, type, id, field) => {
        setSelectedImage(null)
        if (type === "emp_img") {
            setUploadedEmpImage();
        }
        else if (type === "emp_cv") {
            setUploadedEmpCv();
        }
        else if (type === "emp_certificates") {
            setUploadedEmpCertificates(prev => prev.filter(p => p !== fname));
        }

        axios.delete(`http://localhost:8000/api/employee/delete-ftp-file/${fname}?id=${id}&field=${field}`).then((res) => {
            if (type === 'emp_img') {
                form.setFieldsValue({
                    emp_image: res.data?.data
                })
                // setSelectedImage(null)
            }
            else if (type === 'emp_cv') {
                form.setFieldsValue({
                    emp_cv: res.data?.data
                })
            }
            if (type === 'emp_certificates') {
                const prevValue = form.getFieldsValue('certificates').certificates;
                if (prevValue) {
                    const arr1 = JSON.parse(prevValue);
                    const arr2 = arr1.filter((f) => f !== fname);

                    form.setFieldsValue({
                        certificates: JSON.stringify(arr2)
                    })
                }
            }

        }).catch(err => {
            message.error('Error in file deleting');
        })
    }
    const handleView = (fname) => {
        const url = `https://time-sync.s3.ap-south-1.amazonaws.com/${fname}`;
        window.open(url, '_blank');
    }

    const handleFinish = async (values) => {
        setButtonLoading(true)
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/employee/update-employee/${id}`, values);
                setButtonLoading(false)
                navigate("/employee")
            } else {
                await axios.post('http://localhost:8000/api/employee/create-employee', values);
                setButtonLoading(false)
                navigate("/employee")
            }
            message.success('Employee data saved successfully');
            form.resetFields();
        } catch (err) {
            setButtonLoading(false)
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
                            title={id ? "Employees Form Edit" : "Employees Form"}
                            extra={
                                <>
                                    <Link to="/employee">
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
                                    onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    form={form}
                                >

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Employee Name" name="emp_name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                            <Form.Item label="Department" name="department" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    defaultValue="select department"
                                                    popupClassName='select-dropdown'
                                                    options={
                                                        departments.map((dep) => {
                                                            return (
                                                                {
                                                                    value: dep.name,
                                                                    label: dep.name,
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
                                            <Form.Item label="Designation" name="designation" rules={[{ required: true }]}>
                                                <Select
                                                    defaultValue="select designation"
                                                    popupClassName='select-dropdown'
                                                    options={
                                                        designations.map((dep) => {
                                                            return (
                                                                {
                                                                    value: dep.name,
                                                                    label: dep.name,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', }} >
                                            <Form.Item label="Email" name="email" rules={[{ required: true }]} labelAlign="left">
                                                {emailArr.map((val, index) => {
                                                    return (
                                                        <Input style={{ padding: '11px', marginBottom: '10px' }} key={index} value={val} onChange={(value) => { handleEmail(value, index) }} />
                                                    )
                                                })}
                                                <div style={{ display: 'flex', gap: '10px', fontSize: '20px', color: '#03C9D7' }}>
                                                    <PlusCircleOutlined onClick={handleEmailIncrease} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('email') }} />
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Phone" name="phone" labelAlign="left">
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

                                    <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px", color: '#CCCCCC' }}>Address Details</h2>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                            <Form.Item label="Address Details" name="address" rules={[{ required: true }]} labelAlign="left">
                                                <TextArea style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Country" name="country" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    showSearch='true'
                                                    value={selectedCountry}
                                                    onChange={handleCountrySelect}
                                                >
                                                    {Country.getAllCountries().map(country => (
                                                        <Select.Option key={country.isoCode} value={country.isoCode}>
                                                            {country.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="State" name="state" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    showSearch='true'
                                                    value={selectedState}
                                                    onChange={value => setSelectedState(value)}
                                                >
                                                    {State.getStatesOfCountry(selectedCountry).map(state => (
                                                        <Select.Option key={state.isoCode} value={state.name}>
                                                            {state.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="City" name="city" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px", color: '#CCCCCC' }}>Login Credentials</h2>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Login email" name="login_email" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} type="email" />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                            <Form.Item label="Password" name="password" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px", color: '#CCCCCC' }}>Other Information</h2>

                                    <Row>

                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Role" name="role" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="DOB" name="dob" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Joining Date" name="joining_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Service Terms" name="service_terms" rules={[{ required: true }]}>
                                                <Input style={{ padding: '11px', width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Employee image" name="upload_emp_img">
                                                {!uploadedEmpImage && 
                                                    <Input style={{ padding: '5px' }} type='file' accept='.png,.jpg,.jpeg,.webp' onChange={(e) => handleFileUpload(e, "emp_img")} disabled={loading1} 
                                                    value={selectedImage ? '' : undefined} />
                                                }

                                                {loading1 && <LoadingOutlined style={{ position: 'absolute', top: '14px', right: '24px' }} />}

                                                {uploadedEmpImage && uploadedEmpImage.length > 0 &&
                                                    <div
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            fontSize: '1rem', border: "2px solid white", padding: "6px 14px",
                                                            borderRadius: "6px", color: "white"
                                                        }}
                                                    >
                                                        <FilePdfOutlined className='text-red-600 text-xl' />
                                                        <div>{uploadedEmpImage.length > 20 ? 
                                                            uploadedEmpImage.split('-')[0].slice(0,20) + '...' : 
                                                            uploadedEmpImage.split('-')[0]}
                                                        </div>
                                                        <FolderViewOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleView(uploadedEmpImage)} />
                                                        <DeleteOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleFileDelete(uploadedEmpImage, "emp_img", id, "emp_image")} />
                                                    </div>
                                                }

                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="Employee image" name="emp_image" >
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Employee CV" name="upload_emp_cv">
                                                {!uploadedEmpCv &&
                                                <Input style={{ padding: '5px' }} type='file' accept='.pdf,.docx' onChange={(e) => handleFileUpload(e, "emp_cv")} disabled={loading2} value={imgUploadValue} />}

                                                {loading2 && <LoadingOutlined style={{ position: 'absolute', top: '14px', right: '24px' }} />}

                                                {uploadedEmpCv && uploadedEmpCv.length > 0 &&

                                                    <div
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '10px',
                                                            fontSize: '1rem', border: "2px solid white", padding: "6px 14px",
                                                            borderRadius: "6px", color: "white"
                                                        }}
                                                    >
                                                        <FilePdfOutlined className='text-red-600 text-xl' />
                                                        <div>{uploadedEmpCv.length> 20 ? 
                                                            uploadedEmpCv.split('-')[0].slice(0,20) + '...' : 
                                                            uploadedEmpCv.split('-')[0]}
                                                        </div>
                                                        <FolderViewOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleView(uploadedEmpCv)} />
                                                        <DeleteOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleFileDelete(uploadedEmpCv, "emp_cv", id, "emp_cv")} />
                                                    </div>
                                                }
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }} >
                                            <Form.Item label="Employee cv" name="emp_cv" >
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Total Leave" name="total_leave" rules={[{ required: true }]}>
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Certificates" name="upload_certificates">
                                                <Input style={{ padding: '5px' }} type='file' accept='.pdf,.docx,.png,.jpeg,.jpg' multiple onChange={(e) => handleFileUpload(e, "emp_certificates")} disabled={loading3} value={imgUploadValue} />

                                                {loading3 && <LoadingOutlined style={{ position: 'absolute', top: '14px', right: '24px' }} />}
                                                {uploadedEmpCertificates.length > 0 &&
                                                    <div style={{ height: "60px", overflowY: "scroll", display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                        {uploadedEmpCertificates.map((fname) => {
                                                            return (
                                                                <Card style={{ marginTop: '10px', height: 50 }} key={fname}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                                                                        <FilePdfOutlined className='text-red-600 text-xl' />
                                                                        <div>{fname.length> 20 ? 
                                                                            fname.split('-')[0].slice(0,20) + '...' : 
                                                                            fname.split('-')[0]}
                                                                        </div>
                                                                        <FolderViewOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleView(fname)} />
                                                                        <DeleteOutlined style={{ cursor: 'pointer', fontSize: '1.25rem' }} onClick={() => handleFileDelete(fname, "emp_certificates", id, "certificates")} />
                                                                    </div>
                                                                </Card>
                                                            )
                                                        })}
                                                    </div>}

                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }} >
                                            <Form.Item label="Certificates" name="certificates">
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
                                            <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={buttonLoading}>
                                                Submit
                                            </Button>

                                            <Link to="/employee">
                                                <Button type="default" className='punch bg-white'>
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
            </div >
        </>
    );
}

export default EmployeesForm;
