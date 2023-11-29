import { useState, useEffect, useRef, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Input,
  Tooltip,
  Spin,
  DatePicker,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Avatar from "@mui/material/Avatar";
import axios from 'axios';
import moment from 'moment';
import { CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import './style.css';
import '../../assets/styles/home.css';
import DropdownSearch from './DropdownSearch';
import avaterImg from '../../assets/images/avatar.png'


const { Text, } = Typography;

const columns = [
  {
    field: 'emp_name', headerName: 'Profile', width: 200,
    renderCell: (params) => {
      const img = params?.row?.emp_image && params.row.emp_image;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar src={img ? `https://superdolphins.com/superdolphins.com/superdolphinsltd/${img}` : avaterImg}  />
          <div placement="topLeft" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={'/employee/profile/' + params.row.id} style={{ color: '#0088e1' }}>{params.row.emp_name}</Link>
            <div className='text-white text-xs'>{params.row.designation}</div>
          </div>
        </div>
      )
    },
  },
  { field: 'emp_id', headerName: 'Employee ID', width: 180 },
  { field: 'department', headerName: 'Department', width: 200 },
  {
    field: 'email', headerName: 'Email', width: 200,
    renderCell: (params) => {
      const tags = JSON.parse(params?.row?.email)
      return (
        <div style={{ cursor: "pointer" }}>
          <Tooltip placement="topLeft" title={tags.join(", ")}>
            <span >{tags.join(", ")}</span>
          </Tooltip>
        </div>
      )
    },
  },
  
];


function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [filterByName, setFilterByName] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState();
  const [pageNo, setPageNo] = useState(1);


  const getRowClassName = (params) => {
    const date = params.row.contract_end_date;
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (new Date(date) > today) {
      return 'yellow-row';
    } else if (new Date(date) < today) {
      return 'red-row';
    }
    return '';
  };

  const handleChange = (e) => {
    setFilterByName(e.target.value);
    if (e.target.value.length === 0) {
      setFetchAgain(!fetchAgain)
    }
  }

  const handleKeyPress = () => {
    setFetchAgain(!fetchAgain)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let result;
      if(filterByName){
        result = await axios.get(`http://localhost:8000/api/employee/get-employee?name=` + filterByName);
      }
      else if(selectedDepartment){
        result = await axios.get(`http://localhost:8000/api/employee/get-employee?dep_name=` + selectedDepartment);
      }
      else{
        result = await axios.get(`http://localhost:8000/api/employee/get-employee?page${pageNo}&pageSize=10`);
      }
      setEmployees(result.data?.data);
      setLoading(false)
    };
    fetchData();
  }, [fetchAgain, selectedDepartment]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:8000/api/department/get`);
      setDepartments(result.data);
    };
    fetchData();
  }, [fetchAgain]);



  const handleDelete = (sr_no) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        axios.delete(`http://localhost:8000/api/employee/delete-employee/${sr_no}`);
        setEmployees(employees.filter((item) => item.id !== sr_no));
      }
    })
  };

  const actionColumn = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Link to={`/employee/create/${params.row.emp_id}`}>
            <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white'>
              <EditOutlined />
            </Button>
          </Link>
          <Button
            aria-label="delete"
            className='punch bg-white'
            onClick={() => handleDelete(params.row.emp_id)}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ]

  return (
    <>
    <DropdownSearch 
      open={open} 
      setOpen={setOpen} 
      departments={departments} 
      setDepartments={setDepartments}
      setSelectedDepartment={setSelectedDepartment}
      setFetchAgain={setFetchAgain}
      fetchAgain={fetchAgain}
    />
      <header className='p-8' >
        <div className='flex justify-between pb-6'>
          <h2 className='text-xl text-white'>All Employees</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={() => navigate('/employee/create')}>
            Add Employee
          </Button>
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-5'>

            {!selectedDepartment ? 
              <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer' onClick={()=> setOpen(true)}>Department</div>
              :
              <div className=' py-3 px-8 rounded-full text-sm cursor-pointer text-main relative' style={{border: '1px solid'}}>
                <div>Department </div>
                <div className='absolute right-2.5 top-2.5' role="button" onClick={()=> setSelectedDepartment(null)}><CloseOutlined /></div>
              </div>
            }
          </div>
          <div className='flex relative'>
            <SearchOutlined className='search-icon' />
            <Input placeholder='search' className='search-input w-48' value={filterByName} onChange={handleChange} onPressEnter={handleKeyPress} />
          </div>
        </div>
      </header>

      <div className="tabled">
        <div className="table-responsive">
          <div style={{ height: 750, width: '100%', padding: "15px 35px"}}>
          {!loading  ?
            <DataGrid
              getRowId={(row) => row.emp_id}
              rowHeight={80}
              className='gridstyle'
              rows={loading ? [] : employees}
              columns={columns.concat(actionColumn)}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              getRowClassName={getRowClassName}
            />
              :
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spin /> 
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Employees;
