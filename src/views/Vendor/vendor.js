import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormControl, FormHelperText, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import PolicyManagement from './index.js';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { url } from 'core/url.js';
import { postApi } from 'core/apiClient';

const AddPolicy = (props) => {
  const { open, handleClose, fetchData } = props;
  const [isloading, setIsloading] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];

  const validationSchema = yup.object({
    vendorName: yup
      .string()
      .required('vendor Name is required')
      .min(3, 'Vender Name must be at least 3 characters')
      .max(30, 'vender Name must be less than or equal to 50 characters'),
    companyName: yup
      .string()
      .required('Company Name is required')
      .min(3, 'Company Name must be at least 3 characters')
      .max(30, 'Company Name must be less than or equal to 50 characters'),
    address: yup.string().required('Address is required')
      .min(5, 'Address must be at least 3 characters')
      .max(30, 'Address Name must be less than or equal to 50 characters'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .test('not-repeated', 'Phone number is invalid', (value) => {
        if (!value) return false;
        return !/^(\d)\1{9}$/.test(value);
      })
      .required('Phone number is required'),

    email: yup.string().email('Invalid email').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      vendorName: '',
      companyName: '',
      address: '',
      date: todayDate,
      phoneNumber: '',
      email: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      setIsloading(true);

      try {
        const response = await postApi(url.vendorManagement.addVender, values);
        toast.success('Vendor details added successfully');
        fetchData();
        setIsloading(false);
        formik.resetForm();
        handleClose();
      } catch (error) {
        const errorMessage = error?.response?.data?.message;

        if (errorMessage === 'Email already exists') {
          formik.setFieldError('email', 'Email already exists');
        } else {
          console.error('Error submitting form:', error);
          toast.error('Something went wrong');
        }
      }

      setIsloading(false);
    }
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">Add New Vendor</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Vendor Name</FormLabel>
                  <TextField
                    id="vendorName"
                    name="vendorName"
                    size="small"
                    fullWidth
                    value={formik.values.vendorName}
                    onChange={formik.handleChange}
                    error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
                    helperText={formik.touched.vendorName && formik.errors.vendorName}
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Company</FormLabel>
                  <TextField
                    id="companyName"
                    name="companyName"
                    size="small"
                    fullWidth
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                    helperText={formik.touched.companyName && formik.errors.companyName}
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    name="phoneNumber"
                    type="text"
                    size="small"
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    size="small"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    size="small"
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            onClick={formik.handleSubmit}
            color="secondary"
            disabled={isloading}
            style={{
              textTransform: 'capitalize',
              backgroundColor: isloading ? '#ccc' : '',
              color: isloading ? '#666' : '',
              pointerEvents: isloading ? 'none' : 'auto'
            }}
          >
            {isloading ? 'Saving...' : 'Save'}
          </Button>

          <Button
            type="reset"
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPolicy;
