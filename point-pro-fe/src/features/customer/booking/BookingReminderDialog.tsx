import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  Event as EventIcon,
  Directions as DirectionsIcon,
  Info as InfoIcon,
  LocalPhone as LocalPhoneIcon,
  MapSharp as MapSharpIcon,
} from '@mui/icons-material';
import { MobileDialogLayout, Loading, BaseButton } from '~/components';
import { MobileBookingDialog } from '~/types';
import { appDayjs, GENDER_TRANSLATE } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { finishBooking } from '~/store/slices';
import { ConfirmBookingInfo, ConfirmBookingTextField } from './ConfirmBookingInfo';

interface IAtionIconProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}
export const ActionIcon: FC<IAtionIconProps> = (props) => {
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
        onClick={onClick}
      >
        {icon}
      </BaseButton>
      <Typography fontWeight={700}>{title}</Typography>
    </Box>
  );
};

interface IBookingReminderProps {}

export const BookingReminderDialog: FC<IBookingReminderProps> = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ booking }) => booking.dialog);
  const isLoading = useAppSelector(({ booking }) => booking.isLoading);
  const username = useAppSelector(({ booking }) => booking.username);
  const gender = useAppSelector(({ booking }) => booking.gender);

  const handleClose = () => {
    dispatch(finishBooking());
  };

  const handlePhoneCall = () => {
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:+886-2-1234-5678');
    link.click();
  };

  const handleOpenGoogleMaps = () => {
    const encodedAddress = encodeURIComponent('港都熱炒+中山旗艦店');
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return isLoading ? (
    <Loading open={true} />
  ) : (
    <MobileDialogLayout
      title={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <EventIcon sx={{ width: '1rem', height: '1rem' }} />
          <Box sx={{ marginLeft: '.5rem', fontSize: 'body1.fontSize' }}>已為您安排訂位</Box>
        </Box>
      }
      titleSize='h6'
      isShowCloseIcon={false}
      isOpen={dialog === MobileBookingDialog.REMINDER}
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
          親愛的 {username} {GENDER_TRANSLATE[gender]},
        </Typography>
        <br />
        <Typography>您的訂位已經成功囉, 感謝您選擇港都熱炒！</Typography>
        <br />
        <ConfirmBookingInfo isReminder />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <ActionIcon icon={<LocalPhoneIcon />} title='撥打電話' onClick={handlePhoneCall} />
          <ActionIcon icon={<MapSharpIcon />} title='查看位置' onClick={handleOpenGoogleMaps} />
        </Box>
        <ConfirmBookingTextField label='地址' value='台北市中山區民生東路一段52號' icon={<DirectionsIcon />} />
        <ConfirmBookingTextField
          label='溫馨提醒'
          value='請您準時到達，如需更改或取消，請提前聯繫我們。如果有特殊飲食需求或過敏情況，請提前或在抵達餐廳時告知我們的服務人員，期待您的光臨！'
          icon={<InfoIcon />}
          multiline
        />
        <Typography color='text.disabled' sx={{ padding: '2rem', textAlign: 'center', bgcolor: 'common.black_20' }}>
          Copyright © {appDayjs().year()} PointPro.
          <br />
          All Rights Reserved
        </Typography>
      </Box>
    </MobileDialogLayout>
  );
};
