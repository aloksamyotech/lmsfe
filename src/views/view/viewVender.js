import React, { useState, useEffect } from 'react';
import {
  Container,
  Avatar,
  Typography,
  Paper,
  Box,
  Card,
  Stack,
  CardContent,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import { getApi } from 'core/apiClient';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import { useNavigate } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';

const VendorView = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const currentUrl = window.location.href;
    const parts = currentUrl.split('/');
    const extractedId = parts[parts.length - 1];
    setId(extractedId);

    const fetchVendorData = async () => {
      try {
        const response = await getApi(`${url.vendorManagement.viewVendorDetails}${extractedId}`);
        setAllData(response.data);
        setData(
          response.data.purchases.map((item, index) => ({
            _id: item._id,
            sNo: index + 1,
            bookName: item.bookDetails?.bookName || 'N/A',
            price: item.price,
            quantity: item.quantity,
            bookIssueDate: item.bookIssueDate ? new Date(item.bookIssueDate).toLocaleDateString('en-GB') : '',
            totalAmount: item.price * item.quantity
          }))
        );
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };

    if (extractedId) fetchVendorData();
  }, []);

  const columns = [
    { field: 'sNo', headerName: 'S.No.', flex: 0.5 },
    { field: 'bookName', headerName: 'Book Name', flex: 1 },
    { field: 'quantity', headerName: 'Quantity', flex: 1 },
    { field: 'price', headerName: 'Price per Book', flex: 1 },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      valueFormatter: ({ value }) => `${currencySymbol} ${value}`
    },
    { field: 'bookIssueDate', headerName: 'Purchase Date', flex: 1 },
    {
      field: 'generateInvoice',
      headerName: 'Invoice',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          style={{
            color: '#007bff',
            borderRadius: '50%',
            padding: '8px'
          }}
          onClick={() => handleGenerateInvoice(params.row)}
        >
          <ReceiptIcon />
        </IconButton>
      )
    }
  ];
  const handleGenerateInvoice = (row) => {
    const purchaseId = row._id;
    navigate(`/dashboard/purchaseInvoice/${purchaseId}`, {
      state: { rowData: row }
    });
  };

  return (
    <>
      <Box sx={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: 2, marginLeft: '2%' }}>
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/vendor" color="inherit" underline="none">
            Vendor Managment
          </MuiLink>
          <MuiLink component={Link} to="#" color="inherit" underline="none">
            Vendor profile
          </MuiLink>
        </Breadcrumbs>
      </Box>

      <Container>
        <Paper style={{ padding: '20px', marginBottom: '20px', width: '400px' }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Avatar src={allData?.vendor?.logoUrl || ''} sx={{ width: 80, height: 80 }} />
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={600}>
                {allData?.vendor?.vendorName || 'Vendor Name'}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {allData?.vendor?.email || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Company Name:</strong> {allData?.vendor?.companyName || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {allData?.vendor?.phoneNumber || '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {allData?.vendor?.address || '-'}
              </Typography>
            </Stack>
          </Box>
        </Paper>

        <TableStyle>
          <Card style={{ height: '750px', paddingTop: '15px' }}>
            <DataGrid
              pageSizeOptions={[5, 10]}
              pagination
              rows={data.map((row, index) => ({ ...row, sNo: index + 1 }))}
              columns={columns}
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </TableStyle>
      </Container>
    </>
  );
};

export default VendorView;
