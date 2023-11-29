import { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  Modal,
  Spin,
  Input,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import '../employees/style.css';
import '../../assets/styles/home.css';


function Pipeline() {

  const navigate = useNavigate();

  const [pipelines, setPipelines] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [filterByName, setFilterByName] = useState();
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);


  const columns = [
    { field: 'pip_id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'total_deal_value', headerName: 'Total deal value', width: 200 },
    { field: 'no_of_deals', headerName: 'No of deals', width: 200, },

    { field: 'no_of_stages', headerName: 'No of stages', width: 200 },

    {
      field: 'updated_at', headerName: 'Updated At', width: 150,
      valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')
    },
  ];


  const getRowClassName = (params) => {
    const date = params.row.agreement_end_date;
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
        result = await axios.get('http://localhost:8000/api/pipeline/get?name=' + filterByName);
      }
      else{
        result = await axios.get(`http://localhost:8000/api/pipeline/get?page=${pageNo}&pageSize=10`);
      }

      setPipelines(result.data?.data);
      setLoading(false)
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
        axios.delete(`http://localhost:8000/api/pipeline/delete/${sr_no}`);
        setPipelines(pipelines.filter((item) => item.pip_id !== sr_no));
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
          {/* <Link to={`/pipeline/create/${params.row.id}`}>
            <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white'>
              <EditOutlined />
            </Button>
          </Link> */}
          <Button
            aria-label="delete"
            className='punch bg-white'
            onClick={() => handleDelete(params.row.pip_id)}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ]


  return (
    <>
      <header className='p-8'>
        <div className='flex justify-between pb-6'>
          <h2 className='text-xl text-white'>All Pipelines</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={() => navigate('/pipeline/create')}>
            Add Pipeline
          </Button>
        </div>
        <div className='flex justify-end'>

          <div className='flex relative'>
            <SearchOutlined className='search-icon' />
            <Input placeholder='search' className='search-input w-48' value={filterByName} onChange={handleChange} onPressEnter={handleKeyPress} />
          </div>
        </div>
      </header>
      <div className="tabled">

        <div className="table-responsive">
          <div style={{ height: 750, width: '100%', padding: "15px 20px" }}>
            {!loading ?
              <DataGrid
                getRowId={(row) => row.pip_id}
                rowHeight={80}
                className='gridstyle'
                rows={loading ? [] : pipelines}
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

export default Pipeline;

