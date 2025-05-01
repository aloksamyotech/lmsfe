import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, Button, Box, Card, Dialog, TextField, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddRegister from './Addregister';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Iconify from '../../ui-component/iconify';
import { url } from 'core/url';
import ClearIcon from '@mui/icons-material/Clear';
import { deleteApi, getApi, postApi, updateApi } from 'core/apiClient';
const Register = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [excelData, setExcelData] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [isloading, setIsloading] = useState(false);
  const XLSX = require('xlsx');
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
  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'email',
      headerName: 'Student Email',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize',
      renderCell: (params) => {
        return (
          <a href="#!" onClick={() => handleView(params.row)} style={{ textDecoration: 'none', color: 'inherit' }}>
            {params.value}
          </a>
        );
      }
    },
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1
    },
    {
      field: 'mobile_Number',
      headerName: 'Mobile Number',
      flex: 1
    },
    {
      field: 'register_Date',
      headerName: 'Register Date',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton  color="secondary"onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton  color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton
              onMouseDown={(e) => e.stopPropagation()} 
              onClick={() => {
                handleFavorite(params.row);
              }}
              sx={{ color: params.row.favorite ? 'red' : 'gray' }}
            >
              <Icon icon="mdi:heart" />
            </IconButton>

            <IconButton  color="secondary" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        );
      }
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
      const response = await getApi(url.studentRegister.getRegisterManagement);
      const fetchedData = response?.data?.RegisterManagement?.map((item) => ({
        id: item._id,
        student_id: item.student_id,
        student_Name: item.student_Name,
        email: item.email,
        mobile_Number: item.mobile_Number,
        register_Date: formatDate(item.register_Date),
        favorite: item.favorite || false,
        subscription: item.subscription || false
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
  const handleEdit = (register) => {
    setErrors({});
    setEditData(register);
  };
  const handleSaveEdit = async () => {
    setIsloading(true);
    setErrors({});
    const newErrors = {};

    if (!editData.email) newErrors.email = 'Email is required';
    if (!editData.student_Name) newErrors.student_Name = 'Student Name is required';
    if (!editData.mobile_Number) newErrors.mobile_Number = 'Mobile Numberis required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await updateApi(`${url.studentRegister.editRegister}${editData.id}`, editData);
      const updatedRegister = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedRegister.id ? updatedRegister : item)));
      setEditData(null);
      fetchData();
      setOpenBulkUploadDialog(false);
      toast.success('Register details Edit successfully');
    } catch (error) {
      console.error('Error updating Register:', error);
    }
  };
  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
    Call();
  };
  const confirmDelete = async (id) => {
    try {
      await deleteApi(`${url.studentRegister.deleteRegister}${bookToDelete}`);

      setData((prevData) => prevData.filter((register) => register.id !== bookToDelete));
      toast.success('Register details Deleted successfully');
      cancelDelete();
    } catch (error) {
      console.error('Error deleting Register:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };
  const handleView = (row) => {
    window.location.href = `/dashboard/view/${row.id}`;
    const fetchStudent = async () => {
      try {
        const response = await getApi(`${url.allotmentManagement.viewBookAllotment}${id}`);
        const fetchedData = response?.data?.RegisterManagement?.map((item) => ({
          id: item._id,
          student_id: item.student_id,
          student_Name: item.student_Name,
          email: item.email,
          mobile_Number: item.mobile_Number,
          register_Date: formatDate(item.register_Date)
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStudent();
  };
  const handleFavorite = async (student) => {
    const newFavorite = !student.favorite;

    setData((prevData) => prevData.map((item) => (item.id === student.id ? { ...item, favorite: newFavorite } : item)));

    try {
      const response = await postApi(`${url.studentRegister.markFavorite}${student.id}`);
      if (response?.data?.student?.favorite === true) {
        toast.success('Added to Favorite successfully');
      } else {
        toast.error('Removed from Favorite successfully');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      setData((prevData) => prevData.map((item) => (item.id === student.id ? { ...item, favorite: student.favorite } : item)));
      toast.error('Failed to update favorite status.');
    }
  };

  const cancelFavorite = () => {
    setOpenFavoriteDialog(false);
    setFavoriteStudent(null);
  };
  const handleSubscription = async (row) => {
    try {
      const updatedSubscription = !row.subscription;

      const response = await postApi(`${url.studentRegister.markSubscription}${row.id}`, {
        subscription: updatedSubscription
      });
      if (response.status === 200) {
        setData((prevData) => prevData.map((item) => (item.id === row.id ? { ...item, subscription: updatedSubscription } : item)));
      }
      if (response?.data?.student?.subscription == true) {
        toast.success('add to Subscription successfully');
      } else {
        toast.error('Remove to Subscription successfully');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    };
    reader.readAsBinaryString(file);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  const adminId = user?._id;
  const handleBulkUpload = async () => {
    setIsloading(true);

    try {
      const dataWithAdminId = excelData.map((item) => ({
        ...item,
        adminId
      }));
      const response = await postApi(url.studentRegister.registerMany, dataWithAdminId);
      toast.success(`upload Successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading data:', error);
      toast.error('Error uploading data');
      setIsloading(false);
    }
  };
  return (
    <>
      <AddRegister open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
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
            <MuiLink component={Link} to="/dashboard/Register" color="inherit" underline="none">
              Student Management
            </MuiLink>
          </Breadcrumbs>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenBulkUploadDialog(true)}>
              <Typography sx={{ fontSize: '16px' }}>Bulk Upload</Typography>
            </Button>
            <Button variant="contained" startIcon={<Icon icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              <Typography sx={{ fontSize: '14px' }}>Register Student</Typography>
            </Button>
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ paddingTop: '15px', height: '750px' }}>
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
        {editData && (
          <Dialog open={true} onClose={() => setEditData(null)}>
            <Box p={3}>
              <Typography variant="h6">Edit Register</Typography>
              <TextField
                label=" Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                inputProps={{ maxLength: 30 }}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Student Name"
                value={editData.student_Name}
                onChange={(e) => setEditData({ ...editData, student_Name: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                inputProps={{ maxLength: 30 }}
                error={!!errors.student_Name}
                helperText={errors.student_Name}
              />
              <TextField
                label="Mobile Number"
                value={editData.mobile_Number}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setEditData({ ...editData, mobile_Number: e.target.value });
                  }
                }}
                fullWidth
                margin="normal"
                size="small"
                inputProps={{ maxLength: 10 }}
                error={!!errors.mobile_Number}
                helperText={errors.mobile_Number}
              />
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
                disabled={isloading}
                style={{
                  textTransform: 'capitalize',
                  backgroundColor: isloading ? '#ccc' : '',
                  color: isloading ? '#666' : '',
                  pointerEvents: isloading ? 'none' : 'auto'
                }}
              >
                {isloading ? 'Saving...' : 'Save'}
              </Button>

              <Button onClick={() => setEditData(null)} variant="outlined" color="secondary" style={{ marginLeft: '16px' }}>
                Cancel
              </Button>
            </Box>
          </Dialog>
        )}
        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this Student?</Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button onClick={cancelDelete} variant="outlined" color="secondary" disabled={isloading}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="primary">
                OK
              </Button>
            </Stack>
          </Box>
        </Dialog>
         <Dialog open={openBulkUploadDialog} onClose={() => setOpenBulkUploadDialog(false)}>
          <Box p={3} width={400}>
            <ClearIcon onClick={() => setOpenBulkUploadDialog(false)} style={{ cursor: 'pointer', float: 'right' }} />

            <Box alignItems="center" mb={2}>
              <Typography variant="h5">Upload Excel File</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Iconify icon="eva:file-download-fill" />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/SampleFile.xlsx';
                  link.download = 'SampleFile.xlsx';
                  link.click();
                }}
                sx={{ mr: '11px' ,mt:'10px'}}
              >
                <Typography fontSize="13px">Download Sample File</Typography>
              </Button>
            </Box>

            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ marginBottom: '16px' }} />

            <Box display="flex" justifyContent="right" gap={2}>
              <Button variant="contained" color="primary" onClick={handleBulkUpload} disabled={isloading}>
                Upload 
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};
export default Register;
