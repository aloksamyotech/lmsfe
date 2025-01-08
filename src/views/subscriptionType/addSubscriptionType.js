import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, FormControl, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
// import * as yup from 'yup';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AddSubscription = (props) => {
  const { open, handleClose, fetchData } = props;
  const [publisherData, setPublisherData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters long'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be a positive number')
      .typeError('Amount must be a valid number'),
    numberOfDays: Yup.number()
      .required('Number Of Days is required')
      .positive('Number Of Days must be a positive number')
      .typeError('Number Of Days must be a valid number'),
    discount: Yup.number()
      .min(0, 'Discount must be at least 0')
      .max(100, 'Discount cannot be more than 5')
      .optional()
      .typeError('Discount must be a valid number'),
    desc: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters long')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      amount: '',
      discount: '',
      desc: '',
      numberOfDays: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      console.log('Submitted values', values);
      try {
        const response = await axios.post('http://localhost:4300/user/subscriptionType', values);
        console.log('Form submitted successfully:', response);
        console.log();
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Subscription Type details added successfully');
      formik.resetForm();
      handleClose();
    }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('upload_Book', file);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Subscription Type Information</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={5} md={5}>
                <FormLabel>Title</FormLabel>
                <TextField
                  id="title"
                  name="title"
                  size="small"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  inputProps={{ maxLength: 50 }}
                />
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
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={5}>
                <FormLabel>Discount</FormLabel>
                <TextField
                  id="discount"
                  name="discount"
                  size="small"
                  fullWidth
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  error={formik.touched.discount && Boolean(formik.errors.discount)}
                  helperText={formik.touched.discount && formik.errors.discount}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={5}>
                <FormLabel>Number Of Days</FormLabel>
                <TextField
                  id="numberOfDays"
                  name="numberOfDays"
                  size="small"
                  fullWidth
                  value={formik.values.numberOfDays}
                  onChange={formik.handleChange}
                  error={formik.touched.numberOfDays && Boolean(formik.errors.numberOfDays)}
                  helperText={formik.touched.numberOfDays && formik.errors.numberOfDays}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>Description</FormLabel>
                <TextField
                  id="desc"
                  name="desc"
                  size="small"
                  multiline
                  rows={5}
                  fullWidth
                  value={formik.values.desc}
                  onChange={formik.handleChange}
                  error={formik.touched.desc && Boolean(formik.errors.desc)}
                  helperText={formik.touched.desc && formik.errors.desc}
                  inputProps={{ maxLength: 400 }}
                />
              </Grid>
            </Grid>
          </DialogContentText>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
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
  );
};

export default AddSubscription;
