import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input } from "antd";
import React from "react";

function StageForm({
  stage,
  handleStageNameChange,
  handleStageProbabilityChange,
  handleDecrese,
}) {
  return (
    // <Col
    //     md={{ span: 11 }}
    //     xs={{ span: 22 }}
    //     style={{
    //         margin: '0 14px',
    //         backgroundColor: '#eeeeee',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         borderRadius: '5px',
    //     }}
    // >
    <div
      style={{
        backgroundColor: "#222428",
        width: "42%",
        padding: "14px 14px",
        borderRadius: "6px",
      }}
    >
      {/* <Form.Item
                    className="username"
                    label="Name"
                    name="stage_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input the stage name!",
                        },
                    ]}
                > */}
      <Input
        placeholder="Enter the stage name"
        value={stage.stage_name}
        onChange={handleStageNameChange}
        style={{ marginBottom: "10px" }}
      />
      {/* </Form.Item> */}

      {/* <Form.Item
                    className="username"
                    label="Probability"
                    name="probability"
                    rules={[
                        {
                            required: true,
                            message: "Please input the probability!",
                        },
                    ]}
                > */}
      <Input
        placeholder="Enter the probability"
        value={stage.probability}
        onChange={handleStageProbabilityChange}
        style={{ marginBottom: "20px" }}
      />
      {/* </Form.Item> */}

      <Form.Item className="username" name="probability">
        <Button
          type="primary"
          onClick={handleDecrese}
          className="punch"
          style={{ 
            backgroundColor: "rgb(3, 201, 215)", 
            width: "100%",
            display:'flex',
            alignItems:'center',
            justifyContent: 'center'
          }}
        >
          <DeleteOutlined /> Delete stage{" "}
        </Button>
      </Form.Item>
    </div>
  );
}

export default StageForm;
