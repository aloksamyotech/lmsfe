import React from 'react';
import { Box, Typography, Button, Grid, Divider, Paper } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';

const InvoicePage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { invoiceData, studentName, studentEmail, totalAmount, cartItems } = state;

  const handlePrint = (index) => {
    const printContents = document.getElementById(`printable-card`).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
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
      id="printable-card"
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
        Samyotech Library Management
      </Typography>
      {/* Invoice Header */}
      <Paper sx={{ padding: 1, marginBottom: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Invoice
            </Typography>
            <Typography variant="h6" gutterBottom>
              Student: {studentName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Email: {studentEmail}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Invoice ID: {id}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Invoice Date: {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ marginBottom: 2 }} />

      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Books Details
        </Typography>

        <Grid container spacing={2} sx={{ borderBottom: 2, paddingBottom: 1, marginBottom: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body1" fontWeight="bold">
              Book Name
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" fontWeight="bold">
              Quantity
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" fontWeight="bold">
              Amount
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" fontWeight="bold">
              Submission Date
            </Typography>
          </Grid>
        </Grid>

        {cartItems.map((item, index) => (
          <Grid container spacing={2} sx={{ borderBottom: 1, paddingBottom: 1 }} key={index}>
            <Grid item xs={6}>
              <Typography variant="body2">{item.title}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">{item.quantity}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">₹{item.amount.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">{item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : 'N/A'}</Typography>
            </Grid>
          </Grid>
        ))}
      </Paper>

      {/* Total Amount */}
      <Paper sx={{ padding: 3, marginTop: 1 }}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={6} textAlign="right">
            <Typography variant="h6" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ₹{totalAmount.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Print Button */}
      <Box sx={{ textAlign: 'center', marginTop: 1 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default InvoicePage;
