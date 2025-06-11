import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormLabel,
  Autocomplete,
  Tabs,
  Tab,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cart from '../Books/Cart.js';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { toast } from 'react-toastify';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BooksModal from './viewbooks.js';
import { Stack } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Pagination from '@mui/material/Pagination';
import { fetchCurrency } from 'core/comman';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { array } from 'prop-types';
import BookInvoice from './Invoice';
import { url } from 'core/url';
import { IconTrash } from '@tabler/icons-react';

import ReceiveBook from 'views/ReceiveBook/index';
import { useCart } from '../Books/CartContext.js';
import { getApi } from 'core/apiClient.js';
import ClearIcon from '@mui/icons-material/Clear';

const Allotment = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionType, setSubmissionType] = useState('');
  const [studentData, setStudentData] = useState([]);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [studentss, setStudentss] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [studentName, setStudentName] = useState('');

  const [selectedBook, setSelectedBook] = useState(null);
  const { setCartcontextItems } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [currencySymbol, setCurrencySymbol] = useState('');

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const fetchCategory = async () => {
    const response = await getApi(url.bookManagenent.bookmanagementTable);
    setCategoryData(response.data.data);
  };

  const fetchSubscription = async () => {
    try {
      const response = await getApi(url.subscription.findSubscription);
      setStudentData(response.data?.SubscriptionType);
    } catch (error) {
      console.error('Error fetching SubscriptionType', error);
    }
  };
  const handleViewBooks = (row) => {
    setSelectedBooks(row.books);
    setStudentName(row.studentName);
    setShowModal(true);
  };

  const fetchData = async () => {
    try {
      const response = await getApi(url.studentRegister.getRegisterManagement);

      const fetchedData = response?.data?.RegisterManagement.map((item) => ({
        id: item._id,

        name: item.student_Name || 'N/A',
        email: item.email || 'N/A',
        mobile: item.mobile_Number || 'N/A',
        registerDate: item.register_Date ? new Date(item.register_Date).toLocaleDateString() : 'N/A'
      }));
      setStudents(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchinvoice = async () => {
    try {
      const response = await getApi(url.bookAllotmentHistory.getdataalocated);
      const formattedData = response.data.response.map((item) => ({
        id: item._id || Math.random().toString(),
        studentName: item.studentName,
        email: item.studentEmail,
        books: item.books || [],
        bookName: item.bookName,
        studentEmail: item.studentEmail,
        bookAuthor: item.bookAuthor,
        submissionDate: item.submissionDate,
        amount: item.amount,
        totalAmount: item.totalAmount,
        quantity: item.quantity,
        studentMobile: item.studentMobile
      }));
      setStudentss(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('librarycart')) || [];
    setCartItems(storedCartItems);
    setCartcontextItems(storedCartItems);
  }, []);
  useEffect(() => {
    localStorage.setItem('librarycart', JSON.stringify(cartItems));
    setCartcontextItems(cartItems);
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('librarycartCount', totalQuantity);
  }, [cartItems, setCartcontextItems]);
  useEffect(() => {
    fetchCategory();
    fetchSubscription();
    fetchData();
    fetchinvoice();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleAddToCart = (product) => {
    if (product.bookQuantity <= 0) {
      toast.error('Sorry, this book is out of stock!');
      return;
    }
    setSelectedProduct(product);
    setOpenModal(true);
  };
  const columns = [
    {
      field: 'studentName',
      headerName: 'Student Name',
      flex: 1
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1
    },
    {
      field: 'studentEmail',
      headerName: 'Email',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'studentMobile',
      headerName: 'Mobile',
      flex: 1
    },
    {
      field: 'viewBooks',
      headerName: 'View Books',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <button
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}
          onClick={() => handleViewBooks(params.row)}
        >
          View
        </button>
      )
    }
  ];

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSubmissionType(newType);

    const selectedType = studentData.find((type) => type._id === newType);

    if (selectedType && selectedType.numberOfDays) {
      const today = new Date();
      today.setDate(today.getDate() + selectedType.numberOfDays);
      const autoFilledDate = today.toISOString().split('T')[0];

      setSubmissionDate(autoFilledDate);

      setCalculatedAmount(selectedType.amount);
    }
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSubmissionDate(newDate);
    if (submissionType) {
      const selectedType = studentData.find((type) => type._id === submissionType);
      setCalculatedAmount(selectedType ? selectedType.amount : 0);
    }
  };

  const handleSubmitCart = () => {
    if (!submissionDate || !submissionType) {
      toast.error('Please select both submission date and type.');
      return;
    }

    const selectedType = studentData.find((type) => type._id === submissionType);
    const typeCharge = selectedType ? selectedType.amount : 0;
    const typeName = selectedType ? selectedType.title : 'N/A';
    let addedToCart = false;
    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(
        (item) => item._id === selectedProduct._id && item.submissionType === submissionType
      );
      const totalQuantity = prevCartItems.reduce((acc, item) => acc + item.quantity, 0);
      if (totalQuantity >= 5) {
        toast.error('You can add a maximum of 5 Books only!');
        return prevCartItems;
      }

      if (existingItemIndex >= 0) {
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        updatedCartItems[existingItemIndex].submissionDate = submissionDate;
        updatedCartItems[existingItemIndex].amount += typeCharge;
        addedToCart = true;
        return updatedCartItems;
      } else {
        addedToCart = true;
        return [
          ...prevCartItems,
          {
            ...selectedProduct,
            quantity: 1,
            submissionDate,
            submissionType,
            submissionTypeName: typeName,
            amount: typeCharge
          }
        ];
      }
    });

    setTimeout(() => {
      if (addedToCart) {
        toast.success('Book successfully added to cart');
        getBookCount();
        setOpenModal(false);
        setSubmissionDate('');
        setSubmissionType('');
        setCalculatedAmount(null);
      }
    }, 0);
  };

  const filteredProducts = categoryData.filter((product) => product.title && product.title.toLowerCase().includes(search.toLowerCase()));

  const getBookCount = async (bookId) => {
    try {
      const response = await getApi(url.bookManagenent.bookManagement);

      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        bookName: item.bookName,
        upload_Book: item.upload_Book,
        title: item.title,
        publisherName: item.publisherName,
        author: item.author,
        quantity: item.quantity > 0 ? item.quantity : 'Not Available'
      }));
      const book = fetchedData.find((item) => item.id === bookId);

      if (book) {
        return book.quantity;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredProducts.slice(indexOfFirstBook, indexOfLastBook);
  const handleRemoveFromCart = (id, submissionType) => {
    const updatedCartItems = cartItems.filter((item) => !(item._id === id && item.submissionType === submissionType));

    setCartItems(updatedCartItems);
    setCartcontextItems(updatedCartItems);
    localStorage.setItem('librarycart', JSON.stringify(updatedCartItems));

    const totalQuantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('librarycartCount', totalQuantity);
  };

  const handleIncreaseQuantity = (id, submissionType) => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    if (totalQuantity >= 5) {
      toast.error('You can only add up to 5 books in your cart!');
      return;
    }

    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id && item.submissionType === submissionType) {
        if (item.quantity >= item.bookQuantity) {
          toast.error('Book quantity limit reached or out of stock!');
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    localStorage.setItem('librarycart', JSON.stringify(updatedCartItems));

    const newTotalQuantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('librarycartCount', newTotalQuantity);
  };

  const handleDecrementQuantity = (id, submissionType) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id && item.submissionType === submissionType && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    localStorage.setItem('librarycart', JSON.stringify(updatedCartItems));
    const totalQuantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('librarycartCount', totalQuantity);
  };
  return (
    <Container maxWidth="xl">
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
          <MuiLink component={Link} to="/dashboard/bookAllotment" color="inherit" underline="none">
            Book Allotment
          </MuiLink>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '40px',
          width: '35%',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginTop: '25px'
        }}
      >
        <SearchIcon />
        <InputBase placeholder="Search Book..." sx={{ flex: 1, ml: 1 }} onChange={handleSearch} value={search} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
        <Grid container spacing={4}></Grid>
      </Box>
      <Grid container spacing={0}>
        {' '}
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: 'auto' }}>
              <Grid container spacing={2}>
                {currentBooks.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    <Card
                      sx={{
                        transition: 'box-shadow 0.3s, transform 0.3s',
                        border: '1px solid #ccc',
                        height: '25vh',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: 4 },
                        cursor: 'pointer',
                        width: '90%',
                        position: 'relative',
                        marginBottom: '20px'
                      }}
                      onClick={() => handleAddToCart(product)}
                    >
                      <CardMedia
                        component="img"
                        image={product.upload_Book ? `${url.baseurl.baseurl}${product.upload_Book}` : ''}
                        sx={{
                          objectFit: 'cover',
                          height: '80px',
                          padding: '5px',
                          borderRadius: '10px',
                          display: product.upload_Book ? 'block' : 'none'
                        }}
                      />
                      {!product.upload_Book && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '80px',
                            backgroundColor: '#f0f0f0'
                          }}
                        >
                          <LibraryBooksIcon sx={{ fontSize: '50px', color: '#757575' }} />
                        </Box>
                      )}

                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '10px',
                            marginTop: '7px',
                            display: 'inline-block'
                          }}
                        >
                          {product.bookName}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '12px',
                              color: product.bookQuantity === 0 ? 'red' : 'green',
                              fontWeight: product.bookQuantity === 0 ? 'bold' : 'normal'
                            }}
                          >
                            {product.bookQuantity === 0 ? 'Out of Stock' : `In Stock: ${product.bookQuantity}`}
                          </Typography>
                        </Box>
                      </Box>

                      {product.bookQuantity === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '10px'
                          }}
                        />
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: 2,
                height: 'auto',
                backgroundColor: '#f9f9f9',
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Cart Summary
              </Typography>
              {cartItems.length > 0 ? (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={`${item._id}-${item.submissionType}`}>
                          <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{item.bookName}</td>
                          <td style={{ borderBottom: '1px solid #eee', padding: '8px', textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleIncreaseQuantity(item._id, item.submissionType)}
                                sx={{
                                  minWidth: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                                disabled={item.quantity >= item.bookQuantity || cartItems.reduce((acc, i) => acc + i.quantity, 0) >= 5}
                              >
                                +
                              </Button>
                              <Typography variant="body1" sx={{ mx: 1 }}>
                                {item.quantity || 0}
                              </Typography>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDecrementQuantity(item._id, item.submissionType)}
                                disabled={item.quantity === 1}
                                sx={{
                                  minWidth: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  padding: 0,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                -
                              </Button>
                              <Button color="error" onClick={() => handleRemoveFromCart(item._id, item.submissionType)}>
                                <IconTrash stroke={2} size={20} />
                              </Button>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Total Items: {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Amount: {currencySymbol}
                    {cartItems.reduce((total, item) => total + item.amount * item.quantity, 0).toFixed(2)}
                  </Typography>

                  <hr />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/dashboard/cart')}
                    sx={{
                      width: '50%',
                      fontSize: '14px',
                      padding: '4px',
                      borderRadius: '8px'
                    }}
                  >
                    Go to checkout
                  </Button>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography color="error" fontSize="13px" sx={{ minHeight: '18px' }}>
                      {cartItems.reduce((acc, i) => acc + i.quantity, 0) >= 5 ? 'You can only add 5 books' : ''}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Your cart is empty.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Stack
        spacing={2}
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Pagination
          count={Math.ceil(filteredProducts.length / booksPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={3} pt={2}>
          <DialogTitle sx={{ p: 0 }}>Enter Submission Details</DialogTitle>
          <ClearIcon onClick={() => setOpenModal(false)} style={{ cursor: 'pointer' }} />
        </Box>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel>Submission Type</FormLabel>
            <Select value={submissionType} onChange={handleTypeChange} label="Submission Type" size="small">
              {studentData.length > 0 &&
                studentData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormLabel>Submission Date</FormLabel>
          <TextField
            type="date"
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
            value={submissionDate}
            onChange={handleDateChange}
            label=""
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            size="small"
          />

          <Typography variant="h6" color="primary" sx={{ fontSize: '18px' }}>
            Amount: {currencySymbol}
            {calculatedAmount}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitCart} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <BooksModal show={showModal} handleClose={handleCloseModal} books={selectedBooks} studentName={studentName} />
      </div>
    </Container>
  );
};

export default Allotment;
