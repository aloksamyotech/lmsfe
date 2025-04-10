import React, { useState, useEffect } from 'react';
import { Card, Container, Grid, Typography, Box, FormLabel, TextField, Button, Tabs, Tab } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { bookAllotmentReport, purchaseAllotmentReport, submissionDetailsReport } from 'core/helperFurtion'; // Assuming these are API functions
import { url } from 'core/url';
import BooksModal from 'views/BookAllotment/viewbooks';
import { useTheme, styled } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
const EmailTemplates = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Track selected tab
  const [bookAllotmentData, setBookAllotmentData] = useState([]); // For Book Allotment data
  const [purchaseData, setPurchaseData] = useState([]); // For Purchase data
  const [submissionData, setSubmissionData] = useState([]); // For Submission data
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalAllotmetAmount, setTotalAllotmentAmount] = useState(0);
  const [totalfineAmount, setTotalfineAmount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const CardWrapper = styled(MainCard)(({ theme }) => ({
    // backgroundColor: theme.palette.error.dark, // Change the background color
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
      position: 'relative',
      zIndex: 5
    }
    // '&:before': {
    //   content: '""',
    //   position: 'absolute',
    //   zIndex: 1,
    //   width: 210,
    //   height: 210,
    //   background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
    //   borderRadius: '50%',
    //   top: -160,
    //   right: -130,
    //   opacity: 0.5,
    //   [theme.breakpoints.down('sm')]: {
    //     top: -155,
    //     right: -70
    //   }
    // },
    // '&:after': {
    //   content: '""',
    //   position: 'absolute',
    //   zIndex: 1,
    //   width: 210,
    //   height: 210,
    //   background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
    //   borderRadius: '50%',
    //   top: -30,
    //   right: -180
    // }
  }));

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };

  const [studentId, setStudentId] = useState(null);
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchDataForTab = async () => {
    setLoading(true);
    setBookAllotmentData([]);
    setPurchaseData([]);
    setSubmissionData([]);
    setTotalAllotmentAmount();
    setTotalPurchaseAmount();
    setTotalfineAmount();
    setSubmissionCount();

    try {
      // Fetching Book Allotment Data
      const bookAllotmentResponse = await bookAllotmentReport(`${url.allotmentManagement.bookAllotmentReport}${startDate}/${endDate}`);
      const bookAllotmentFinalData = bookAllotmentResponse?.data?.map((item) => {
        const allotment = item.books[0] || {};
        const book = item.bookDetails || {};
        const student = item.studentDetails || {};
        const paymentType = item.paymentType || {};
        const quantity = allotment.quantity || 0;
        const amount = allotment.amount || 0;
        const totalAmount = quantity * amount || 0;
        return {
          id: item._id,
          bookName: book.bookName || 'No Book Name',
          student_Name: student.student_Name || 'Unknown Student',
          paymentType: paymentType.title || 'Unknown Payment Type',
          quantity,
          amount,
          totalAmount
        };
      });
      const totalallotmentAmount = bookAllotmentFinalData.reduce((sum, item) => sum + item.totalAmount, 0);
      setTotalAllotmentAmount(totalallotmentAmount);
      console.log('total allotment data::', totalallotmentAmount);
      setBookAllotmentData(bookAllotmentFinalData);

      // Fetching Purchase Allotment Data
      const purchaseResponse = await axios.get(`${url.purchaseBook.purchaseReport}${startDate}/${endDate}`);
      const purchaseFinalData = purchaseResponse?.data?.map((item) => {
        const purchaseAmount = item.price || 0;
        const quantity = item.quantity || 0;
        const totalAmount = purchaseAmount * quantity;
        return {
          id: item._id,
          bookName: item.bookDetails.bookName || 'Unknown Book',
          vender_Name: item.vendorDetails.vendorName || 'Unknown Vendor',
          purchaseAmount,
          quantity,
          totalAmount,
          purchaseDate: formatDate(item.bookIssueDate)
        };
      });

      setPurchaseData(purchaseFinalData);
      const totalpurchaseAmount = purchaseFinalData.reduce((sum, item) => sum + item.totalAmount, 0);
      setTotalPurchaseAmount(totalpurchaseAmount);
      console.log('total purchase data::', totalpurchaseAmount);
      const submissionResponse = await axios.get(`${url.allotmentManagement.submissionReport}${startDate}/${endDate}`);
      const submissionFinalData = submissionResponse?.data?.map((item) => {
        const allotment = item.books[0] || {};
        const book = item.bookDetails || {};
        const student = item.studentDetails || {};
        const finedetails = item.finedetalis || {};
        const paymentType = item.paymentType || {};
        const quantity = allotment.quantity || 0;
        const amount = allotment.amount || 0;
        const totalAmount = quantity * amount || 0;
        const submissionDate = formatDate(item.updatedAt);
        const bookCount = item.books ? item.books.length : 0;

        return {
          id: item._id,
          bookName: book.bookName || 'No Book Name',
          student_Name: student.student_Name || 'Unknown Student',
          paymentType: paymentType.title || 'Unknown Payment Type',
          quantity,
          amount,
          totalAmount,
          submissionDate,
          fine: allotment.fine || 'NULL',
          fineamount: finedetails.fineAmount || 0,
          bookCount // Store the bookCount here
        };
      });

      // To calculate the total book count, sum up the bookCount values from submissionFinalData
      const totalBookCount = submissionFinalData.reduce((sum, item) => sum + item.bookCount, 0);
      console.log('Total books count: ', totalBookCount); // Log the total count of books
      setSubmissionCount(totalBookCount);
      // To calculate the total fine amount
      const totalfineAmount = submissionFinalData.reduce((sum, item) => sum + item.fineamount, 0);
      setTotalfineAmount(totalfineAmount);

      // Set the submission data to state
      setSubmissionData(submissionFinalData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForTab();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const columnsForBookAllotment = [
    // {
    //   field: 'serialNo',
    //   headerName: 'Serial No.',
    //   flex: 0.5,
    //   renderCell: (params) => {
    //     return params.rowIndex + 1; // Serial number starts from 1
    //   },
    // },
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'student_Name', headerName: 'Student Name', flex: 1 },
    { field: 'paymentType', headerName: 'Payment Type', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
    { field: 'amount', headerName: 'Amount', flex: 0.5 },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 0.5 },
  ];
  

  const columnsForPurchase = [
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'vender_Name', headerName: 'Vender Name', flex: 1 },
    { field: 'purchaseAmount', headerName: 'Price per book', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'totalAmount', headerName: 'Total Amount', flex: 1 },
    { field: 'purchaseDate', headerName: 'Purchase Date', flex: 1 }
  ];

  const columnsForSubmission = [
    { field: 'student_Name', headerName: 'Student Name', flex: 1 },
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'submissionDate', headerName: 'Submission Date', flex: 1 },
    {
      field: 'fine',
      headerName: 'Fine Status',
      flex: 1,
      valueGetter: (params) => {
        // If 'fine' is true, display 'Applied'. If false, display 'Not'.
        return params.row.fine === true ? 'Applied' : 'Not Applied';
      }
    }
    // {field :'fineamount',headerName:'Fine Amount', flex:1},
  ];

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
            <h4>Book Allotment Report</h4>
          </Link>
        </Breadcrumbs>
      </Box>

      <Card style={{ paddingTop: '10px' }}>
        <Formik initialValues={{ startDate, endDate }} onSubmit={() => {}}>
          {({ values, handleChange }) => (
            <Form>
              <Box width="100%" padding="30px">
                <Typography style={{ marginBottom: '15px' }} variant="h3">
                  Choose Date Range
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormLabel>Start Date</FormLabel>
                    <TextField
                      name="startDate"
                      type="date"
                      size="small"
                      fullWidth
                      value={values.startDate}
                      onChange={(e) => {
                        handleChange(e);
                        setStartDate(e.target.value);
                      }}
                      inputProps={{
                        max: values.endDate
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormLabel>End Date</FormLabel>
                    <TextField
                      name="endDate"
                      type="date"
                      size="small"
                      fullWidth
                      value={values.endDate}
                      onChange={(e) => {
                        handleChange(e);
                        setEndDate(e.target.value);
                      }}
                      inputProps={{
                        min: values.startDate
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={fetchDataForTab}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <CardWrapper border={false} content={false} sx={{ marginTop: '30px', width: '22%', height: '40%' }}>
          <Box sx={{ paddingLeft: '50px' }}>
            <Grid container direction="column">
              <Grid container justifyContent="space-between">
                <Grid item>
                  <AddShoppingCartIcon
                    sx={{
                      fontSize: 45,
                      verticalAlign: 'middle',
                      marginRight: 1,
                      color: 'black',
                      borderRadius: '50%',
                      padding: 1
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                        color: 'black'
                      }}
                    >
                      {`Total Purchase`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                      {totalPurchaseAmount}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
        <CardWrapper border={false} content={false} sx={{ marginTop: '30px', width: '22%' }}>
          <Box sx={{ paddingLeft: '48px' }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <BookmarkRemoveIcon
                      sx={{
                        fontSize: 45,
                        verticalAlign: 'middle',
                        marginRight: 1,
                        color: 'black',
                        borderRadius: '50%',
                        padding: 1
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                        color: 'black'
                      }}
                    >
                      {`Total Book Allotment`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                      {totalAllotmetAmount}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
        <CardWrapper border={false} content={false} sx={{ marginTop: '30px', width: '22%' }}>
          <Box sx={{ paddingLeft: '48px' }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <MoneyOffCsredIcon
                      sx={{
                        fontSize: 45,
                        verticalAlign: 'middle',
                        marginRight: 1,
                        color: 'black',
                        borderRadius: '50%',
                        padding: 1
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                        color: 'black'
                      }}
                    >
                      {`Total Fine`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                      {totalfineAmount}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
        <CardWrapper border={false} content={false} sx={{ marginTop: '30px', width: '22%' }}>
          <Box sx={{ paddingLeft: '50px' }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <BookmarkAddRoundedIcon
                      sx={{
                        fontSize: 45,
                        verticalAlign: 'middle',
                        marginRight: 1,
                        color: 'black',
                        borderRadius: '50%',
                        padding: 1
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                        color: 'black'
                      }}
                    >
                      {`Total Book recive`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '15px', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                      {submissionCount}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      </Box>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Book Allotment Tabs" sx={{ marginTop: '20px' }}>
        <Tab label="Book Allotment" />
        <Tab label="Purchase Details" />
        <Tab label="Submission Details" />
      </Tabs>
      {loading ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={4}>
          Loading...
        </Typography>
      ) : (
        <Box sx={{ marginTop: '30px' }}>
          {selectedTab === 0 &&
            (bookAllotmentData.length > 0 ? (
              <Box sx={{ height: 'auto', overflow: 'auto', backgroundColor: 'white' }}>
                <DataGrid
                  rows={bookAllotmentData}
                  columns={columnsForBookAllotment}
                  pageSize={5}
                  components={{ Toolbar: GridToolbar }}
                  style={{ height: '100%', width: '100%' }}
                />
              </Box>
            ) : (
              <Typography variant="h6" color="textSecondary" align="center">
                No data available for Book Allotment
              </Typography>
            ))}

          {selectedTab === 1 &&
            (purchaseData.length > 0 ? (
              <Card sx={{ height: 'auto' }}>
                <DataGrid rows={purchaseData} columns={columnsForPurchase} pageSize={5} components={{ Toolbar: GridToolbar }} />
              </Card>
            ) : (
              <Typography variant="h6" color="textSecondary" align="center">
                No data available for Purchase Allotment
              </Typography>
            ))}

          {selectedTab === 2 &&
            (submissionData.length > 0 ? (
              <Card sx={{ height: 'auto' }}>
                <DataGrid rows={submissionData} columns={columnsForSubmission} pageSize={5} components={{ Toolbar: GridToolbar }} />
              </Card>
            ) : (
              <Typography variant="h6" color="textSecondary" align="center">
                No data available for Submission Details
              </Typography>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default EmailTemplates;
