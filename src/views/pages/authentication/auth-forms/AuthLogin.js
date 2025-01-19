import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/icons/social-google.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await axios.post('http://localhost:4300/user/login', values);

            if (response?.status === 200) {
              console.log('Response:', response?.data?.message);

              if (response?.data?.message === 'Password Not Match') {
                toast.warn('Enter Correct Password');
              } else if (response?.data?.message === 'not found') {
                toast.error('User not Found');
              // } else if (response?.data?.userToken) {
              } else if (response?.data) {
                toast.success('Login Successfully');
                // const loginToken = response?.data?.userToken;
                const loginToken = response?.data;
                localStorage.setItem('loginToken', loginToken);

                setTimeout(() => {
                  window.location.replace('/dashboard/default');
                }, 1000);
              }
            } else {
              toast.error('Unexpected response status');
            }
          } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred, please try again');
          }

          try {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Remember me"
              />
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;

// import { useState } from 'react';
// import { useTheme } from '@mui/material/styles';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormHelperText,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography
// } from '@mui/material';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import AnimateButton from 'ui-component/extended/AnimateButton';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// // import { url } from 'api/url';
// // import { loggedUser } from 'api/apis';
// // import logo from '../../../../layout/MainLayout/LogoSection/logo_3.jpg';
// import Logo  from '../../../../assets/images/Screenshot.png'
// import CopyAllIcon from '@mui/icons-material/CopyAll';
// import LockIcon from '@mui/icons-material/Lock';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import CheckIcon from '@mui/icons-material/Check';
// import { toast } from 'react-toastify';
// const FirebaseLogin = ({ ...others }) => {
//   const theme = useTheme();
//   const [showPassword, setShowPassword] = useState(false);
//   const [copiedEmail, setCopiedEmail] = useState(false);
//   const [copiedPassword, setCopiedPassword] = useState(false);
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };
//   const handleCopy = (text, type) => {
//     if (navigator.clipboard) {
//       navigator.clipboard
//         .writeText(text)
//         .then(() => {
//           if (type === 'email') {
//             setCopiedEmail(true);
//             setTimeout(() => setCopiedEmail(false), 400);
//           } else if (type === 'password') {
//             setCopiedPassword(true);
//             setTimeout(() => setCopiedPassword(false), 400);
//           }
//         })
//         .catch((err) => {
//           console.error('Clipboard copy failed:', err);
//           toast.error('Failed to copy to clipboard');
//         });
//     } else {
//       toast.error('Clipboard not supported in this browser');
//     }
//   };
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '30vh',
//         padding: 3
//       }}
//     >
//       <Box
//         sx={{
//           background: '#fff',
//           padding: 4,
//           borderRadius: 2,
//           boxShadow: 3,
//           textAlign: 'center',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: '90%',
//           maxWidth: '400px'
//         }}
//       >
//         <img src={Logo} alt="Logo" width="150" style={{ marginBottom: 20 }} />
//         <Formik
//           initialValues={{
//             email: '',
//             password: ''
//           }}
//           validationSchema={Yup.object().shape({
//             email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//             password: Yup.string().max(255).required('Password is required')
//           })}
//           onSubmit={async (values, { resetForm }) => {
//             const com_url = `${url.base_url}${url.login.login}`;
//             try {
//               const res = await loggedUser(com_url, values);
//               if (res?.data?.message === 'User Not Registered') {
//                 toast.error(res?.data?.message);
//                 resetForm();
//               } else if (res?.data?.message === 'Wrong Password') {
//                 toast.warning(res?.data?.message);
//               } else {
//                 toast.success(res?.data?.message || 'Login Successful');
//                 const token = res.data.token;
//                 localStorage.setItem('token', token);
//                 const companyLogo = res?.data?.logo || '';
//                 localStorage.setItem('companyLogo', companyLogo);
//                 setTimeout(() => {
//                   window.location.replace('/dashboard/default');
//                 }, 1000);
//               }
//             } catch (err) {
//               console.error(`error: ${err}`);
//               toast.error(err?.response?.data?.message || '500 Error: Something went wrong');
//             }
//           }}
//         >
//           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//             <form noValidate onSubmit={handleSubmit} {...others}>
//               <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ mb: 2 }}>
//                 <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
//                 <OutlinedInput
//                   id="outlined-adornment-email-login"
//                   type="email"
//                   value={values.email}
//                   name="email"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   label="Email Address / Username"
//                   sx={{
//                     '&.MuiOutlinedInput-root': {
//                       borderRadius: 1,
//                       background: '#F6F7FB'
//                     }
//                   }}
//                 />
//                 {touched.email && errors.email && (
//                   <FormHelperText error id="standard-weight-helper-text-email-login">
//                     {errors.email}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//               <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mb: 2 }}>
//                 <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
//                 <OutlinedInput
//                   id="outlined-adornment-password-login"
//                   type={showPassword ? 'text' : 'password'}
//                   value={values.password}
//                   name="password"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                         edge="end"
//                         size="large"
//                       >
//                         {showPassword ? <Visibility /> : <VisibilityOff />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   label="Password"
//                   sx={{
//                     '&.MuiOutlinedInput-root': {
//                       borderRadius: 1,
//                       background: '#F6F7FB'
//                     }
//                   }}
//                 />
//                 {touched.password && errors.password && (
//                   <FormHelperText error id="standard-weight-helper-text-password-login">
//                     {errors.password}
//                   </FormHelperText>
//                 )}
//               </FormControl>
//               <Accordion sx={{ width: '100%' }} defaultExpanded={false}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
//                   <Typography variant="h6">Admin Credentials</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ backgroundColor: '#F6F7FB' }}>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
//                     <strong>Email: </strong> admin@gmail.com
//                     <IconButton
//                       onClick={() => handleCopy('admin@gmail.com', 'email')}
//                       sx={{ color: theme.palette.primary.main, marginLeft: 1 }}
//                     >
//                       {copiedEmail ? <CheckIcon /> : <CopyAllIcon />}
//                     </IconButton>
//                     {copiedEmail && <span style={{ color: 'green' }}>Copied</span>}
//                   </Typography>
//                   <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
//                     <strong>Password: </strong> 12345
//                     <IconButton onClick={() => handleCopy('123456', 'password')} sx={{ color: theme.palette.primary.main, marginLeft: 1 }}>
//                       {copiedPassword ? <CheckIcon /> : <CopyAllIcon />}
//                     </IconButton>
//                     {copiedPassword && <span style={{ color: 'green' }}>Copied</span>}
//                   </Typography>
//                 </AccordionDetails>
//               </Accordion>
//               <Box sx={{ mt: 2 }}>
//                 <AnimateButton>
//                   <Button
//                     disableElevation
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     sx={{
//                       '&:hover': {
//                         backgroundColor: theme.palette.primary.dark
//                       }
//                     }}
//                   >
//                     Sign in
//                   </Button>
//                 </AnimateButton>
//               </Box>
//             </form>
//           )}
//         </Formik>
//       </Box>
//     </Box>
//   );
// };
// export default FirebaseLogin;
