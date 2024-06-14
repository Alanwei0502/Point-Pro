import { ChangeEvent, FC, useState } from 'react';
import { Box, FormControl, Grid, Modal, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Section, AppButton } from '~/components';
import { useResponsiveStyles } from '~/hooks';
import { theme } from '~/theme';
import { emailRegex } from '~/utils';
import { NewsletterApi } from '~/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface ISubscriptionProps {}

export const Subscription: FC<ISubscriptionProps> = () => {
  const { isTablet } = useResponsiveStyles();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscrbing, setIsSubscrbing] = useState(false);
  const [emailIsError, setEmailIsError] = useState(false);

  const handleButtonClick = async () => {
    const isValidated = emailRegex.test(email);

    if (!isValidated) {
      setEmailIsError(!isValidated);
      return;
    }

    setIsSubscrbing(true);
    toast
      .promise(
        async () => {
          await NewsletterApi.subscribe({ email });
          setOpen(true);
        },
        {
          pending: '訂閱中...',
          success: '訂閱成功',
          error: {
            render({ data }) {
              if (data instanceof AxiosError) {
                return data.response?.data.result;
              }
            },
          },
        },
      )
      .finally(() => {
        setIsSubscrbing(false);
      });
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEmail('');
    setEmailIsError(false);
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailIsError(false);
    setEmail(e.target.value);
  };

  return (
    <Section id='subscribe' isBgGray>
      <Box borderRadius='2.5rem' boxShadow={`5px 5px 0px ${theme.palette.primary.main}`} sx={{ backgroundColor: 'white' }}>
        <Box p={3}>
          <Grid container spacing={2} justifyContent='space-between' alignItems='center' flexDirection={isTablet ? 'row' : 'column'} flexGrow={1}>
            <Grid item md={6}>
              <Typography fontSize={theme.typography.h4.fontSize} fontWeight={900} mb={2}>
                掌握第一手促銷
              </Typography>
              <Typography>歡迎訂閱我們的電子報，了解最新餐飲趨勢和專家建議，還可以獲得專屬優惠與折扣碼。</Typography>
            </Grid>
            <Grid item md={6} display='flex' alignItems='flex-start' gap={0.5} flexGrow={1}>
              <FormControl fullWidth>
                <TextField
                  type='email'
                  size='small'
                  placeholder='請輸入您的電子信箱'
                  error={emailIsError}
                  helperText={emailIsError && '電子信箱格式錯誤'}
                  value={email}
                  onChange={handleChangeEmail}
                />
              </FormControl>
              <AppButton onClick={handleButtonClick} disableRipple={true} disableFocusRipple={true} disabled={isSubscrbing}>
                <SendIcon fontSize='small' />
              </AppButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          gap={1}
          minWidth={350}
          bgcolor='common.white'
          textAlign='center'
          position='absolute'
          top='50%'
          left='50%'
          padding='1.5rem'
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box p={3}>
            <Typography fontSize={theme.typography.h4.fontSize} fontWeight={900} mb={3}>
              感謝您的訂閱
            </Typography>
            <Typography>我們將會寄送最新優惠及最新餐飲趨勢到您的信箱。</Typography>
          </Box>
          <AppButton fullWidth onClick={handleCloseModal}>
            確認
          </AppButton>
        </Box>
      </Modal>
    </Section>
  );
};
