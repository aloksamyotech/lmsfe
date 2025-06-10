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
import { url } from 'core/url';
import { postApi, updateApi } from 'core/apiClient';

const AddPublications = (props) => {
  const { open, handleClose, fetchData, editData } = props;
  const [isloading, setIsloading] = useState(false);

  const validationSchema = yup.object({
    publisherName: yup
      .string()
      .required('Publisher Name is required')
      .min(3, 'Publisher Name must be at least 3 characters')
      .max(30, 'Publisher Name must be less than or equal to 50 characters'),

    address: yup
      .string()
      .required('Address is required')
      .min(5, 'Address Name must be at least 5 characters')
      .max(30, 'Address Name must be less than or equal to 50 characters'),

    description: yup.string().required('Description is required')
  });
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      publisherName: editData?.publisherName || '',
      address: editData?.address || '',
      description: editData?.description || ''
    },
    validationSchema,

    onSubmit: async (values) => {
      setIsloading(true);

      try {
        const dataToSend = {
          ...values,
          ...(editData?.id && { id: editData.id }) // include id only in edit case
        };

        if (editData?.id) {
          await updateApi(`${url.publications.editPublications}`, dataToSend);
          toast.success('Publication updated successfully');
        } else {
          await postApi(url.publications.addPublications, dataToSend);
          toast.success('Publication added successfully');
        }

        fetchData();
        formik.resetForm();
        handleClose();
      } catch (error) {
        const errorMessage = error?.response?.data?.message;

        if (errorMessage === 'This already exists') {
          formik.setFieldTouched('publisherName', true, false);
          formik.setFieldError('publisherName', 'Name already exists');
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
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <form>
          <DialogTitle
            id="scroll-dialog-title"
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="h6">{editData?.id ? 'Edit Publications' : 'Add Publications'}</Typography>

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
                    fullWidth
                    value={formik.values.publisherName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    inputProps={{ maxLength: 100 }}
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
              {isloading ? (editData?.id ? 'Updating...' : 'Saving...') : editData?.id ? 'Update' : 'Save'}
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
