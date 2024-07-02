import { FC, Fragment } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { MobileDialogLayout, NumberInput, AppButton } from '~/components';
import { calculateCartItemPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, updateSpecialty, increaseMealAmount, decreaseMealAmount, createCartItem, updateCartItem } from '~/store/slices';
import { MobileDialog, MenuSpecialtiesWithItems, MenuSpecialtyItem } from '~/types';

interface ICustomizedSpecialtiesProps {}

const CustomizedSpecialties: FC<ICustomizedSpecialtiesProps> = () => {
  const dispatch = useAppDispatch();
  const specialtiesWithItems = useAppSelector((state) => state.menu.specialtiesWithItems);
  const customizedDialogData = useAppSelector((state) => state.menu.dialog.data);

  const mealSpecialtyItemIds = customizedDialogData?.mealSpecialtyItems.map((s) => s.specialtyItemId) ?? [];

  const customizedSpecialties = specialtiesWithItems
    .map((s) => ({ ...s, specialtyItems: s.specialtyItems.filter((si) => mealSpecialtyItemIds.includes(si.id)) }))
    .filter((s) => s.specialtyItems.length > 0);

  const handleClickItem = (selectedSpecialty: MenuSpecialtiesWithItems, selectedItem: MenuSpecialtyItem) => () => {
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
                        <Checkbox sx={{ padding: 0 }} checked={!!customizedDialogData?.selectedSpecialtyItems.find(({ id }) => id === item.id)} />
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
          無客製化選項
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
          <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' sx={{ userSelect: 'none' }}>
            <NumberInput value={customizedDialogData.amount} onAdd={handleAdd} onMinus={handleMinus} />
            <Typography variant='h5' fontWeight={900}>
              {calculateCartItemPrice(customizedDialogData)}元
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' justifyContent='space-between' width='100%' gap={1}>
            <AppButton fullWidth onClick={handleClose}>
              返回
            </AppButton>
            {isModifiedCartItem ? (
              <AppButton fullWidth onClick={handleUpdateCartItem}>
                確認
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
