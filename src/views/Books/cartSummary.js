import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { toast } from 'react-toastify';
import { postApi } from 'core/apiClient';

const CartSummary = ({ summaryData }) => {
  const { studentName, studentEmail, studentId, cartItems, totalAmount } = summaryData;
  const navigate = useNavigate();
  const { setCartcontextItems } = useCart();
  const [currencySymbol, setCurrencySymbol] = useState('');
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const handleCreateInvoice = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const adminId = user?._id;
    const invoiceData = cartItems.map((item) => ({
      bookId: item._id,
      studentId: studentId,
      bookIssueDate: new Date().toISOString(),
      submissionDate: item.submissionDate || null,
      paymentType: item.submissionType,
      quantity: item.quantity,
      amount: item.amount || 0,
      adminId
    }));
    try {
      const response = await postApi(url.allotmentManagement.manyBookAllotment, invoiceData);

      if (response.status === 200 || response.status === 201) {
        const result = response.data;

        setCartcontextItems([]);
        localStorage.setItem('librarycart', JSON.stringify([]));
        localStorage.setItem('librarycartCount', JSON.stringify(0));

        navigate(`/dashboard/bookAllotmentInvoice/${result.allotment._id}`, {
          state: {
            allotmentId: result.allotment._id,
            invoiceData,
            cartItems,
            studentName,
            studentEmail,
            totalAmount
          }
        });
      } else {
        toast.error(response.data?.message || 'Failed to allot books. Please try again.');
      }
    } catch (error) {
      console.error('Error while allotting books:', error);
    }
  };
  const formattedTotalAmount = !isNaN(totalAmount) ? totalAmount.toFixed(2) : '0.00';
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
                  <Typography variant="body2">
                    {currencySymbol}
                    {(item.amount || 0).toFixed(2)}
                  </Typography>
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
        Total Amount: {currencySymbol}{totalAmount.toFixed(2)}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button onClick={handleCreateInvoice} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
