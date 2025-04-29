import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Button,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { IconTrash } from '@tabler/icons-react';
import CloseIcon from '@mui/icons-material/Close';
import CartSummary from './cartSummary';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCart } from './CartContext';
import { url } from 'core/url';
import defaultBook from './bookDummy.jpeg';
import { fetchCurrency } from 'core/comman';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getApi } from 'core/apiClient';
const Cart = ({ onRemoveFromCart, onClearCart, onIncreaseQuantity, onDeacrmentQuantity }) => {
  const [summary, setSummary] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('');

  const { setCartcontextItems } = useCart();
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('librarycart')) || [];
    setCartItems(storedCartItems);
  }, []);
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const totalAmount = cartItems.reduce((total, item) => total + item.amount * item.quantity, 0);
  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty. Please add books to the cart.');
      return;
    }
    if (!selectedStudent) {
      toast.error('Please select a student.');
      return;
    }

    const studentDetails = students.find((student) => student.id === selectedStudent);

    if (!studentDetails) {
      alert('Selected student details not found.');
      return;
    }

    const cartSummary = {
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      studentId: studentDetails.id,
      cartItems,
      totalAmount
    };

    setSummary(cartSummary);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSummary(null);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveFromCart = (id, submissionType) => {
    const updatedCartItems = cartItems.filter(
      (item) => !(item._id === id && item.submissionType === submissionType)
    );
  
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
  
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          justifyContent: 'space-between',
          marginBottom: '-18px'
        }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/bookAllotment" color="inherit" underline="none">
            Book Allotment
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/cart" color="inherit" underline="none">
            Cart
          </MuiLink>
        </Breadcrumbs>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '50px'}}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={students}
              getOptionLabel={(student) => student.name || ''}
              value={students.find((s) => s.id === selectedStudent) || null}
              onChange={(event, newValue) => setSelectedStudent(newValue ? newValue.id : null)}
              renderInput={(params) => <TextField {...params} label="Select Student" fullWidth />}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={students}
              getOptionLabel={(student) => student.email || ''}
              value={students.find((s) => s.id === selectedStudent) || null}
              onChange={(event, newValue) => setSelectedStudent(newValue ? newValue.id : null)}
              renderInput={(params) => <TextField {...params} label="Select Email" fullWidth />}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" sx={{ width: 120 }} onClick={() => (window.location.href = '/dashboard/BookManagement')}>
              Add Books
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', marginTop: '25px' }}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: '80px',
            padding: '10px'
          }}
        >
          {cartItems.length === 0 ? (
            <Typography variant="h6" textAlign="center" color="textSecondary">
              Your cart is empty.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
              {' '}
              <Table sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center', width: '10%' }}>Image</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '20%' }}>Title</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '15%' }}>Submission</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '10%' }}>Quantity</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '15%' }}>Amount</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: '15%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id + item.submissionType}>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <img
                          src={item.upload_Book ? `${url.baseurl.baseurl}${item.upload_Book}` : defaultBook}
                          alt={item.title}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{item.title}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{item.submissionTypeName || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
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
                            disabled={
                              item.quantity >= item.bookQuantity || // book-level quantity limit
                              cartItems.reduce((acc, i) => acc + i.quantity, 0) >= 5 // total cart quantity limit
                            }
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
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {currencySymbol}
                        {(item.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button color="error" onClick={() => handleRemoveFromCart(item._id, item.submissionType)}>
                          <IconTrash stroke={2} size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <Box
          sx={{
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: 'white',
            // borderTop: '1px solid #ccc',
            borderRadius: '8px',
            // boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
            height: '30vh',
            width: '55vh',
            marginTop: '10px'
          }}
        >
          <Typography variant="h4" sx={{ padding: '10px' }}>
            Cart Summary
          </Typography>
          <hr></hr>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total Items : {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total Amount: {currencySymbol}
            {cartItems.reduce((total, item) => total + item.amount * item.quantity, 0).toFixed(2)}
          </Typography>
          <hr></hr>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              width: '35%',
              fontSize: '16px',
              padding: '5px',
              borderRadius: '8px'
            }}
          >
            Confirm
          </Button>
        </Box>
        <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
          <DialogTitle>
            Cart Summary
            <IconButton aria-label="close" onClick={handleClosePopup} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>{summary && <CartSummary summaryData={summary} />}</DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default Cart;
