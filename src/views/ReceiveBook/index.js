import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Divider, Avatar, Dialog, TextField } from '@mui/material';
import { Grid, FormLabel, FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from 'ui-component/TableStyle';
import axios from 'axios';
import Iconic from 'ui-component/iconify/Iconify';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};
const paymentTypeMapping = {
  1: 'Credit Card',
  2: 'Cash',
  3: 'Bank Transfer'
  // Add other payment types here as necessary
};

const ReceiveBook = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [fetchReceiveBook, setFetchReceiveBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'title',
      headerName: 'Payment Type',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1
    },
    {
      field: 'bookIssueDate',
      headerName: 'Book Issue Date',
      flex: 1
    },
    {
      field: 'submissionDate',
      headerName: 'Submission Date',
      flex: 1
    },
    {
      field: 'invoice',
      headerName: 'Invoice',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleInvoice(params.row)} style={{ margin: '-9px' }}>
            <ReceiptIcon />
          </Button>
        </div>
      )
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
        setStudentData(response.data?.SubscriptionType);

        console.log('Subscription Type......>>>>', response?.data);
      } catch (error) {
        console.error('Error fetching SubscriptionType', error);
      }
    };

    const fetchReceiveBook = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/receiveBook');
        setFetchReceiveBook(response.data);
      } catch (error) {
        console.error('Error fetching Receive Book', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/registerManagement');
        setAllData(response?.data?.RegisterManagement);
        console.log('response data', response?.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const NewReceiveBook = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getReceiveBook');
        setFetchReceiveBook(response.data);
      } catch (error) {
        console.error('Error fetching Receive Book', error);
      }
    };

    fetchStudents();
    fetchSubscription();
    fetchReceiveBook();
    NewReceiveBook();
  }, []);

  const formik = useFormik({
    initialValues: {
      studentId: studentId,
      email: '',
      bookId: []
    },
    onSubmit: async (values) => {
      console.log('Submitting form with values:', values);
      try {
        const response = await axios.post('http://localhost:4300/user/postReceiveBook', values);
        console.log('Form submitted successfully:', response);
        toast.success('Details Book successfully');
        fetchData();
        handleClose();
      } catch (error) {
        toast.error('Error submitting form:');
        console.error('Error submitting form:', error);
      }
      // formik.resetForm();
      handleStudentChange();
    }
  });

  const handleStudentChange = async (event) => {
    const selectedStudentId = event.target.value;
    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);

    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }
    try {
      const submitResponse = await axios.get(`http://localhost:4300/user/getSubmitBookDetails/${selectedStudentId}`);
      console.log('Submit Book Data:', submitResponse.data.submittedBooks);
      const fetchedData = submitResponse?.data?.submittedBooks?.map((item) => ({
        id: item._id,
        student_Name: item?.studentDetails?.[0]?.student_Name,
        bookName: item?.bookDetails?.[0]?.bookName,
        title: item?.paymentDetails?.[0]?.title,
        amount: item?.paymentDetails?.[0]?.amount,
        bookIssueDate: formatDate(item?.bookIssueDate),
        submissionDate: formatDate(item?.submissionDate)
      }));
      console.log(`fetchedData`, fetchedData);

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching submit book data:', error);
    }
  };

  console.log(`data ...........///`, data);

  // function refreshPage() {
  //   window.location.reload();
  // }
  useEffect(() => {
    if (selectedStudentId) {
      const filteredBooks = fetchReceiveBook.filter((receiveBookItem) => receiveBookItem.studentId === selectedStudentId);
      console.log('Filtered Books:', filteredBooks);
      setBookData(filteredBooks);
    }
  }, [selectedStudentId, fetchReceiveBook]);

  console.log(`book>>>>>>>>>>>>>Data`, bookData);
  const filteredBooks = bookData.filter((book) => formik.values.bookId.includes(book._id));

  const handleInvoice = (row) => {
    navigate(`/dashboard/receiveInvoice/${row.id}`, { state: { rowData: row } });
  };

  const handleRemove = async (bookId) => {
    try {
      setLoading(true);

      const removeResponse = await axios.post(`http://localhost:4300/user/removeReceiveBook/${bookId}`);
      console.log('get response >>........<<:', removeResponse.status);
      toast.success('Book removed successfully');

      // refreshPage();
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setLoading(false);
    }

    const submitResponse = await axios.post(`http://localhost:4300/user/submitBook/${bookId}`);
    console.log('Submit response:', submitResponse.status);
    toast.success('Book submitted successfully');
  };

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '-12px' }}>
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
            <h4>Books Management / Receive Book</h4>
          </Link>
        </Breadcrumbs>

        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '120px',
          marginBottom: '-18px'
        }}
      >
        <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Student</FormLabel>
            <FormControl fullWidth>
              <Select id="studentId" name="studentId" value={formik.values.studentId} onChange={handleStudentChange}>
                {allData.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.student_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Email</FormLabel>
            <FormControl fullWidth>
              <Select id="email" name="email" value={formik.values.email} disabled onChange={formik.handleChange}>
                {allData.map((item) => (
                  <MenuItem key={item._id} value={item.email}>
                    {item.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Book</FormLabel>
            <FormControl fullWidth>
              <Select multiple id="bookId" name="bookId" value={formik.values.bookId} onChange={formik.handleChange}>
                {bookData.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item?.bookDetails?.bookName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      <Grid container spacing={2}>
        {filteredBooks?.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: '12px',
                background: '#F8FAFC',
                padding: '20px',
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h4" sx={{ fontSize: '22px', textAlign: 'center', mb: 2, color: 'text.primary' }}>
                {book?.bookDetails?.bookName || 'Loading...'}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Author:</strong> {book?.bookDetails?.author || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Student Name:</strong> {book?.studentDetails?.student_Name || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {book?.studentDetails?.email || 'Loading...'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Subscription:</strong> {book?.subscriptionDetails?.title || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {book?.studentDetails?.mobile_Number || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> {book?.subscriptionDetails?.amount || 'Loading...'}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body1">
                <strong>Issue Date:</strong> {formatDate(book?.bookIssueDate) || 'Loading...'}
              </Typography>
              <Typography variant="body1">
                <strong>Expiry Date:</strong> {formatDate(book?.submissionDate) || 'Loading...'}
              </Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: 2, width: '100%' }} onClick={() => handleRemove(book._id)}>
                Submit
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px',
          marginTop: '30px'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={data}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle>
      {/* </Grid> */}
    </Container>
  );
};

export default ReceiveBook;
