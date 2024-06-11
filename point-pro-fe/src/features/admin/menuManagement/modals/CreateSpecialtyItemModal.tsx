import { ChangeEvent, FC, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeCreateSpecialtyItemModal, getSpecialties, postSpecialtyItem } from '~/store/slices';
import { theme } from '~/theme';
import { ISpecialtyItem } from '~/types';

interface ICreateSpecialtyItemModalProps {}

export const CreateSpecialtyItemModal: FC<ICreateSpecialtyItemModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.menuManagement.createSpecialtyItemModal.isOpen);
  const data = useAppSelector((state) => state.menuManagement.createSpecialtyItemModal.data);

  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [title, setTitle] = useState<ISpecialtyItem['title']>('');
  const [price, setPrice] = useState<ISpecialtyItem['price']>(0);

  const hasSameSpecialtyExist = !!data && data.specialtyItems.some((si) => si.title === title);
  const isIncompleteInfo = !title || isNaN(price);
  const isInvalid = !data || hasSameSpecialtyExist || isIncompleteInfo || isCreateLoading;

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

    setIsCreateLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            postSpecialtyItem({
              specialtyId: data.id,
              title,
              price,
              position: data.specialtyItems.length,
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
        setIsCreateLoading(false);
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
