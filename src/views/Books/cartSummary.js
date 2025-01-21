import React from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ summaryData }) => {
  const { studentName, studentEmail, studentId, cartItems, totalAmount } = summaryData;
  const navigate = useNavigate();

  const handleCreateInvoice = async () => {
    const invoiceData = cartItems.map((item) => ({
      bookId: item._id,
      studentId: studentId,
      bookIssueDate: new Date().toISOString(),
      submissionDate: item.submissionDate || null,
      paymentType: item.submissionType,
      quantity: item.quantity,
      amount: item.amount || 0
    }));

    try {
      const response = await fetch('http://localhost:4300/user/manyBookAllotment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('response===============>', result.allotment.studentId);

        console.log('Books allotted successfully:', result);
        navigate(`/dashboard/invoice/${result.allotment.studentId}`, {
          state: { invoiceData, cartItems, studentName, studentEmail, totalAmount }
        });
      } else {
        console.error('Failed to allot books:', response.statusText);
        alert('Failed to allot books. Please try again.');
      }
    } catch (error) {
      console.error('Error allotting books:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Student Details:
      </Typography>
      <Typography>Name: {studentName}</Typography>
      <Typography>Email: {studentEmail}</Typography>

      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
        Books Details
      </Typography>

      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 1, fontWeight: 'bold' }}>Book Name</TableCell>
              <TableCell sx={{ padding: 1, fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ padding: 1, fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ padding: 1, fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ padding: 1, fontWeight: 'bold' }}>Submission Date</TableCell>
            </TableRow>

            {cartItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ padding: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {item.title}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: 1 }}>
                  <Typography variant="body2">{item.quantity || 0}</Typography>
                </TableCell>
                <TableCell sx={{ padding: 1 }}>
                  <Typography variant="body2">₹{(item.amount || 0).toFixed(2)}</Typography>
                </TableCell>
                <TableCell sx={{ padding: 1 }}>
                  <Typography variant="body2">{item.submissionTypeName || 'N/A'}</Typography>
                </TableCell>
                <TableCell sx={{ padding: 1 }}>
                  {item.submissionDate && <Typography variant="body2">{new Date(item.submissionDate).toLocaleDateString()}</Typography>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mt: 3,
          textAlign: 'right',
          borderTop: '1px solid #ddd',
          paddingTop: 2
        }}
      >
        Total Amount: ₹{totalAmount.toFixed(2)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button onClick={handleCreateInvoice} variant="contained" color="primary">
          Create Invoice
        </Button>
        <Button variant="outlined" color="secondary">
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
