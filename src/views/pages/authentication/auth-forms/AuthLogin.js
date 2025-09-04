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
  useMediaQuery,
  MenuItem,
  Menu
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
import { url } from 'core/url';
import { color } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [checked, setChecked] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
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
            const response = await axios.post(url.admin.login, values);
            console.log(response);

            if (response?.status === 200) {
              if (response?.data?.message === 'Password Not Match') {
                toast.warn('Enter Correct Password');
              } else if (response?.data?.message === 'Admin not found') {
                toast.error('Admin not Found');
              } else if (response?.data?.statusCode === 200) {
                toast.success('Login Successfully');
                const loginToken = response?.data.userToken;

                const userData = response?.data.payload;

                localStorage.setItem('loginToken', loginToken);
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.replace('/dashboard/default');
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
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
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
                inputProps={{ maxLength: 30 }}
              />
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {touched.email && errors.email ? errors.email : ' '}
              </FormHelperText>
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput, marginTop: '-1%', marginBottom: '2%' }}
            >
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
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{ maxLength: 30 }}
              />
              {touched.password && errors.password ? (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              ) : (
                <FormHelperText id="standard-weight-helper-text-password-login"> </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                padding: '8px 12px',
                borderRadius: '4px',
                width: 'fit-content',
                gap: '8px'
              }}
            >
              <Typography variant="body2" sx={{ color: 'black', display: 'flex', alignItems: 'center' }}>
                User Credentials
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setFieldValue('email', 'admin@gmail.com');
                  setFieldValue('password', 'admin123');

                  setTimeout(() => {
                    handleSubmit();
                  }, 0);
                }}
              >
                Click Here
              </Button>
            </Box>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    background: 'linear-gradient(45deg, #441572, #7c4bad)',
                    borderRadius: '50px',
                    '&:hover': {
                      background: 'linear-gradient(to right, #4b6cb7, #182848)',
                      boxShadow: '2'
                    },
                    marginTop: '10px'
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Sign in'}
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
