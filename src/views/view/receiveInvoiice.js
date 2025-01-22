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
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import moment from 'moment';
import axios from 'axios';
import { url } from 'core/url';

const ReceiveInvoice = () => {
  const location = useLocation();
  const { customerData, row, bookingData } = location.state || {};
  const { rowData } = location.state || {};
  // console.log('Received Row Data:', rowData?.id);

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
  const [allFineData, setAllFineData] = useState([]);
  const [amount, setAmount] = useState();

  const containerRef = useRef();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchData = async () => {
    // console.log(`fetchData`);
    // const Url = `http://localhost:4300/user/getInvoice/${rowData?.id}`;
    const Url = `${url.allotmentManagement.getInvoice}${rowData?.id}`;
    // console.log(`Url`, Url);
    // const response = await axios.get(`http://localhost:4300/user/getInvoice/${rowData?.id}`);
    const response = await axios.get(`${url.allotmentManagement.getInvoice}${rowData?.id}`);
    // console.log('Invoice Data ----------', response?.data[0]);
    // console.log('Invoice Data ----------', response?.data);

    const studentId = response?.data[0]?.studentId;
    // console.log('studentId', studentId);

    const bookId = response?.data[0]?.bookId;
    // console.log('bookId by Hritik>>', bookId);

    const student_Name = response?.data[0]?.studentDetails?.student_Name;
    setStudentName(student_Name);

    const email = response?.data[0]?.studentDetails?.email;
    setStudentEmail(email);

    const mobile_Number = response?.data[0]?.studentDetails?.mobile_Number;
    setStudentMobile_Number(mobile_Number);

    const select_identity = response?.data[0]?.studentDetails?.select_identity;
    setStudentSelectIdentity(select_identity);

    const register_Date = response?.data[0]?.studentDetails?.register_Date;
    setStudentRegister_Date(formatDate(register_Date));

    const bookName = response?.data[0]?.bookDetails?.bookName;
    setBookName(bookName);
    const amount = response?.data[0]?.subscriptionDetails?.amount;
    setStudentAmount(amount);

    const title = response?.data[0]?.subscriptionDetails?.title;
    setStudentTitle(title);

    const discount = response?.data[0]?.subscriptionDetails?.discount;
    setDiscount(discount);

    const bookIssueDate = response?.data[0]?.bookIssueDate;
    const submissionDate = response?.data[0]?.submissionDate;
    setSubmissionDate(formatDate(submissionDate));

    // try {
    //   // const data = await axios.get(`http://localhost:4300/user/findFineInvoice/${studentId}/${bookId}`);

    //   const response = await axios.get(`${url.fine.findFine}${studentId}/${bookId}`);

    //   console.log(`Fine data  >>>>>>>>`, response?.data);
    //   const fine = response?.data?.map((item) => {
    //     const reason = item?.reason;
    //     const fineAmount = item?.fineAmount;
    //     return { reason, fineAmount };
    //   });
    //   setAllFineData(fine);
    //   console.log('fine>>>>>>>>', fine);
    // } catch (error) {
    //   console.log(`error`, error);
    // }

    try {
      // const data = await axios.get(`http://localhost:4300/user/findFineInvoice/${studentId}/${bookId}`);

      const response = await axios.get(`${url.fine.findFine}${studentId}/${bookId}`);

      console.log(`Fine data  >>>>>>>>`, response?.data);

      const fine = response?.data?.map((item) => {
        const reason = item?.reason;
        const fineAmount = item?.fineAmount;
        return { reason, fineAmount };
      });

      const amount = fine.reduce((total, item) => total + item.fineAmount, 0);
      setAmount(amount);
      setAllFineData(fine);
      console.log('fine>>>>>>>>', fine);
      console.log('Total Fine Amount: ', amount);
    } catch (error) {
      console.log(`error`, error);
    }
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
            <h4>Receive Books Invoice</h4>
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
                Select Identity:
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
                Total Price:
              </Typography>
              <Typography variant="body2">{`₹${studentAmount}` || '₹0'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Payment Type:
              </Typography>
              <Typography variant="body2">{studentTitle || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Discount:
              </Typography>
              <Typography variant="body2">{discount ? `₹${discount}` : '₹0' || '₹0'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Submission Date:
              </Typography>
              <Typography variant="body2">{submissionDate}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Paid Amount:
              </Typography>
              <Typography variant="body2">
                {allBookingData?.bookingData?.[0]?.payments?.[0]?.totalPaidAmount
                  ? `₹${
                      allBookingData?.bookingData?.[0]?.payments?.[0]?.totalPaidAmount -
                      allBookingData?.bookingData?.[0]?.payments?.[0]?.discount
                    }`
                  : '₹0' || '₹0'}
              </Typography>
            </Grid>
            <div>
              <Grid container spacing={2}>
                {allFineData?.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          Fine Reason :
                        </Typography>
                        <Typography variant="body2">{item.reason || 'The book has not been fined'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          Fine Amount:
                        </Typography>
                        <Typography variant="body2">{item.fineAmount ? `₹${item.fineAmount}` : '₹0'}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>

          <Grid container spacing={1} mt={2} mb={5}>
            <Grid item xs={12}>
              <Typography variant="h4">Total Amount:</Typography>
              <Typography variant="body2" fontSize="1.1rem">
                {`₹${studentAmount + (amount || 0) - (discount || 0)}` || `₹0.00`}
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

export default ReceiveInvoice;
