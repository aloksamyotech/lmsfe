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
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { getBookAllotmentHistory } from 'core/helperFurtion';
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
      const response = await getBookAllotmentHistory(url.bookAllotmentHistory.getdataalocated);
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
      headerName: 'Total Amount',
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
      headerName: 'Generate Invoice',
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
