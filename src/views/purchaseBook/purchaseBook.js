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
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState } from 'react';

const AddPurchaseBook = (props) => {
  const { open, handleClose, fetchData } = props;
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [publisherData, setPublisherData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  const validationSchema = yup.object({
    bookIssueDate: yup.date().required('Book Issue date is required'),
    quantity: yup.number().required('Quantity is required').typeError('Must be a number'),
    bookComment: yup.string(),
    discount: yup.string().required('Discount is required:'),
    price: yup.string().required('Price is required')
  });

  const formik = useFormik({
    initialValues: {
      bookName: '',
      vendorId: '',
      bookIssueDate: new Date().toISOString().split('T')[0],
      quantity: '',
      bookComment: '',
      discount: '',
      price: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting form with values:', values);
      try {
        const response = await axios.post('http://localhost:4300/user/purchaseBook', values);
        console.log('Form submitted successfully>>>>>>>:', response);
        toast.success('Purchase Book details added successfully');
        fetchData();
        handleClose();
      } catch (error) {
        toast.error(error?.response?.data?.message);
        console.error('Error submitting form:', error);
      }
      formik.resetForm();
      handleClose();
    }
  });

  // Handle the change for quantity and price to dynamically calculate total price
  const handlePriceCalculation = (field, value) => {
    formik.setFieldValue(field, value);

    // If quantity and price are set, calculate the total price
    if (formik.values.quantity && formik.values.price) {
      const totalPrice = formik.values.quantity * formik.values.price;
      formik.setFieldValue('price', totalPrice.toString());
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/bookManagement');
        console.log('Fetched Book Data:', response.data);
        setBookData(response.data?.BookManagement);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchVendor = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/venderManagement');
        console.log('Vendor Data:', response);
        setStudentData(response.data?.VenderManagement);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    const fetchPublisher = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getPublications');
        console.log('Publisher Data:', response);
        setPublisherData(response.data?.PublicationsManagement);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    };

    fetchBooks();
    fetchVendor();
    fetchPublisher();
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Purchase New Books</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Books</FormLabel>
                  <FormControl fullWidth>
                    <Select id="bookId" name="bookId" value={formik.values.bookId} onChange={formik.handleChange}>
                      {bookData && bookData.length > 0 ? (
                        bookData.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.bookName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No books available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl fullWidth>
                    <Select
                      id="vendorId"
                      name="vendorId"
                      value={formik.values.vendorId}
                      onChange={(event) => formik.setFieldValue('vendorId', event.target.value)}
                    >
                      {studentData.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.vendorName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Date</FormLabel>
                  <TextField
                    name="bookIssueDate"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.bookIssueDate}
                    onChange={formik.handleChange}
                    InputProps={{
                      style: {
                        height: '50px'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Total Quantity</FormLabel>
                  <TextField
                    id="quantity"
                    name="quantity"
                    size="small"
                    fullWidth
                    value={formik.values.quantity}
                    onChange={(e) => handlePriceCalculation('quantity', e.target.value)}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    inputProps={{ maxLength: 5 }}
                    InputProps={{
                      style: {
                        height: '50px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Price</FormLabel>
                  <TextField
                    id="price"
                    name="price"
                    size="small"
                    fullWidth
                    value={formik.values.price}
                    onChange={(e) => handlePriceCalculation('price', e.target.value)}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    inputProps={{ maxLength: 5 }}
                    InputProps={{
                      style: {
                        height: '50px'
                      }
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Total Discount</FormLabel>
                  <TextField
                    id="discount"
                    name="discount"
                    size="small"
                    fullWidth
                    value={formik.values.discount}
                    onChange={(event) => formik.setFieldValue('discount', event.target.value)}
                  />
                </Grid> */}
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Comment</FormLabel>
                  <TextField
                    id="bookComment"
                    name="bookComment"
                    size="small"
                    multiline
                    rows={5}
                    fullWidth
                    value={formik.values.bookComment}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
            <DialogActions>
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

export default AddPurchaseBook;
