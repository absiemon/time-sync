import { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tooltip,
  Modal,
} from "antd";
import { Link } from "react-router-dom";

import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { AuthContext } from '../../context/AuthContext';
import AddCardModal from './AddCardModal';
// import './style.css'
// import "./rental.css"



function Deals() {

  const columns = [
    // { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'deal_value', headerName: 'Deal value', width: 200 },
    { field: 'lead', headerName: 'Lead', width: 200 },
    { field: 'owner', headerName: 'Owner', width: 200,},
    
    { field: 'updated_at', headerName: 'Updated At', width: 150 ,
    valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')},
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


    const [deals, setDeals] = useState([]);
    const [visible, setVisible] = useState(false)
    const [fetchAgain, setFetchAgain] = useState(false);
    const [cardId, setCardId] = useState();

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios.get('http://localhost:8000/api/deal/get');
        setDeals(result.data);
      };
      fetchData();
    }, [fetchAgain]);

    const handleEdit = (cardId)=>{
      setCardId(cardId)
      setVisible(true);
    }
  
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
            axios.delete(`http://localhost:8000/api/deal/${sr_no}/delete`);
            setDeals(deals.filter((item) => item.id !== sr_no));
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
              <Button aria-label="edit" style={{margin:"0px 10px"}} onClick={()=> handleEdit(params.row.id)}>
                <EditOutlined />
              </Button>
          <Button
            aria-label="delete"
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
    <AddCardModal visible={visible} setVisible ={setVisible} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} cardId={cardId}/>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Deals"
              extra={
                <>
                  <Button type="primary" onClick={()=> setVisible(true)}>
                    Add a deal
                  </Button>
                </>
              }
            >
              <div className="table-responsive">
                <div style={{ height: 750, width: '100%', padding:"15px 20px" }}>
                  <DataGrid
                    rows={deals}
                    columns={columns.concat(actionColumn)}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    getRowClassName={getRowClassName} 
                  />
                </div>

              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Deals;

