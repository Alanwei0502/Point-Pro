import { FC, useEffect } from 'react';
import { Box, Grid, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  PhoneIphone as PhoneIphoneIcon,
  Email as EmailIcon,
  StickyNote2 as StickyNote2Icon,
} from '@mui/icons-material';
import { formatFullDate, formatFullDateWithTime, formatTimeOnly, genderObj } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { sendMail } from '~/store/slices';

interface IConfirmBookingTextFieldProps extends Omit<TextFieldProps, 'label' | 'value' | 'InputProps' | 'variant'> {
  label: string;
  value: string;
  icon: React.ReactNode;
}
export const ConfirmBookingTextField: FC<IConfirmBookingTextFieldProps> = (props) => {
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
  const username = useAppSelector(({ booking }) => booking.username);
  const gender = useAppSelector(({ booking }) => booking.gender);
  const phone = useAppSelector(({ booking }) => booking.phone);
  const email = useAppSelector(({ booking }) => booking.email);
  const remark = useAppSelector(({ booking }) => booking.remark);
  const people = useAppSelector(({ booking }) => booking.people);
  const selectedPeriod = useAppSelector(({ booking }) => booking.selectedPeriod);

  useEffect(() => {
    const html = `<h1>港都熱炒</h1>
    <h2>親愛的 ${username} ${genderObj[gender]}</h2>
    <p>您的訂位已經成功囉, 感謝您選擇港都熱炒！</p>
    <p>我們會竭誠為您提供美味佳餚和貼心的服務。請留意並保存以下資訊，並準時到達。 如需更改或取消，提前聯繫我們。</p>
    <p>期待您的光臨用餐</p>
    <h3>訂位資訊</h3>
    <ul>
    <li>姓名: ${username} ${genderObj[gender]}</li>
    <li>電子信箱: ${email}</li>
    <li>手機號碼: ${phone}</li>
    <li>備註: ${remark}</li>
    <li>人數: ${people}</li>
    <li>訂位時間: ${formatFullDateWithTime(selectedPeriod?.startTime ?? null)}</li>
    </ul>
    <h3>到店用餐時請告知店員預約姓名或手機號碼，以核對預約資訊</h3>
    `;
    const request = {
      to: email,
      subject: '成功訂位',
      html,
    };

    // isReminder && dispatch(sendMail(request));
  }, [dispatch, email, gender, isReminder, people, phone, remark, selectedPeriod?.startTime, username]);

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
          <Box sx={{ fontSize: 'h5.fontSize', fontWeight: 900, color: 'common.black' }}>{people} 位</Box>
        </Grid>
        <Grid item xs={6} sx={{ padding: '0 1rem', borderLeft: '.1rem solid', borderColor: 'common.black_40' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>入座時間</Box>
          <Box sx={{ fontSize: 'h6.fontSize', fontWeight: 900, color: 'common.black' }}>
            <Box>{formatFullDate(selectedPeriod?.startTime)}</Box>
            <Box>{formatTimeOnly(selectedPeriod?.startTime)}</Box>
          </Box>
        </Grid>
      </Grid>
      <ConfirmBookingTextField label='姓名' value={`${username} ${genderObj[gender]}`} icon={<AccessibilityIcon />} />
      <ConfirmBookingTextField label='手機號碼' value={phone} icon={<PhoneIphoneIcon />} />
      <ConfirmBookingTextField label='電子信箱' value={email ?? ''} icon={<EmailIcon />} />
      <ConfirmBookingTextField label='備註' value={remark || '無'} icon={<StickyNote2Icon />} multiline maxRows={4} />
    </Box>
  );
};
