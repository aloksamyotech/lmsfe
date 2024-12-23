import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';

const profiles = [
  {
    name: 'Paulo Coelho',
    role: ' THE ALCHEMIST ',
    status: 'Active',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6_G-a3LG6oKgubC158kAGS8TeRDG3F291cQ&s'
  },
  {
    name: 'Novel by Edward P. Jones',
    role: 'The Known World',
    status: 'Active',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSduFXOoU2VD-1gc1jCl03gsoHYzeKNyaKJOA&s'
  },
  {
    name: 'Charles Darwin',
    role: 'THE ORIGIN OF SPECIES',
    status: 'Active',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeI3YP5JmaQ4_YDCFmljuPIggK1-7_aAb70A&s'
  },
  {
    name: 'Sally Hepworth',
    role: 'THE GOOD SISTER ',
    status: 'Active',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5DOPTv9dZFILkYSoi2AkxeME3-eGXK1H93A&s'
  }
];

const ProfileCard = ({ name, role, status, img }) => {
  return (
    <Card
      sx={{
        width: 300,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // smooth transition for zoom effect
        '&:hover': {
          transform: 'scale(1.05)', // zoom in the card on hover
          boxShadow: 6 // increase shadow on hover
        }
      }}
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

const Book2 = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        padding: 2,
        marginTop: '-1%'
      }}
    >
      {profiles.map((profile, index) => (
        <ProfileCard key={index} {...profile} />
      ))}
    </Box>
  );
};

export default Book2;
