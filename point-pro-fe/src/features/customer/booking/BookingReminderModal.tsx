import { FC, useEffect } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, TextFieldProps, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsIcon from '@mui/icons-material/Directions';
import InfoIcon from '@mui/icons-material/Info';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { MobileDialogLayout, Loading, BaseButton } from '~/components';
import { CustomerBookingDialog, Gender } from '~/types';
import { appDayjs, formatDateOnly, formatTimeOnly } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setStep, setDialog, resetUserInfo, sendMail } from '~/store/slices';

interface IAtionIconProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}
export const ActionIcon = (props: IAtionIconProps) => {
  const { icon, title, onClick } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <BaseButton
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          borderRadius: '50%',
          bgcolor: 'common.white',
          marginBottom: '.5rem',
        }}
        onClick={() => onClick()}
      >
        {icon}
      </BaseButton>
      <Typography fontWeight={700}>{title}</Typography>
    </Box>
  );
};

interface IConfirmBookingTextFieldProps extends Omit<TextFieldProps, 'label' | 'value' | 'InputProps' | 'variant'> {
  label: string;
  value: string;
  icon: React.ReactNode;
}
export const ConfirmBookingTextField = (props: IConfirmBookingTextFieldProps) => {
  const { label, value, icon, ...rest } = props;

  return (
    <TextField
      label={
        <Box sx={{ display: 'flex', alignContent: 'center', fontSize: 'h5.fontSize' }}>
          {icon}
          <Box sx={{ marginLeft: '.5rem', color: 'common.black' }}>{label}</Box>
        </Box>
      }
      variant='standard'
      value={value}
      InputProps={{
        startAdornment: <InputAdornment position='start' sx={{ width: '1rem' }} />,
      }}
      sx={{ width: '100%', marginBottom: '2rem', pointerEvents: 'none', padding: '1rem 1rem 0' }}
      {...rest}
    />
  );
};

interface IConfirmBookingInfoProps {
  isReminder?: boolean;
}

