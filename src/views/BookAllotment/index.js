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
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './booksAllotment';

import ReceiptIcon from '@mui/icons-material/Receipt';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { array } from 'prop-types';
import BookInvoice from './Invoice';
import { url } from 'core/url';
import { deleteBook, editBookAllotment, getBookAllotmentHistory } from 'core/helperFurtion';

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
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const fetchCategory = async () => {
    const response = await axios.get('http://localhost:4300/user/bookManagement');
    setCategoryData(response.data.BookManagement);
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
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
      const response = await axios.get('http://localhost:4300/user/registerManagement');
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
      const response = await axios.get('http://localhost:4300/user/getdataalocated');
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
    fetchData();
    fetchinvoice();
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
                quantity: (item.quantity || 0) + 1,
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
    console.log('item', itemId);

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

  const rows = [
    {
      id: 1,
      studentName: 'John Doe',
      quantity: 2,
      books: [
        { bookName: 'Book A', quantity: 1 },
        { bookName: 'Book B', quantity: 1 }
      ]
    }
  ];

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
    const selectedType = studentData.find((type) => type._id === submissionType);
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
      <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} sx={{ marginBottom: 2 }}>
        <Tab value={0} label="Allotment" />
        <Tab value={1} label="History" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={students}
                  getOptionLabel={(student) => student.name || ''}
                  value={students.find((s) => s.id === selectedStudent) || null}
                  onChange={(event, newValue) => setSelectedStudent(newValue ? newValue.id : null)}
                  renderInput={(params) => <TextField {...params} label="Select Student" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={students}
                  getOptionLabel={(student) => student.email || ''}
                  value={students.find((s) => s.id === selectedStudent) || null}
                  onChange={(event, newValue) => setSelectedStudent(newValue ? newValue.id : null)}
                  renderInput={(params) => <TextField {...params} label="Select Email" fullWidth />}
                />
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
                          image={`http://localhost:4300/${product.upload_Book}`}
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
              <Box sx={{ height: '70vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Shopping Cart
                </Typography>
                <Cart
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDeacrmentQuantity={handleDecreaseQuantity}
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
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
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
        </>
      )}
      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Box width="100%" mt={3}>
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={studentss}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableContainer>
      )}

      <div>
        <BooksModal show={showModal} handleClose={handleCloseModal} books={selectedBooks} studentName={studentName} />
      </div>
    </Container>
  );
};

export default Allotment;
