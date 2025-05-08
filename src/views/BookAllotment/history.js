import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BooksModal from './viewbooks.js';
import { Stack } from '@mui/material';
import { Box, Card, Paper, TableContainer } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IconButton from '@mui/material/IconButton';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman'; 
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { getApi } from 'core/apiClient.js';
const History = ({ allotmentId }) => {
  const [students, setStudents] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getApi(url.bookAllotmentHistory.getdataalocated);
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
    const allotmentId = row.allotmentId;

    navigate(`/dashboard/bookAllotmentInvoice/${allotmentId}`, {
      state: { allotmentId }
    });
  };
  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
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
      field: 'totalAmount',
      headerName: 'Paid Amount',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'generateInvoice',
      headerName: 'Invoice',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          style={{
            color: '#007bff',
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
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          justifyContent: 'space-between',
          marginBottom: '-18px'
        }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/BookManagement" color="inherit" underline="none">
            Book Managment
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/History" color="inherit" underline="none">
            History
          </MuiLink>
        </Breadcrumbs>
      </Box>
      <TableContainer component={Paper}sx={{marginTop:'40px'}}>
        <Box width="100%" mt={3}>
          <Card style={{ height: '750px' }}>
            <DataGrid
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pagination
              rows={students.map((row, index) => ({ ...row, sNo: index + 1 }))}
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
