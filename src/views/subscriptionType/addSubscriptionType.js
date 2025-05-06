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
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { url } from 'core/url';
import { postApi } from 'core/apiClient';

const AddSubscription = (props) => {
  const { open, handleClose, fetchData } = props;
  const [publisherData, setPublisherData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const [isloading, SetIsloading] = useState(false);

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
    desc: Yup.string().max(500, 'Comment cannot exceed 500 characters').required('Discription  is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      amount: '',
      desc: '',
      numberOfDays: ''
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const response = await postApi(url.subscription.Subscription, values);
        toast.success('Subscription Type details added successfully');
        fetchData();
        formik.resetForm();
        handleClose();
      } catch (error) {
        const errorMessage = error?.response?.data?.message;

        if (errorMessage === 'Title already exists') {
          formik.setFieldTouched('title', true, false);
          formik.setFieldError('title', 'Title already exists');
        } else {
          console.error('Error submitting form:', error);
          toast.error('Something went wrong');
        }
      }

      SetIsloading(false);
    }

  });
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
                  inputProps={{ maxLength: 6 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
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
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Description</FormLabel>
                <TextField
                  id="desc"
                  name="desc"
                  size="small"
                  multiline
                  rows={4}
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
            <Button type="submit" variant="contained" color="primary" disabled={isloading}>
              {isloading ? 'Saving...' : 'Save'}
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