export const ConfirmBookingInfo = (props: IConfirmBookingInfoProps) => {
  const dispatch = useAppDispatch();
  const { isReminder = false } = props;
  const reservedAt = useAppSelector(({ customerReservation }) => customerReservation.reservationParams.reservedAt);
  const { name, gender, phone, email, remark, adults } = useAppSelector(
    ({ customerReservation }) => customerReservation.reservationParams.user,
  );

  useEffect(() => {
    const html = `<h1>港都熱炒</h1>
    <h2>親愛的 ${name} ${gender === Gender.MALE ? '先生' : gender === Gender.FEMALE ? '小姐' : ''}</h2>
    <p>您的訂位已經成功囉, 感謝您選擇港都熱炒！</p>
    <p>我們會竭誠為您提供美味佳餚和貼心的服務。請留意並保存以下資訊，並準時到達。 如需更改或取消，提前聯繫我們。</p>
    <p>期待您的光臨用餐</p>
    <h3>訂位資訊</h3>
    <ul>
    <li>姓名: ${name} ${gender === Gender.MALE ? '先生' : gender === Gender.FEMALE ? '小姐' : ''}</li>
    <li>電子信箱: ${email}</li>
    <li>手機號碼: ${phone}</li>
    <li>備註: ${remark}</li>
    <li>人數: ${adults}</li>
    <li>訂位時間: ${formatDateOnly(reservedAt)} ${formatTimeOnly(reservedAt)}</li>
    </ul>
    <h3>到店用餐時請告知店員預約姓名或手機號碼，以核對預約資訊</h3>
    `;
    const request = {
      to: email,
      subject: '成功訂位',
      html,
    };

    isReminder && dispatch(sendMail(request));
  }, [adults, dispatch, email, gender, isReminder, name, phone, remark, reservedAt]);

  return (
    <Box sx={{ paddingBottom: isReminder ? '' : '10rem' }}>
      <Grid
        container
        sx={{
          padding: '1rem 0',
          borderRadius: '5px',
          bgcolor: 'common.black_20',
          color: 'common.black_60',
          marginBottom: '1rem',
        }}
      >
        <Grid item xs={6} sx={{ padding: '0 1rem' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>用餐人數</Box>
          <Box sx={{ fontSize: 'h5.fontSize', fontWeight: 900, color: 'common.black' }}>{adults} 位</Box>
        </Grid>
        <Grid item xs={6} sx={{ padding: '0 1rem', borderLeft: '.1rem solid', borderColor: 'common.black_40' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>入座時間</Box>
          <Box sx={{ fontSize: 'h6.fontSize', fontWeight: 900, color: 'common.black' }}>
            <Box>{formatDateOnly(reservedAt)}</Box>
            <Box>{formatTimeOnly(reservedAt)}</Box>
          </Box>
        </Grid>
      </Grid>
      <ConfirmBookingTextField label='姓名' value={`${name} ${Gender[gender]}`} icon={<AccessibilityIcon />} />
      <ConfirmBookingTextField label='手機號碼' value={phone} icon={<PhoneIphoneIcon />} />
      <ConfirmBookingTextField label='電子信箱' value={email} icon={<EmailIcon />} />
      <ConfirmBookingTextField label='備註' value={remark || '無'} icon={<StickyNote2Icon />} multiline maxRows={4} />
    </Box>
  );
};

interface IBookingReminderProps {}

export const BookingReminderModal: FC<IBookingReminderProps> = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerReservation }) => customerReservation.dialog);
  const isLoading = useAppSelector(({ customerReservation }) => customerReservation.isLoading);
  const { name, gender } = useAppSelector(({ customerReservation }) => customerReservation.reservationParams.user);

  const handleClose = () => {
    dispatch(setStep(0));
    dispatch(resetUserInfo());
    dispatch(setDialog());
  };

  // [TODO]: temprarily remove
  // const handleQRCode = () => {
  //   dispatch(setDialog(CustomerBookingDialog.QRCODE));
  // };

  // const handlePhoneCall = () => {
  //   const link = document.createElement("a");
  //   link.setAttribute("href", "tel:+886-988376229");
  //   link.click();
  // };

  if (isLoading) {
    return <Loading open={true} />;
  }

  return (
    <MobileDialogLayout
      title={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <EventIcon sx={{ width: '1rem', height: '1rem' }} />
          <Box sx={{ marginLeft: '.5rem', fontSize: 'body1.fontSize' }}>已為您安排訂位</Box>
        </Box>
      }
      titleSize='h6'
      isShowCloseIcon={false}
      isOpen={dialog === CustomerBookingDialog.REMINDER}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleClose}>關閉</Button>}
      dialogTitleProps={{
        sx: { '.MuiTypography-h6': { textAlign: 'center' }, bgcolor: 'primary.main' },
      }}
    >
      <Box sx={{ paddingBottom: '2rem' }}>
        <br />
        <Typography variant='h3' fontWeight={900}>
          港都熱炒
        </Typography>
        <br />
        <Typography>
          親愛的 {name} {Gender[gender]}
        </Typography>
        <br />
        <Typography>您的訂位已經成功囉, 感謝您選擇港都熱炒！</Typography>
        <br />
        <Typography>
          我們會竭誠為您提供美味佳餚和貼心的服務。請留意並保存以下資訊，並準時到達。 如需更改或取消，提前聯繫我們。
        </Typography>
        <br />
        <ConfirmBookingInfo isReminder />
        {/* [TODO]: temprarily remove */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2rem"
          }}
        >
          <ActionIcon icon={<QrCodeIcon />} title="QR Code" onClick={handleQRCode} />
          <ActionIcon icon={<LocalPhoneIcon />} title="撥打電話" onClick={handlePhoneCall} />
        </Box> */}
        <ConfirmBookingTextField label='位置' value='台北市中山區民生東路一段52號' icon={<DirectionsIcon />} />
        <ConfirmBookingTextField
          label='溫馨提醒'
          value='請您準時到達,如有遲到情況,請提前告知,以免影響您的用餐體驗。如遇特殊天氣或交通狀況,請提前安排出行,確保您能夠準時抵達餐廳。如果有特殊飲食需求或過敏情況,請在抵達餐廳時告知我們的服務人員。再次感謝您選擇港都熱炒,期待您的光臨!'
          icon={<InfoIcon />}
          multiline
          rows={7}
        />
        <Typography color='text.disabled' sx={{ padding: '3rem', textAlign: 'center', bgcolor: 'common.black_20' }}>
          Copyright © {appDayjs().year()} PointPro.
          <br />
          All Rights Reserved
        </Typography>
      </Box>
    </MobileDialogLayout>
  );
};
