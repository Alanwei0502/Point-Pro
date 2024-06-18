import { FC, Fragment } from 'react';
import { Box, Divider, List, ListItemButton, ListSubheader, Typography } from '@mui/material';
import { BaseCheckbox, MobileDialogLayout, NumberInput, AppButton } from '~/components';
import { calculateCartItemPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, updateSpecialty, increaseMealAmount, decreaseMealAmount, createCartItem, updateCartItem } from '~/store/slices';
import { MobileDialog, GetMenuResponseSpecialtiesWithItems, GetMenuResponseSpecialtyItem } from '~/types';

interface ICustomizedSpecialtiesProps {}

const CustomizedSpecialties: FC<ICustomizedSpecialtiesProps> = () => {
  const dispatch = useAppDispatch();
  const specialtiesWithItems = useAppSelector((state) => state.menu.specialtiesWithItems);
  const customizedDialogData = useAppSelector((state) => state.menu.dialog.data);

  const mealSpecialtyItemIds = customizedDialogData?.mealSpecialtyItems.map((s) => s.specialtyItemId) ?? [];

  const customizedSpecialties = specialtiesWithItems
    .map((s) => ({ ...s, specialtyItems: s.specialtyItems.filter((si) => mealSpecialtyItemIds.includes(si.id)) }))
    .filter((s) => s.specialtyItems.length > 0);

  const handleClickItem = (selectedSpecialty: GetMenuResponseSpecialtiesWithItems, selectedItem: GetMenuResponseSpecialtyItem) => () => {
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  return (
    <>
      {customizedSpecialties.length ? (
        <List subheader={<li />} sx={{ '& ul': { padding: 0 }, userSelect: 'none' }}>
          {customizedSpecialties.map((specialty) => (
            <li key={specialty.id}>
              <ul>
                <ListSubheader sx={{ padding: '1rem 0', color: 'common.black' }} disableSticky>
                  <Typography variant='h6' fontWeight={900}>
                    {specialty.title}
                  </Typography>
                </ListSubheader>
                {specialty.specialtyItems.map((item) => (
                  <Fragment key={item.id}>
                    <ListItemButton onClick={handleClickItem(specialty, item)}>
                      <Box display='flex' justifyContent='space-between' width='100%' py={1}>
                        <Typography>{item.title}</Typography>
                        <BaseCheckbox checked={!!customizedDialogData?.selectedSpecialtyItems.find(({ id }) => id === item.id)} />
                      </Box>
                    </ListItemButton>
                    <Divider light />
                  </Fragment>
                ))}
              </ul>
            </li>
          ))}
        </List>
      ) : (
        <Typography
          sx={{
            textAlign: 'center',
            margin: 'auto',
            color: 'text.disabled',
            userSelect: 'none',
          }}
        >
          此餐點無客製化選項
        </Typography>
      )}
    </>
  );
};

interface ICustomizedDialogProps {}

export const CustomizedDialog: FC<ICustomizedDialogProps> = () => {
  const dispatch = useAppDispatch();

  const { type: dialogType, data: customizedDialogData } = useAppSelector((state) => state.menu.dialog);
  const isModifiedCartItem = useAppSelector((state) => state.menu.isModifiedCartItem);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleAddToCart = () => {
    dispatch(createCartItem());
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
  };

  if (!customizedDialogData) return null;

  return (
    <MobileDialogLayout
      title={customizedDialogData.title}
      isOpen={dialogType === MobileDialog.CUSTOMIZED}
      actionButton={
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              userSelect: 'none',
            }}
          >
            <NumberInput value={customizedDialogData.amount} onAdd={handleAdd} onMinus={handleMinus} />
            <Typography variant='h5' fontWeight={900}>
              {customizedDialogData.id ? calculateCartItemPrice(customizedDialogData) : 0}元
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' justifyContent='space-between' width='100%' gap={1}>
            <AppButton fullWidth onClick={handleClose}>
              返回點餐
            </AppButton>
            {isModifiedCartItem ? (
              <AppButton fullWidth onClick={handleUpdateCartItem}>
                確認修改
              </AppButton>
            ) : (
              <AppButton fullWidth onClick={handleAddToCart}>
                加入購物車
              </AppButton>
            )}
          </Box>
        </>
      }
    >
      <CustomizedSpecialties />
    </MobileDialogLayout>
  );
};
