import { ChangeEvent, FC, useState } from 'react';
import { Box, FormControl, Grid, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { BaseModal, Section, AppButton } from '~/components';
import { useAppDispatch, useResponsiveStyles } from '~/hooks';
import { theme } from '~/theme';
import { emailRegex } from '~/utils';

const html = `
  <h1>親愛的客戶，您好</h1>
  <p>感謝您訂閱「PointPro」的電子報！我們非常高興能夠與您建立聯繫並分享最新的產品和行業資訊。在這封信中，我們想向您介紹一些我們的服務以及您可以期待的好處。</p>
  <p>
  「PointPro」是一個專為餐飲業打造的先進POS系統，我們致力於幫助餐廳提升營運效率，提供更優質的客戶體驗。以下是一些您可以期待的「PointPro」的優點：</p>

  <ol>
  <li>簡單易用的操作界面：我們設計了直觀且使用者友好的界面，使您能夠輕鬆管理訂單、庫存、員工和報表等。</li>
  <li>客製化功能：「PointPro」提供了豐富的功能和模組，讓您能夠根據您的餐廳需求自訂設定，包括餐桌管理、菜單設計、促銷活動等。</li>
  <li>即時數據和報表：我們的系統能夠提供即時的銷售數據和報表，讓您能夠快速了解餐廳的營運狀況，做出明智的決策。</li>
  <li>客戶支援和培訓：我們擁有一支專業的客戶支援團隊，隨時為您提供協助和解答問題。此外，我們還提供全面的培訓資源，以確保您和您的團隊能夠充分發揮「PointPro」系統的潛力。</li>
  </ol>
  <p>我們期待能夠與您共同合作，幫助您的餐廳取得更大的成功。如果您有任何問題或需要進一步的資訊，請隨時聯繫我們的客戶支援團隊。再次感謝您的訂閱，我們期待在未來的電子報中與您分享更多有價值的內容。</p>
  <p>祝您一切順利！</p>
  <p>最誠摯的問候，順頌時祺</p>
  <h2>「PointPro」團隊敬上</h2>
`;

interface ISubscriptionProps {}

export const Subscription: FC<ISubscriptionProps> = () => {
  const dispatch = useAppDispatch();

  const { isTablet } = useResponsiveStyles();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailIsError, setEmailIsError] = useState(false);

  const handleButtonClick = async () => {
    const isValidated = emailRegex.test(email);

    if (!isValidated) {
      setEmailIsError(!isValidated);
      return;
    }

    // await dispatch(sendEmail({
    //   to: email,
    //   subject: '歡迎訂閱「PointPro」電子報！',
    //   html,
    // })).unwrap().then(() => {
    // setOpen(true);
    // });

    // temp
    setOpen(true);
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
              <AppButton onClick={handleButtonClick} disableRipple={true} disableFocusRipple={true}>
                <SendIcon fontSize='small' />
              </AppButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <BaseModal open={open} onClose={handleCloseModal}>
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
      </BaseModal>
    </Section>
  );
};
