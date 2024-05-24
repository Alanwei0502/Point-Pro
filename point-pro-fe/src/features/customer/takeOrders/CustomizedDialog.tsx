import { FC, Fragment } from 'react';
import { Box, Button, Divider, List, ListItemButton, ListSubheader, Typography } from '@mui/material';
import { BaseCheckbox, MobileDialogLayout, NumberInput } from '~/components';
import { calculateCartItemPrice, getToken } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  closeDialog,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  createCartItem,
  updateCartItem,
} from '~/store/slices';
import { MobileDialog, GetMenuResponseSpecialtiesWithItems, GetMenuResponseSpecialtyItem } from '~/types';

interface ICustomizedSpecialtiesProps {}

const CustomizedSpecialties: FC<ICustomizedSpecialtiesProps> = () => {
  const dispatch = useAppDispatch();
  const token = getToken();
  const specialtiesWithItems = useAppSelector(({ takeOrder }) => takeOrder.specialtiesWithItems);
  const customizedDialogData = useAppSelector(({ takeOrder }) => takeOrder.dialog.data);

  const mealSpecialtyItemIds = customizedDialogData?.mealSpecialtyItems.map((s) => s.specialtyItemId) ?? [];

  const customizedSpecialties = specialtiesWithItems
    .map((s) => ({ ...s, specialtyItems: s.specialtyItems.filter((si) => mealSpecialtyItemIds.includes(si.id)) }))
    .filter((s) => s.specialtyItems.length > 0);

  const handleClickItem =
    (selectedSpecialty: GetMenuResponseSpecialtiesWithItems, selectedItem: GetMenuResponseSpecialtyItem) => () => {
      // TODO: recover token
      // if (!token) return;
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>{item.title}</Typography>
                        {/* TODO: recover token */}
                        {!token && (
                          <BaseCheckbox
                            checked={!!customizedDialogData?.selectedSpecialtyItems.find(({ id }) => id === item.id)}
                          />
                        )}
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

  const token = getToken();
  const { type: dialogType, data: customizedDialogData } = useAppSelector(({ takeOrder }) => takeOrder.dialog);
  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);

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
      onCloseDialog={handleClose}
      actionButton={
        // TODO: recover token
        // <>
        //   {token && (
        //     <>
        //       <Box
        //         sx={{
        //           display: 'flex',
        //           justifyContent: 'space-between',
        //           alignItems: 'center',
        //           width: '100%',
        //           userSelect: 'none',
        //         }}
        //       >
        //         <NumberInput value={customizedDialogData.amount} onAdd={handleAdd} onMinus={handleMinus} />
        //         <Typography variant='h5' fontWeight={900}>
        //           {customizedDialogData.id ? calculateCartItemPrice(customizedDialogData) : 0}元
        //         </Typography>
        //       </Box>
        //       {isModifiedCartItem ? (
        //         <Button onClick={handleUpdateCartItem}>確認修改</Button>
        //       ) : (
        //         <Button onClick={handleAddToCart}>加入購物車</Button>
        //       )}
        //     </>
        //   )}
        // </>
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
          {isModifiedCartItem ? (
            <Button onClick={handleUpdateCartItem}>確認修改</Button>
          ) : (
            <Button onClick={handleAddToCart}>加入購物車</Button>
          )}
        </>
      }
    >
      <CustomizedSpecialties />
    </MobileDialogLayout>
  );
};
