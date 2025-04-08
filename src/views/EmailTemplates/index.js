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

const EmailTemplates = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Track selected tab
  const [bookAllotmentData, setBookAllotmentData] = useState([]); // For Book Allotment data
  const [purchaseData, setPurchaseData] = useState([]); // For Purchase data
  const [submissionData, setSubmissionData] = useState([]); // For Submission data
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const CardWrapper = styled(MainCard)(({ theme }) => ({
    // backgroundColor: theme.palette.error.dark, // Change the background color
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
      position: 'relative',
      zIndex: 5
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      width: 210,
      height: 210,
      background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
      borderRadius: '50%',
      top: -160,
      right: -130,
      opacity: 0.5,
      [theme.breakpoints.down('sm')]: {
        top: -155,
        right: -70
      }
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      zIndex: 1,
      width: 210,
      height: 210,
      background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
      borderRadius: '50%',
      top: -30,
      right: -180
    }
  }));

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    // Clear data when changing tab
    if (newValue === 0) {
      setBookAllotmentData([]); // Clear Book Allotment data
    } else if (newValue === 1) {
      setPurchaseData([]); // Clear Purchase data
    } else if (newValue === 2) {
      setSubmissionData([]); // Clear Submission data
    }
  };

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

  // Function to handle API calls based on selected tab
  const fetchDataForTab = async () => {
    setBookAllotmentData([]);
    setLoading(true);
    try {
      if (selectedTab === 0) {
        // Book Allotment Tab
        const response = await bookAllotmentReport(`${url.allotmentManagement.bookAllotmentReport}${startDate}/${endDate}`);
        console.log('Response from allotment tab:', response);

        const finalData = response.data.map((item) => {
          const allotment = item.books[0] || {};
          const book = item.bookDetails || {};
          const student = item.studentDetails || {};
          const paymentType = item.paymentType || {};
          const quantity = allotment.quantity || 0; // Default to 0 if quantity is not available
          const amount = allotment.amount || 0; // Default to 0 if amount is not available
          const totalAmount = quantity * amount || 0; // Calculate total amount

          return {
            id: item._id,
            bookName: book.bookName ? `${book.bookName}` : 'No Book Name', // Book Name
            student_Name: student.student_Name || 'Unknown Student', // Student Name
            paymentType: paymentType.title || 'Unknown Payment Type', // Payment Type
            quantity: quantity || 'NULL', // Quantity (or NULL if unavailable)
            amount: amount || 'NULL', // Amount (or NULL if unavailable)
            totalAmount: totalAmount || 'NULL' // Total Amount (calculated as quantity * amount)
          };
        });

        console.log('Fetched data from Book Allotment tab:', finalData);
        setBookAllotmentData(finalData); // Update the state with the final data
      } else if (selectedTab === 1) {
        // Purchase Allotment Tab
        const response = await axios.get(`${url.purchaseBook.purchaseReport}${startDate}/${endDate}`);
        console.log('Response from purchase tab:', response);

        const finalData = response.data.map((item) => {
          const purchaseAmount = item.price || 0; // Default to 0 if purchaseAmount is not available
          const quantity = item.quantity || 0; // Default to 0 if quantity is not available
          const totalAmount = purchaseAmount * quantity; // Calculate totalAmount
          return {
            id: item._id,
            bookName: item.bookDetails.bookName || 'Unknown Book', // Book Name
            vender_Name: item.vendorDetails.vendorName || 'Unknown Vendor', // Vendor Name
            purchaseAmount: purchaseAmount, // Purchase Amount
            quantity: quantity, // Quantity
            totalAmount: totalAmount, // Total Amount (calculated as purchaseAmount * quantity)
            purchaseDate: formatDate(item.bookIssueDate), // Formatted Purchase Date
          };
        });
        
        console.log('Fetched data from Purchase Allotment tab:', finalData);
        setPurchaseData(finalData); // Update the state with the final data
      } else if (selectedTab === 2) {
        // Submission Details Tab
        const response = await axios.get(`${url.allotmentManagement.submissionReport}${startDate}/${endDate}`);
        console.log('response form submission tab ', response);
        const finalData = response.data.map((item) => {
          const allotment = item.books[0] || {};
          const book = item.bookDetails || {};
          const student = item.studentDetails || {};
          const paymentType = item.paymentType || {};
          const quantity = allotment.quantity || 0;
          const amount = allotment.amount || 0;
          const totalAmount = quantity * amount || 0;
          const submissionDate = formatDate(item.updatedAt);

          return {
            id: item._id,
            bookName: book.bookName ? `${book.bookName}` : 'No Book Name',
            student_Name: student.student_Name || 'Unknown Student',
            paymentType: paymentType.title || 'Unknown Payment Type',
            quantity: quantity || 'NULL',
            amount: amount || 'NULL',
            totalAmount: totalAmount || 'NULL',
            submissionDate: submissionDate || 'NULL'
          };
        });
        setSubmissionData(finalData);
      }
    } catch (error) {
      // toast.error('Error fetching data. Please try again!');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch data when the selected tab changes
  useEffect(() => {
    fetchDataForTab();
  }, [selectedTab]); // Trigger fetch when tab or date changes

  const columnsForBookAllotment = [
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'student_Name', headerName: 'Student Name', flex: 1 },
    { field: 'paymentType', headerName: 'Payment Type', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
    { field: 'amount', headerName: 'Amount', flex: 0.5 },
    { field: 'totalAmount', headerName: ' Total Amount', flex: 0.5 }
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
    { field: 'submissionDate', headerName: 'Submission Date', flex: 1 }
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
                        setStartDate(e.target.value); // Set the new start date
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
                        setEndDate(e.target.value); // Set the new end date
                      }}
                      inputProps={{
                        min: values.startDate // Set the min attribute dynamically to startDate
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
      <CardWrapper border={false} content={false} sx={{ height: '80%', marginTop: '30px', width: '25%' }}>
        <Box sx={{ p: 2.25 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item></Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 0.75 }}>
              <Grid container alignItems="center">
                <Grid item sx={{ ml: 1 }}>
                  {/* <MenuBookIcon
                            sx={{
                              fontSize: 45,
                              verticalAlign: 'middle',
                              marginRight: 1,
                              color: 'rgb(255, 193, 7)',
                              background: 'rgb(255, 248, 225)',
                              borderRadius: '50%',
                              padding: 1
                            }}
                          /> */}
                </Grid>
                {/* <Grid item>
                          <Typography sx={{ fontSize: '1.825rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                            {totalAmountSum}
                          </Typography>
                        </Grid> */}
                {/* Add the MenuBookIcon next to the book count */}

                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '1.200rem',
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
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardWrapper>
      
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Book Allotment Tabs" sx={{ marginTop: '20px' }}>
        <Tab label="Book Allotment" />
        <Tab label="Purchase Details" />
        <Tab label="Submission Details" />
      </Tabs>

      {loading ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={4}>
          Loading...
        </Typography>
      ) : selectedTab === 0 ? (
        bookAllotmentData.length > 0 ? (
          <Box sx={{ height: 'auto', overflow: 'auto', backgroundColor: 'white', marginTop: '30px' }}>
            <DataGrid
              rows={bookAllotmentData}
              columns={columnsForBookAllotment}
              pageSize={5}
              components={{ Toolbar: GridToolbar }}
              style={{ height: '100%', width: '100%' }} 
            />
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No data available for Book Allotment
          </Typography>
        )
      ) : selectedTab === 1 ? (
        purchaseData.length > 0 ? (
          <Card style={{ height: 'auto', marginTop: '30px' }}>
            <DataGrid rows={purchaseData} columns={columnsForPurchase} pageSize={5} components={{ Toolbar: GridToolbar }} />
          </Card>
        ) : (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No data available for Purchase Allotment
          </Typography>
        )
      ) : selectedTab === 2 ? (
        submissionData.length > 0 ? (
          <Card style={{ height: '600px', marginTop: '30px' }}>
            <DataGrid rows={submissionData} columns={columnsForSubmission} pageSize={5} components={{ Toolbar: GridToolbar }} />
          </Card>
        ) : (
          <Typography variant="h6" color="textSecondary" align="center" mt={4}>
            No data available for Submission Details
          </Typography>
        )
      ) : null}
    </Container>
  );
};

export default EmailTemplates;
