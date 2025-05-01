import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Divider,
  Avatar,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Grid, FormLabel, FormControl, Select, MenuItem, FormHelperText, Autocomplete } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from 'ui-component/TableStyle';
import axios from 'axios';
import Iconic from 'ui-component/iconify/Iconify';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { url } from 'core/url';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchCurrency } from 'core/comman';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Add, Remove } from '@mui/icons-material';
import { getApi, postApi } from 'core/apiClient';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

const ReceiveBook = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [fetchReceiveBook, setFetchReceiveBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fineloading, setFineloading] = useState(false);

  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [amountError, setAmountError] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [amountHelperText, setAmountHelperText] = useState('');
  const [reasonHelperText, setReasonHelperText] = useState('');
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [book_Id, setBook_Id] = useState();
  const [fineDataa, setFineDataa] = useState([]);
  const [fineDetails, setFineDetails] = useState(null);
  const [allFineData, setAllFineData] = useState([]);
  const [fineid, setFineid] = useState([]);
  const [allotmentId, setAllotmentId] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookquantity, setBookqunatity] = useState('');
  const [submitbookquantity, setSubmitbookqunatity] = useState(1);
  const [remainingbooks, setRemainingbooks] = useState();
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const handleOpen = (book) => {
    setAmount('');
    setReason('');
    setFineid(book);
    setOpen(true);
  };
  const handleClose = () => {
    setFineid(null);
    setOpen(false);
  };
  const [booksss, setFetchReceiveBooks] = useState([]);
  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'title',
      headerName: 'Payment Type',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'bookIssueDate',
      headerName: 'Book Issue Date',
      flex: 1
    },
    {
      field: 'submissionDate',
      headerName: 'Submission Date',
      flex: 1
    },
    {
      field: 'invoice',
      headerName: 'Invoice',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleInvoice(params.row)} style={{ margin: '-9px' }}>
            <ReceiptIcon />
          </Button>
        </div>
      )
    }
  ];
  const validateAmount = (value) => {
    if (!value) {
      setAmountError(true);
      setAmountHelperText('Amount is required');
    } else if (isNaN(value) || value <= 0) {
      setAmountError(true);
      setAmountHelperText('Please enter a valid amount greater than 0');
    } else {
      setAmountError(false);
      setAmountHelperText('');
    }
  };
  const validateReason = (value) => {
    if (!value) {
      setReasonError(true);
      setReasonHelperText('Reason is required');
    } else {
      setReasonError(false);
      setReasonHelperText('');
    }
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };
  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    validateReason(value);
  };
  const handleSubmit = () => {
    if (!amountError && !reasonError) {
      handleFineSubmit();
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);
  useEffect(() => {
    const getAllSubmitBookDetails = async () => {
      try {
        const submitResponse = await getApi(`${url.booksubmission.getsubmitedBookinvoice}`);
        const fetchedData = submitResponse?.data?.data?.map((item, index) => {
          const fines = item?.fines || [];

          return {
            serial: index + 1,
            id: item?._id,
            bookid: item?.bookId || 'N/A',
            student_Name: item?.studentDetails?.student_Name || 'N/A',
            bookName: item?.bookDetails?.bookName || 'N/A',
            title: item?.subscriptiontypes?.[0]?.title || 'N/A',
            amount: item?.subscriptiontypes?.[0]?.amount || 0,
            quantity: item?.quantity || 0,
            bookIssueDate: formatDate(item?.bookIssueDate),
            submissionDate: formatDate(item?.submissionDate),
            fines: fines
          };
        });

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching submit book data:', error);
      }
    };
    getAllSubmitBookDetails();
    const fetchSubscription = async () => {
      try {
        const response = await getApi(url.subscription.findSubscription);
        setStudentData(response.data?.SubscriptionType);
      } catch (error) {
        console.error('Error fetching SubscriptionType', error);
      }
    };
    const fetchReceiveBook = async () => {
      try {
        const response = await getApi(url.allotmentManagement.receiveBook);
        setFetchReceiveBook(response.data.books);
        setFetchReceiveBooks(response.data.books || []);
      } catch (error) {
        console.error('Error fetching Receive Book', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await getApi(url.studentRegister.getRegisterManagement);

        setAllData(response?.data?.RegisterManagement);

        const modifiedData = response?.data?.RegisterManagement?.map((item) => {
          return item;
        });

        setAllData(modifiedData);
        return modifiedData;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const BookAllotments = async () => {
      try {
        const response = await getApi(url.allotmentManagement.allotmentManagementData);
        const data = response?.data;
        setFetchReceiveBook(data);

        return data;
      } catch (error) {
        console.error('Error fetching Allotment Books', error);
      }
    };
    const filterData = async () => {
      try {
        const studentData = await fetchStudents();
        const bookData = await BookAllotments();

        const bookStudentIds = bookData.map((book) => book.studentId);

        const matchedStudents = studentData.filter((student) => bookStudentIds.includes(student._id));

        setMatchedStudents(matchedStudents);
      } catch (error) {
        console.error('Error filtering data:', error);
      }
    };

    // const NewReceiveBook = async () => {
    //   try {
    //     const response = await getApi(url.allotmentManagement.getReceiveBook);

    //     setFetchReceiveBook(response.data);
    //   } catch (error) {
    //     console.error('Error fetching Receive Book', error);
    //   }
    // };
    filterData();
    fetchStudents();
    fetchSubscription();
    fetchReceiveBook();
    // NewReceiveBook();
    BookAllotments();
  }, []);
  const formik = useFormik({
    initialValues: {
      studentId: studentId,
      email: '',
      bookId: []
    },
    onSubmit: async (values) => {
      try {
        const response = await postApi(url.allotmentManagement.postReceiveBook, values);
        toast.success('Details Book successfully');
        fetchData();
        handleClose();
        handleStudentChange({
          target: { value: values.studentId }
        });
      } catch (error) {
        toast.error('Error submitting form:');
        console.error('Error submitting form:', error);
      }
    }
  });
  const handleStudentChange = async (newValue) => {
    if (!newValue) {
      console.error('No student selected');
      return;
    }

    const selectedStudentId = newValue._id;
    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);

    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }

    try {
      const submitResponse = await getApi(`${url.allotmentManagement.getAllSubmitBookDetails}${selectedStudentId}`);
      const fetchedData = submitResponse?.data?.submittedBooks?.map((item) => ({
        id: item._id,
        student_Name: item?.studentDetails?.[0]?.student_Name,
        title: item?.paymentDetails?.[0]?.title,
        amount: item?.paymentDetails?.[0]?.amount,
        bookIssueDate: formatDate(item?.bookIssueDate),
        submissionDate: formatDate(item?.submissionDate)
      }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching submit book data:', error);
    }
  };

  function refreshPage() {
    window.location.reload();
  }
  useEffect(() => {
    if (selectedStudentId) {
      const filteredBooks = booksss.filter((receiveBookItem) => receiveBookItem.student.studentId === selectedStudentId);
      const allotmentId = filteredBooks[0].allotmentId;
      setAllotmentId(allotmentId);

      setBookData(filteredBooks);
    }
  }, [selectedStudentId, booksss]);

  useEffect(() => {
    const result = bookData.filter((book) => formik.values.bookId.includes(book.bookId) && book.active === true);

    setFilteredBooks(result);
    const bookQuantity = result[0]?.quantity || 0;
    setBookqunatity(bookQuantity);
    const count = result[0]?.submitCount || 0;
    setRemainingbooks(bookQuantity - count);
    const filterbookId = result[0]?.bookId || null;
    setBook_Id(filterbookId);
  }, [formik.values.bookId, bookData]);

  const handleInvoice = (row) => {
    navigate(`/dashboard/receiveInvoice/${row.id}`, {
      state: {
        rowData: row,
        bookId: row.bookid,
        fine: row.fines
      }
    });
  };

  const handleFineSubmit = () => {
    setFineloading(true);
    if (!amountError && !reasonError && amount && reason) {
      const newFine = {
        amount: amount.trim(),
        reason: reason.trim()
      };

      setFineDataa((prev) => [...prev, newFine]);

      setAmount('');
      setReason('');
      setFineloading(false);
      setOpen(false);
    } else {
      console.error('Please fix validation errors before saving.');
    }
  };

  const handleRemove = async (bookId) => {
    const book = filteredBooks.find((b) => b._id === bookId);
    const quantityToSubmit = submitbookquantity;
    const user = JSON.parse(localStorage.getItem('user'));
    const adminId = user?._id;
    try {
      const submitResponse = await postApi(`${url.allotmentManagement.submitBook}${bookId}`, { receivequantity: quantityToSubmit });

      toast.success('Book submitted successfully');
      const { submittedBook } = submitResponse.data;
      const updatedBook = submittedBook.books.find((book) => book._id === bookId);
      const totalFineAmount = fineDataa.reduce((sum, fine) => sum + (parseFloat(fine.amount) || 0), 0);
      const payload = {
        allotmentId: submittedBook._id,
        studentId: submittedBook.studentId,
        bookId: updatedBook.bookId,
        bookIssueDate: updatedBook.bookIssueDate,
        submissionDate: updatedBook.submissionDate,
        paymentType: updatedBook.paymentType,
        quantity: quantityToSubmit,
        amount: updatedBook.amount,
        fine: fineDataa.length > 0,
        totalFineAmount: totalFineAmount,
        fines: fineDataa,
        adminId
      };
      const response = await postApi(`${url.booksubmission.submitedBook}`, payload);
      setLoading(true);
      window.location.reload();
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setLoading(false);
    }
  };
  const isSubmitDisabled = !amount || !reason || amountError || reasonError;

  function getUniqueBooks(bookData) {
    return [...new Map(bookData.filter((item) => item.active === true).map((item) => [item.bookId, item])).values()];
  }
  function getFilteredBooksss(book) {
    const alocationIdToFind = book._id;
    const filteredDataArray = allFineData.filter((item) => item.alocationId === alocationIdToFind);
    setFineDataa(fine);
    return filteredDataArray;
  }

  return (
    <Container>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px'
        }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/BookManagement" color="inherit" underline="none">
            Book Management
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/Receive" color="inherit" underline="none">
            Receive
          </MuiLink>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '100px',
          marginBottom: '-30px'
        }}
      >
        <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Student</FormLabel>
            <FormControl fullWidth sx={{ height: '40px' }}>
              <Autocomplete
                id="studentId"
                name="studentId"
                size="small"
                value={matchedStudents.find((student) => student._id === formik.values.studentId) || null}
                onChange={(event, newValue) => handleStudentChange(newValue)}
                options={matchedStudents}
                getOptionLabel={(option) => option.student_Name}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                isOptionEqualToValue={(option, value) => option._id === value?._id}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Email</FormLabel>
            <FormControl fullWidth>
              <Select id="email" name="email" size="small" value={formik.values.email} disabled onChange={formik.handleChange}>
                {allData.map((item) => (
                  <MenuItem key={item._id} value={item.email}>
                    {item.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Book</FormLabel>
            <FormControl fullWidth>
              <Select
                id="bookId"
                name="bookId"
                size="small"
                value={formik.values.bookId}
                onChange={formik.handleChange}
                disabled={!formik.values.studentId}
              >
                {getUniqueBooks(bookData).map((item) => (
                  <MenuItem key={item.bookId} value={item.bookId}>
                    {item?.bookName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      <Grid container spacing={2}>
        {filteredBooks?.map((book, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Card
              sx={{
                borderRadius: '12px',
                background: '#F8FAFC',
                padding: '20px'
              }}
            >
              <Typography variant="h4" sx={{ fontSize: '22px', textAlign: 'center', mb: 2, color: 'text.primary' }}>
                {book?.bookName || 'Loading...'}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Author:</strong> {book?.bookAuthor || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Student Name:</strong> {book?.student.studentName || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {book?.student.email || 'Loading...'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Subscription:</strong> {book?.paymentType || 'Loading...'}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Phone:</strong> {book?.student.mobileNumber || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> {book?.amount || 'Loading...'}
                  </Typography>
                  <Typography variant="body1">
                    <strong> Item:</strong> {remainingbooks || 0}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Issue Date:</strong> {formatDate(book?.bookIssueDate) || 'Loading...'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: new Date(book?.submissionDate) > new Date() ? 'red' : 'inherit'
                    }}
                  >
                    <strong>Submission Date:</strong> {formatDate(book?.submissionDate) || 'Loading...'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                      <strong>Quantity:</strong>
                    </Typography>

                    <IconButton onClick={() => setSubmitbookqunatity((prev) => Math.max(1, prev - 1))} disabled={submitbookquantity <= 1}>
                      <Remove />
                    </IconButton>

                    <Typography>{submitbookquantity}</Typography>

                    <IconButton
                      onClick={() => setSubmitbookqunatity((prev) => Math.min(remainingbooks, prev + 1))}
                      disabled={submitbookquantity >= remainingbooks}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ marginY: 1 }} />
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                  <Typography component="span" sx={{ fontWeight: 'bold', color: '#333333' }}>
                    Fine Details
                  </Typography>
                </AccordionSummary>
                <div>
                  <AccordionDetails sx={{ marginTop: '-20px' }}>
                    {fineDataa.length > 0 ? (
                      <ol style={{ paddingLeft: '20px' }}>
                        {' '}
                        {fineDataa.map((item, index) => (
                          <li key={index}>
                            <Typography variant="body1">
                              <strong>Reason:</strong> {item?.reason || 'Loading...'}
                              <strong style={{ marginLeft: '50px' }}>Fine Amount:</strong> {currencySymbol}
                              {item?.amount ?? `${currencySymbol}0.00`}
                            </Typography>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <Typography variant="body1">No fine data available.</Typography>
                    )}
                  </AccordionDetails>
                </div>
              </Accordion>
              <Divider sx={{ marginY: 1 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2, width: '15%', marginRight: 2 }}
                  onClick={() => handleRemove(book._id)}
                >
                  Submit
                </Button>
                <Button variant="contained" color="primary" sx={{ marginTop: 2, width: '15%' }} onClick={() => handleOpen(book)}>
                  Add Fine
                </Button>
                <Dialog open={open} onClose={handleClose}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" px={3} pt={2}>
                    <DialogTitle sx={{ p: 0 }}>Book Fine</DialogTitle>
                    <ClearIcon onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />
                  </Box>

                  <DialogContent>
                    <p>Please Pay Fine</p>
                    <TextField
                      label="Amount"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={amount}
                      onChange={handleAmountChange}
                      error={amountError}
                      helperText={amountHelperText}
                      sx={{ marginBottom: 2 }}
                      inputProps={{ maxLength: 3 }}
                    />
                    <TextField
                      label="Reason"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={reason}
                      onChange={handleReasonChange}
                      error={reasonError}
                      helperText={reasonHelperText}
                      sx={{ marginBottom: 2 }}
                      inputProps={{ maxLength: 30 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleFineSubmit} color="primary" disabled={isSubmitDisabled || fineloading}>
                      {fineloading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px',
          marginTop: '30px'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <TableStyle>
        <Box width="100%" backgroundColor="white" height="700px">
          <DataGrid
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 }
              }
            }}
            pagination
            rows={data.map((row, index) => ({ ...row, sNo: index + 1 }))}
            columns={columns}
            getRowId={(row) => row.serial}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        </Box>
      </TableStyle>
    </Container>
  );
};
export default ReceiveBook;
