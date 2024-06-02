import { ChangeEvent, FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateSpecialtyItemModal, getSpecialties, postSpecialtyItem } from '~/store/slices';
import { theme } from '~/theme';
import { ISpecialtyItem } from '~/types';

interface ICreateSpecialtyItemModalProps {}

export const CreateSpecialtyItemModal: FC<ICreateSpecialtyItemModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.menuSetting.createSpecialtyItemModal.isOpen);
  const data = useAppSelector((state) => state.menuSetting.createSpecialtyItemModal.data);

  const [title, setTitle] = useState<ISpecialtyItem['title']>('');
  const [price, setPrice] = useState<ISpecialtyItem['price']>(0);

  const hasSameSpecialtyExist = !!data && data.specialtyItems.some((si) => si.title === title);
  const isIncompleteInfo = !title || isNaN(price);
  const isInvalid = !data || hasSameSpecialtyExist || isIncompleteInfo;

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);

    if (!/[\d]/.test(`${newPrice}`)) return;

    setPrice((prevPrice) => (newPrice < 0 ? prevPrice : newPrice));
  };

  const handleCancel = () => {
    setTitle('');
    setPrice(0);
    dispatch(closeCreateSpecialtyItemModal());
  };

  const handleConfirmCreateSpecialty = () => {
    if (isInvalid) return;

    dispatch(
      postSpecialtyItem({
        specialtyId: data.id,
        title,
        price,
        position: data.specialtyItems.length,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(getSpecialties());
        handleCancel();
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='新增項目' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>名稱</FormLabel>
            <TextField
              autoFocus
              size='small'
              value={title}
              error={hasSameSpecialtyExist}
              helperText={hasSameSpecialtyExist && '已有相同的項目'}
              onChange={handleChangeTitle}
            />
          </FormControl>
          <FormControl margin='dense' required fullWidth>
            <FormLabel>價格</FormLabel>
            <TextField type='number' size='small' value={price.toString()} onChange={handleChangePrice} />
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
