import React, { useState, useEffect } from 'react';
import { Card, Container, Grid, Typography, Box, FormLabel, TextField, Button, Tabs, Tab, CardContent } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { bookAllotmentReport, purchaseAllotmentReport, submissionDetailsReport } from 'core/helperFurtion';
import { fetchCurrency } from 'core/comman';
import { url } from 'core/url';
import BooksModal from 'views/BookAllotment/viewbooks';
import { useTheme, styled } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { height } from '@mui/system';

const EmailTemplates = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookAllotmentData, setBookAllotmentData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
  const [totalAllotmetAmount, setTotalAllotmentAmount] = useState(0);
  const [totalfineAmount, setTotalfineAmount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

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
      const bookAllotmentResponse = await bookAllotmentReport(`${url.allotmentManagement.bookAllotmentReport}${startDate}/${endDate}`);
      const bookAllotmentFinalData = bookAllotmentResponse?.data?.map((item) => {
        const books = item.books || [];
        const student = item.studentDetails || {};

        const bookNames = books.map((book) => book.bookDetail?.bookName || 'Unnamed Book').join(', ');

        const paymentType = books[0]?.paymentDetail?.title || 'Unknown Payment Type';
        const totalQuantity = books.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
        const totalAmount = books.reduce((acc, curr) => acc + (curr.quantity || 0) * (curr.amount || 0), 0);

        return {
          id: item._id,
          bookName: bookNames || 'No Book Name',
          student_Name: student.student_Name || 'Unknown Student',
          Student_email:student.email||'Email',
          quantity: totalQuantity,
          totalAmount
        };
      });

      const totalallotmentAmount = bookAllotmentFinalData.reduce((sum, item) => sum + item.totalAmount, 0);
      setTotalAllotmentAmount(totalallotmentAmount);
      setBookAllotmentData(bookAllotmentFinalData);

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

      const getsubmitedBooks= await axios.get(`${url.booksubmission.getsubmitedBook}`)
      const filteredData = getsubmitedBooks.data.data.filter((item) => {
        const createdDate = moment(item.createdAt).format("YYYY-MM-DD");
        return createdDate >= startDate && createdDate <= endDate;
      });
      const submissionFinalData = filteredData.map((item, index) => ({
        id: item._id,
        student_Name: item.studentName || 'Unknown Student',
        bookName: item.bookName || 'No Book Name',
        Student_email:item.studentEmail||"null",
        fine: item.fine
      }));

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
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'wrap-text'
    },
    { field: 'student_Name', headerName: 'Student Name', flex: 1 },
    { field: 'Student_email', headerName: 'Student Email', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    }
  ];

  const columnsForPurchase = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'vender_Name', headerName: 'Vender Name', flex: 1 },
    {
      field: 'purchaseAmount',
      headerName: 'Price per book',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    { field: 'purchaseDate', headerName: 'Purchase Date', flex: 1 }
  ];

  const columnsForSubmission = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    { field: 'student_Name', headerName: 'Student Name', flex: 1 },
    { field: 'Student_email', headerName: 'Student email', flex: 1 },

    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    {
      field: 'fine',
      headerName: 'Fine Status',
      flex: 1,
      valueGetter: (params) => {
        return params.row.fine === true ? 'Applied' : 'Not Applied';
      }
    }
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
        <Card sx={{ width: '22%', minWidth: 200, m: 1, boxShadow: 3, height: '9%', marginTop: '35px', paddingBottom: '0' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '10px', paddingBottom: '10px !important' }}>
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 60,
                height: 60,
                backgroundColor: '#0769b4'
              }}
            >
              <AddShoppingCartIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '15px' }}>
                {`Total Purchase`}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                {currencySymbol}
                {totalPurchaseAmount ? totalPurchaseAmount.toFixed(2) : '0.00'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ width: '22%', minWidth: 200, m: 1, boxShadow: 3, height: '9%', marginTop: '35px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '10px', paddingBottom: '10px !important' }}>
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 60,
                height: 60,
                backgroundColor: '#28a745'
              }}
            >
              <MoneyOffCsredIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '15px' }}>
                {`Total Fine`}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                {currencySymbol}
                {totalfineAmount ? totalfineAmount.toFixed(2) : '0.00'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ width: '22%', minWidth: 200, m: 1, boxShadow: 3, height: '9%', marginTop: '35px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '10px', paddingBottom: '10px !important' }}>
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 60,
                height: 60,
                backgroundColor: '#ffc107'
              }}
            >
              <BookmarkRemoveIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '14px' }}>
                {`Book Allotment`}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                {currencySymbol}
                {totalAllotmetAmount ? totalAllotmetAmount.toFixed(2) : '0.00'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ width: '22%', minWidth: 200, m: 1, boxShadow: 3, height: '9%', marginTop: '35px' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '10px', paddingBottom: '10px !important' }}>
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 60,
                height: 60,
                backgroundColor: '#dc3545'
              }}
            >
              <BookmarkAddRoundedIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '15px' }}>
                {`Book Recieve`}
              </Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                {submissionCount ? submissionCount : '0'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
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
                  rows={bookAllotmentData.map((row, index) => ({ ...row, sNo: index + 1 }))}
                  columns={columnsForBookAllotment}
                  pageSize={5}
                  components={{ Toolbar: GridToolbar }}
                  style={{ height: '100%', width: '100%' }}
                  getRowHeight={() => '60'} // ✅ correct
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
                <DataGrid
                  rows={purchaseData.map((row, index) => ({ ...row, sNo: index + 1 }))}
                  columns={columnsForPurchase}
                  pageSize={5}
                  components={{ Toolbar: GridToolbar }}
                />
              </Card>
            ) : (
              <Typography variant="h6" color="textSecondary" align="center">
                No data available for Purchase Allotment
              </Typography>
            ))}

          {selectedTab === 2 &&
            (submissionData.length > 0 ? (
              <Card sx={{ height: 'auto' }}>
                <DataGrid
                  rows={submissionData.map((row, index) => ({ ...row, sNo: index + 1 }))}
                  columns={columnsForSubmission}
                  getRowId={(row) => row.id}
                  pageSize={5}
                  components={{ Toolbar: GridToolbar }}
                />
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
