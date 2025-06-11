import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, FormControl, Autocomplete, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { Field, useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { url } from 'core/url';
import { getApi, postApi, updateApi } from 'core/apiClient';

const validationSchema = yup.object({
  bookName: yup
    .string()
    .required('Book Name is required')
    .min(3, 'Book Name must be at least 3 characters')
    .max(30, 'Book Name must be less than or equal to 50 characters'),

  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(30, 'Title must be less than or equal to 50 characters'),

  author: yup
    .string()
    .required('Author is required')
    .min(3, 'Author must be at least 3 characters')
    .max(30, 'Author Name must be less than or equal to 50 characters'),

  publisher: yup.string().required('Publisher is required').min(3, 'Publisher must be at least 3 characters'),

  bookDistribution: yup
    .string()
    .required('Book Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(400, 'Description must be less than or equal to 400 characters')
});

const AddLead = (props) => {
  const { open, handleClose, fetchData, editData } = props;
  const [publisherData, setPublisherData] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      bookName: editData?.bookName || '',
      title: editData?.title || '',
      author: editData?.author || '',
      bookIssueDate: '',
      publisher: editData?.publisherId || '',
      upload_Book: '',
      bookDistribution: editData?.bookDistribution || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsloading(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== 'upload_Book') {
          formData.append(key, values[key]);
        }
      });

      if (values.upload_Book) {
        formData.append('upload_Book', values.upload_Book);
      }

      try {
        let response;

        if (editData) {
          response = await updateApi(`${url.bookManagenent.editBook}${editData.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Book details updated successfully');
        } else {
          response = await postApi(url.bookManagenent.addBook, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Book details added successfully');
        }

        fetchData();
        formik.resetForm();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);

        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;

          if (errorMessage.includes('already exists')) {
            formik.setFieldError('bookName', 'Book already exists with this title and author');
            formik.setFieldError('author', 'Author already has a book with this name');
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } finally {
        setIsloading(false);
      }
    }
  });

  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        const response = await getApi(url.publications.getPublications);

        setPublisherData(response.data.PublicationsManagement);
      } catch (error) {
        console.error('Error fetching Publisher:', error);
      }
    };
    fetchPublisher();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('upload_Book', file);
  };
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{editData?.id ? 'Edit Book' : 'Add Book'}</Typography>

        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Name</FormLabel>
                <TextField
                  id="bookName"
                  name="bookName"
                  size="small"
                  fullWidth
                  value={formik.values.bookName}
                  onChange={formik.handleChange}
                  error={formik.touched.bookName && Boolean(formik.errors.bookName)}
                  helperText={formik.touched.bookName && formik.errors.bookName}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Title</FormLabel>
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

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Author Name</FormLabel>
                <TextField
                  id="author"
                  name="author"
                  size="small"
                  fullWidth
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  error={formik.touched.author && Boolean(formik.errors.author)}
                  helperText={formik.touched.author && formik.errors.author}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Publisher Name</FormLabel>
                <FormControl fullWidth error={formik.touched.publisherName && Boolean(formik.errors.publisherName)}>
                  <Autocomplete
                    id="publisher"
                    name="publisher"
                    size="small"
                    options={publisherData}
                    getOptionLabel={(option) => option.publisherName || ''}
                    value={publisherData.find((pub) => pub._id === formik.values.publisher) || null}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('publisher', newValue ? newValue._id : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                        helperText={formik.touched.publisher && formik.errors.publisher}
                      />
                    )}
                    sx={{ height: '40px' }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Upload Book Image</FormLabel>
                <FormControl fullWidth error={formik.touched.upload_Book && Boolean(formik.errors.upload_Book)}>
                  <TextField
                    id="upload_Book"
                    name="upload_Book"
                    size="small"
                    fullWidth
                    value={formik.values.upload_Book ? formik.values.upload_Book.name : ''}
                    onClick={() => document.getElementById('file-input').click()}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button sx={{ marginRight: '25px' }}>Choose File</Button>
                        </InputAdornment>
                      )
                    }}
                  />
                  <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  {formik.touched.upload_Book && formik.errors.upload_Book && <FormHelperText>{formik.errors.upload_Book}</FormHelperText>}
                  {formik.values.upload_Book && formik.values.upload_Book.name && (
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      {formik.values.upload_Book.name}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <FormLabel>Book Description</FormLabel>
                <TextField
                  id="bookDistribution"
                  name="bookDistribution"
                  size="small"
                  multiline
                  rows={5}
                  fullWidth
                  value={formik.values.bookDistribution}
                  onChange={formik.handleChange}
                  error={formik.touched.bookDistribution && Boolean(formik.errors.bookDistribution)}
                  helperText={formik.touched.bookDistribution && formik.errors.bookDistribution}
                  inputProps={{ maxLength: 400 }}
                />
              </Grid>
            </Grid>
          </DialogContentText>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary" disabled={isloading}>
              {isloading ? (editData?.id ? 'Updating...' : 'Saving...') : editData?.id ? 'Update' : 'Save'}
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

export default AddLead;
