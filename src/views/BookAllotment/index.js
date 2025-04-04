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
import { deleteBook, editBookAllotment, getBookAllotmentHistory, getBookManagement } from 'core/helperFurtion';
import ReceiveBook from 'views/ReceiveBook/index';
import { useCart } from '../Books/CartContext.js';
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const fetchCategory = async () => {
    const response = await axios.get(url.bookManagenent.bookmanagementTable);
    console.log('response------------------------', response);
    setCategoryData(response.data.data);
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(url.subscription.findSubscription);
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
      const response = await axios.get(url.studentRegister.getRegisterManagement);

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
      const response = await getBookAllotmentHistory(url.bookAllotmentHistory.getdataalocated);
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
    console.log('Cart items----------', cartItems);
    console.log('Cart items length', cartItems.length);
    setCartcontextItems(cartItems);
    localStorage.setItem('librarycart', JSON.stringify(cartItems));

    // console.log('Cart update successful===============================================>>>>>>>>>>>>>>>>>>>>>');
  }, [cartItems, setCartcontextItems]);
  useEffect(() => {
    fetchCategory();
    fetchSubscription();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleAddToCart = (product) => {
    console.log('product==================>>>>>', product);
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

    toast.success('Book successfully added to cart');
    getBookCount();
    setOpenModal(false);
    setSubmissionDate('');
    setSubmissionType('');
    setCalculatedAmount(null);
    // console.log('Updated cartItems:333333333333333', cartItems);
  };

  useEffect(() => {
    console.log('Updated cartItems:', cartItems);
  }, [cartItems]);
  // const handleSubmitCart = () => {
  //   const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  //   if (totalQuantity >= 10) {
  //     toast.error('You can only add up to 10 books to your cart.');
  //     setOpenModal(false);
  //     return;
  //   }

  //   if (!submissionDate || !submissionType) {
  //     toast.error('Please select both submission date and type.');
  //     return;
  //   }

  //   const selectedType = studentData.find((type) => type._id === submissionType);
  //   const typeCharge = selectedType ? selectedType.amount : 0;
  //   const typeName = selectedType ? selectedType.title : 'N/A';

  //   setCartItems((prevCartItems) => {
  //     const existingItemIndex = prevCartItems.findIndex(
  //       (item) => item._id === selectedProduct._id && item.submissionType === submissionType
  //     );

  //     if (existingItemIndex >= 0) {
  //       const updatedCartItems = [...prevCartItems];
  //       updatedCartItems[existingItemIndex].quantity += 1;
  //       updatedCartItems[existingItemIndex].submissionDate = submissionDate;
  //       updatedCartItems[existingItemIndex].amount += typeCharge;
  //       return updatedCartItems;
  //     } else {
  //       return [
  //         ...prevCartItems,
  //         {
  //           ...selectedProduct,
  //           quantity: 1,
  //           submissionDate,
  //           submissionType,
  //           submissionTypeName: typeName,
  //           amount: typeCharge
  //         }
  //       ];
  //     }
  //   });
  //   toast.success("Book successfully added to cart");
  //   addToCart(cartItems)
  //   setOpenModal(false);
  //   setSubmissionDate('');
  //   setSubmissionType('');
  //   setCalculatedAmount(null);
  //   console.log('-------------------------------- index page', cartItems);
  // };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      navigate('/dashboard/receive');
    }
  };

  const filteredProducts = categoryData.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()));

  const getBookCount = async (bookId) => {
    try {
      const response = await getBookManagement(url.bookManagenent.bookManagement);
      console.log('response data:', response.data); // Log the full response to check the structure

      // Map the fetched data
      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        bookName: item.bookName,
        upload_Book: item.upload_Book,
        title: item.title,
        publisherName: item.publisherName,
        author: item.author,
        quantity: item.quantity > 0 ? item.quantity : 'Not Available'
      }));

      console.log('fetchedData:', fetchedData);

      // Find the book by bookId
      const book = fetchedData.find((item) => item.id === bookId); // Find the book with the given bookId

      if (book) {
        console.log(`Book Quantity for ${item._id}:`, book.quantity); // Print the quantity of the book
        return book.quantity; // Optionally return the quantity if you need it
      } else {
        console.log('Book not found!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredProducts.slice(indexOfFirstBook, indexOfLastBook);

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
        <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '-12px' }}>
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/dashboard/bookAllotment" underline="hover" color="inherit">
            <h4>Books Management / Allocate Book</h4>
          </Link>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>

      {/* <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} sx={{ marginBottom: 2, marginTop: 2 }}>
        <Tab value={0} label="Allotment" />
        <Tab value={1} label="Receive " />
      </Tabs> */}

      {/* <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: 2, marginTop: 2 }}>
        <Tab value={0} label="Allotment" />
        <Tab value={1} label="Receive" />
      </Tabs> */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: 2, marginTop: 2 }}>
          <Tab value={0} label="Allotment" />
          <Tab value={1} label="Receive" />
        </Tabs>

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
          <InputBase placeholder="Search Product..." sx={{ flex: 1, ml: 1 }} onChange={handleSearch} value={search} />
        </Box>
      </Box>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
            <Grid container spacing={4}>
              {/* <Grid item xs={12} sm={4}>
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
              </Grid> */}
            </Grid>
          </Box>

          {/* <Grid container spacing={2}>
            <Grid item xs={12} md={9} lg={12}>
              <Box sx={{ height: '70vh' }}>
                <Grid container spacing={2}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={2} key={product._id}>
                      <Card
                        sx={{
                          transition: 'box-shadow 0.3s, transform 0.3s',
                          border: '1px solid #ccc',
                          height: '25vh',
                          '&:hover': { transform: 'scale(1.05)', boxShadow: 4 },
                          cursor: 'pointer'
                        }}
                        onClick={() => handleAddToCart(product)}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            objectFit: 'cover',
                            height: '80px',
                            display: product.upload_Book ? 'block' : 'none' // Hide if no image
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
          </Grid> */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={9} lg={12}>
              <Box sx={{ height: '70vh' }}>
                <Grid container spacing={2}>
                  {currentBooks.map((product) => (
                    <Grid item xs={12} sm={6} md={2} key={product._id}>
                      <Card
                        sx={{
                          transition: 'box-shadow 0.3s, transform 0.3s',
                          border: '1px solid #ccc',
                          height: '25vh',
                          '&:hover': { transform: 'scale(1.05)', boxShadow: 4 },
                          cursor: 'pointer',
                          width: '70%'
                        }}
                        onClick={() => handleAddToCart(product)}
                      >
                        <CardMedia
                          component="img"
                          image={product.upload_Book ? `${url.baseurl.baseurl}${product.upload_Book}` : ''}
                          sx={{
                            objectFit: 'cover',
                            height: '80px',
                            display: product.upload_Book ? 'block' : 'none' // Hide if no image
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
          </Grid>

          {/* Pagination */}
          <Stack
            spacing={2}
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end', // Aligns content to the right horizontally
              alignItems: 'flex-end' // Ensures the Pagination is aligned to the right edge
            }}
          >
            <Pagination
              count={Math.ceil(filteredProducts.length / booksPerPage)} // Total pages
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>

          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Enter Submission Details</DialogTitle>
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
      {/* {tabValue === 1 && (
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
      )} */}

      <div>
        <BooksModal show={showModal} handleClose={handleCloseModal} books={selectedBooks} studentName={studentName} />
      </div>
    </Container>
  );
};

export default Allotment;
