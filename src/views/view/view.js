import React, { useState, useEffect } from 'react';
import { Container, Avatar, Typography, Paper, Box, Card, Stack, Button, CardContent, IconButton, Grid } from '@mui/material';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddRegister from 'views/Register/Addregister';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { getApi } from 'core/apiClient';

const View = () => {
  const [data, setData] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [id, setId] = useState(null);
  const [allData, setAllData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [totalAllotted, setTotalAllotted] = useState(0);
  const [totalSubmitted, setTotalSubmitted] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.5
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'bookIssueDateTime',
      headerName: 'Issue Date',
      flex: 1,
      renderCell: (params) => {
        const date = params.row.bookIssueDate || '';
        const time = params.row.time || '';
        return (
          <div>
            <div>{date}</div>
            <div>{time}</div>
          </div>
        );
      }
    },
    {
      field: 'submissionDate',
      headerName: 'Expected Submission Date',
      flex: 1
    },
    {
      field: 'generateInvoice',
      headerName: 'Invoice',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          style={{
            color: '#007bff',
            borderRadius: '50%',
            padding: '8px'
          }}
          onClick={() => handleGenerateInvoice(params.row)}
        >
          <ReceiptIcon />
        </IconButton>
      )
    }
  ];
  const handleGenerateInvoice = (row) => {
    const allotmentId = row.id;
    navigate(`/dashboard/bookAllotmentInvoice/${allotmentId}`, {
      state: { allotmentId }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const student = {
    logoUrl: 'https://example.com/logo.png',
    Name: 'John Doe',
    Email: 'john.doe@example.com',
    Phone_Number: '+1234567890',
    Register_Date: '2024-11-18'
  };

  useEffect(() => {
    const Url = window.location.href;
    setCurrentUrl(Url);

    const parts = Url.split('/');
    const extractedId = parts[parts.length - 1];

    setId(extractedId);
    const sendIdToBackend = async () => {
      try {
        const response = await getApi(`${url.allotmentManagement.viewBookAllotment}${extractedId}`);

        setAllData(response.data);
      } catch (error) {
        console.error('Error sending ID to backend:', error);
      }
    };

    if (extractedId) {
      sendIdToBackend();
    }
  }, []);

  useEffect(() => {
    const rul = window.location.href;
    setCurrentUrl(rul);

    const parts = rul.split('/');
    const extractedId = parts[parts.length - 1];

    setId(extractedId);
    const fetchData = async () => {
      try {
        const response = await getApi(`${url.allotmentManagement.findHistory}${extractedId}`);

        let totalAllottedCount = 0;
        let totalSubmittedCount = 0;

        const fetchedData = response?.data?.map((item) => {
          const dateObj = new Date(item.createdAt);
          const istTime = dateObj.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          const bookNames = item.books
            ?.map((book) => book.bookId?.bookName)
            .filter(Boolean)
            .join(', ');

          const totalAmount = item.books?.reduce((sum, book) => {
            const quantity = book.quantity || 1;
            const amountPerBook = book.amount || 0;
            return sum + quantity * amountPerBook;
          }, 0);

          let totalQuantity = 0;
          let submittedQuantity = 0;

          item.books?.forEach((book) => {
            const quantity = book.quantity || 1;
            totalQuantity += quantity;
            const submitCount = book.submitCount || 1;
            submittedQuantity += submitCount;
          });
          totalAllottedCount += totalQuantity;
          totalSubmittedCount += submittedQuantity;

          const allSubmitted = item.books?.every((book) => book.submit === true);

          return {
            id: item._id,
            bookName: bookNames,
            student_Name: item.studentId?.student_Name,
            paymentType: item.paymentType?.title,
            amount: totalAmount,
            bookIssueDate: formatDate(item.books?.[0]?.bookIssueDate),
            submissionDate: formatDate(item.books?.[0]?.submissionDate),
            time: istTime,
            quantity: totalQuantity,
            isSubmit: allSubmitted
          };
        });

        setData(fetchedData);
        setTotalAllotted(totalAllottedCount);
        setTotalSubmitted(totalSubmittedCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          width: '96%',
          marginBottom: '-6px',
          marginLeft: '2%'
        }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/Register" color="inherit" underline="none">
            Student Managment
          </MuiLink>
          <MuiLink component={Link} to="" color="inherit" underline="none">
            Student profile
          </MuiLink>
        </Breadcrumbs>
      </Box>
      <Container>
        <Grid container spacing={2} sx={{ marginTop: '10px', marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 60,
                    height: 60,
                    backgroundColor: '#90CAF9'
                  }}
                >
                  <Avatar sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Box sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  <Typography variant="h5" gutterBottom sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    {allData?.user?.student_Name}
                  </Typography>

                  <Typography variant="body1" color="textSecondary" sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    <strong>{allData?.user?.email}</strong>
                  </Typography>

                  <Typography variant="body1" color="textSecondary" sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                    <strong>{allData?.user?.mobile_Number}</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    p: 1,
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
                    Books Allotment
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                    {totalAllotted ?? '0'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
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
                    Book Received
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                    {totalSubmitted ?? '0'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ width: '100%', boxShadow: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
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
                    backgroundColor: '#17a2b8'
                  }}
                >
                  <PendingActionsIcon sx={{ fontSize: 30, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ fontSize: '14px' }}>
                    Pending Books
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '17px' }}>
                    {totalAllotted - totalSubmitted}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }
                  }
                }}
                pagination
                rows={data.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default View;
