import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Divider, Avatar, Dialog, TextField } from '@mui/material';
import { Grid, FormLabel, FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from 'ui-component/TableStyle';
import axios from 'axios';
import Iconic from 'ui-component/iconify/Iconify';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};
const paymentTypeMapping = {
  1: 'Credit Card',
  2: 'Cash',
  3: 'Bank Transfer'
};

const FinePerDay = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [fetchReceiveBook, setFetchReceiveBook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  const columns = [
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
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
      field: 'fineAmount',
      headerName: 'Fine Amount',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    }
  ];

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
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/registerManagement');
        setAllData(response?.data?.RegisterManagement);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchAllStudents = async () => {
      console.log('HRitik ..........');

      try {
        const response = await axios.get('http://localhost:4300/user/getAllFineBooks');
        console.log('response>>>>>>>>', response?.data);

        setAllData(response?.data);
        const fetchedData = response?.data?.map((item) => ({
          id: item._id,
          student_Name: item?.studentDetails?.student_Name,
          bookName: item?.bookDetails?.bookName,
          amount: item?.paymentTypeDetails?.amount,
          fineAmount: item?.fineAmount,
          bookIssueDate: formatDate(item?.bookAllotmentsDetails?.bookIssueDate),
          submissionDate: formatDate(item?.bookAllotmentsDetails?.submissionDate)
        }));

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
    fetchAllStudents();
  }, []);

  const formik = useFormik({
    initialValues: {
      studentId: studentId,
      email: '',
      bookId: []
    }
  });

  const handleStudentChange = async (event) => {
    const selectedStudentId = event.target.value;
    console.log(`selectedStudentId`, selectedStudentId);

    setSelectedStudentId(selectedStudentId);
    formik.setFieldValue('studentId', selectedStudentId);

    const selectedStudent = allData.find((student) => student._id === selectedStudentId);
    if (selectedStudent) {
      formik.setFieldValue('email', selectedStudent.email);
    }

    try {
      const fineResponse = await axios.get(`http://localhost:4300/user/getFineBook/${selectedStudentId}`);

      console.log(`Fine Response`, fineResponse?.data);

      const fetchedData = fineResponse?.data?.map((item) => ({
        id: item._id,
        student_Name: item?.studentDetails?.student_Name,
        bookName: item?.bookDetails?.bookName,
        amount: item?.paymentTypeDetails?.amount,
        fineAmount: item?.fineAmount,
        bookIssueDate: formatDate(item?.bookAllotmentsDetails?.bookIssueDate),
        submissionDate: formatDate(item?.bookAllotmentsDetails?.submissionDate)
      }));

      setData(fetchedData);
      fetchAllStudents();
    } catch (error) {
      console.error('Error fetching submit book data:', error);
    }

    formik.handleChange(event);
  };

  // function refreshPage() {
  //   window.location.reload();
  // }
  useEffect(() => {
    if (selectedStudentId) {
      const filteredBooks = fetchReceiveBook.filter((receiveBookItem) => receiveBookItem.studentId === selectedStudentId);

      setBookData(filteredBooks);
    }
  }, [selectedStudentId, fetchReceiveBook]);

  const filteredBooks = bookData.filter((book) => formik.values.bookId.includes(book._id));
  const handleInvoice = (row) => {
    navigate(`/dashboard/receiveInvoice/${row.id}`, { state: { rowData: row } });
  };
  const handleRemove = async (bookId) => {
    console.log('submit click>>>>>', bookId);

    try {
      setLoading(true);
      const removeResponse = await axios.post(`http://localhost:4300/user/removeReceiveBook/${bookId}`);
      console.log('removeResponse', removeResponse);

      toast.success('Book removed successfully');

      // window.location.reload();
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
      setLoading(false);
    }

    const submitResponse = await axios.post(`http://localhost:4300/user/submitBook/${bookId}`);
    console.log('submitResponse', submitResponse);

    // toast.success('Book submitted successfully');
  };
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
        <Breadcrumbs aria-label="breadcrumb" style={{ marginTop: '-12px' }}>
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
            <h4>Books Management / Manage Fine</h4>
          </Link>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
      {/* <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '120px',
          marginBottom: '-18px'
        }}
      >
        <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Student</FormLabel>
            <FormControl fullWidth>
              <Select id="studentId" name="studentId" value={formik.values.studentId} onChange={handleStudentChange}>
                {allData.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.student_Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <FormLabel>Email</FormLabel>
            <FormControl fullWidth>
              <Select id="email" name="email" value={formik.values.email} disabled onChange={formik.handleChange}>
                {allData.map((item) => (
                  <MenuItem key={item._id} value={item.email}>
                    {item.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box> */}
      <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>

      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          height: '50px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '-18px',
          marginTop: '-42px'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
      </Box>
      <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={data}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle>
      {/* </Grid> */}
    </Container>
  );
};

export default FinePerDay;
