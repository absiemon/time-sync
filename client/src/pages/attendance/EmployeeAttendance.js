import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
  Input,
} from "antd";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import EmployeeAttendanceForm from './EmployeeAttendanceForm'
import '../employees/style.css';
import '../../assets/styles/home.css';
import { Link } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';


const columns = [
  {
    field: 'emp_name', headerName: 'Profile', width: 200,
    renderCell: (params) => {
      const name = params?.row?.emp_name;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className='h-12 w-12 rounded-full bg-main-dark-bg flex justify-center items-center'>{name?.charAt(0)}</div>
          <div placement="topLeft" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to={'/employee/profile/' + params.row.emp_id} target="_blank" style={{ color: '#0088e1' }}>{params?.row?.emp_name}</Link>
            <div className='text-white text-xs'>{params.row.emp_id}</div>
          </div>
        </div>
      )
    },
  },

  {
    field: 'atten_date', headerName: 'Date', width: 200,
    valueGetter: (params) => moment(params.row.atten_date).format('MMM DD, YYYY')
  },

  { field: 'signin_time', headerName: 'Punch in', width: 200, },
  { field: 'signout_time', headerName: 'Punch out', width: 200 },
  { field: 'behaviour', headerName: 'Behaviour', width: 200 },
  { field: 'break_time', headerName: 'Break time', width: 200 },
  { field: 'break_start_time', headerName: 'Break start time', width: 200,
  valueGetter: (params) => params.row.break_start_time && moment(params.row.break_start_time).format('MMM DD, YYYY HH:mm:ss') },

  { field: 'break_end_time', headerName: 'Break end time', width: 200, 
  valueGetter: (params) =>  params.row.break_end_time && moment(params.row.break_end_time).format('MMM DD, YYYY HH:mm:ss')  },
  { field: 'working_hour', headerName: 'Total hours', width: 200 },
  { field: 'location', headerName: 'Location', width: 230 },
  { field: 'device_info', headerName: 'Device info', width: 230 },

  {
    field: 'updated_at', headerName: 'Updated At', width: 150,
    valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')
  },
];


function EmployeeAttendance() {

  const { user } = useStateContext();

  const [employeeAttend, setEmployeeAttend] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [Id, setId] = useState();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false)
  const [filterByName, setFilterByName] = useState();

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
      if(user?.role === 'admin'){
        result = await axios.get(`http://localhost:8000/api/attendance/get-employee-attendance?name=${filterByName}`);
      }
      else{
        result = await axios.get(`http://localhost:8000/api/attendance/get-employee-attendance/${user?.id}`);
      }
      setLoading(false)
      setEmployeeAttend(result.data);
    };
    fetchData();
  }, [fetchAgain]);

  const showDrawer = () => {
    setId();
    setOpen(true);
  };
  const showDrawer2 = (id) => {
    setId(id);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

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
        axios.delete(`http://localhost:8000/api/attendance/delete-employee-attendance/${sr_no}`);
        setEmployeeAttend(employeeAttend.filter((item) => item.id !== sr_no));
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
          {user?.role === 'admin' && <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white' onClick={() => showDrawer2(params.row.id)}>
            <EditOutlined />
          </Button>}
          {user?.role === 'admin' && 
          <Button
            aria-label="delete"
            className='punch bg-white'
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlined />
          </Button>}
        </>
      ),
    },
  ]

  return (
    <>
      <EmployeeAttendanceForm onClose={onClose} open={open} Id={Id} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/>
      <header className='p-8'>
        <div className='flex justify-between pb-6'>
          <h2 className='text-xl text-white'>Attendance Lists</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={showDrawer}>
            Add Attandance
          </Button>
        </div>
        <div className='flex justify-end'>
          {/* <div className='flex gap-5'>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer'>Created</div>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer' onClick={() => setOpen(true)}>Department</div>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer'>Email</div>
          </div> */}
          <div className='flex relative'>
            <SearchOutlined className='search-icon' />
            <Input placeholder='search' className='search-input w-48' value={filterByName} onChange={handleChange} onPressEnter={handleKeyPress} />
          </div>
        </div>
      </header>

      <div className="tabled">
        <div className="table-responsive">
          <div style={{ height: 750, width: '100%', padding: "15px 35px" }}>
            {!loading ?
              <DataGrid
                rowHeight={80}
                className='gridstyle'
                rows={loading ? [] : employeeAttend}
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

export default EmployeeAttendance;
