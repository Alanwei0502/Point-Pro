import { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppButton, TabletModalLayout } from '~/components';
import { theme } from '~/theme';
import { GENDER_TRANSLATE, RESERVATION_PEOPLE_OPTIONS, appDayjs, emailRegex, formatDateOnly, formatTimeOnly, phoneRegex } from '~/utils';
import { AvailablePeriod, Gender } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ReservationModalType, reservationManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';

const { closeModal, setModalData, getReservations, patchReservation, postReservation, deleteReservation, setModalSelectedDate, getAvailablePeriods } =
  reservationManagementSliceActions;

const ModalTitle = {
  [ReservationModalType.CREATE]: '新增預約',
  [ReservationModalType.EDIT]: '編輯預約',
  [ReservationModalType.DELETE]: '刪除預約',
};

interface IReservationModalProps {}

export const ReservationModal: FC<IReservationModalProps> = () => {
  const dispatch = useAppDispatch();

  const [nameIsError, setNameIsError] = useState(false);
  const [phoneIsError, setPhoneIsError] = useState(false);
  const [emailIsError, setEmailIsError] = useState(false);

  const { isOpen, type, data, modalSelectedDate } = useAppSelector((state) => state.reservationManagement.reservationModal);
  const availableTime = useAppSelector((state) => state.reservationManagement.availableTime);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const availableDate = useMemo(() => availableTime.map((p) => formatDateOnly(p.startTime)), [availableTime]);

  const availablePeriods = useMemo(
    () => availableTime.filter((p) => appDayjs(p.startTime).isSame(modalSelectedDate, 'day')),
    [availableTime, modalSelectedDate],
  );

  const capacityLimit = useMemo(
    () => availableTime.find((i) => appDayjs(i.startTime).isSame(data.selectedPeriod?.startTime))?.capacity ?? 0,
    [availableTime, data.selectedPeriod],
  );

  const isPeopleDisabled = (option: number) => {
    switch (type) {
      case ReservationModalType.CREATE: {
        return option > capacityLimit;
      }
      case ReservationModalType.EDIT: {
        return option > capacityLimit + data.people;
      }
    }
  };

  const handleChangeDate = (date: appDayjs.Dayjs | null) => {
    if (date) {
      dispatch(setModalSelectedDate(date.toDate()));
    }
  };

  const handleChangePeriod = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    const availablePeriod = availablePeriods.find((p) => p.startTime === value) as AvailablePeriod;

    dispatch(
      setModalData({
        ...data,
        selectedPeriod: {
          id: availablePeriod.id,
          startTime: availablePeriod.startTime,
        },
      }),
    );
  };

  const handleChangePeople = (e: SelectChangeEvent<string>) => {
    const people = +e.target.value;
    dispatch(setModalData({ ...data, people }));
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameIsError(false);
    const username = e.target.value;
    dispatch(setModalData({ ...data, username }));
  };

  const handleChangeGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gender = e.target.value as Gender;
    dispatch(setModalData({ ...data, gender }));
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneIsError(false);
    const phone = e.target.value;
    dispatch(setModalData({ ...data, phone }));
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailIsError(false);
    const email = e.target.value;
    dispatch(setModalData({ ...data, email }));
  };

  const handleChangeRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const remark = e.target.value;
    dispatch(setModalData({ ...data, remark }));
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    const isNameValid = !!data.username;
    const isPhoneValid = phoneRegex.test(data.phone);
    const isEmailValid = !data.email || emailRegex.test(data.email);
    if (isNameValid && isPhoneValid && isEmailValid) {
      switch (type) {
        case ReservationModalType.CREATE: {
          toast.promise(
            async () => {
              await dispatch(postReservation()).unwrap();
              dispatch(getReservations(dateFilter));
              dispatch(getAvailablePeriods());
              dispatch(closeModal());
            },
            {
              pending: '訂位中...',
              success: '訂位成功',
              error: '訂位失敗',
            },
          );
          break;
        }
        case ReservationModalType.EDIT: {
          toast.promise(
            async () => {
              await dispatch(patchReservation()).unwrap();
              dispatch(getReservations(dateFilter));
              dispatch(getAvailablePeriods());
              dispatch(closeModal());
            },
            {
              pending: '更新中...',
              success: '更新成功',
              error: '更新失敗',
            },
          );
          break;
        }
        case ReservationModalType.DELETE: {
          toast.promise(
            async () => {
              await dispatch(deleteReservation()).unwrap();
              dispatch(getReservations(dateFilter));
              dispatch(getAvailablePeriods());
              dispatch(closeModal());
            },
            {
              pending: '刪除中...',
              success: '刪除成功',
              error: '刪除失敗',
            },
          );
          break;
        }
      }
    }
    setNameIsError(!isNameValid);
    setPhoneIsError(!isPhoneValid);
    setEmailIsError(!isEmailValid);
  };

  useEffect(() => {
    dispatch(getAvailablePeriods());
  }, [dispatch]);

  console.log({ capacityLimit });

  return isOpen ? (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title={ModalTitle[type as ReservationModalType]} sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        {type === ReservationModalType.DELETE ? (
          <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
            <Typography textAlign='center'>
              確定要刪除「{data.username} {GENDER_TRANSLATE[data.gender]}」的預約？
            </Typography>
          </CardContent>
        ) : (
          <CardContent sx={{ padding: '1rem', width: '50cqw', height: 550, overflow: 'scroll' }}>
            <FormControl margin='dense' required fullWidth>
              <FormLabel>日期</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  value={appDayjs(modalSelectedDate)}
                  format='YYYY年MM月DD日 (星期dd)'
                  views={['day']}
                  onChange={handleChangeDate}
                  disablePast
                  shouldDisableDate={(day) => !availableDate.includes(formatDateOnly(day))}
                  sx={{
                    '&.MuiFormControl-root': {
                      width: '100%',
                    },
                    '& .MuiInputBase-input': {
                      padding: '.5rem',
                    },
                  }}
                />
              </LocalizationProvider>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl margin='dense' required fullWidth>
                <FormLabel>時段</FormLabel>
                <Select size='small' value={`${data.selectedPeriod?.startTime ?? ''}`} onChange={handleChangePeriod} displayEmpty>
                  <MenuItem disabled value=''>
                    請選擇
                  </MenuItem>
                  {availablePeriods.map((p) => (
                    <MenuItem value={`${p.startTime}`} key={p.id} disabled={p.capacity === 0 || appDayjs(p.startTime).isBefore(appDayjs())}>
                      {formatTimeOnly(p.startTime)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl margin='dense' required fullWidth>
                <FormLabel>人數</FormLabel>

                <Select size='small' value={`${data.people}`} onChange={handleChangePeople}>
                  <MenuItem disabled value={'0'}>
                    請選擇
                  </MenuItem>
                  {RESERVATION_PEOPLE_OPTIONS.map((p) => (
                    <MenuItem key={p} value={`${p}`} disabled={isPeopleDisabled(p)}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              <FormControl margin='dense' required sx={{ flexGrow: 2 }}>
                <FormLabel>姓名</FormLabel>
                <TextField
                  size='small'
                  defaultValue={data.username}
                  error={nameIsError}
                  helperText={nameIsError && '請輸入姓名'}
                  onChange={handleChangeUsername}
                />
              </FormControl>
              <FormControl margin='dense'>
                <RadioGroup row value={data.gender} onChange={handleChangeGender}>
                  <FormControlLabel value={Gender.MALE} control={<Radio size='small' />} label={GENDER_TRANSLATE.MALE} />
                  <FormControlLabel value={Gender.FEMALE} control={<Radio size='small' />} label={GENDER_TRANSLATE.FEMALE} />
                </RadioGroup>
              </FormControl>
            </Box>
            <FormControl margin='dense' required fullWidth>
              <FormLabel>電話</FormLabel>
              <TextField
                type='tel'
                size='small'
                placeholder='0987654321'
                error={phoneIsError}
                helperText={phoneIsError && '手機號碼格式錯誤'}
                defaultValue={data.phone}
                onChange={handleChangePhone}
              />
            </FormControl>
            <FormControl margin='dense' fullWidth>
              <FormLabel>信箱</FormLabel>
              <TextField
                type='email'
                size='small'
                error={emailIsError}
                helperText={emailIsError && '電子信箱格式錯誤'}
                placeholder='example@email.com'
                defaultValue={data.email}
                onChange={handleChangeEmail}
              />
            </FormControl>
            <FormControl margin='dense' fullWidth>
              <FormLabel>備註</FormLabel>
              <TextField
                multiline
                rows={4}
                size='small'
                defaultValue={data.remark}
                placeholder='有任何特殊需求嗎？可以先寫在這裡喔（例如：行動不便、過敏...等）。'
                onChange={handleChangeRemark}
              />
            </FormControl>
          </CardContent>
        )}
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleConfirm} disabled={false}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  ) : null;
};
