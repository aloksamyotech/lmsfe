import { useState } from 'react';
import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddMeetings from './addPublications';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import { useEffect, use } from 'react';
import { toast } from 'react-toastify';
import { Dialog, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { url } from 'core/url';
import { deletePublications, editPublications, getPublications } from 'core/helperFurtion';

const meetingData = [
  {
    id: 1,
    name: 'Rohit',
    title: 'Ram Charan',
    author: 'vijai',
    address: 'indore',
    startDate: '08/01/2024',
    action: 'Edit'
  }
];

const Publications = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [errors, setErrors] = useState({});
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
      field: 'publisherName',
      headerName: 'Publisher Name',
      flex: 1,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Description',
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    try {


      const response = await getPublications(url.publications.getPublications);

      const fetchedData = await response?.data?.PublicationsManagement.map((item) => {
        return {
          id: item._id,
          publisherName: item.publisherName,
          address: item.address,
          description: item.description,
          action: item.action
        };
      });
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

  const handleEdit = (publications) => {
    setErrors({});
    setEditData(publications);
  };
 

  const handleSaveEdit = async () => {
    setErrors({});
    const newErrors = {};

    if (!editData.publisherName) newErrors.publisherName = 'Publisher Name is required';
    if (!editData.address) newErrors.address = 'Address is required';
    if (!editData.description) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const updatedPublications = { ...editData, startDate: new Date(editData.startDate) }; 


      const response = await editPublications(`${url.publications.editPublications}${editData.id}`, updatedPublications);

      setData((prevData) => prevData.map((item) => (item.id === updatedPublications.id ? updatedPublications : item)));

      setEditData(null);
      toast.success('Publication details Edit successfully');
    } catch (error) {
      console.error('Error updating Publications:', error);
    }
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {

      await deletePublications(`${url.publications.delete}${bookToDelete}`);

      setData((prevData) => prevData.filter((item) => item.id !== bookToDelete));
      toast.success('Publication details Deleted successfully');
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  return (
    <>
      <AddMeetings open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
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
            <MuiLink component={Link} to="/dashboard/meeting" color="inherit" underline="none">
              Publication Management
            </MuiLink>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Publication
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
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
              <Typography variant="h6">Edit Publications</Typography>
              <TextField
                label="Publisher Name"
                value={editData.publisherName}
                onChange={(e) => setEditData({ ...editData, publisherName: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.publisherName}
                helperText={errors.publisherName}
                inputProps={{ maxLength: 50 }}
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
              <TextField
                label="Description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.description}
                helperText={errors.description}
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
            <Typography variant="h6">Are you sure you want to delete this Publications?</Typography>
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

export default Publications;
