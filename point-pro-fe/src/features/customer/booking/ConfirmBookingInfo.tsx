import { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { formatFullDate, formatTimeOnly, GENDER_TRANSLATE } from '~/utils';
import { useAppSelector } from '~/hooks';

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
  const { isReminder = false } = props;

  const username = useAppSelector(({ booking }) => booking.username);
  const gender = useAppSelector(({ booking }) => booking.gender);
  const phone = useAppSelector(({ booking }) => booking.phone);
  const email = useAppSelector(({ booking }) => booking.email);
  const remark = useAppSelector(({ booking }) => booking.remark);
  const people = useAppSelector(({ booking }) => booking.people);
  const selectedPeriod = useAppSelector(({ booking }) => booking.selectedPeriod);

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
      <ConfirmBookingTextField label='姓名' value={`${username} ${GENDER_TRANSLATE[gender]}`} icon={<AccessibilityIcon />} />
      <ConfirmBookingTextField label='手機號碼' value={phone} icon={<PhoneIphoneIcon />} />
      <ConfirmBookingTextField label='電子信箱' value={email || '無'} icon={<EmailIcon />} />
      <ConfirmBookingTextField label='備註' value={remark || '無'} icon={<StickyNote2Icon />} multiline maxRows={4} />
    </Box>
  );
};
