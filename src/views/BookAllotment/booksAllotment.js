import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, MenuItem, Select, FormHelperText, FormControl, Autocomplete } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';

const AddAllotment = (props) => {
  const { open, handleClose, fetchData } = props;
  const [bookData, setBookData] = useState([]);
  const [addBook, setAddBook] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [bookNumber, setBookNumber] = useState();
  const [allData, setAllData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  const formik = useFormik({
    initialValues: {
      bookId: '',
      studentId: '',
      submissionDate: '',
      bookIssueDate: new Date().toISOString().split('T')[0],
      paymentType: '',
      amount: ''
    },

    onSubmit: async (values) => {
      const payload = {
        ...values,
        bookId: [values.bookId]
      };
      if (addBook.some((book) => book.bookId === values.bookId)) {
        toast.error('This book has already been added.');
        return;
      }
      setAddBook((prevBooks) => [...prevBooks, values]);

      const dataToSend = addBook && Object.keys(addBook).length > 0 ? addBook : [values];
      console.log('Gopal>>>>>>>>>>', dataToSend);
      console.log('Gopal Chotu>>>>>>>>>>', dataToSend[0]?.amount);
      const newData = {
        studentId: dataToSend?.[0]?.studentId,
        bookDetails: dataToSend
      };
      try {
        const response = await axios.post('http://localhost:4300/user/manyBookAllotment', dataToSend);

        if (response) {
          console.log(`response  Gopal ---->>>>`, response);
          const Bookresponse = await axios.post('http://localhost:4300/user/bookAllotmentHistory', newData);
          console.log('Bookresponse', Bookresponse);

          toast.success('Book details added successfully');
          fetchData();

          handleClose();
          setAddBook([]);
          formik.resetForm();
        } else {
          toast.error('please add book');
        }
        // window.location.reload();
      } catch (error) {
        setAddBook([]);
        formik.resetForm();
        toast.error('Book details addition failed!!! Please Add Book');
      }
    }
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/bookManagement');
        const filteredBooks = response.data?.BookManagement.filter((book) => book.quantity > 0);
        console.log('response Aman-2', response);
        setBookData(filteredBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/registerManagement');
        console.log('response Aman', response);
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
    console.log('studentId New ', event.target.value);

    if (!studentId) {
      toast.error('Please select a valid student.');
      return;
    }
    formik.setFieldValue('studentId', studentId);
    try {
      const response = await axios.get(`http://localhost:4300/user/bookAllotmentCount/${studentId}`);
      const count = response?.data?.allotmentsCount || 0;

      setBookNumber(count);
      setBorrowedBooksCount(count);
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
  const handleAddBookClick = () => {
    const { bookId, studentId, submissionDate, bookIssueDate, paymentType, amount } = formik.values;

    if (addBook.some((book) => book.bookId === bookId)) {
      toast.error('This book has already been added.');
      return;
    }
    const bookData = {
      studentId,
      bookId: bookId?._id,
      submissionDate,
      bookIssueDate,
      paymentType,
      amount
    };
    setAddBook([...addBook, bookData]);
    formik.setValues({
      ...formik.values,
      bookId: '',
      submissionDate: '',
      bookIssueDate: '',
      paymentType: '',
      amount: ''
    });
  };
  console.log(`addBook`, addBook);
  const handleRemoveBook = (bookId) => {
    setAddBook((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
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
                <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 2, }}>
                  <FormLabel>Student</FormLabel>
                  <FormControl fullWidth error={formik.touched.studentId && Boolean(formik.errors.studentId)}>
                    <Autocomplete
                      id="studentId"
                      name="studentId"
                      value={formik.values.studentId ? allData.find((student) => student._id === formik.values.studentId) : null}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          formik.setFieldValue('studentId', newValue._id);
                        } else {
                          formik.setFieldValue('studentId', '');
                        }
                      }}
                      options={allData}
                      getOptionLabel={(option) => option.student_Name}
                      renderInput={(params) => <TextField {...params} />}
                      isOptionEqualToValue={(option, value) => option._id === value?._id}
                      fullWidth
                    />
                    <FormHelperText>{formik.touched.studentId && formik.errors.studentId ? formik.errors.studentId : ''}</FormHelperText>
                    <FormLabel style={{ color: bookNumber === 5 ? 'red' : 'inherit' }}>
                      {bookNumber === 5 ? `You Have Already Booked ${bookNumber} books` : null}
                    </FormLabel>
                  </FormControl>
                </Grid>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: '50px', marginTop: '50px', height: '40px' }}
                  disabled={!formik.values.bookId || !formik.values.paymentType || !formik.values.submissionDate || bookNumber >= 5}
                  onClick={handleAddBookClick}
                >
                  Add Book
                </Button>

                <Grid
                  container
                  spacing={1}
                  style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', marginLeft: '20px', marginTop: '15px' }}
                >
                  <Grid container>
                    <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 6 }}>
                      <FormLabel>Book</FormLabel>
                      <FormControl fullWidth error={formik.touched.bookId && Boolean(formik.errors.bookId)}>
                        <Autocomplete
                          id="bookId"
                          name="bookId"
                          value={formik.values.bookId || null}
                          onChange={(event, newValue) => formik.setFieldValue('bookId', newValue)}
                          options={bookData}
                          getOptionLabel={(option) => option.bookName || ''}
                          isOptionEqualToValue={(option, value) => option._id === value}
                          disabled={borrowedBooksCount >= 5}
                          renderInput={(params) => <TextField {...params} error={formik.touched.bookId && Boolean(formik.errors.bookId)} />}
                        />
                        <FormHelperText>{formik.touched.bookId && formik.errors.bookId}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 4 }}>
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
                  </Grid>
                  <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 6 }}>
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
                  <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 4 }}>
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
              </Grid>
            </DialogContentText>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={12}>
                {addBook.length > 0 ? (
                  <Grid container spacing={3}>
                    {addBook.map((book, index) => (
                      <Grid item xs={12} key={index}>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '5px',
                            marginLeft: '-10px ',
                            position: 'relative'
                          }}
                        >
                          <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 6 }}>
                            <FormLabel>Book</FormLabel>
                            <TextField
                              name="submissionDate"
                              type="text"
                              size="small"
                              fullWidth
                              value={bookData.filter((item) => item._id == book.bookId)?.[0]?.bookName}
                              InputProps={{ style: { height: '50px' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 4 }}>
                            <FormLabel>Submission Date</FormLabel>
                            <TextField
                              name="submissionDate"
                              type="date"
                              size="small"
                              fullWidth
                              value={book.submissionDate}
                              onChange={formik.handleChange}
                              InputProps={{ style: { height: '50px' } }}
                              inputProps={{ min: new Date().toISOString().split('T')[0] }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 6 }}>
                            <FormLabel>Amount</FormLabel>
                            <TextField
                              name="submissionDate"
                              type="text"
                              size="small"
                              fullWidth
                              value={book.amount}
                              InputProps={{ style: { height: '50px' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={5} md={5} sx={{ marginRight: 4 }}>
                            <FormLabel>Subscription Type</FormLabel>
                            <TextField
                              name="paymentType"
                              type="text"
                              size="small"
                              fullWidth
                              value={studentData.filter((item) => item._id == book.paymentType)?.[0]?.title}
                              InputProps={{ style: { height: '50px' } }}
                            />
                          </Grid>
                          <Grid item style={{ position: 'absolute', top: '-5px', right: '-4px' }}>
                            <IconButton onClick={() => handleRemoveBook(book.bookId)} size="small" color="error">
                              <CancelIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2">No books added yet.</Typography>
                )}
              </Grid>
            </Grid>
            <DialogActions sx={{ ml: '40px' }}>
              <Button type="submit" variant="contained" color="primary" disabled={addBook.length === 0}>
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
