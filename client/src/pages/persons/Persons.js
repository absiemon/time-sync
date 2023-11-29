import { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  Modal,
  Input,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import './style.css'
import '../../assets/styles/home.css';
import '../employees/style.css';
// import "./rental.css"


function Persons() {

  const navigate = useNavigate()
  const columns = [
    // { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'lead_group', headerName: 'Lead Groups', width: 200,
      renderCell: (params) => {
        const leadClass = params.row.lead_group;
        return (
          <div
            style={{
              width: '120px',
              height: '30px',
              backgroundColor: `${leadClass === 'Warm Lead' ? '#03C9D7' :
                leadClass === 'Cold Lead' ? '#32CD32' : '#fc6510'
                }`,
              borderRadius: '17px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', left: '16px', top: '4px' }}>{leadClass}</div>
          </div>
        )
      },
    },

    {
      field: 'email', headerName: 'Email', width: 200,
      renderCell: (params) => {
        const tags = JSON.parse(params.row.email)
        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={tags.join(", ")}>
              <span >{tags.join(", ")}</span>
            </Tooltip>
          </div>
        )
      },
    },

    {
      field: 'phone_number', headerName: 'Phone(s)', width: 200,
      renderCell: (params) => {
        const tags = JSON.parse(params.row.phone)
        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={tags.join(", ")}>
              <span >{tags.join(", ")}</span>
            </Tooltip>
          </div>
        )
      },
    },

    {
      field: 'address', headerName: 'Address', width: 200,
      renderCell: (params) => {
        const tags = [];
        tags.push(params.row.area);
        tags.push(params.row.city);
        tags.push(params.row.state);
        tags.push(params.row.country);
        tags.push(params.row.zipcode);
        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={tags.join(", ")}>
              <span >{tags.join(", ")}</span>
            </Tooltip>
          </div>
        )
      },
    },
    { field: 'owner', headerName: 'Owner', width: 200 },

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


  const [persons, setPersons] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [filterByName, setFilterByName] = useState();
  const [loading, setLoading] = useState(false);

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
      if (filterByName) {
        result = await axios.get(`http://localhost:8000/api/persons/get?name=` + filterByName);
      }
      else {
        result = await axios.get('http://localhost:8000/api/persons/get');
      }
      setLoading(false)
      setPersons(result.data?.data);
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
        axios.delete(`http://localhost:8000/api/persons/${sr_no}/delete`);
        setPersons(persons.filter((item) => item.id !== sr_no));
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
          <Link to={`/persons/create/${params.row.id}`}>
            <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white'>
              <EditOutlined />
            </Button>
          </Link>
          <Button
            aria-label="delete"
            className='punch bg-white'

            onClick={() => handleDelete(params.row.id)}
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
          <h2 className='text-xl text-white'>All Persons</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={() => navigate('/persons/create')}>
            Add Person
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
            {!loading  ?
            <DataGrid
              rowHeight={80}
              className='gridstyle'
              rows={loading ? [] : persons}
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

export default Persons;
