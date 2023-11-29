import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Button, Tooltip, Modal, Input, Spin, Select, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import axios from "axios";
import moment from "moment";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import "../../assets/styles/home.css";
import "../employees/style.css";
// import './style.css'
// import "./rental.css"

function Proposal() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [filterByName, setFilterByName] = useState();
  const [loading, setLoading] = useState(false);

  const options = [
   
    {
      value: "Accept",
      label: "Accept",
    },
    {
      value: "Reject",
      label: "Reject",
    },
  ]

  const handleStatusSelect = async(value, id, email, template)=>{
    const values = {
      status: value,
      email: email,
      template: template
    }
    await axios.put(`http://localhost:8000/api/proposal/update/${id}`, values).then((res)=>{
        // setFetchAgain(!fetchAgain)
        message.success("Proposal email send successfully");
    }).catch((err)=>{
      console.log(err)
    })
    
  }

  const columns = [
    { field: "title", headerName: "Subject", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <div
            style={{
              borderRadius: "17px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: "16px", top: "-22px" }}>
              <Select
                defaultValue={status}
                style={{
                  width: 120,
                  marginBottom: '10px'
                }}
                popupClassName='ant-dropdown'
                onChange={(value)=> handleStatusSelect(value, params.row.id, params.row.email, params.row.template)}
                options={options}
              />
            </div>
          </div>
        );
      },
    },
    {
      field: "deal_title",
      headerName: "Deals",
      width: 200,
      renderCell: (params) => {
        const title = params.row.deal_title;

        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={title}>
              <span>{title}</span>
            </Tooltip>
          </div>
        );
      },
    },

    { field: "owner", headerName: "Owner", width: 200 },

    {
      field: "updated_at",
      headerName: "Updated At",
      width: 150,
      valueGetter: (params) =>
        moment(params.row.time_stamp).format("MMM DD, YYYY HH:mm:ss"),
    },
  ];

  const getRowClassName = (params) => {
    const date = params.row.agreement_end_date;
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (new Date(date) > today) {
      return "yellow-row";
    } else if (new Date(date) < today) {
      return "red-row";
    }
    return "";
  };



  const handleChange = (e) => {
    setFilterByName(e.target.value);
    if (e.target.value.length === 0) {
      setFetchAgain(!fetchAgain);
    }
  };

  const handleKeyPress = () => {
    setFetchAgain(!fetchAgain);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result;
      if (filterByName) {
        result = await axios.get(
          `http://localhost:8000/api/proposal/get?name=` + filterByName
        );
      } else {
        result = await axios.get("http://localhost:8000/api/proposal/get");
      }
      setLoading(false);
      setProposals(result.data);
    };
    fetchData();
  }, [fetchAgain]);

  const handleDelete = (sr_no) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        axios.delete(`http://localhost:8000/api/proposal/delete/${sr_no}`);
        setProposals(proposals.filter((item) => item.id !== sr_no));
      }
    });
  };

  const actionColumn = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Link to={`/proposal/create/${params.row.id}`}>
            <Button
              aria-label="edit"
              style={{ margin: "0px 10px" }}
              className="punch bg-white"
            >
              <EditOutlined />
            </Button>
          </Link>
          <Button
            aria-label="delete"
            className="punch bg-white"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <header className="p-8">
        <div className="flex justify-between pb-6">
          <h2 className="text-xl text-white">All Proposals</h2>
          <Button
            type="primary"
            htmlType="submit"
            style={{ margin: "0px 10px", backgroundColor: "limegreen" }}
            className="punch"
            onClick={() => navigate("/proposal/create")}
          >
            New Proposal
          </Button>
        </div>
        <div className="flex justify-end">
          <div className="flex relative">
            <SearchOutlined className="search-icon" />
            <Input
              placeholder="search"
              className="search-input w-48"
              value={filterByName}
              onChange={handleChange}
              onPressEnter={handleKeyPress}
            />
          </div>
        </div>
      </header>
      <div className="tabled">
        <div className="table-responsive">
          <div style={{ height: 750, width: "100%", padding: "15px 20px" }}>
            {!loading ? (
              <DataGrid
                rowHeight={80}
                className="gridstyle"
                rows={loading ? [] : proposals}
                columns={columns.concat(actionColumn)}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
                getRowClassName={getRowClassName}
              />
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spin />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Proposal;
