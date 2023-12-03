import React, { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, message } from "antd";

// import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import axios from 'axios';


function AddColModal({ visible, setVisible, fetchAgain, setFetchAgain, selectedPipelineId, stageId }) {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (stageId) {
            const fetchData = async () => {
                await axios.get(`/pipeline/${stageId}/get-stage`).then((res) => {
                    const data = res.data?.data[0];
                    console.log(data)
                    form.setFieldsValue({
                        stage_name: data?.stage_name,
                        pip_id: selectedPipelineId
                    })
                })
            }
            fetchData();
        }
        else {
            form.setFieldsValue({
                pip_id: selectedPipelineId
            })
        }
    }, [form, stageId, selectedPipelineId])

    const handleClose = () => {
        setVisible(false)
    }

    const handleFinish = async () => {
        try {
            const values = form.getFieldValue();
            if (stageId) {
                await axios.put(`/pipeline/${stageId}/update-stage`, values);
                setFetchAgain(!fetchAgain)
                setLoading(false);
                setVisible(false)
                message.success('Stage Updated successfully');
                form.resetFields();
            }
            else {
                await axios.post(`/pipeline/${selectedPipelineId}/create-stage`, values);
                setFetchAgain(!fetchAgain)
                setLoading(false);
                setVisible(false)
                message.success('Stage created successfully');
                form.resetFields();
            }

        } catch (err) {
            setLoading(false);
            message.error('Error submitting form');
        }
    }
    return (
        <div>
            <Drawer
                placement="top"
                mask={false}
                onClose={() => setVisible(false)}
                visible={visible}
                width={100}
                height={300}
                rootClassName='attandance-drawer'
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Add Stage"
                footer={
                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center", padding:'6px' }}>
                        <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading} onClick={handleFinish}>
                            Submit
                        </Button>

                        <Button type="default" className="punch bg-white" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div>
                    <Form
                        // onFinish={handleFinish}
                        //   onFinishFailed={onFinishFailed}
                        layout="vertical"
                        className="row-col"
                        form={form}
                    >
                        <Form.Item
                            className="username"
                            label="Name"
                            name="stage_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the column name!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter the column name" />
                        </Form.Item>

                        <Form.Item
                            className="username"
                            label=""
                            name="pip_id"
                            style={{ display: 'none' }}

                        >
                            <Input placeholder="Enter the deal value" />
                        </Form.Item>


                    </Form>
                </div>
            </Drawer>
        </div>
    )
}

export default AddColModal