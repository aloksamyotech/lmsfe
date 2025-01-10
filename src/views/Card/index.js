import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// ProfileCard component to display each book's information
const ProfileCard = ({ name, role, img, onClick }) => {
  return (
    <Card
      sx={{
        width: '100%', // Full width of the grid column
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
      onClick={onClick} // Add onClick event handler here
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }} // Handle keyboard navigation
      role="button" // This makes the card behave like a button for screen readers
      tabIndex={0} // Ensures that the Card is focusable
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

// Main App component
const App = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const navigate = useNavigate(); // Hook to navigate to different pages

  const fetchData = async () => {
    try {
      const response = await axios.get('http://64.227.130.216:4300/user/bookManagement');
      console.log('response <<<<<>>>>>>>> : ', response.data);

      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        name: item.bookName, // Assuming 'bookName' is the book's name
        role: item.author, // Assuming 'author' is the author of the book
        img: `http://64.227.130.216:4300/${item.upload_Book}` // Assuming 'upload_Book' is the image path
      }));

      setData(fetchedData); // Set the fetched data into state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array ensures it runs only once after the initial render

  // Handle card click and navigate to the image gallery
  const handleImage = (row) => {
    navigate(`/dashboard/imageGallery/${row.id}`, { state: { rowData: row } });
  };

  return (
    <Box sx={{ padding: 2, marginTop: '-1%' }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Map through the data and create a ProfileCard for each item */}
        {data.map((profile, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <ProfileCard
              {...profile} // Spread profile data to the ProfileCard
              onClick={() => handleImage(profile)} // Pass the click handler
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default App;
