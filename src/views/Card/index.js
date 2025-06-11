import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import defaultBook from '../Books/bookDummy.jpeg';
import { url } from 'core/url';
import { getApi } from 'core/apiClient';

const ProfileCard = ({ name, role, img, onClick }) => {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '300px',
        height: '70%',
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
      <CardMedia component="img" height="100" image={img} alt={`${name} background`} />
      <CardContent sx={{ textAlign: 'center', marginTop: '-15px' }}>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await getApi(url.allotmentManagement.trendingBooks);
      const fetchedData = response?.data?.data?.map((item) => ({
        id: item.bookId,
        name: item.title,
        role: item.author,
        img: item.img ? `${url.baseurl.baseurl}${item.img}` : defaultBook
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
    <Box sx={{ p: 2, mt: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {data.map((profile, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProfileCard {...profile} onClick={() => handleImage(profile)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default App;
