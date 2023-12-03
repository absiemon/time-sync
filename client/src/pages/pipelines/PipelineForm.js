import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, InputNumber } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, Space } from 'antd';
// import 'antd/dist/antd.css';

import axios from 'axios';
import moment from 'moment';
import StageForm from './StageForm';
import { PlusOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';

// const { Option } = Select;

function PipelineForm() {

    const { setUser, user } = useStateContext();
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const [loading, setLoading] = useState(false)
    const [allStages, setAllStages] = useState([{stage_name:'', probability:''}]);
    const id = path.id

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`/persons/get/${id}`);
                    const data = res.data[0];

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



    const handleIncrease = () => {
        setAllStages((prev) => {
            return [...prev, { stage_name: '', probability: '' }]
        })
    }

    const handleDecrese = (index) => {
        setAllStages((prev) => {
            const newArr = [...prev];
            newArr.splice(index);
            return newArr;
        })
    }

    const handleStageNameChange = (e, index) => {
        const { value } = e.target

        setAllStages((prev) => {
            const arr = [...prev];
            const obj = { ...arr[index], stage_name: value };
            // obj.stage_name = e.target.value;
            arr[index] = obj;
            console.log(arr)
            return arr;
        })
    }
    const handleStageProbabilityChange = (e, index) => {
        const { value } = e.target

        setAllStages((prev) => {
            const arr = [...prev];
            const obj = { ...arr[index], probability: value };
            // obj.probability = e.target.value;
            arr[index] = obj;
            return arr;
        })
    }

    const handleFinish = async (values) => {
        setLoading(true);
        const obj = {
            pipelineData: {
                name: values.name,
                emp_id: user?.emp_id,
                no_of_stages: allStages.length
            },
            stages: allStages
        }
        
        try {
            if (id) {
                await axios.put(`/pipeline/${id}/update`, obj);
                navigate("/pipeline")
            } else {
                await axios.post('/pipeline/create', obj);
                setLoading(false);
                navigate("/pipeline")
            }
            setLoading(false);
            message.success('Pipeline data saved successfully');
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
                            title={id ? "Pipeline Form Edit" : "Pipeline Input Form"}
                            extra={
                                <>

                                    <Link to="/pipeline">
                                        <Button type="primary" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} >
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
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Name" name="name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Button type="primary" className = "punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} onClick={handleIncrease}><PlusOutlined /> Add a stage</Button>
                                        </Col>
                                    </Row>

                                    <Row style={{ gap: '20px', marginTop: '20px' }}>
                                        {allStages.map((stage, index) => {
                                            return (
                                                <StageForm
                                                    key={index}
                                                    stage={stage}
                                                    // index={index}
                                                    handleStageNameChange={(e) => handleStageNameChange(e, index)}
                                                    handleStageProbabilityChange={(e) => handleStageProbabilityChange(e, index)}
                                                    handleDecrese={() => handleDecrese(index)}
                                                />
                                            )
                                        })
                                        }
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

                                            <Link to="/pipeline">
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
            </div >
        </>
    );
}

export default PipelineForm;
