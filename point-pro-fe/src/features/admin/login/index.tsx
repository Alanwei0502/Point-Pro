import { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Typography, InputAdornment, IconButton, OutlinedInput, FormControl, InputLabel } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { authSliceActions } from '~/store/slices';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { AppButton, pathObj } from '~/components';

const { login } = authSliceActions;

interface ILoginProps {}

export const Login: FC<ILoginProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const authToken = useAppSelector((state) => state.auth.authToken);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = () => {
    toast.promise(
      async () => {
        if (!usernameRef.current || !passwordRef.current) {
          return;
        }

        await dispatch(login({ username: usernameRef.current.value, password: passwordRef.current.value })).unwrap();
      },
      {
        pending: '登入中...',
        success: '登入成功',
        error: '登入失敗',
      },
    );
  };

  useEffect(() => {
    if (authToken) {
      navigate(`/${pathObj.admin}/${pathObj.orderManagement}`);
    }
  }, [authToken, navigate]);

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
          <InputLabel htmlFor='username'>名稱</InputLabel>
          <OutlinedInput inputProps={{ ref: usernameRef }} id='username' label='Username' placeholder='Please enter username' />
        </FormControl>
        {/* Password */}
        <FormControl sx={{ my: 2, width: '100%' }} variant='outlined'>
          <InputLabel htmlFor='password'>密碼</InputLabel>
          <OutlinedInput
            inputProps={{ ref: passwordRef }}
            id='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Please enter password'
            endAdornment={
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={handleShowPassword} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <AppButton sx={{ width: '100%', fontSize: 18, my: 2 }} onClick={handleLogin}>
          登入
        </AppButton>
      </Box>
    </Box>
  );
};
