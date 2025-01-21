import React, { useState, useEffect, useRef } from 'react';
import invoice from '../view/invoice.png';
const html2pdf = require('html2pdf.js');
import HomeIcon from '@mui/icons-material/Home';

import {
  Stack,
  Button,
  Container,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Table,
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
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
// import { url } from 'api/url';

import moment from 'moment';
import axios from 'axios';
import { url } from 'core/url';
// import html2pdf from 'html2pdf.js';
// import { allBooking, allItems } from 'api/apis';

const PurchaseInvoice = () => {
  const location = useLocation();
  const { customerData, row, bookingData } = location.state || {};
  const { rowData } = location.state || {};
  console.log('Received Row Data:', rowData?.id);

  const customerId = customerData?._id ? customerData?._id : bookingData?.customerId;
  const bookingId = row?._id ? row?._id : bookingData?._id;

  let totalPrice = 0;
  const [allBookingData, setAllBookingData] = useState([]);
  const [allItemData, setAllItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentMobile_Number, setStudentMobile_Number] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentSelectIdentity, setStudentSelectIdentity] = useState('');
  const [studentRegister_Date, setStudentRegister_Date] = useState('');
  const [bookName, setBookName] = useState('');
  const [studentTitle, setStudentTitle] = useState('');
  const [studentAmount, setStudentAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [quantity, setQuantity] = useState('');

  const containerRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    console.log(`fetchData>>>>>>>>>>>>>>`);
    // const Url = `http://localhost:4300/user/getInvoice/${rowData?.id}`;
    // console.log(`Url`, Url);
    const response = await axios.get(`http://localhost:4300/user/getPurchaseInvoice/${rowData?.id}`);

    // const response = await getPurchaseInvoices(`${url.purchaseBook.getPurchaseInvoice}${rowData?.id}`);

    const student_Name = response?.data[0]?.vendorDetails?.vendorName;

    setStudentName(student_Name);

    const email = response?.data[0]?.vendorDetails?.email;
    setStudentEmail(email);

    const mobile_Number = response?.data[0]?.vendorDetails?.phoneNumber;
    setStudentMobile_Number(mobile_Number);

    const select_identity = response?.data[0]?.vendorDetails?.companyName;
    setStudentSelectIdentity(select_identity);

    const register_Date = response?.data[0]?.vendorDetails?.date;
    setStudentRegister_Date(formatDate(register_Date));

    const bookName = response?.data[0]?.bookDetails?.bookName;
    setBookName(bookName);
    const amount = response?.data[0]?.price;
    setStudentAmount(amount);

    const title = response?.data[0]?.subscriptionDetails?.title;
    setStudentTitle(title);

    const discount = response?.data[0]?.subscriptionDetails?.discount;
    setDiscount(discount);

    const quantity = response?.data[0]?.quantity;
    setQuantity(quantity);

    const bookIssueDate = response?.data[0]?.bookIssueDate;
    const submissionDate = response?.data[0]?.bookIssueDate;
    setSubmissionDate(formatDate(submissionDate));

    console.log('bookName', bookName);
    console.log('student Name >>', student_Name);
    console.log('email >>', email);
    console.log(' amount >>', amount);
    console.log('bookIssueDate', bookIssueDate);
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
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
            <h4>Purchase Books Invoice</h4>
          </Link>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      {loading && (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
          // onClick={handleClose}
        >
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

          <Typography variant="h3" fontWeight="bold" sx={{ mt: 3 }}>
            Invoice
          </Typography>

          <Typography variant="h4" align="right" mb={6} sx={{ mb: 3 }}>
            Date: {moment().format('MMMM D, YYYY')}
          </Typography>

          <Typography variant="h4" mb={3} mt={1}>
            Vendor Information
          </Typography>
          <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Name:
              </Typography>
              <Typography variant="body2">{studentName || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Phone:
              </Typography>
              <Typography variant="body2">{studentMobile_Number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Email:
              </Typography>
              <Typography variant="body2">{studentEmail || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Company Name:
              </Typography>
              <Typography variant="body2">{studentSelectIdentity || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Register Date:
              </Typography>
              <Typography variant="body2">{studentRegister_Date || 'N/A'}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h4" mb={3} mt={3}>
            Payment Information
          </Typography>
          <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Book Name:
              </Typography>
              <Typography variant="body2">{bookName || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Par Book Price:
              </Typography>
              <Typography variant="body2">{`₹${studentAmount}` || '₹0'}</Typography>
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
              <Typography variant="body2">{discount ? `₹${discount}` : '₹0' || '₹0'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Book Purchase Date:
              </Typography>
              <Typography variant="body2">{submissionDate}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Quantity:
              </Typography>
              <Typography variant="body2">{quantity || '₹0'}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={2} mb={5}>
            <Grid item xs={12}>
              <Typography variant="h4">Total Amount:</Typography>
              <Typography variant="body2" fontSize="1.1rem">
                {`₹${studentAmount * quantity || `₹0.00`}`}
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

export default PurchaseInvoice;
