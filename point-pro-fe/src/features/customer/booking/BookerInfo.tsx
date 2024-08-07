import { FC, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import { MobileBookingDialog, Gender } from '~/types';
import { GENDER_TRANSLATE } from '~/constants';
import { emailRegex, phoneRegex } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { bookingSliceActions } from '~/store/slices/customer/booking.slice';

const { setPhone, setDialog, setName, setEmail, setRemark, setGender, setAgreedPolicy } = bookingSliceActions;

interface IBookerInfoProps {}

export const BookerInfo: FC<IBookerInfoProps> = () => {
  const dispatch = useAppDispatch();

  const username = useAppSelector(({ booking }) => booking.username);
  const phone = useAppSelector(({ booking }) => booking.phone);
  const email = useAppSelector(({ booking }) => booking.email);
  const gender = useAppSelector(({ booking }) => booking.gender);
  const remark = useAppSelector(({ booking }) => booking.remark);

  const isAgreedPrivacyPolicy = useAppSelector(({ booking }) => booking.isAgreedPrivacyPolicy);

  const [nameIsError, setNameIsError] = useState(false);
  const [phoneIsError, setPhoneIsError] = useState(false);
  const [emailIsError, setEmailIsError] = useState(false);

  const handleEnterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = !!e.target.value;
    setNameIsError(!isValidated);
    dispatch(setName(e.target.value));
  };

  const handleChooseGender = (e: React.ChangeEvent<HTMLInputElement>, value: string): void => {
    dispatch(setGender(value as Gender));
  };

  const handleEnterPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = phoneRegex.test(e.target.value);
    setPhoneIsError(!isValidated);
    dispatch(setPhone(e.target.value));
  };

  const handleEnterEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      const isValidated = emailRegex.test(e.target.value);
      setEmailIsError(!isValidated);
    } else {
      setEmailIsError(false);
    }
    dispatch(setEmail(e.target.value));
  };

  const handleEnterRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setRemark(e.target.value));
  };

  const handleAgreedPolicy = () => {
    dispatch(setAgreedPolicy(!isAgreedPrivacyPolicy));
  };

  const handleOpenPrivayPolicyDialog = () => {
    dispatch(setDialog(MobileBookingDialog.PRIVACY_POLICY));
  };

  return (
    <Box pb='10rem'>
      <FormControl margin='normal' required fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>姓名</FormLabel>
        <TextField
          placeholder='如何稱呼您'
          defaultValue={username}
          error={nameIsError}
          helperText={nameIsError && '請輸入姓名'}
          onChange={handleEnterName}
        />
      </FormControl>

      <FormControl>
        <RadioGroup row value={gender} onChange={handleChooseGender}>
          <FormControlLabel value={Gender.MALE} control={<Radio />} label={GENDER_TRANSLATE.MALE} />
          <FormControlLabel value={Gender.FEMALE} control={<Radio />} label={GENDER_TRANSLATE.FEMALE} />
        </RadioGroup>
      </FormControl>

      <FormControl margin='normal' required fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>手機號碼</FormLabel>
        <TextField
          placeholder='0987654321'
          type='tel'
          defaultValue={phone}
          error={phoneIsError}
          helperText={phoneIsError && '手機號碼格式錯誤'}
          onChange={handleEnterPhone}
        />
      </FormControl>

      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>電子信箱</FormLabel>
        <TextField
          placeholder='example@email.com'
          type='email'
          defaultValue={email}
          error={emailIsError}
          helperText={emailIsError && '電子信箱格式錯誤'}
          onChange={handleEnterEmail}
        />
      </FormControl>

      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>備註</FormLabel>
        <TextField
          placeholder='有任何特殊需求嗎？可以先寫在這裡喔（例如：行動不便、過敏...等）。'
          multiline
          rows={4}
          defaultValue={remark}
          onChange={handleEnterRemark}
        />
      </FormControl>

      <Box sx={{ padding: '0 .1rem', margin: '1rem 0' }}>
        <FormControlLabel
          control={<Checkbox sx={{ padding: 0 }} checked={isAgreedPrivacyPolicy} onChange={handleAgreedPolicy} />}
          label='確認我已閱讀並同意'
          sx={{ margin: 0 }}
        />
        <ButtonBase sx={{ textDecoration: 'underline', fontWeight: 700, fontSize: 'body1.fontSize' }} onClick={handleOpenPrivayPolicyDialog}>
          PointPro 隱私權政策
        </ButtonBase>
      </Box>
    </Box>
  );
};
