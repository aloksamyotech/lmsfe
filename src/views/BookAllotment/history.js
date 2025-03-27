import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BooksModal from './viewbooks.js';
import { Stack } from '@mui/material';
import {
  Box,
  Card,
  Paper,
  TableContainer,
} from '@mui/material';
const History=()=>{
    const [studentss, setStudentss] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => {
      setShowModal(false);
    };
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getdataalocated');
        const formattedData = response.data.response.map((item) => ({
          id: item._id || Math.random().toString(),
          studentName: item.studentName,
          email: item.studentEmail,
          books: item.books || [],
          bookName: item.bookName,
          studentEmail: item.studentEmail,
          bookAuthor: item.bookAuthor,
          submissionDate: item.submissionDate,
          amount: item.amount,
          totalAmount: item.totalAmount,
          quantity: item.quantity,
          studentMobile: item.studentMobile
        }));
        setStudentss(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
     useEffect(() => {
        fetchData();
      }, []);
      const handleViewBooks = (row) => {
        setSelectedBooks(row.books);
        setStudentName(row.studentName);
        setShowModal(true);
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
          field: 'viewBooks',
          headerName: 'View Books',
          flex: 1,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
            <button
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                border: 'none',
                background: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
              onClick={() => handleViewBooks(params.row)}
            >
              View
            </button>
          )
        }
      ];
      const rows = [
        {
          id: 1,
          studentName: 'John Doe',
          quantity: 2,
          books: [
            { bookName: 'Book A', quantity: 1 },
            { bookName: 'Book B', quantity: 1 }
          ]
        }
      ];
    return(
      <>
        {/* <Box
                sx={{
                  backgroundColor: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  height: '50px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  marginBottom: '-18px'
                }}
              >
                <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '-12px' }}>
                  <Link href="/" underline="hover" color="inherit">
                    <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
                  </Link>
                  <Link href="/account-profile" underline="hover" color="inherit">
                    <h4>Books Management / History</h4>
                  </Link>
                </Breadcrumbs>
                <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
        </Box> */}
        <TableContainer component={Paper}>
          <Box width="100%" mt={3}>
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={studentss}
                columns={columns}
                // checkboxSelection
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableContainer>

        <div>
          <BooksModal show={showModal} handleClose={handleCloseModal} books={selectedBooks} studentName={studentName} />
        </div>
      </>
    );
};

export default History