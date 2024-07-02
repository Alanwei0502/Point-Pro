import { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { useAppDispatch } from '~/hooks';
import { authSliceActions } from '~/store/slices';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { AppButton } from '~/components';
import { ROUTE_PATH } from '~/utils';

interface ILoginProps {}

const Login: FC<ILoginProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = () => {
    const { login } = authSliceActions;

    toast.promise(
      async () => {
        if (!usernameRef.current || !passwordRef.current) {
          return;
        }

        await dispatch(login({ username: usernameRef.current.value, password: passwordRef.current.value })).unwrap();
        navigate(`/${ROUTE_PATH.admin}/${ROUTE_PATH.takeOrder}`);
      },
      {
        pending: '登入中...',
        success: '登入成功',
        error: '登入失敗',
      },
    );
  };

  return (
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>
      <Box width='100%' maxWidth='400px' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
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

export default Login;
