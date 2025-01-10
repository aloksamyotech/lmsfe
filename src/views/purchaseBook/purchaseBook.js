import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, MenuItem, Select, FormControl, FormHelperText, Autocomplete } from '@mui/material';
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

const validationSchema = yup.object({
  bookId: yup.string().required('Book is required'),
  vendorId: yup.string().required('Vendor is required'),
  bookIssueDate: yup.date().required('Issue Date is required').max(new Date(), 'Issue date cannot be in the future'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be a positive number')
    .integer('Quantity must be an integer')
    .min(1, 'Minimum quantity is 1')
    .max(1000, 'Quantity cannot exceed 1000'),
  price: yup.number().required('Price is required').positive('Price must be a positive number').min(0.1, 'Price must be at least 0.1'),
  // totalPrice: yup.number().required('Total Price is required').positive('Total price must be positive'),
  bookComment: yup.string().max(500, 'Comment cannot exceed 500 characters')
});

const AddPurchaseBook = (props) => {
  const { open, handleClose, fetchData } = props;
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [publisherData, setPublisherData] = useState([]);

  const formik = useFormik({
    initialValues: {
      bookIssueDate: new Date().toISOString().split('T')[0],
      quantity: '',
      bookComment: '',
      discount: '',
      price: '',
      totalPrice: '',
      bookId: '',
      vendorId: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting form with values:', values);
      try {
        const response = await axios.post('http://64.227.130.216:4300/user/purchaseBook', values);
        console.log('Form submitted successfully>>>>>>>:', response);
        toast.success('Purchase Book added successfully');
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/bookManagement');
        console.log('Fetched Book Data:', response.data);
        setBookData(response.data?.BookManagement);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchVendor = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/venderManagement');
        console.log('Vendor Data:', response);
        setStudentData(response.data?.VenderManagement);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    const fetchPublisher = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/getPublications');
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

  const handleQuantityPriceChange = (field, value) => {
    const newValue = value === '' ? '' : value.replace(/[^0-9.]/g, '');
    formik.setFieldValue(field, newValue);

    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(formik.values.quantity) || 0;
      const price = parseFloat(formik.values.price) || 0;

      const totalPrice = quantity * price;
      formik.setFieldValue('totalPrice', totalPrice);
    }
  };

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
                    <Autocomplete
                      id="bookId"
                      name="bookId"
                      value={bookData.find((book) => book._id === formik.values.bookId) || null}
                      onChange={(event, newValue) => formik.setFieldValue('bookId', newValue ? newValue._id : '')}
                      options={bookData}
                      getOptionLabel={(option) => option.bookName}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={formik.touched.bookId && Boolean(formik.errors.bookId)}
                          helperText={formik.touched.bookId && formik.errors.bookId}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="vendorId"
                      name="vendorId"
                      value={studentData.find((item) => item._id === formik.values.vendorId) || null}
                      onChange={(event, newValue) => formik.setFieldValue('vendorId', newValue?._id || '')}
                      options={studentData}
                      getOptionLabel={(option) => option.vendorName}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={formik.touched.vendorId && Boolean(formik.errors.vendorId)}
                          helperText={formik.touched.vendorId && formik.errors.vendorId}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option._id === value}
                    />
                    {/* <FormHelperText style={{ color: 'red' }}>{formik.touched.vendorId && formik.errors.vendorId}</FormHelperText> */}
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
                    inputProps={{
                      min: new Date().toISOString().slice(0, 10),
                      style: { height: '30px' }
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
                    onChange={(e) => handleQuantityPriceChange('quantity', e.target.value)}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    inputProps={{ maxLength: 5 }}
                    InputProps={{ style: { height: '50px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Price Par Book</FormLabel>
                  <TextField
                    id="price"
                    name="price"
                    size="small"
                    fullWidth
                    value={formik.values.price}
                    onChange={(e) => handleQuantityPriceChange('price', e.target.value)}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                    inputProps={{ maxLength: 5 }}
                    InputProps={{ style: { height: '50px' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={5} md={5}>
                  <FormLabel>Total Amount</FormLabel>
                  <TextField
                    id="totalPrice"
                    name="totalPrice"
                    size="small"
                    fullWidth
                    value={formik.values.price * formik.values.quantity}
                    error={formik.touched.totalPrice && Boolean(formik.errors.totalPrice)}
                    helperText={formik.touched.totalPrice && formik.errors.totalPrice}
                    inputProps={{ maxLength: 5 }}
                    InputProps={{ style: { height: '50px' } }}
                    disabled
                  />
                </Grid>

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
                    error={formik.touched.bookComment && Boolean(formik.errors.bookComment)}
                    helperText={formik.touched.bookComment && formik.errors.bookComment}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                onClick={formik.handleSubmit}
                style={{ textTransform: 'capitalize' }}
                color="secondary"
              >
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
