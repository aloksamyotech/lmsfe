import React, { useState, useEffect, useRef } from 'react';
import invoice from '../view/invoice.png';
const html2pdf = require('html2pdf.js');
import HomeIcon from '@mui/icons-material/Home';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Divider,
  Paper,
  Grid,
  Backdrop,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { url } from 'core/url';

const BookInvoice = () => {
  const location = useLocation();
  const { rowData } = location.state || {};
  const [allInvoiceData, setAllInvoiceData] = useState();
  const [allBookingData, setAllBookingData] = useState([]);
  const [allItemData, setAllItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentAmount, setStudentAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [newData, setNewData] = useState('');
  const [mappedData, setMappedData] = useState('');
  const [payment, setPayment] = useState('');
  const containerRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    const urlWindow = window.location.href;
    setCurrentUrl(urlWindow);
    const parts = urlWindow.split('/');
    const extractedId = parts[parts.length - 1];
    // const response = await axios.get(`http://localhost:4300/user/getBookAllotmentInvoice/${extractedId}`);
    const response = await axios.get(`${url.bookAllotmentHistory.getBookAllotmentInvoice}${extractedId}`);
    console.log('Invoice Data ----------', response?.data);
    setAllInvoiceData(response?.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setAllItemData(allBookingData?.items);
  }, [allBookingData?.items]);

  const handlePrint = () => {
    const element = containerRef.current;
    const options = {
      margin: 10,
      filename: `invoice_${allBookingData?.bookingData?.[0]?.customer?.[0]?.name}${moment().format('DD-MM_YYYY')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  };
  const totalAmount = allInvoiceData?.allotmentDetails?.reduce((acc, item) => {
    return acc + (item?.amount ?? 0);
  }, 0);

  const totalAmountAfterDiscount = totalAmount - (discount ?? 0);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px',
          marginLeft: '2.5%',
          width: '95%'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '-12px' }}>
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6A1B9A' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
            <h4> Books Allotment Invoice</h4>
          </Link>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      {loading && (
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Container>
        <Paper
          ref={containerRef}
          elevation={4}
          sx={{
            p: 6,
            borderRadius: '12px',
            mb: 6,
            maxWidth: 'auto',
            minHeight: 'auto',
            position: 'relative'
          }}
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
          <Typography variant="h4" mb={3} mt={3}>
            Student Information
          </Typography>
          <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Name:
              </Typography>
              <Typography variant="body2">{allInvoiceData?.studentDetails?.student_Name ?? 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Phone:
              </Typography>
              <Typography variant="body2">{allInvoiceData?.studentDetails?.mobile_Number ?? 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Email:
              </Typography>
              <Typography variant="body2">{allInvoiceData?.studentDetails?.email ?? 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Select Identity:
              </Typography>
              <Typography variant="body2">{allInvoiceData?.studentDetails?.select_identity ?? 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Register Date:
              </Typography>
              <Typography variant="body2">{formatDate(allInvoiceData?.studentDetails?.register_Date ?? 'N/A')}</Typography>
            </Grid>
          </Grid>
          <Typography variant="h4" mb={3} mt={3}>
            Payment Information
          </Typography>
          <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
          {allInvoiceData?.allotmentDetails?.map((item, index) => {
            console.log(`item`, item?.bookDetails?.bookName);
            return (
              <div key={index}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Book Name:
                    </Typography>
                    <Typography variant="body2">{item?.bookDetails?.bookName ?? 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Total Price:
                    </Typography>
                    <Typography variant="body2">{`₹${item?.amount ?? '0'}`}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Advance Payment:
                    </Typography>
                    <Typography variant="body2">{'₹0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Discount:
                    </Typography>
                    <Typography variant="body2">{discount ? `₹${discount}` : '₹0'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Payment Type:
                    </Typography>
                    <Typography variant="body2">{item?.paymentDetails?.title ?? 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Paid Amount:
                    </Typography>
                    <Typography variant="body2">{`₹${'0'}`}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Submission Date:
                    </Typography>
                    <Typography variant="body2">{formatDate(item?.submissionDate ?? 'N/A')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Total Paid Amount:
                    </Typography>
                    <Typography variant="body2">{`₹${item?.amount ?? '0'}`}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
              </div>
            );
          })}
          <Grid container spacing={1} mt={2} mb={5}>
            <Grid item xs={12}>
              <Typography variant="h4">Total Amount:</Typography>
              <Typography variant="body2" fontSize="1.1rem">
                {`₹${totalAmountAfterDiscount ?? `₹0.00`}`}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ position: 'absolute', bottom: '20px', right: '20px' }}>
            <Typography variant="body2" fontSize="1.1rem" color="text.secondary">
              SAMYOTECH
            </Typography>
          </Box>
        </Paper>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default BookInvoice; 