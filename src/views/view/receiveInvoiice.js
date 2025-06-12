import React, { useState, useEffect, useRef } from 'react';
import invoice from '../view/invoice.png';
const html2pdf = require('html2pdf.js');
import HomeIcon from '@mui/icons-material/Home';

import { Stack, Button, Container, Typography, Box, Divider, Paper, Grid, Backdrop, CircularProgress } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { getApi } from 'core/apiClient';
import LogoSection from 'layout/MainLayout/LogoSection';

const ReceiveInvoice = () => {
  const location = useLocation();
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
  const [issueDate, setIssueDate] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [bookQuantity, setBookQuantity] = useState('');
  const [allFineData, setAllFineData] = useState([]);
  const [amount, setAmount] = useState();
  const [allotmentId, setAllotmentId] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [bookList, setBookList] = useState([]);

  const rowData = location.state?.rowData;
  const bookId = location.state?.bookId;
  const fineData = location.state?.fine;
  const submissionId = rowData?.id;

  const containerRef = useRef();
  const user = JSON.parse(localStorage.getItem('user'));
  const CompanyName = user?.company;
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchData = async () => {
    try {
      const response = await getApi(url.booksubmission.getsubmitedBookinvoice);
      const allData = response?.data?.data || [];

      const filteredSubmission = allData.find((item) => item._id === submissionId);

      if (!filteredSubmission) {
        console.warn('No data found for the given submissionId');
        return;
      }

      setAllotmentId(filteredSubmission?.allotmentId);

      const student = filteredSubmission?.studentDetails;
      setStudentName(student?.student_Name || 'N/A');
      setStudentEmail(student?.email || 'N/A');
      setStudentMobile_Number(student?.mobile_Number || 'N/A');
      setStudentSelectIdentity(student?.select_identity || 'N/A');
      setStudentRegister_Date(formatDate(student?.register_Date));

      const book = filteredSubmission?.bookDetails;
      setBookName(book?.bookName || 'N/A');

      const subscription = filteredSubmission?.subscriptiontypes?.[0];
      setStudentAmount(filteredSubmission?.amount || 0);
      setBookQuantity(filteredSubmission?.quantity || 0);
      setStudentTitle(subscription?.title || 'N/A');
      setDiscount(subscription?.discount || 0);

      setIssueDate(formatDate(filteredSubmission?.bookIssueDate));
      setSubmissionDate(formatDate(filteredSubmission?.updatedAt));
    } catch (error) {
      console.error('Error fetching submission data:', error);
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
      filename: `invoice_${moment().format('DD-MM_YYYY')}.pdf`,
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
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/Receive" color="inherit" underline="none">
            Receive Invoice
          </MuiLink>
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
              <LogoSection />
            </Box>
            <Box style={{ marginRight: '100px' }}>
              <Typography variant="h1" fontWeight="bold" display="flex" justifyContent="center" alignItems="center" height="5vh">
                {CompanyName}
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
            Book Information
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
                Book Quantity:
              </Typography>
              <Typography variant="body2">{bookQuantity || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Issue Date :
              </Typography>
              <Typography variant="body2">{issueDate || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Submission Date:
              </Typography>
              <Typography variant="body2">{submissionDate}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Subscription Type:
              </Typography>
              <Typography variant="body2">{studentTitle || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Subscription Price:
              </Typography>
              <Typography variant="body2">{`${currencySymbol}${studentAmount}` || `${currencySymbol}0.00`}</Typography>
            </Grid>
          </Grid>
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
            <Typography variant="body1" fontWeight="bold" mb={3} mt={3} ml={1.125}>
              Fine Details
            </Typography>
            {fineData && fineData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>S.No.</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Reason</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fineData.map((fine, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{fine.reason || 'No reason provided'}</TableCell>
                        <TableCell>{fine.amount ? `${currencySymbol}${fine.amount}` : `${currencySymbol}0.00`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: '50px' }}>
                No fines applied.
              </Typography>
            )}
          </Grid>
          <Divider sx={{ mb: 3, borderBottomWidth: 2 }} />
          <Grid container spacing={1} mt={2} mb={5}>
            <Grid item xs={6}>
              <Typography variant="body1" fontWeight="bold">
                Total items:
              </Typography>
              <Typography variant="body2">{bookQuantity || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">Total Amount:</Typography>
              <Typography variant="body2" fontSize="1.1rem">
                {`${currencySymbol}${(
                  (studentAmount || 0) * (bookQuantity || 1) +
                  (fineData?.reduce((acc, item) => acc + Number(item?.amount || 0), 0) || 0)
                ).toFixed(2)}`}
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
