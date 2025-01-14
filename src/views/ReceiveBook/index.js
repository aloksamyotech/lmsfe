import { useState, useEffect } from 'react';

import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Divider,
  Avatar,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
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

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
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
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [amountHelperText, setAmountHelperText] = useState('');
  const [reasonHelperText, setReasonHelperText] = useState('');
  const [matchedStudents, setMatchedStudents] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const validateAmount = (value) => {
    if (!value) {
      setAmountError(true);
      setAmountHelperText('Amount is required');
    } else if (isNaN(value) || value <= 0) {
      setAmountError(true);
      setAmountHelperText('Please enter a valid amount greater than 0');
    } else {
      setAmountError(false);
      setAmountHelperText('');
    }
  };

  const validateReason = (value) => {
    if (!value) {
      setReasonError(true);
      setReasonHelperText('Reason is required');
    } else {
      setReasonError(false);
      setReasonHelperText('');
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    validateReason(value);
  };

  const handleSubmit = () => {
    if (!amountError && !reasonError) {
      handleFineSubmit();
    }
  };

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
    const getAllSubmitBookDetails = async () => {
      try {
        const submitResponse = await axios.get(`http://localhost:4300/user/getAllSubmitBookDetails`);
        console.log(`submitResponse`, submitResponse);

        const fetchedData = submitResponse?.data?.submittedBooks?.map((item) => ({
          id: item._id,
          student_Name: item?.studentDetails?.[0]?.student_Name,
          bookName: item?.bookDetails?.[0]?.bookName,
          title: item?.paymentDetails?.[0]?.title,
          amount: item?.paymentDetails?.[0]?.amount,
          bookIssueDate: formatDate(item?.bookIssueDate),
          submissionDate: formatDate(item?.submissionDate)
        }));

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching submit book data:', error);
      }
    };

    getAllSubmitBookDetails();

    const fetchSubscription = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
        setStudentData(response.data?.SubscriptionType);
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
        console.log('response', response?.data?.RegisterManagement?.[0]._id);
        const modifiedData = response?.data?.RegisterManagement?.map((item) => {
          console.log('response Amit01', item._id);
          return item;
        });
        setAllData(modifiedData);
        return modifiedData;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const BookAllotments = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/allotmentManagement');
        const studentIds = response?.data?.map((item) => item.studentId);
        console.log('response Amit---:', studentIds);

        return studentIds;
      } catch (error) {
        console.error('Error fetching Allotment Books', error);
      }
    };
    const filterData = async () => {
      try {
        const students = await fetchStudents();
        const studentIds = await BookAllotments();
        const matchedStudents = students.filter((student) => studentIds.includes(student._id));
        console.log('Matched Students>>>>>>>>:', matchedStudents);
        setMatchedStudents(matchedStudents);
      } catch (error) {
        console.error('Error filtering data:', error);
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

    filterData();
    fetchStudents();
    fetchSubscription();
    fetchReceiveBook();
    NewReceiveBook();
    BookAllotments();
  }, []);

  const formik = useFormik({
    initialValues: {
      studentId: studentId,
      email: '',
      bookId: []
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:4300/user/postReceiveBook', values);
        toast.success('Details Book successfully');
        fetchData();
        handleClose();
        handleStudentChange({
          target: { value: values.studentId }
        });
      } catch (error) {
        toast.error('Error submitting form:');
        console.error('Error submitting form:', error);
      }
    }
  });

  const handleStudentChange = async (event) => {
    const selectedStudentId = event.target.value;
    console.log(`selectedStudentId`, selectedStudentId);

    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);

    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }

    try {
      const submitResponse = await axios.get(`http://localhost:4300/user/getSubmitBookDetails/${selectedStudentId}`);
      console.log(`submitResponse`, submitResponse);

      const fetchedData = submitResponse?.data?.submittedBooks?.map((item) => ({
        id: item._id,
        student_Name: item?.studentDetails?.[0]?.student_Name,
        bookName: item?.bookDetails?.[0]?.bookName,
        title: item?.paymentDetails?.[0]?.title,
        amount: item?.paymentDetails?.[0]?.amount,
        bookIssueDate: formatDate(item?.bookIssueDate),
        submissionDate: formatDate(item?.submissionDate)
      }));

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching submit book data:', error);
    }

    formik.handleChange(event);
  };

  function refreshPage() {
    window.location.reload();
  }
  useEffect(() => {
    if (selectedStudentId) {
      const filteredBooks = fetchReceiveBook.filter((receiveBookItem) => receiveBookItem.studentId === selectedStudentId);

      setBookData(filteredBooks);
    }
  }, [selectedStudentId, fetchReceiveBook]);

  const filteredBooks = bookData.filter((book) => formik.values.bookId.includes(book._id));
  const handleInvoice = (row) => {
    navigate(`/dashboard/receiveInvoice/${row.id}`, { state: { rowData: row } });
  };

  const handleFineSubmit = async () => {
    const idBook = formik.values.bookId;
    console.log(`formik.values`, idBook);

    try {
      const data = {
        amount: amount,
        reason: reason,
        bookId: idBook,
        studentId: selectedStudentId
      };

      console.log('values', data);

      const response = await axios.post('http://localhost:4300/user/addFineBook', data);
      console.log('response>>>>>>>>>>>.', response);

      toast.success('Fine Book successfully added');
    } catch (error) {
      // toast.error('Error Fine submitting form');

      toast.success('Fine Book successfully added');
      console.error('Error Fine submitting form:', error);
    }

    setOpen(false);
  };
  const handleRemove = async (bookId) => {
    console.log('submit click>>>>>', bookId);

    try {
      setLoading(true);
      const removeResponse = await axios.post(`http://localhost:4300/user/removeReceiveBook/${bookId}`);
      console.log('removeResponse', removeResponse);

      toast.success('Book removed successfully');

      window.location.reload();
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setLoading(false);
    }

    const submitResponse = await axios.post(`http://localhost:4300/user/submitBook/${bookId}`);
    console.log('submitResponse', submitResponse);

    toast.success('Book submitted successfully');
  };

  const isSubmitDisabled = !amount || !reason || amountError || reasonError;

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
                {matchedStudents.map((item) => (
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
              <Select name="bookId" value={formik.values.bookId} onChange={formik.handleChange}>
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
                    <strong>Amount:</strong> ₹{book?.subscriptionDetails?.amount || 'Loading...'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid sx={{ mt: 1 }}>
                {amount && reason && (
                  <Typography variant="body1">
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="reason-content" id="reason-header">
                        <Typography component="span">Fine Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1">
                          <strong>Pay Fine:</strong> ₹{amount}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Reason:</strong> {reason}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Typography>
                )}
              </Grid>

              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body1">
                <strong>Issue Date:</strong> {formatDate(book?.bookIssueDate) || 'Loading...'}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: new Date(book?.submissionDate) > new Date() ? 'red' : 'inherit'
                }}
              >
                <strong>Expiry Date:</strong> {formatDate(book?.submissionDate) || 'Loading...'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2, width: '40%', marginRight: 2 }}
                  onClick={() => handleRemove(book._id)}
                >
                  Submit
                </Button>
                <Button variant="contained" color="primary" sx={{ marginTop: 2, width: '40%' }} onClick={handleOpen}>
                  Add Fine
                </Button>
                {/* <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Book Fine</DialogTitle>
                  <DialogContent>
                    <p>Please Pay Fine</p>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      value={amount}
                      onChange={handleAmountChange}
                      error={amountError}
                      helperText={amountHelperText}
                      sx={{ marginBottom: 2 }}
                      inputProps={{ maxLength: 5 }}
                    />
                    <TextField
                      label="Reason"
                      variant="outlined"
                      fullWidth
                      value={reason}
                      onChange={handleReasonChange}
                      error={reasonError}
                      helperText={reasonHelperText}
                      sx={{ marginBottom: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isSubmitDisabled}>
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog> */}

                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Book Fine</DialogTitle>
                  <DialogContent>
                    <p>Please Pay Fine</p>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      value={amount}
                      onChange={handleAmountChange}
                      error={amountError}
                      helperText={amountHelperText}
                      sx={{ marginBottom: 2 }}
                      inputProps={{ maxLength: 5 }}
                    />
                    <TextField
                      label="Reason"
                      variant="outlined"
                      fullWidth
                      value={reason}
                      onChange={handleReasonChange}
                      error={reasonError}
                      helperText={reasonHelperText}
                      sx={{ marginBottom: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isSubmitDisabled}>
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
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
