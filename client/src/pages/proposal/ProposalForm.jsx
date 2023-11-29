import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, InputNumber } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, Space } from 'antd';

import axios from 'axios';
import moment from 'moment';
import { useStateContext } from '../../contexts/ContextProvider';
import TextEditor from './TextEditor';

// const { Option } = Select;

function ProposalForm() {

    const [form] = Form.useForm();
    const { user } = useStateContext();
    const { TextArea } = Input;

    const navigate = useNavigate()
    const path = useParams();
    const [deals, setDeals] = useState([])
    const [loading, setLoading] = useState(false)
    const id = path.id

    const [editorContent, setEditorContent] = useState('');
    const [emails, setEmails] = useState();
    const [selectedDealId, setSelectedDealId] = useState()

    const [imagesInfo, setImagesInfo] = useState() // for images that are inserted in editor 

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`http://localhost:8000/api/deal/get`);
            setDeals(res.data)
        }
        fetchData();
    }, [])

    const handleDealSelect = async (value) => {
        let deal_id;
        deals.map((deal) => {
            if (deal.title === value) {
                deal_id = deal?.id
                form.setFieldsValue({
                    deal_id: deal?.id
                })
            }
        })
        setSelectedDealId(deal_id)
    }

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/proposal/get/${id}`);
                    const data = res.data[0];
                    setEditorContent(data?.template)
                    handleDealSelect(data?.deal_title)
                    form.setFieldsValue({
                        title: data.title,
                        // deal_title: data.deal_title,
                        // deal_id: data?.deal_id,
                        // email: data?.email,
                        owner: data?.owner,
                        template: data?.template,
                        status: data?.status
                    });
                } catch (err) {
                    message.error('Error in retrieving data');
                }
            };
            fetchData();
        }
        else {
            form.setFieldsValue({
                owner: user.emp_name,
                status:"Sent"
            })
        }
    }, [id, form]);


    useEffect(() => {
        form.setFieldsValue({
            template: editorContent
        })
    }, [editorContent])

    useEffect(() => {
        if (selectedDealId) {
            try {
                const fetch = async()=>{
                    let result = await axios.get(`http://localhost:8000/api/proposal/get-emails/${selectedDealId}`)
                    const data = result.data;
                    if (data?.email) {
                        setEmails(JSON.parse(data.email));
                    }
                    else{
                        message.warning("This deal has no contact person with email.")
                    }
                }
                fetch()
            } catch (error) {
                console.error(error)
            }
        }
    }, [selectedDealId])


    const handleFinish = async (values) => {
        setLoading(true);
        const newValues = {
            fields:values,
            imagesInfo
        }
        console.log(newValues)
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/proposal/update/${id}`, newValues);
                navigate("/proposal")
            } else {
                await axios.post('http://localhost:8000/api/proposal/create', newValues);
                navigate("/proposal")
            }
            setLoading(false);
            message.success('Proposal data saved successfully');
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
            <div className="tabled  px-9 py-9">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24 antd-card"
                            title={id ? "Proposal Form Edit" : "Proposal Input Form"}
                            extra={
                                <>
                                    <Link to="/proposal">
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
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Proposal title" name="title" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Deal title" name="deal_title" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    defaultValue="Select a deal title"
                                                    showSearch='true'
                                                    popupClassName='ant-dropdown'

                                                    onChange={handleDealSelect}
                                                    options={
                                                        deals.map((p) => {
                                                            return (
                                                                {
                                                                    value: p.title,
                                                                    label: p.title,
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
                                            <Form.Item label="Choose email" name="email" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    defaultValue="Select a email"
                                                    styles={{
                                                        height: '40px',
                                                        borderRadius: "6px"
                                                    }}
                                                    popupClassName='ant-dropdown'
                                                    options={
                                                        emails && emails.map((p) => {
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
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="template" labelAlign="left">
                                                {/* <TextArea rows={4} cols={10} /> */}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <TextEditor
                                        editorContent={editorContent}
                                        setEditorContent={setEditorContent}
                                        setImagesInfo={setImagesInfo}
                                    />

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }} >
                                            <Form.Item label="Owner" name="owner">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }} >
                                            <Form.Item label="deal id" name="deal_id">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }} >
                                            <Form.Item label="status" name="status">
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
                                            <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading} disabled={!emails}>
                                                Submit
                                            </Button>

                                            <Link to="/proposal">
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

export default ProposalForm;
