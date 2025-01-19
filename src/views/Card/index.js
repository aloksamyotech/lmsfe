import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import defaultBook from '../Books/bookDummy.jpeg';
import { url } from 'core/url';

const ProfileCard = ({ name, role, img, onClick }) => {
  return (
    <Card
      sx={{
        width: '100%',
        marginTop: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 5
        }
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      role="button"
      tabIndex={0}
    >
      <CardMedia component="img" height="250" image={img} alt={`${name} background`} />
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {role}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}>
          <Facebook sx={{ color: '#3b5998', cursor: 'pointer' }} />
          <Twitter sx={{ color: '#1da1f2', cursor: 'pointer' }} />
          <LinkedIn sx={{ color: '#0077b5', cursor: 'pointer' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // const response = await axios.get('http://localhost:4300/user/bookManagement/');

      const response = await axios.get(url.bookManagenent.bookManagement);
      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        name: item.bookName,
        role: item.author,
        img: item.upload_Book ? `http://localhost:4300/${item.upload_Book}` : defaultBook
        // img: item.upload_Book ? `${url}${item.upload_Book}` : defaultBook
      }));

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImage = (row) => {
    navigate(`/dashboard/imageGallery/${row.id}`, { state: { rowData: row } });
  };

  return (
    <Box sx={{ padding: 2, marginTop: '-1%' }}>
      <Grid container spacing={4} justifyContent="center">
        {data.map((profile, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProfileCard {...profile} onClick={() => handleImage(profile)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default App;
