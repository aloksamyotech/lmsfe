/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormControl, FormHelperText, FormLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import axios from 'axios';
import { url } from 'core/url';
import { postApi } from 'core/apiClient';

const AddPublications = (props) => {
  const { open, handleClose, fetchData } = props;
  const [isloading, setIsloading] = useState(false);

  const validationSchema = yup.object({
    publisherName: yup.string().required('Book Title is required'),

    address: yup.string().required('Address is required'),
    description: yup.string().required('Description is required')
  });

  const formik = useFormik({
    initialValues: {
      publisherName: '',

      address: '',
      description: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      setIsloading(true);

      try {
        const response = await postApi(url.publications.addPublications, values);
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Publications details added successfully');
      formik.resetForm();
      setIsloading(false);

      handleClose();
    }
  });
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);
  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <form>
          <DialogTitle
            id="scroll-dialog-title"
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">Add Publications </Typography>
            <Typography>
              <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Publisher Name</FormLabel>
                  <TextField
                    id="publisherName"
                    name="publisherName"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.publisherName}
                    onChange={formik.handleChange}
                    error={formik.touched.publisherName && Boolean(formik.errors.publisherName)}
                    helperText={formik.touched.publisherName && formik.errors.publisherName}
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    inputProps={{ maxLength: 30 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="description"
                    name="description"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    inputProps={{ maxLength: 300 }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
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
        </form>
      </Dialog>
    </div>
  );
};

export default AddPublications;
