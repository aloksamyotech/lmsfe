import React from 'react';
import { Box, Typography, Grid, Button, Paper, Divider, Stack } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

const PaymentReceipt = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, margin: 'auto' }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          Payment Receipt Details <span style={{ color: '#d3d3d3' }}>#00013655</span>
        </Typography>
        <Button variant="contained" color="primary" startIcon={<PrintIcon />}>
          Print
        </Button>
      </Box>

      {/* Company Info */}
      <Stack direction="row" spacing={2} alignItems="center" my={2}>
        <img
          src="https://via.placeholder.com/50" // Placeholder for avatar
          alt="Profile"
          style={{ borderRadius: '50%', width: 50, height: 50 }}
        />
        <Box>
          <Typography variant="h6">Material Ui-SAAS</Typography>
          <Typography variant="body2" color="text.secondary">
            CT-205 &nbsp; | &nbsp; <a href="#">Get Link</a>
          </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Typography variant="body2">No. of Invoice</Typography>
            <Typography fontWeight="bold">1</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Method</Typography>
            <Typography fontWeight="bold">Case</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Amount</Typography>
            <Typography fontWeight="bold">$2748</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Reference</Typography>
            <Typography fontWeight="bold">#00073730</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Bank charges</Typography>
            <Typography fontWeight="bold">$10</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">Create Date</Typography>
            <Typography fontWeight="bold">27/11/2024</Typography>
          </Grid>
        </Grid>
      </Stack>

      <Divider />

      {/* Address Details */}
      <Grid container my={3}>
        <Grid item xs={6}>
          <Typography variant="h6">Bill To</Typography>
          <Typography variant="body2">
            <strong>Address:</strong> 128 Rue La Boétie, Paris, Île-de-France 75008, FR
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> accounts@material-ui.com
          </Typography>
          <Typography variant="body2">
            <strong>SIREN:</strong> 852357748
          </Typography>
          <Typography variant="body2">
            <strong>VAT:</strong> FR93852357748
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Ship To</Typography>
          <Typography variant="body2">
            128 Rue La Boétie, Paris, Île-de-France 75008, FR
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      {/* Invoice Table */}
      <Box mt={3}>
        <Grid container sx={{ backgroundColor: '#f5f5f5', p: 1 }}>
          <Grid item xs={3}>
            <Typography fontWeight="bold">Issue Date</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight="bold">Invoice No.</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight="bold">Due Date</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight="bold">Due Amount</Typography>
          </Grid>
        </Grid>

        {/* Invoice Data */}
        <Grid container sx={{ p: 1 }}>
          <Grid item xs={3}>
            <Typography>7/6/2022</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>#8795646525453</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>7/8/2022</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>$3000</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Payment Summary */}
      <Box mt={2} sx={{ backgroundColor: '#e3f2fd', p: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body1">
              <strong>Total Payment Amount:</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" fontWeight="bold">
              $2748
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" mt={1}>
          <Grid item>
            <Typography variant="body1">
              <strong>Total Due Amount:</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" fontWeight="bold">
              $252
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Notes */}
      <Box mt={3}>
        <Typography variant="h6">Notes</Typography>
        <Typography variant="body2" color="text.secondary">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </Box>

      {/* Footer */}
      <Box mt={3} textAlign="right">
        <Typography variant="body2" fontWeight="bold">
          Have Question?
        </Typography>
        <Typography variant="body2" color="primary">
          Support@Berrytheme.com
        </Typography>
      </Box>
    </Paper>
  );
};

export default PaymentReceipt;
