import { ChangeEvent, FC, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateSpecialtyModal, getSpecialties, postSpecialty } from '~/store/slices';
import { theme } from '~/theme';
import { ISpecialty, SelectionType } from '~/types';
import { SELECTION_TYPE_TRANSLATE } from '~/utils';

interface ICreateSpecialtyModalProps {}

export const CreateSpecialtyModal: FC<ICreateSpecialtyModalProps> = () => {
  const dispatch = useAppDispatch();

  const specialties = useAppSelector((state) => state.menuManagement.specialties);
  const isOpen = useAppSelector((state) => state.menuManagement.createSpecialtyModal.isOpen);

  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [title, setTitle] = useState<ISpecialty['title']>('');
  const [selectionType, setSelectionType] = useState<ISpecialty['selectionType']>(SelectionType.SINGLE);

  const hasSameSpecialtyExist = specialties.some((s) => s.title === title);
  const isIncompleteInfo = !title || !selectionType;
  const isInvalid = isIncompleteInfo || hasSameSpecialtyExist || isCreateLoading;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeSelectionType = (e: SelectChangeEvent) => {
    setSelectionType(e.target.value as SelectionType);
  };

  const handleCancel = () => {
    setTitle('');
    setSelectionType(SelectionType.SINGLE);
    dispatch(closeCreateSpecialtyModal());
  };

  const handleConfirmCreateSpecialty = () => {
    if (isInvalid) return;

    setIsCreateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            postSpecialty({
              title,
              selectionType,
              position: specialties.length,
            }),
          ).unwrap();
          await dispatch(getSpecialties());
        },
        {
          pending: '新增中...',
          success: '新增成功',
          error: '新增失敗',
        },
      )
      .finally(() => {
        handleCancel();
        setIsCreateLoading(false);
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增種類' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>名稱</FormLabel>
            <TextField
              autoFocus
              size='small'
              value={title}
              error={hasSameSpecialtyExist}
              helperText={hasSameSpecialtyExist && '已有相同的種類'}
              onChange={handleChangeTitle}
            />
          </FormControl>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>選擇方式</FormLabel>
            <Select size='small' value={selectionType} onChange={handleChangeSelectionType}>
              {Object.entries(SELECTION_TYPE_TRANSLATE).map((item) => (
                <MenuItem key={item[0]} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleConfirmCreateSpecialty} disabled={isInvalid}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
