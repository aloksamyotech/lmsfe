import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  FormLabel,
  Autocomplete,
  Typography,
  InputAdornment
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { getApi, postApi, updateApiPatch } from 'core/apiClient';
import { fetchCurrency } from 'core/comman';
import { url } from 'core/url';

const validationSchema = yup.object({
  bookId: yup.string().required('Book is required'),
  vendorId: yup.string().required('Vendor is required'),
  bookIssueDate: yup.date().required('Issue Date is required'),
  quantity: yup.number().required('Quantity is required').positive().integer().min(1).max(1000),
  price: yup.number().required('Price is required').positive().min(0.1),
  bookComment: yup.string().max(500).required('Comment is required')
});

const AddPurchaseBook = ({ open, handleClose, fetchData, editData }) => {
  const [bookData, setBookData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const books = await getApi(url.bookManagenent.bookmanagementTable);
        const vendors = await getApi(url.vendorManagement.viewVender);

        setBookData(books.data?.data || []);
        setVendorData(vendors.data?.VenderManagement || []);
      } catch (error) {
        console.error('Error fetching dropdowns:', error);
      }
    };
    fetchDropdowns();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bookId: editData?.bookId || '',
      vendorId: Array.isArray(editData?.vendorId) ? editData.vendorId[0] : editData?.vendorId || '',
      bookIssueDate: editData?.bookIssueDate || new Date().toISOString().split('T')[0],
      quantity: editData?.quantity || '',
      price: editData?.price || '',
      totalPrice: editData?.totalPrice || (editData?.quantity && editData?.price ? editData.quantity * editData.price : ''),
      bookComment: editData?.bookComment || ''
    },

    validationSchema,
    onSubmit: async (values) => {
      setIsloading(true);
      try {
        const dataToSend = {
          ...values,
          totalPrice: values.quantity * values.price
        };

        if (editData?.id) {
          dataToSend.id = editData.id;
          dataToSend.previousQuantity = editData.quantity;
          dataToSend.previousBookId = editData.bookId;

          await updateApiPatch(`${url.purchaseBook.updatePurchaseBook}`, dataToSend);
          toast.success('Purchase Book updated successfully');
        } else {
          await postApi(url.purchaseBook.purchaseBook, dataToSend);
          toast.success('Purchase Book added successfully');
        }

        fetchData();
        handleClose();
        formik.resetForm();
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
        console.error('Error:', error);
      } finally {
        setIsloading(false);
      }
    }
  });

  const handleFieldChange = (field, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    formik.setFieldValue(field, cleanValue);

    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(field === 'quantity' ? cleanValue : formik.values.quantity) || 0;
      const price = parseFloat(field === 'price' ? cleanValue : formik.values.price) || 0;
      formik.setFieldValue('totalPrice', quantity * price);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{editData?.id ? 'Edit Purchase' : 'Add Purchase'}</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText tabIndex={-1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormLabel>Book</FormLabel>
                <Autocomplete
                  id="bookId"
                  name="bookId"
                  size="small"
                  fullWidth
                  value={bookData.find((book) => book._id === formik.values.bookId) || null}
                  onChange={(e, newVal) => formik.setFieldValue('bookId', newVal ? newVal._id : '')}
                  options={bookData}
                  getOptionLabel={(option) => option.bookName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={formik.touched.bookId && Boolean(formik.errors.bookId)}
                      helperText={formik.touched.bookId && formik.errors.bookId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Vendor</FormLabel>
                <Autocomplete
                  id="vendorId"
                  name="vendorId"
                  size="small"
                  fullWidth
                  options={vendorData}
                  getOptionLabel={(option) => option.vendorName || ''}
                  value={vendorData.find((v) => v._id === formik.values.vendorId) || null}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('vendorId', newValue?._id || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={formik.touched.vendorId && Boolean(formik.errors.vendorId)}
                      helperText={formik.touched.vendorId && formik.errors.vendorId}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Date</FormLabel>
                <TextField
                  name="bookIssueDate"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.bookIssueDate}
                  onChange={(e) => formik.setFieldValue('bookIssueDate', e.target.value)}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Quantity</FormLabel>
                <TextField
                  id="quantity"
                  name="quantity"
                  size="small"
                  fullWidth
                  value={formik.values.quantity}
                  onChange={(e) => handleFieldChange('quantity', e.target.value)}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Price per Book</FormLabel>
                <TextField
                  id="price"
                  name="price"
                  size="small"
                  fullWidth
                  value={formik.values.price}
                  onChange={(e) => handleFieldChange('price', e.target.value)}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormLabel>Total Amount</FormLabel>
                <TextField
                  id="totalPrice"
                  name="totalPrice"
                  size="small"
                  fullWidth
                  disabled
                  value={formik.values.totalPrice}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormLabel>Comment</FormLabel>
                <TextField
                  id="bookComment"
                  name="bookComment"
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  value={formik.values.bookComment}
                  onChange={formik.handleChange}
                  error={formik.touched.bookComment && Boolean(formik.errors.bookComment)}
                  helperText={formik.touched.bookComment && formik.errors.bookComment}
                />
              </Grid>
            </Grid>
          </DialogContentText>

          <DialogActions sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isloading}
              sx={{
                textTransform: 'capitalize',
                backgroundColor: isloading ? '#ccc' : undefined
              }}
            >
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

export default AddPurchaseBook;
