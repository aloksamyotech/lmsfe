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
import { url } from 'core/url';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Button from '@mui/material/Button';

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
  const [allFineData, setAllFineData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [booksss, setFetchReceiveBooks] = useState([]);

  const [stuId, setStuId] = useState('');
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

  console.log('Student', stuId);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);
  useEffect(() => {
    const getAllSubmitBookDetails = async () => {
      try {
        // const submitResponse = await axios.get(`http://localhost:4300/user/getAllSubmitBookDetails`);
        const submitResponse = await axios.get(url.allotmentManagement.getAllSubmitBookDetails);
        console.log('submitResponse<<<>>>', submitResponse);
        const stuId = submitResponse?.data?.submittedBooks[0]?.studentId;
        console.log('Stud0000000', stuId);
        setStuId(stuId);
        const fetchedData = submitResponse?.data?.submittedBooks?.map((item, index) => ({
          serial: index + 1,
          id: item.books.bookId,
          student_Name: item?.studentDetails?.student_Name,
          bookName: item?.bookDetails?.bookName,
          title: item?.paymentDetails?.title,
          amount: item?.paymentDetails?.amount,
          bookIssueDate: formatDate(item?.books?.bookIssueDate),
          submissionDate: formatDate(item?.books?.submissionDate)
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching submit book data:', error);
      }
    };
    getAllSubmitBookDetails();
    const fetchSubscription = async () => {
      try {
        // const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
        const response = await axios.get(url.subscription.findSubscription);
        setStudentData(response.data?.SubscriptionType);
      } catch (error) {
        console.error('Error fetching SubscriptionType', error);
      }
    };
    const fetchReceiveBook = async () => {
      try {
        // const response = await axios.get('http://localhost:4300/user/receiveBook');
        const response = await axios.get('http://localhost:4300/user/receiveBook');
        setFetchReceiveBook(response.data.books);
        setFetchReceiveBooks(response.data.books || []);
      } catch (error) {
        console.error('Error fetching Receive Book', error);
      }
    };
    const fetchStudents = async () => {
      try {
        // const response = await axios.get('http://localhost:4300/user/registerManagement');
        const response = await axios.get(url.studentRegister.getRegisterManagement);
        setAllData(response?.data?.RegisterManagement);
        const modifiedData = response?.data?.RegisterManagement?.map((item) => {
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
        // const response = await axios.get('http://localhost:4300/user/allotmentManagement');
        const response = await axios.get(url.allotmentManagement.allotmentManagementData);
        const data = response?.data;
        setFetchReceiveBook(data);
        return data;
      } catch (error) {
        console.error('Error fetching Allotment Books', error);
      }
    };
    const filterData = async () => {
      try {
        const studentData = await fetchStudents();
        const bookData = await BookAllotments();
        const bookStudentIds = bookData.map((book) => book.studentId);
        const matchedStudents = studentData.filter((student) => bookStudentIds.includes(student._id));
        setMatchedStudents(matchedStudents);
      } catch (error) {
        console.error('Error filtering data:', error);
      }
    };

    const NewReceiveBook = async () => {
      try {
        // const response = await axios.get('http://localhost:4300/user/getReceiveBook');
        const response = await axios.get(url.allotmentManagement.getReceiveBook);
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
        // const response = await axios.post('http://localhost:4300/user/postReceiveBook', values);
        const response = await axios.post(url.allotmentManagement.postReceiveBook, values);
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
    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);
    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }
    try {
      const submitResponse = await axios.get(`http://localhost:4300/user/getSubmitBookDetails/${selectedStudentId}`);
      // const submitResponse = await axios.get(`${url.allotmentManagement.getAllSubmitBookDetails}${selectedStudentId}`);
      console.log('submitResponse<<<>>>', submitResponse?.data);

      const fetchedData = submitResponse?.data?.submittedBooks?.map((item) => ({
        id: item._id,
        student_Name: item?.studentDetails?.[0]?.student_Name,
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
      const filteredBooks = booksss.filter((receiveBookItem) => receiveBookItem.student.studentId === selectedStudentId);
      setBookData(filteredBooks);
    }
  }, [selectedStudentId, booksss]);
  const filteredBooks = bookData.filter((book) => formik.values.bookId.includes(book.bookId) && book.active === true);

  const handleInvoice = (row) => {
    console.log('row Data', row);
    console.log('rowwwwww', stuId);
    navigate(`/dashboard/receiveInvoice/${row.id}`, { state: { rowData: row, studentId: stuId } });
  };

  const handleFineSubmit = async () => {
    const idBook = formik.values.bookId;
    const _id = formik.values._id;
    try {
      const data = {
        amount: amount,
        reason: reason,
        bookId: idBook,
        studentId: selectedStudentId
      };
      // const response = await axios.post('http://localhost:4300/user/addFineBook', data);
      const response = await axios.post(url.fine.addFineBook, data);
      toast.success('Fine Book successfully added');
    } catch (error) {
      toast.error('Error Fine submitting form');
      console.error('Error Fine submitting form:', error);
    }
    setOpen(false);
  };
  const handleRemove = async (bookId) => {
    // const submitResponse = await axios.post(`http://localhost:4300/user/submitBook/${bookId}`);
    const submitResponse = await axios.post(`${url.allotmentManagement.submitBook}${bookId}`);
    toast.success('Book submitted successfully');
    try {
      setLoading(true);
      // const removeResponse = await axios.post(`http://localhost:4300/user/removeReceiveBook/${bookId}`);
      const removeResponse = await axios.post(`${url.allotmentManagement.removeReceiveBook}${bookId}`);
      toast.success('Book removed successfully');
      window.location.reload();
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setLoading(false);
    }
  };
  const isSubmitDisabled = !amount || !reason || amountError || reasonError;
  const findFineData = async () => {
    try {
      // const response = await axios.get(`http://localhost:4300/user/findFine/${formik.values.bookId}/${selectedStudentId}`);
      // const response = await axios.get(`${url.fine.fineDetails}${formik.values.bookId}/${selectedStudentId}`);
      const fine = response?.data?.map((item) => {
        const reason = item?.reason;
        const fineAmount = item?.fineAmount;
        return { reason, fineAmount };
      });
      setAllFineData(fine);
    } catch (error) {
      console.log(`error`, error);
    }
  };
  if (formik.values.bookId) {
    // findFineData()
  }
  useEffect(() => {
    findFineData();
  }, [formik.values.bookId]);
  function getUniqueBooks(bookData) {
    return [...new Map(bookData.filter((item) => item.active === true).map((item) => [item.bookId, item])).values()];
  }
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
              <Select id="bookId" name="bookId" value={formik.values.bookId} onChange={formik.handleChange}>
                {getUniqueBooks(bookData).map((item) => (
                  <MenuItem key={item.bookId} value={item.bookId}>
                    {item?.bookTitle}
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
                {book?.bookTitle || 'Loading...'}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Author:</strong> {book?.bookAuthor || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Student Name:</strong> {book?.student.studentName || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {book?.student.email || 'Loading...'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Subscription:</strong> {book?.paymentType || 'Loading...'}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Phone:</strong> {book?.student.mobileNumber || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> {book?.amount || 'Loading...'}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                  <Typography component="span" sx={{ fontWeight: 'bold', color: '#333333' }}>
                    Fine Details
                  </Typography>
                </AccordionSummary>
                <div>
                  <AccordionDetails sx={{ marginTop: '-20px' }}>
                    {allFineData?.length > 0 ? (
                      allFineData.map((item, index) => (
                        <div key={index}>
                          <Typography variant="body1">
                            <strong>Reason:</strong> {item?.reason || 'Loading...'}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Fine Amount:</strong> {`₹${item?.fineAmount}` || '₹0'}
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <Typography variant="body1">No fines available.</Typography>
                    )}
                  </AccordionDetails>
                </div>
              </Accordion>
              <Divider sx={{ marginY: 1 }} />
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
                      inputProps={{ maxLength: 3 }}
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
              getRowId={(row) => row.serial}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle>
    </Container>
  );
};
export default ReceiveBook;
