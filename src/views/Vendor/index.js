import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './vendor.js';
import axios from 'axios';

import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { url } from 'core/url';
import { deleteApi, getApi, updateApi } from 'core/apiClient';

const PolicyManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      flex: 1,
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
 
    {
      field: 'date',
      headerName: 'Date',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
            <EditIcon />
          </Button>
          <Button color="secondary" onClick={() => handleDelete(params.row.id)} style={{ margin: '-9px' }}>
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchData = async () => {
    try {

      const response = await getApi(url.vendorManagement.viewVender);
      const fetchedData = response?.data?.VenderManagement?.map((item) => ({
        id: item._id,
        vendorName: item.vendorName,
        companyName: item.companyName,
        email: item.email,
        date: formatDate(item.date),
        phoneNumber: item.phoneNumber,
        address: item.address
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
    setErrors({});
    setEditData(book);
  };
  const handleSaveEdit = async () => {
    setErrors({});
    const newErrors = {};

    if (!editData.vendorName) newErrors.vendorName = 'Vendor Name is required';
    if (!editData.companyName) newErrors.companyName = 'Company Name is required';
    if (!editData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!editData.address) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await updateApi(`${url.vendorManagement.editVender}${editData.id}`, editData);

      const updatedVender = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedVender.id ? updatedVender : item)));
      setEditData(null);
      fetchData();
      toast.success('Vender details added successfully');
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
      await deleteApi(`${url.vendorManagement.delete}${bookToDelete}`);
      setData((prevData) => prevData.filter((item) => item.id !== bookToDelete));
      cancelDelete();
      toast.success('Vender details Deleted successfully');
    } catch (error) {
      console.error('Error deleting Vender:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };
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
          <Breadcrumbs
           separator="/"
           aria-label="breadcrumb"
           sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/policy" color="inherit" underline="none">
              Vander Management
            </MuiLink>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New Vendor
            </Button>
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={data.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
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
                label="Vendor Name"
                value={editData.vendorName}
                onChange={(e) => setEditData({ ...editData, vendorName: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.vendorName}
                helperText={errors.vendorName}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                label="Company Name"
                value={editData.companyName}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.companyName}
                helperText={errors.companyName}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setEditData({ ...editData, phoneNumber: value });
                  }
                }}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                label="Address"
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.address}
                helperText={errors.address}
                inputProps={{ maxLength: 50 }}
              />
              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={() => setEditData(null)} variant="outlined" color="secondary" style={{ marginLeft: '16px' }}>
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

export default PolicyManagement;
