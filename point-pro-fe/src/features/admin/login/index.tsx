import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Typography, InputAdornment, IconButton, OutlinedInput, FormControl, InputLabel, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { login } from '~/store/slices';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { pathObj } from '~/components';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleConfirm = () => {
    if (usernameRef.current && passwordRef.current) {
      dispatch(login({ username: usernameRef.current.value, password: passwordRef.current.value }));
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${pathObj.admin}/${pathObj.order}`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box component='img' src={HeaderLogo} sx={{ width: '200px', height: '200px' }} />
        <Typography variant='h2' component='div' sx={{ my: 3 }}>
          後台登入
        </Typography>
        {/* Username */}
        <FormControl sx={{ my: 2, width: '100%' }} variant='outlined'>
          <InputLabel htmlFor='username'>Username</InputLabel>
          <OutlinedInput inputProps={{ ref: usernameRef }} id='username' placeholder='Please enter username' label='Username' />
        </FormControl>
        {/* Password */}
        <FormControl sx={{ my: 2, width: '100%' }} variant='outlined'>
          <InputLabel htmlFor='password'>Password</InputLabel>
          <OutlinedInput
            inputProps={{ ref: passwordRef }}
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Please enter password'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
        <Button variant='contained' sx={{ my: 3, width: '100%' }} onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};
