import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BooksModal from './viewbooks.js';
import { Stack } from '@mui/material';
import { Box, Card, Paper, TableContainer } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IconButton from '@mui/material/IconButton';

const History = ({ allotmentId }) => {
  const [students, setStudents] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4300/user/getdataalocated');
      console.log('response-----', response);
      const formattedData = response.data.response.map((item) => ({
        id: item._id || Math.random().toString(),
        studentName: item.studentName,
        email: item.studentEmail,
        books: item.books || [],
        studentEmail: item.studentEmail,
        totalAmount: item.totalAmount,
        quantity: item.quantity,
        studentMobile: item.studentMobile,
        allotmentId: item.allotmentId
      }));
      setStudents(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateInvoice = (row) => {
    // Make sure row.allotmentId exists and is valid
    const allotmentId = row.allotmentId;

    // Ensure you are passing the correct allotmentId in the state
    navigate(`/dashboard/bookAllotmentInvoice/${allotmentId}`, {
      state: { allotmentId } // Sending allotmentId in state
    });

    console.log('Allotment ID:------- ', allotmentId); // Check if it logs the correct value
  };
  const columns = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1
    },
    {
      field: 'studentEmail',
      headerName: 'Email',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'studentMobile',
      headerName: 'Mobile',
      flex: 1
    },
    {
      field: 'generateInvoice',
      headerName: 'Generate Invoice',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          style={{
            color: '#007bff',
            // backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            padding: '8px'
          }}
          onClick={() => handleGenerateInvoice(params.row)}
        >
          <ReceiptIcon />
        </IconButton>
      )
    }
  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Box width="100%" mt={3}>
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={students}
              columns={columns}
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableContainer>
    </>
  );
};

export default History;
