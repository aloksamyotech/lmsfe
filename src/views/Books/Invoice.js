import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import invoice from '../view/invoice.png';

const InvoicePage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();
  const { invoiceData, studentName, studentEmail, totalAmount, cartItems } = state;
  useEffect(() => {
    console.log('cartitems------------', invoiceData );
  }, []);
  const handlePrint = () => {
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

    navigate('/dashboard/bookAllotment');
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: '850px',
        margin: 'auto',
        backgroundColor: '#fff',
        boxShadow: 3,
        borderRadius: 2
      }}
      ref={printRef}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box style={{ marginRight: '50px' }}>
          <img src={invoice} alt="Screenshot" style={{ width: '100px', height: 'auto' }} />
        </Box>
        <Box style={{ marginRight: '100px' }}>
          <Typography variant="h1" fontWeight="bold" display="flex" justifyContent="center" alignItems="center" height="5vh">
            SAMYOTECH
          </Typography>
          <Typography variant="h2" fontWeight="bold" display="flex" justifyContent="center" alignItems="center" height="10vh">
            LIBRARY MANAGEMENT SYSTEM
          </Typography>
        </Box>
      </Box>
      <Typography variant="h3" fontWeight="bold" mt={3}>
        Invoice
      </Typography>
      <Typography variant="h4" align="right" mb={3}>
        Date: {moment().format('MMMM D, YYYY')}
      </Typography>

      <Paper sx={{ padding: 1, marginBottom: 1 }}>
        <Typography variant="h4" gutterBottom>
          Student Information
        </Typography>
        <Typography variant="body1">Name: {studentName}</Typography>
        <Typography variant="body1">Email: {studentEmail}</Typography>
        <Typography variant="body1">Invoice Date: {new Date().toLocaleDateString()}</Typography>
      </Paper>

      <Paper sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Book Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book Name</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Submission Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">₹{item.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">{item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Total Amount
        </Typography>
        <Typography variant="h4" color="primary" fontWeight="bold">
          ₹{totalAmount.toFixed(2)}
        </Typography>
      </Paper>

      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default InvoicePage;
