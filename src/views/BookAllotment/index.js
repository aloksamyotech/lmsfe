// //..................................................................//
import { useState, useEffect } from 'react';
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
  FormLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cart from '../Books/Cart.js';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { toast } from 'react-toastify';

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
  const [students, setStudents] = useState([]); // Holds student data

  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student

  const navigate = useNavigate();

  const fetchCategory = async () => {
    const response = await axios.get('http://localhost:4300/user/bookManagement');
    setCategoryData(response.data.BookManagement);
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('http://64.227.130.216:4300/user/getSubscriptionType');
      console.log('response of student data', response);
      setStudentData(response.data?.SubscriptionType);
    } catch (error) {
      console.error('Error fetching SubscriptionType', error);
    }
  };
  const fetchData = async () => {
    try {
      console.log('API Start........');
      const response = await axios.get('http://64.227.130.216:4300/user/getBookAllotmentHistory');
      console.log('Response--------->>>>>>>>>>>>', response?.data);

      const fetchedData = response?.data?.histories.map((item) => ({
        id: item._id,
        name: item.studentDetails[0]?.student_Name || 'N/A',
        email: item.studentDetails[0]?.email || 'N/A',
        mobile: item.studentDetails[0]?.mobile_Number || 'N/A',
        bookIssueDate: item.bookIssueDate || 'N/A'
      }));

      console.log('Student Data:', fetchedData);
      setStudents(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCategory();
    fetchSubscription();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };
  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleRemoveFromCart = (productId, submissionType) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => !(item._id === productId && item.submissionType === submissionType)));
  };

  const handleIncreaseQuantity = (itemId, submissionType) => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (totalQuantity < 10) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId && item.submissionType === submissionType
            ? {
                ...item,
                quantity: (item.quantity || 0) + 1, // Increase quantity
                amount: (item.amount || 0) + (item.amount || 0) / (item.quantity || 1)
              }
            : item
        )
      );
    } else {
      toast.error('Total quantity in cart cannot exceed 10');
    }
  };

  const handleDecreaseQuantity = (itemId, submissionType) => {
    console.log('look', itemId, submissionType);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId && item.submissionType === submissionType
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : 1,
              amount: item.quantity > 1 ? item.amount - item.amount / item.quantity : item.amount
            }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    if (submissionType && submissionDate) {
      const selectedType = studentData.find((type) => type._id === submissionType);
      setCalculatedAmount(selectedType ? selectedType.amount : 0);
    } else {
      setCalculatedAmount(null);
    }
  }, [submissionType, submissionDate, studentData]);

  const handleDateChange = (event) => {
    setSubmissionDate(event.target.value);
    const selectedType = studentData.find((type) => type._id === selectedTypeId);
    setCalculatedAmount(selectedType ? selectedType.amount : 0);
  };

  const handleTypeChange = (event) => {
    setSubmissionType(event.target.value);
  };
  const handleSubmitCart = () => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    if (totalQuantity >= 10) {
      toast.error('You can only add up to 10 books to your cart.');
      setOpenModal(false);
      return;
    }

    if (!submissionDate || !submissionType) {
      toast.error('Please select both submission date and type.');
      return;
    }

    const selectedType = studentData.find((type) => type._id === submissionType);
    const typeCharge = selectedType ? selectedType.amount : 0;
    const typeName = selectedType ? selectedType.title : 'N/A';

    setCartItems((prevCartItems) => {
      const existingItemIndex = prevCartItems.findIndex(
        (item) => item._id === selectedProduct._id && item.submissionType === submissionType
      );

      if (existingItemIndex >= 0) {
        const updatedCartItems = [...prevCartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        updatedCartItems[existingItemIndex].submissionDate = submissionDate;
        updatedCartItems[existingItemIndex].amount += typeCharge;
        return updatedCartItems;
      } else {
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

    setOpenModal(false);
    setSubmissionDate('');
    setSubmissionType('');
    setCalculatedAmount(null);
  };

  const filteredProducts = categoryData.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <FormControl sx={{ width: '300px', marginBottom: 2 }}>
              <InputLabel>Select Student</InputLabel>
              <Select value={selectedStudent} onChange={handleStudentChange} label="Select Student">
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl sx={{ width: '300px', marginBottom: 2 }}>
              <InputLabel>Select Email</InputLabel>
              <Select value={selectedStudent} onChange={handleStudentChange} label="Select Student">
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '80%' }}>
              <SearchIcon />
              <InputBase placeholder="Search Product..." sx={{ flex: 1, ml: 1 }} onChange={handleSearch} value={search} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9} lg={6}>
          <Box sx={{ height: '70vh' }}>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card
                    sx={{
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      border: '1px solid #ccc',
                      height: '35vh',
                      '&:hover': { transform: 'scale(1.05)', boxShadow: 4 }
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    <CardMedia
                      component="img"
                      image={`http://64.227.130.216:4300/${product.upload_Book}`}
                      sx={{ objectFit: 'cover', height: '150px' }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">{product.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.author}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={3} lg={6}>
          <Box
            sx={{
              height: '70vh',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Shopping Cart
            </Typography>
            <Cart
              cartItems={cartItems}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDeacrmentQuantaty={handleDecreaseQuantity}
              selectedStudent={selectedStudent}
              students={students}
            />
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Enter Submission Details</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel>Submission Type</FormLabel>
            <Select value={submissionType} onChange={handleTypeChange} label="Submission Type">
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
            value={submissionDate}
            onChange={handleDateChange}
            label=""
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="h6" color="primary">
            Amount: ₹{calculatedAmount}
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
    </Container>
  );
};

export default Allotment;
