import { useEffect, useState } from "react";
import { Button, Drawer, Input, Radio, Space, Spin } from "antd";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";

function DropdownSearch({ open, setOpen, departments, setSelectedDepartment, setFetchAgain, fetchAgain }) {
 

  const handleDepartmentClick = (name) => {
    setSelectedDepartment(name)
    setOpen(false)
    setFetchAgain(!fetchAgain)
  }
  return (
    <Drawer
      placement="top"
      mask={true}
      // maskClosable={true}
      closable={false}
      visible={open}
      width={100}
      height={400}
      rootClassName="filter-drawer"
      headerStyle={{ padding: "10px 24px" }}
      title={
        <div className="flex relative justify-center">
          <SearchOutlined className="search-icon top-6" />
          <Input
            placeholder="search"
            className="search-input w-72 h-12"
            // value={filterByName}
            // onChange={handleChange}
            // onPressEnter={handleKeyPress}
          />
        </div>
      }
      footer={
        <Button
          type="primary"
          htmlType="submit"
          className="punch"
          style={{ backgroundColor: "rgb(3, 201, 215)" }}
          onClick={() => setOpen(false)}
        >
          cancel
        </Button>
      }
    >
      <div>
        {departments.length > 0 ? (
          departments.map((department) => {
            return (
              <div
                className="text-primary hover:bg-gray-800 cursor-pointer"
                style={{ padding: "14px 10px" }}
                role="button"
                onClick={()=> handleDepartmentClick(department.name)}
              >
                {department.name}
              </div>
            );
          })
        ) : (
          <Spin />
        )}
      </div>
    </Drawer>
  );
}

export default DropdownSearch;
