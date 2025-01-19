// import { Link } from 'react-router-dom';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// // project imports
// import AuthWrapper1 from '../AuthWrapper1';
// import AuthCardWrapper from '../AuthCardWrapper';
// import AuthLogin from '../auth-forms/AuthLogin';
// import Logo from 'ui-component/Logo';
// import AuthFooter from 'ui-component/cards/AuthFooter';

// // assets

// // ================================|| AUTH3 - LOGIN ||================================ //

// const Login = () => {
//   const theme = useTheme();
//   const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <AuthWrapper1>
//       <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
//         <Grid item xs={12}>
//           <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
//             <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
//               <AuthCardWrapper>
//                 <Grid container spacing={2} alignItems="center" justifyContent="center">
//                   <Grid item sx={{ mb: 3 }}>
//                     <Link to="#">{/* <Logo /> */}</Link>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
//                       <Grid item>
//                         <Stack alignItems="center" justifyContent="center" spacing={1}>
//                           <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
//                             Hi, Welcome Back
//                           </Typography>
//                           <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
//                           Enter your credentials to continue
//                           </Typography>
//                         </Stack>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <AuthLogin />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Divider />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Grid item container direction="column" alignItems="center" xs={12}>
//                       <Typography component={Link} to="/pages/register/register3" variant="subtitle1" sx={{ textDecoration: 'none' }}>
//                         Don&apos;t have an account?
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </AuthCardWrapper>
//             </Grid>
//           </Grid>
//         </Grid>
//         <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
//           <AuthFooter />
//         </Grid>
//       </Grid>
//     </AuthWrapper1>
//   );
// };

// export default Login;

import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box } from '@mui/material';
import AuthWrapper1 from '../AuthWrapper1.js';
import AuthCardWrapper from '../AuthCardWrapper.js';
import AuthLogin from '../auth-forms/AuthLogin.js';
import Logo from 'layout/MainLayout/LogoSection';
import AuthFooter from 'ui-component/cards/AuthFooter.js';
import InventoryImage from '../../../../assets/images/Backimag.jpg';
const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <AuthWrapper1>
      <Grid container sx={{ height: '100vh', backgroundColor: '#441572' }}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'lightblue'
            // backgroundColor: '#4682B4 '
            backgroundColor: '#4b8bc0 '
          }}
        >
          <AuthCardWrapper
            sx={{
              maxWidth: 400,
              width: '100%',
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item sx={{ mb: 2, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '2px',
                    marginLeft: 12
                  }}
                >
                  <Logo />
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '-20px' }}>
                <Stack alignItems="center">
                  <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', color: '#240046' }}>
                    Welcome to Library Management System
                  </Typography>
                  <Typography textAlign="center" variant="body2" sx={{ color: 'black' }}>
                    {/* Login to use the platform */}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#FFFFFF' }} />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Typography
                  component={Link}
                  to="/register"
                  variant="subtitle1"
                  sx={{
                    textDecoration: 'none',
                    color: 'black',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {/* Don&apos;t have an account?<span style={{ color: '#441572', fontWeight: 'bold' }}>Register here</span> */}
                </Typography>
              </Grid>
            </Grid>
          </AuthCardWrapper>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: '#2F124C',
              padding: '4px',
              flexDirection: 'column',
              // backgroundColor: 'white'
              // backgroundColor: '#4682B4'
              backgroundColor: '#4b8bc0 '
            }}
          >
            <Box
              component="img"
              src={InventoryImage}
              alt="Inventory Management"
              sx={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                marginTop: '2%'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '16px'
              }}
            >
              {/* Inventory Management System <br />
              <span style={{ fontSize: '12px' }}>Streamline your inventory, track your products, and manage supplies effortlessly.</span> */}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};
export default Login;
