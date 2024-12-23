import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, MenuItem, Select, InputLabel, FormHelperText, FormControl } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { Field, useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';

const AddAllotment = (props) => {
  const { open, handleClose, fetchData } = props;
  const [bookData, setBookData] = useState([]);
  const [addBook, setAddBook] = useState([]); // State to store the added books
  const [studentData, setStudentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  const [selectedAllotmentData, setSelectedAllotmentData] = useState(null); // New state to save selected data

  const validationSchema = yup.object({
    studentId: yup.string().required('Student is required'),
    bookId: yup.array().min(1, 'At least one book must be selected').required('Book is required'),
    paymentType: yup.string().required('Subscription type is required'),
    amount: yup.number().positive('Amount must be greater than 0').required('Amount is required'),
    submissionDate: yup.date().required('Submission date is required').min(new Date(), 'Submission date cannot be in the past')
  });

  const formik = useFormik({
    initialValues: {
      bookId: [],
      studentId: '',
      submissionDate: '',
      bookIssueDate: new Date().toISOString().split('T')[0],
      paymentType: '',
      amount: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Onsubmit>>>>>>>>>>>', values);

      try {
        const response = await axios.post('http://localhost:4300/user/bookAllotment', values);
        fetchData();
        handleClose();
      } catch (error) {
        toast.error('Book details added failed');
      }
      formik.resetForm();
      handleClose();
      fetchData();
    }
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/bookManagement');
        const filteredBooks = response.data?.BookManagement.filter((book) => book.quantity > 0);
        setBookData(filteredBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/registerManagement');
        setAllData(response?.data?.RegisterManagement);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchSubscription = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
        setStudentData(response.data?.SubscriptionType);
      } catch (error) {
        console.error('Error fetching SubscriptionType', error);
      }
    };

    fetchBooks();
    fetchStudents();
    fetchSubscription();
  }, []);

  const handleStudentChange = async (event) => {
    const studentId = event.target.value;
    formik.setFieldValue('studentId', studentId);
    try {
      const response = await axios.get(`http://localhost:4300/user/bookAllotmentCount/${studentId}`);
      setBorrowedBooksCount(response.data.count);
    } catch (error) {
      console.error('Error fetching borrowed books count:', error);
    }
  };

  const handleSubscriptionType = (e) => {
    const selectedSubscription = studentData.find((item) => item._id === e.target.value);
    if (selectedSubscription) {
      formik.setFieldValue('paymentType', selectedSubscription._id);
      formik.setFieldValue('amount', selectedSubscription.amount);
    }
  };

  // Handle "Add Book" button click
  const handleAddBookClick = () => {
    // Get selected values from the form fields
    const selectedBooks = formik.values.bookId;
    const studentId = formik.values.studentId;
    const submissionDate = formik.values.submissionDate;
    const bookIssueDate = formik.values.bookIssueDate;
    const paymentType = formik.values.paymentType;
    const amount = formik.values.amount;

    console.log('Selected Data:');
    console.log('Student:', studentId);
    console.log('Books:', selectedBooks);
    console.log('Submission Date:', submissionDate);
    console.log('Book Issue Date:', bookIssueDate);
    console.log('Payment Type:', paymentType);
    console.log('Amount:', amount);

    setSelectedAllotmentData({
      studentId,
      books: selectedBooks,
      submissionDate,
      bookIssueDate,
      paymentType,
      amount
    });

    setAddBook([...addBook, ...selectedBooks]);

    console.log('Updated Added Books:', [...addBook, ...selectedBooks]);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Allotment New Book</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Student</FormLabel>
                  <FormControl fullWidth error={formik.touched.studentId && Boolean(formik.errors.studentId)}>
                    <Select id="studentId" name="studentId" value={formik.values.studentId} onChange={handleStudentChange}>
                      {allData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.student_Name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{formik.touched.studentId && formik.errors.studentId}</FormHelperText>
                  </FormControl>
                </Grid>

                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: '50px', marginTop: '50px', height: '40px' }}
                  disabled={!formik.isValid || !formik.dirty}
                  onClick={handleAddBookClick}
                >
                  Add Book
                </Button>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Book</FormLabel>
                  <FormControl fullWidth error={formik.touched.bookId && Boolean(formik.errors.bookId)}>
                    <Select
                      multiple
                      id="bookId"
                      name="bookId"
                      value={formik.values.bookId}
                      onChange={formik.handleChange}
                      disabled={borrowedBooksCount >= 5}
                    >
                      {bookData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.bookName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{formik.touched.bookId && formik.errors.bookId}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Subscription Type</FormLabel>
                  <FormControl fullWidth error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}>
                    <Select id="paymentType" name="paymentType" value={formik.values.paymentType} onChange={handleSubscriptionType}>
                      {studentData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{formik.touched.paymentType && formik.errors.paymentType}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Amount</FormLabel>
                  <TextField
                    id="amount"
                    name="amount"
                    size="small"
                    fullWidth
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    InputProps={{ style: { height: '50px' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Submission Date</FormLabel>
                  <TextField
                    name="submissionDate"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.submissionDate}
                    onChange={formik.handleChange}
                    error={formik.touched.submissionDate && Boolean(formik.errors.submissionDate)}
                    helperText={formik.touched.submissionDate && formik.errors.submissionDate}
                    InputProps={{ style: { height: '50px' } }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>

            <DialogActions sx={{ ml: '40px' }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button
                onClick={() => {
                  formik.resetForm();
                  handleClose();
                }}
                variant="outlined"
                color="error"
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddAllotment;
