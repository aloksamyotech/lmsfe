import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './booksAllotment';
import axios from 'axios';

import ReceiptIcon from '@mui/icons-material/Receipt';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { array } from 'prop-types';

const Allotment = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const columns = [
    {
      field: 'studentEmail',
      headerName: 'Student Email',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => handleView(params.row)}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'normal'
            }}
          >
            {params.value}
          </Button>
        </div>
      )
    },
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'mobile_Number',
      headerName: 'Mobile Number',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'bookIssueDate',
      headerName: 'Book Issue Date',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'amount',
      headerName: 'Total Amount',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'name-column--cell--capitalize'
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
    },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleView(params.row)} color="secondary" style={{ margin: '-15px' }}>
            <VisibilityIcon />
          </Button>
        </div>
      )
    }
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleView = (row) => {
    console.log('Viewing', row);

    navigate(`/dashboard/viewBookAllotment/${row.id}`);
  };
  const fetchData = async () => {
    try {
      console.log('Api Start........');
      const response = await axios.get('http://64.227.130.216:4300/user/getBookAllotmentHistory');
      console.log('response--------->>>>>>>>>>>>', response?.data);

      // let BookData = response?.data?.histories[0]?.allotmentDetails;
      // console.log('BookData:', BookData);


      let BookData = response?.data?.histories[0]?.allotmentDetails?.map((item)=>({
      amount : item.amount
      })); 
        
      console.log('Book Data', BookData);
      
      const fetchedData = response?.data?.histories.map((item) => ({
        id: item._id,
        student_Name: item.studentDetails[0]?.student_Name,
        studentEmail: item.studentDetails[0]?.email,
        mobile_Number: item.studentDetails[0]?.mobile_Number,
        bookIssueDate: formatDate(item.bookIssueDate)
      }));
      console.log(' student_Name', fetchedData);

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useState(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (book) => {
    setEditData(book);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://64.227.130.216:4300/user/editBookAllotment/${editData.id}`, editData);
      console.log('Data', response);

      const updatedBook = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedBook.id ? updatedBook : item)));
      setEditData(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('delete API...');
      await axios.delete(`http://64.227.130.216:4300/user/deleteAllotmentBook/${bookToDelete}`);
      setData((prevData) => prevData.filter((book) => book.id !== bookToDelete));
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  console.log(`editData`, editData);

  return (
    <>
      <AddLead open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
            </Link>
            <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
              <h4>Allotment Management</h4>
            </Link>
          </Breadcrumbs>

          {/* <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}> */}
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Allotted New Book
            </Button>
          </Stack>
          {/* </Stack> */}
        </Box>

        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>

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

        {editData && (
          <Dialog open={true} onClose={() => setEditData(null)}>
            <Box p={3}>
              <Typography variant="h6">Edit Book</Typography>
              <TextField
                label="Book Name"
                value={editData.bookName}
                onChange={(e) => setEditData({ ...editData, bookName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Student Name"
                value={editData.student_Name}
                onChange={(e) => setEditData({ ...editData, student_Name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Payment Type"
                value={editData.paymentType}
                onChange={(e) => setEditData({ ...editData, paymentType: e.target.value })}
                fullWidth
                margin="normal"
              />
              {/* <TextField
                label="Book Issue Date"
                value={editData.bookIssueDate}
                onChange={(e) => setEditData({ ...editData, bookIssueDate: e.target.value })}
                fullWidth
                margin="normal"
              /> */}
              {/* <TextField
                label="Submission Date"
                value={editData.submissionDate}
                onChange={(e) => setEditData({ ...editData, submissionDate: e.target.value })}
                fullWidth
                margin="normal"
              /> */}
              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </Dialog>
        )}

        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this book?</Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button onClick={cancelDelete} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="primary">
                OK
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};

export default Allotment;
