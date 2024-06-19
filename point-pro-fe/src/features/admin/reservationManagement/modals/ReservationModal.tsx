import { FC, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppButton, TabletModal } from '~/components';
import { GENDER_TRANSLATE, RESERVATION_PEOPLE_OPTIONS, appDayjs, emailRegex, formatDateOnly, formatTimeOnly, phoneRegex } from '~/utils';
import { AvailablePeriod, Gender, ReservationModalType } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices';

const { closeModal, getReservations, patchReservation, postReservation, setModalSelectedDate, getAvailablePeriods } =
  reservationManagementSliceActions;

const ModalTitle = {
  [ReservationModalType.CREATE]: '新增預約',
  [ReservationModalType.EDIT]: '編輯預約',
};

interface IReservationModalProps {}

export const ReservationModal: FC<IReservationModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.reservationManagement.reservationModal.isOpen);
  const modalType = useAppSelector((state) => state.reservationManagement.reservationModal.modalType);
  const data = useAppSelector((state) => state.reservationManagement.reservationModal.data);
  const modalSelectedDate = useAppSelector((state) => state.reservationManagement.reservationModal.modalSelectedDate);

  const availableTime = useAppSelector((state) => state.reservationManagement.availableTime);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const [nameIsError, setNameIsError] = useState(false);
  const [phoneIsError, setPhoneIsError] = useState(false);
  const [emailIsError, setEmailIsError] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [newData, setNewData] = useState(data);

  const availableDate = useMemo(() => availableTime.map((p) => formatDateOnly(p.startTime)), [availableTime]);

  const availablePeriods = useMemo(
    () => availableTime.filter((p) => appDayjs(p.startTime).isSame(modalSelectedDate, 'day')),
    [availableTime, modalSelectedDate],
  );

  const capacityLimit = useMemo(
    () => availableTime.find((i) => appDayjs(i.startTime).isSame(newData.selectedPeriod?.startTime))?.capacity ?? 0,
    [availableTime, newData.selectedPeriod],
  );

  const availablePeopleOptions = useMemo(() => {
    let allowPeople = 0;
    if (modalType === ReservationModalType.CREATE) {
      allowPeople = capacityLimit;
    }

    if (modalType === ReservationModalType.EDIT) {
      if (appDayjs(data.selectedPeriod?.startTime).isSame(newData.selectedPeriod?.startTime)) {
        allowPeople = capacityLimit + data.people;
      } else {
        allowPeople = capacityLimit;
      }
    }

    return allowPeople > 10 ? RESERVATION_PEOPLE_OPTIONS : Array.from({ length: allowPeople }, (_, i) => i + 1);
  }, [capacityLimit, data.people, data.selectedPeriod?.startTime, modalType, newData.selectedPeriod?.startTime]);

  const handleChangeDate = (date: appDayjs.Dayjs | null) => {
    if (date) {
      dispatch(setModalSelectedDate(date.toDate()));
    }
  };

  const handleChangePeriod = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    const availablePeriod = availablePeriods.find((p) => p.startTime === value) as AvailablePeriod;

    setNewData({
      ...newData,
      selectedPeriod: {
        id: availablePeriod.id,
        startTime: availablePeriod.startTime,
      },
    });
  };

  const handleChangePeople = (e: SelectChangeEvent<string>) => {
    const people = +e.target.value;
    setNewData({ ...newData, people });
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameIsError(false);
    const username = e.target.value;
    setNewData({ ...newData, username });
  };

  const handleChangeGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gender = e.target.value as Gender;
    setNewData({ ...newData, gender });
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneIsError(false);
    const phone = e.target.value;
    setNewData({ ...newData, phone });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailIsError(false);
    const email = e.target.value;
    setNewData({ ...newData, email });
  };

  const handleChangeRemark = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const remark = e.target.value;
    setNewData({ ...newData, remark });
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    const isNameValid = !!newData.username;
    const isPhoneValid = phoneRegex.test(newData.phone);
    const isEmailValid = !newData.email || emailRegex.test(newData.email);
    setNameIsError(!isNameValid);
    setPhoneIsError(!isPhoneValid);
    setEmailIsError(!isEmailValid);

    if (isNameValid && isPhoneValid && isEmailValid) {
      setIsRequestLoading(true);
      toast
        .promise(
          async () => {
            if (modalType === ReservationModalType.CREATE) {
              await dispatch(postReservation(newData)).unwrap();
            } else {
              await dispatch(patchReservation(newData)).unwrap();
            }
            dispatch(getReservations(dateFilter));
            dispatch(getAvailablePeriods());
            dispatch(closeModal());
          },
          modalType === ReservationModalType.CREATE
            ? {
                pending: '訂位中...',
                success: '訂位成功',
                error: '訂位失敗',
              }
            : {
                pending: '更新中...',
                success: '更新成功',
                error: '更新失敗',
              },
        )
        .finally(() => {
          setIsRequestLoading(false);
        });
    }
  };

  useEffect(() => {
    dispatch(getAvailablePeriods());
  }, [dispatch]);

  useEffect(() => {
    setNewData(data);
  }, [data]);

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: ModalTitle[modalType as ReservationModalType],
      }}
      cardContentProps={{
        sx: { height: 550, overflow: 'scroll' },
        children: (
          <>
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
                <Select size='small' value={`${newData.selectedPeriod?.startTime ?? ''}`} onChange={handleChangePeriod} displayEmpty>
                  <MenuItem disabled value=''>
                    請選擇
                  </MenuItem>
                  {availablePeriods.map((p) => (
                    <MenuItem
                      value={`${p.startTime}`}
                      key={p.id}
                      disabled={p.capacity <= 0 || p.capacity < newData.people || appDayjs(p.startTime).isBefore(appDayjs())}
                    >
                      {formatTimeOnly(p.startTime)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl margin='dense' required fullWidth>
                <FormLabel>人數</FormLabel>
                <Select size='small' value={`${newData.people}`} onChange={handleChangePeople}>
                  <MenuItem disabled value='0'>
                    請選擇
                  </MenuItem>
                  {availablePeopleOptions.map((p) => (
                    <MenuItem key={p} value={`${p}`}>
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
                  value={newData?.username ?? ''}
                  error={nameIsError}
                  helperText={nameIsError && '請輸入姓名'}
                  onChange={handleChangeUsername}
                />
              </FormControl>
              <FormControl margin='dense'>
                <RadioGroup row value={newData.gender} onChange={handleChangeGender}>
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
                value={newData?.phone ?? ''}
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
                value={newData?.email ?? ''}
                onChange={handleChangeEmail}
              />
            </FormControl>
            <FormControl margin='dense' fullWidth>
              <FormLabel>備註</FormLabel>
              <TextField
                multiline
                rows={4}
                size='small'
                value={newData?.remark ?? ''}
                placeholder='有任何特殊需求嗎？可以先寫在這裡喔（例如：行動不便、過敏...等）。'
                onChange={handleChangeRemark}
              />
            </FormControl>
          </>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirm} disabled={isRequestLoading}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
