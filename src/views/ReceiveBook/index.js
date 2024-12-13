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
      formik.resetForm();
    }
  });

  const handleStudentChange = (event) => {
    const selectedStudentId = event.target.value;
    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);

    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }
  };
  function refreshPage() {
    window.location.reload();
  }
  useEffect(() => {
    if (selectedStudentId) {
      const filteredBooks = fetchReceiveBook.filter((receiveBookItem) => receiveBookItem.studentId === selectedStudentId);
      console.log('Filtered Books:', filteredBooks);
      setBookData(filteredBooks);
    }
  }, [selectedStudentId, fetchReceiveBook]);

  console.log(`book>>>>>>>>>>>>>Data`, bookData);
  const filteredBooks = bookData.filter((book) => formik.values.bookId.includes(book._id));

  const handleRemove = async (bookId) => {
    try {
      // setLoading(true);

      const response = await axios.delete(`http://localhost:4300/user/removeReceiveBook/${bookId}`);
      console.log(`response`, response.status);
      toast.success('Details Book successfully');
      refreshPage();
      setLoading(false);
    } catch (error) {
      console.error('Error removing book:', error);
      toast.error('An error occurred while removing the book');
      // setLoading(false);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
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

          {/* <Grid item xs={12} sm={4} md={4}>
            <FormLabel></FormLabel>
            <Button
              style={{
                maxWidth: '200px',
                maxHeight: '40px',
                minWidth: '100px',
                minHeight: '30px',
                marginTop: '-8px',
                marginLeft: '430px'
              }}
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid> */}
        </Grid>
      </Box>

      {/* <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={bookData}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle> */}
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      <Grid container spacing={1}>
        <Grid container spacing={1}>
          {filteredBooks?.map((book, index) => (
            <Grid item xs={12} sm={12} md={12} key={index}>
              <Card sx={{ borderRadius: '10px', background: '#F8FAFC', padding: '10px', boxShadow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontSize: '21px', textAlign: 'center', ml: -10 }}>
                      {book?.bookDetails?.bookName || 'Loading...'}
                    </Typography>
                    <Divider sx={{ marginY: '10px' }} />
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong>Author Name -: </strong> {book?.bookDetails?.author || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '16px', marginTop: '3px' }}>
                          <strong>Student Name -: </strong> {book?.studentDetails?.student_Name || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong>Subscription Type -: </strong> {book?.subscriptionDetails?.title || 'Loading...'}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong>Title Name -: </strong> {book?.bookDetails?.title || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '16px', marginTop: '3px' }}>
                          <strong>Email -: </strong> {book?.studentDetails?.email || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong>Number Of Days -: </strong> {book?.subscriptionDetails?.numberOfDays || 'Loading...'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong>Book Issue Date -: </strong> {formatDate(book?.bookIssueDate) || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '15px', marginTop: '3px' }}>
                          <strong> Phone Number -: </strong> {book?.studentDetails?.mobile_Number || 'Loading...'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography sx={{ fontSize: '17px', marginTop: '3px' }}>
                          <strong>amount -: </strong> {book?.subscriptionDetails?.amount || 'Loading...'}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography sx={{ fontSize: '16px', marginTop: '3px' }}>
                      <strong>Book Expiry Date -: </strong> {formatDate(book?.submissionDate) || 'Loading...'}
                      <Divider sx={{ marginY: '10px' }} />
                    </Typography>
                    <Grid container spacing={3}>
                      {/* <Grid item xs={12} sm={4} md={4}>
                        <FormLabel></FormLabel>
                        <Button
                          style={{
                            maxWidth: '200px',
                            maxHeight: '40px',
                            minWidth: '100px',
                            minHeight: '30px',
                            marginTop: '-8px',
                            marginLeft: '650px'
                          }}
                          variant="contained"
                          color="primary"
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Generate'}
                        </Button>
                      </Grid> */}
                      <Grid item xs={12} sm={4} md={4}>
                        <FormLabel></FormLabel>
                        <Button
                          style={{
                            maxWidth: '200px',
                            maxHeight: '40px',
                            minWidth: '100px',
                            minHeight: '30px',
                            marginTop: '-8px',
                            marginLeft: '450px'
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleRemove(book._id)}
                          // disabled={loading}
                        >
                          Submit
                          {/* {loading ? 'Submitting...' : 'Submit'} */}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReceiveBook;
