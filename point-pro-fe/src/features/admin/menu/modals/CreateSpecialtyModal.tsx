import { ChangeEvent, FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateSpecialtyModal, getSpecialties, postSpecialty } from '~/store/slices';
import { theme } from '~/theme';
import { ISpecialty, SelectionType } from '~/types';
import { selectionTypeObj } from '~/utils';

interface ICreateSpecialtyModalProps {}

export const CreateSpecialtyModal: FC<ICreateSpecialtyModalProps> = () => {
  const dispatch = useAppDispatch();

  const specialties = useAppSelector((state) => state.menu.specialties);
  const isOpen = useAppSelector((state) => state.menu.createSpecialtyModal.isOpen);

  const [title, setTitle] = useState<ISpecialty['title']>('');
  const [selectionType, setSelectionType] = useState<ISpecialty['selectionType']>(SelectionType.SINGLE);

  const hasSameSpecialtyExist = specialties.some((s) => s.title === title);
  const isIncompleteInfo = !title || !selectionType;
  const isInvalid = isIncompleteInfo || hasSameSpecialtyExist;

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

    dispatch(
      postSpecialty({
        title,
        selectionType,
        position: specialties.length,
      }),
    ).then(() => {
      dispatch(getSpecialties());
      handleCancel();
    });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增種類' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>種類名稱</FormLabel>
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
              {Object.entries(selectionTypeObj).map((item) => (
                <MenuItem key={item[0]} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleConfirmCreateSpecialty} disabled={isInvalid}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
