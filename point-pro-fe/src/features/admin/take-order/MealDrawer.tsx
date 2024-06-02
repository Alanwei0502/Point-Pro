import { FC, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BaseButton, CloseButton, NumberInput } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { takeOrderSlice } from '~/store/slices';
import { theme } from '~/theme';
import { GetMenuResponseSpecialtyItem, ISpecialty, SelectionType } from '~/types';

interface IMealDrawerProps {}

export const MealDrawer: FC<IMealDrawerProps> = () => {
  const dispatch = useAppDispatch();

  const { increaseMealAmount, decreaseMealAmount, setUnselectMeal, setSelectSpecialtyItems, addCartItem, updateCartItem } = takeOrderSlice.actions;
  const selectMeal = useAppSelector((state) => state.takeOrder.selectMeal);
  const selectSpecialtyItems = useAppSelector((state) => state.takeOrder.selectSpecialtyItems);
  const specialtiesWithItems = useAppSelector((state) => state.takeOrder.specialtiesWithItems);
  const editingCartItem = useAppSelector((state) => state.takeOrder.editingCartItem);
  const isEditing = editingCartItem !== -1;

  const selectMealSpecialtyItemsId = useMemo(() => selectMeal?.mealSpecialtyItems.map((msi) => msi.specialtyItemId) ?? [], [selectMeal]);

  const customizedSpecialties = useMemo(
    () =>
      specialtiesWithItems
        .map((s) => ({
          ...s,
          specialtyItems: s.specialtyItems
            .map((si) => ({ ...si, specialtyId: s.id }))
            .filter((si) => selectMealSpecialtyItemsId.some((msi) => msi === si.id)),
        }))
        .filter((s) => s.specialtyItems.length > 0),
    [specialtiesWithItems, selectMealSpecialtyItemsId],
  );

  const handleClickItem = (selectedSpecialtyId: ISpecialty['id'], selectionType: SelectionType, selectedItem: GetMenuResponseSpecialtyItem) => () => {
    dispatch(setSelectSpecialtyItems({ selectedSpecialtyId, selectionType, selectedItem: { ...selectedItem, specialtyId: selectedSpecialtyId } }));
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
  };

  const handleAddToCart = () => {
    dispatch(addCartItem());
  };

  const handleClose = () => {
    dispatch(setUnselectMeal());
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        transition: 'transform 0.3s',
        transform: `translateY(${selectMeal ? 0 : '100%'})`,
        width: '66.6vw',
      }}
    >
      {selectMeal && (
        <Box
          bgcolor='white'
          sx={{
            boxShadow: `${theme.palette.common.black_40} 0px 1px 4px`,
            position: 'relative',
            padding: '.5rem',
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 900, color: 'common.black' }}>{selectMeal.title}</Typography>
          <CloseButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '.5rem',
              minWidth: 0,
            }}
          />
          <Box>
            {customizedSpecialties.length
              ? customizedSpecialties.map((s) => (
                  <Box key={s.id}>
                    <Typography key={s.id} sx={{ fontWeight: 900, padding: '1rem 0 1rem', color: theme.palette.common.black_80 }}>
                      {s.title}
                    </Typography>
                    <Box
                      sx={{
                        padding: 0,
                        margin: 0,
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: '.5rem',
                      }}
                    >
                      {s.specialtyItems.map((si) => (
                        <Chip
                          key={si.id}
                          label={si.title}
                          color='primary'
                          variant={selectSpecialtyItems.some(({ id }) => id === si.id) ? 'filled' : 'outlined'}
                          onClick={handleClickItem(s.id, s.selectionType, si)}
                          sx={{
                            color: theme.palette.common.black,
                            fontSize: theme.typography.body1.fontSize,
                            '&:hover': {
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))
              : null}
          </Box>
          <Box sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'end' }}>
            <NumberInput value={selectMeal.amount} onAdd={handleAdd} onMinus={handleMinus} />
            <BaseButton
              sx={{
                backgroundColor: 'common.black',
                color: 'white',
                padding: '.5rem 1rem',
                marginLeft: '1.5rem',
                '&:hover': {
                  backgroundColor: 'common.black_80',
                  color: 'common.black_20',
                },
              }}
              onClick={isEditing ? handleUpdateCartItem : handleAddToCart}
              startIcon={isEditing ? <DoneIcon /> : <ShoppingCartIcon />}
            >
              <Typography variant='body1' fontWeight={700}>
                {isEditing ? '確認修改' : '加入購物車'}
              </Typography>
            </BaseButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};
