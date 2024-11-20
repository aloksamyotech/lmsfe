import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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

const AddAllotment = (props) => {
  const { open, handleClose, fetchData } = props;
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);

  const validationSchema = yup.object({
    bookId: yup.string().required('Book Name is required'),
    studentId: yup.string().required('Book Title is required'),
    submissionDate: yup.date().required('Submit Date is required'),
    bookIssueDate: yup.date().required('Book Issue date is required'),
    // publisherName: yup.string().required('Publisher Name is required'),
    paymentType: yup.string().required('Payment Type is required')
    // returnPrice: yup.number().required('Return Price is required').typeError('Must be a number'),
    // bookDistribution: yup.string().required('Distribution is required')
  });

  const formik = useFormik({
    initialValues: {
      bookId: '',
      studentId: '',
      submissionDate: '',
      bookIssueDate: new Date().toISOString().split('T')[0],
      // publisherName: '',
      paymentType: ''
      // returnPrice: '',
      // bookDistribution: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitted values', values);
      try {
        const response = await axios.post('http://localhost:4300/user/bookAllotment', values);
        console.log('Form submitted successfully:', response);
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Book details added successfully');
      formik.resetForm();
      handleClose();
    }
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/bookManagement');
        console.log('Data.....', response);

        setBookData(response.data?.BookManagement);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/registerManagement');
        console.log('Student Data', response);
        setStudentData(response.data?.RegisterManagement);
        // setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchBooks();
    fetchStudents();
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Add New Books</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {/* <Typography style={{ marginBottom: '15px' }} variant="h6">
                Books Information
              </Typography> */}
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Book Name</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      id="bookId"
                      name="bookId"
                      value={formik.values.bookId}
                      onChange={formik.handleChange}
                      error={formik.touched.bookId && Boolean(formik.errors.bookId)}
                    >
                      {/* <MenuItem value="Book1">Book1</MenuItem>
                      <MenuItem value="Book2">Book2</MenuItem>
                      <MenuItem value="Book3">Book3</MenuItem> */}
                      {bookData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.bookName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      id="studentId"
                      name="studentId"
                      value={formik.values.studentId}
                      onChange={formik.handleChange}
                      error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                    >
                      {studentData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.student_Name}
                        </MenuItem>
                      ))}
                      {/* <MenuItem value="Student1">Student1</MenuItem>
                      <MenuItem value="Student2">Student2</MenuItem>
                      <MenuItem value="Student3">Student3</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Payment Type</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      id="paymentType"
                      name="paymentType"
                      value={formik.values.paymentType}
                      onChange={formik.handleChange}
                      error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
                    >
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="One Day">One Day</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Book Issue Date</FormLabel>
                  <TextField
                    name="bookIssueDate"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.bookIssueDate}
                    onChange={formik.handleChange}
                    error={formik.touched.bookIssueDate && Boolean(formik.errors.bookIssueDate)}
                    helperText={formik.touched.bookIssueDate && formik.errors.bookIssueDate}
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
