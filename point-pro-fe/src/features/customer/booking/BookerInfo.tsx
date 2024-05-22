import { FC, useState } from 'react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { BaseCheckbox, BaseButton } from '~/components';
import { CustomerBookingDialog, Gender } from '~/types';
import { emailRegex, genderObj, phoneRegex } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setPhone, setDialog, setName, setEmail, setRemark, setGender, setAgreedPolicy } from '~/store/slices';

interface IBookerInfoProps {}

export const BookerInfo: FC<IBookerInfoProps> = () => {
  const dispatch = useAppDispatch();

  const { name, gender, phone, email, remark } = useAppSelector(
    ({ customerReservation }) => customerReservation.reservationParams.user,
  );
  const isAgreedPrivacyPolicy = useAppSelector(({ customerReservation }) => customerReservation.isAgreedPrivacyPolicy);

  const [nameIsError, setNameIsError] = useState(false);
  const [phoneIsError, setPhoneIsError] = useState(false);
  const [emailIsError, setEmailIsError] = useState(false);

  const handleEnterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = !!e.target.value;
    setNameIsError(!isValidated);
    dispatch(setName(isValidated ? e.target.value : ''));
  };

  const handleChooseGender = (e: React.ChangeEvent<HTMLInputElement>, value: string): void => {
    dispatch(setGender(value as Gender));
  };

  const handleEnterPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = phoneRegex.test(e.target.value);
    setPhoneIsError(!isValidated);
    dispatch(setPhone(isValidated ? e.target.value : ''));
  };

  const handleEnterEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = emailRegex.test(e.target.value);
    setEmailIsError(!isValidated);
    dispatch(setEmail(isValidated ? e.target.value : ''));
  };

  const handleEnterRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setRemark(e.target.value));
  };

  const handleAgreedPolicy = () => {
    dispatch(setAgreedPolicy(!isAgreedPrivacyPolicy));
  };

  const handleOpenPrivayPolicyDialog = () => {
    dispatch(setDialog(CustomerBookingDialog.PRIVACY_POLICY));
  };

  return (
    <Box sx={{ pb: '10rem' }}>
      <FormControl margin='normal' required fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>姓名</FormLabel>
        <TextField
          placeholder='如何稱呼您'
          defaultValue={name}
          error={nameIsError}
          helperText={nameIsError && '請輸入姓名'}
          onChange={handleEnterName}
        />
      </FormControl>

      <FormControl>
        <RadioGroup row value={gender} onChange={handleChooseGender}>
          <FormControlLabel value={Gender.MALE} control={<Radio />} label={genderObj.MALE} />
          <FormControlLabel value={Gender.FEMALE} control={<Radio />} label={genderObj.FEMALE} />
          <FormControlLabel value={Gender.OTHER} control={<Radio />} label={genderObj.OTHER} />
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

      <FormControl margin='normal' required fullWidth>
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

      <Box sx={{ padding: '0 .1rem' }}>
        <FormControlLabel
          control={<BaseCheckbox checked={isAgreedPrivacyPolicy} onChange={handleAgreedPolicy} />}
          label='確認我已閱讀並同意'
          sx={{ margin: 0 }}
        />
        <BaseButton
          sx={{ textDecoration: 'underline', fontWeight: 700, fontSize: 'body1.fontSize' }}
          onClick={handleOpenPrivayPolicyDialog}
        >
          PointPro 隱私權政策
        </BaseButton>
      </Box>
    </Box>
  );
};
