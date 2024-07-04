import { ChangeEvent, FC, useState } from 'react';
import { toast } from 'react-toastify';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ISpecialtyItem } from '~/types';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';

const { closeCreateSpecialtyItemModal, getSpecialties, postSpecialtyItem } = menuManagementSliceActions;

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
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '新增項目',
      }}
      cardContentProps={{
        children: (
          <>
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
          </>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirmCreateSpecialty} disabled={isInvalid}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
