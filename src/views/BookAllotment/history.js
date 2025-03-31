import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BooksModal from './viewbooks.js';
import { Stack } from '@mui/material';
import {
  Box,
  Button,
  Card,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IconButton from '@mui/material/IconButton';


const History = () => {
  const [students, setStudents] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const printRef = useRef();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
  };

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
        studentMobile: item.studentMobile
      }));
      setStudents(formattedData);
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

  const handleGenerateInvoice = (row) => {
    setInvoiceData({
      studentName: row.studentName,
      studentEmail: row.studentEmail,
      studentMobile: row.studentMobile,
      books: row.books,
      totalAmount: row.totalAmount
    });
    setShowInvoice(true);
  };

  const handlePrintInvoice = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
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

      <div>
        <BooksModal show={showModal} handleClose={handleCloseModal} books={selectedBooks} studentName={studentName} />
      </div>

      {/* Invoice Modal */}
      <Dialog open={showInvoice} onClose={handleCloseInvoice} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Invoice for{' '}
          {invoiceData ? `${invoiceData.studentName} - ${invoiceData.books.map((book) => book.bookName).join(', ')}` : 'Loading...'}
        </DialogTitle>
        <DialogContent>
          {invoiceData && (
            <>
              <Typography variant="h6">Student Information:</Typography>
              <Typography>Name: {invoiceData.studentName}</Typography>
              <Typography>Email: {invoiceData.studentEmail}</Typography>
              <Typography>Phone: {invoiceData.studentMobile}</Typography>

              <Typography variant="h6" sx={{ marginTop: '20px' }}>
                Books Details:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Name</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Submission Date</TableCell>
                      <TableCell align="center">Submission Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData.books.map((book, index) => (
                      <TableRow key={index}>
                        <TableCell>{book.bookName}</TableCell>
                        <TableCell align="center">{book.quantity}</TableCell>
                        <TableCell align="center">{book.amount}</TableCell>

                        {/* Convert and display submissionDate */}
                        <TableCell align="center">
                          {book.submissionDate
                            ? (() => {
                                const [day, month, year] = book.submissionDate.split('/');

                                const formattedDate = new Date(`${year}-${month}-${day}`);
                                return !isNaN(formattedDate) ? formattedDate.toLocaleDateString() : 'Invalid Date';
                              })()
                            : 'N/A'}
                        </TableCell>

                        {/* Display submission type */}
                        <TableCell align="center">{book.submissionType || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h5" fontWeight="bold" sx={{ marginTop: '20px' }}>
                Total Amount: {invoiceData.totalAmount}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handlePrintInvoice}>
            Print
          </Button>
          <Button onClick={handleCloseInvoice} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default History;
