// import React from 'react';
// import { Box, Card, CardContent, Typography, Avatar, IconButton, TextField, Button, Grid } from '@mui/material';
// import { MoreVert, Add, Search } from '@mui/icons-material';

// const contacts = [
//   {
//     name: 'Alene',
//     role: 'Sr. Customer Manager',
//     email: 'alene_work@company.com',
//     avatar: 'https://via.placeholder.com/50' // Replace with actual avatar
//   },
//   {
//     name: 'Agilulf Fuxg',
//     role: 'Specialist',
//     email: 'agilulf_fuxg_work@gmail.com',
//     avatar: 'https://via.placeholder.com/50' // Replace with actual avatar
//   },
//   {
//     name: 'Adaline Bergfalks',
//     role: 'Shaper',
//     email: 'adaline_bergfalks_work@gmail.com',
//     avatar: 'https://via.placeholder.com/50' // Replace with actual avatar
//   }
// ];

// const ContactCard = ({ name, role, email, avatar }) => (
//   <Card
//     sx={{
//       width: '100%',
//       borderRadius: 2,
//       boxShadow: 2,
//       padding: 2
//     }}
//   >
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//       <Avatar alt={name} src={avatar} sx={{ width: 56, height: 56 }} />
//       <Box sx={{ flexGrow: 1 }}>
//         <Typography variant="h6">{name}</Typography>
//         <Typography variant="body2" color="text.secondary">
//           {role}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Email: {email}
//         </Typography>
//       </Box>
//       <IconButton>
//         <MoreVert />
//       </IconButton>
//     </Box>
//   </Card>
// );

// const TrandingBook = () => {
//   return (
//     <Box sx={{ padding: 4 }}>
//       {/* Header */}
//       <Typography variant="h5" sx={{ marginBottom: 3 }}>
//       Trending Books
//       </Typography>

//       {/* Search Bar and Add Button */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           marginBottom: 4,
//           gap: 2
//         }}
//       >
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search Contact"
//           fullWidth
//           InputProps={{
//             startAdornment: <Search sx={{ marginRight: 1 }} />
//           }}
//         />
//         <Button variant="contained" startIcon={<Add />} sx={{ textTransform: 'none' }}>
//           Add
//         </Button>
//       </Box>

//       {/* Contact List */}
//       <Box>
//         <Typography variant="h6" sx={{ marginBottom: 2 }}>
//           A
//         </Typography>
//         <Grid container spacing={3}>
//           {contacts.map((contact, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <ContactCard {...contact} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Box, Link, Breadcrumbs } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const TrandingBook = () => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
              marginBottom: '-25px'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
            <h4>Trending Books</h4>
          </Link>
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default TrandingBook;
