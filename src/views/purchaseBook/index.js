import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddPurchaseBook from './purchaseBook';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';

const PurchaseBook = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

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
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'vendorId',
      headerName: 'Vendor',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'quantity',
      headerName: 'Available Quantity',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },

    {
      field: 'price',
      headerName: 'Par Book Price',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
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
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="secondary" onClick={() => handleDelete(params?.row)} style={{ margin: '-9px' }}>
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      console.log('fetch data ');

      const response = await axios.get('http://localhost:4300/user/purchaseManagement');
      console.log('response-----===', response);

      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        bookName: item.bookName,
        vendorId: item.vendorId,
        price: item.price,
        quantity: item.quantity
      }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (book) => {
    setEditData(book);
  };

  const handleSaveEdit = async () => {
    console.log('satrt>>>>>>>>>>>>>>');

    console.log(`id `, editData.id);
    console.log(`editData`, editData);

    try {
      const response = await axios.put(`http://localhost:4300/user/editPurchaseBook/${editData.id}`, editData);
      console.log('Data', response);
      const updatedBook = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedBook.id ? updatedBook : item)));
      setEditData(null);
      fetchData();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleInvoice = (row) => {
    navigate(`/dashboard/purchaseInvoice/${row.id}`, { state: { rowData: row } });
  };

  const handleDelete = (row) => {
    setBookToDelete(row);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const id = bookToDelete?.id;
    console.log(`bookToDelete>>>>>>>>>>>`, bookToDelete);

    console.log(`id`, id);

    try {
      await axios.delete(`http://localhost:4300/user/deletePurchaseBook/${id}`);
      setData((prevData) => prevData.filter((book) => book.id !== id));
      toast.success('Purchase Book add  successfully');
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Purchase Book deleted  successfully');
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };
  const closeEditDailog = () => {
    setEditData(false);
  };

  return (
    <>
      <AddPurchaseBook open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
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
              <h4>Purchase Books</h4>
            </Link>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Purchase New Book
            </Button>
          </Stack>
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
              <Typography variant="h6">Edit Purchase Book</Typography>
              <TextField
                label="Book Name"
                value={editData.bookName}
                disabled
                onChange={(e) => setEditData({ ...editData, bookName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label=" Vendor"
                value={editData.vendorId}
                disabled
                onChange={(e) => setEditData({ ...editData, vendorId: e.target.value })}
                fullWidth
                margin="normal"
              />
              {/* <TextField
                label="Total Price"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, publisherId: e.target.value })}
                fullWidth
                margin="normal"
              /> */}
              <TextField
                label="Quantity"
                value={editData.quantity}
                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Total Price"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleSaveEdit} variant="contained" color="primary" sx={{ marginRight: '10px' }}>
                Save
              </Button>
              <Button onClick={closeEditDailog} variant="outlined" color="secondary">
                Cancel
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

export default PurchaseBook;
