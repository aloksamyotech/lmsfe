import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Dialog,
  TextField,
  Grid,
  FormLabel,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddPurchaseBook from './purchaseBook';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate } from 'react-router-dom';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { deleteApi, getApi, updateApi, updateApiPatch } from 'core/apiClient';

const PurchaseBook = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const urlWindow = window.location.href;
    const parts = urlWindow.split('/');
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
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1
    },
    {
      field: 'vendorName',
      headerName: 'Vendor',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },

    {
      field: 'price',
      headerName: 'Per Book Price',
      width: 120,
      valueFormatter: ({ value }) => {
        if (value != null) {
          return ` ${currencySymbol} ${value.toLocaleString()}`;
        }
        return '$0';
      }
    },
    {
      field: 'purchesDate',
      headerName: 'Purches Date',
      flex: 1
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ minWidth: 'auto', padding: '6px' }}>
            <EditIcon />
          </Button>

          <Button color="secondary" onClick={() => handleDelete(params.row)} style={{ minWidth: 'auto', padding: '6px' }}>
            <DeleteIcon />
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
  const fetchData = async () => {
    try {
      const response = await getApi(url.purchaseBook.purchaseManagement);
      
      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        bookId: item.bookId,
        bookName: item.bookName,
        vendorId: item.vendorId,
        vendorName:item.vendorName,
        price: item.price,
        quantity: item.quantity,
        purchesDate: formatDate(item.bookIssueDate),
        bookComment:item.bookComment
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
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setEditData(null);
  };
  const handleEdit = (book) => {
    setEditData(book);
    setOpenAdd(true);
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

    try {
      await deleteApi(`${url.purchaseBook.deletePurchaseBook}${id}`);
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
  return (
    <>
      <AddPurchaseBook open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} editData={editData} />
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
            <MuiLink component={Link} to="/dashboard/purchase" color="inherit" underline="none">
              Purchase Management
            </MuiLink>
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
            <Typography variant="h6">Are you sure you want to delete this Purchase Entry?</Typography>
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
