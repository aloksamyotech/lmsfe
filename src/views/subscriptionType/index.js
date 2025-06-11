import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';

import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddSubscription from './addSubscriptionType';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { deleteApi, getApi, updateApi } from 'core/apiClient';

const SubscriptType = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [isloading, SetIsloading] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  const [studentId, setStudentId] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1
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
      field: 'numberOfDays',

      align: 'center',
      headerAlign: 'center',
      headerName: 'Number Of Days',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',

      align: 'center',
      headerAlign: 'center',
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

  const fetchData = async () => {
    try {
      SetIsloading(true);
      const response = await getApi(url.subscription.findSubscription);

      const fetchedData = response?.data?.SubscriptionType?.map((item) => ({
        id: item._id,
        title: item.title,
        amount: item.amount,
        discount: item.discount,
        desc: item.desc,
        numberOfDays: item.numberOfDays
      }));
      setData(fetchedData);
      SetIsloading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setEditData(null);
  };
  const handleEdit = (book) => {
    setErrors({});
    setEditData(book);
    setOpenAdd(true);
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteApi(`${url.subscription.delete}${bookToDelete}`);
      setData((prevData) => prevData.filter((book) => book.id !== bookToDelete));
      setOpenDeleteDialog(false);
      setBookToDelete(null);

      toast.success('Subscription details Deleted successfully');
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

  return (
    <>
      <AddSubscription open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} editData={editData} />
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
          <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/SubscriptionType" color="inherit" underline="none">
              Subscription Type
            </MuiLink>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Subscription
            </Button>
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '750px', paddingTop: '15px' }}>
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
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>

        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this Subscription Type?</Typography>
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

export default SubscriptType;
