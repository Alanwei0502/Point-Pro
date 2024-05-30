import { FC } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { DomainVerification } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BaseButton, CloseButton, NumberInput } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, createCartItem, decreaseMealAmount, increaseMealAmount, updateCartItem, updateSpecialty } from '~/store/slices';
import { theme } from '~/theme';
import { ISpecialty, ISpecialtyItem } from '~/types';

interface IMealDrawerProps {}

export const MealDrawer: FC<IMealDrawerProps> = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);
  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);

  const customizedSpecialties = meals?.find((meal) => meal.id === customized?.id)?.specialties ?? [];

  const items = customized?.specialties?.reduce((acc, cur) => acc.concat(cur.items), [] as ISpecialtyItem[]);

  const handleClickItem = (selectedSpecialty: ISpecialty, selectedItem: ISpecialtyItem) => () => {
    dispatch(updateSpecialty({ selectedSpecialty, selectedItem }));
  };

  const handleAdd = () => {
    dispatch(increaseMealAmount());
  };

  const handleMinus = () => {
    dispatch(decreaseMealAmount());
  };

  const handleUpdateCartItem = () => {
    dispatch(updateCartItem());
    dispatch(closeDialog());
  };

  const handleAddToCart = () => {
    dispatch(createCartItem());
  };

  const handleClose = () => {
    dispatch(closeDialog());
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        transition: 'transform 0.3s',
        transform: customized ? 'translateY(0)' : 'translateY(100%)',
        width: '66.6vw',
      }}
    >
      <Box
        bgcolor='white'
        sx={{
          borderTop: `1px solid ${theme.palette.common.black_40}`,
          position: 'relative',
          padding: '.5rem',
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 900, color: 'common.black' }}>
          {customized?.title}
        </Typography>
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
            ? customizedSpecialties.map((specialty) => (
                <Box key={specialty.id}>
                  <Typography variant='h6' key={specialty.id} sx={{ fontWeight: 900, padding: '1rem 0 1rem', color: theme.palette.common.black_80 }}>
                    {specialty.title}
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
                    {specialty.items.map((item) => (
                      <Chip
                        key={item.id}
                        label={item.title}
                        color='primary'
                        variant={items?.find(({ id }) => id === item.id) ? 'filled' : 'outlined'}
                        icon={
                          <DomainVerification
                            sx={{
                              display: items?.find(({ id }) => id === item.id) ? 'block' : 'none',
                              fontSize: theme.typography.body1.fontSize,
                            }}
                          />
                        }
                        onClick={handleClickItem(specialty, item)}
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
        {customized && (
          <Box sx={{ marginTop: '1rem', display: 'flex', justifyContent: 'end' }}>
            <NumberInput value={customized.amount} onAdd={handleAdd} onMinus={handleMinus} />
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
              onClick={isModifiedCartItem ? handleUpdateCartItem : handleAddToCart}
              startIcon={isModifiedCartItem ? <DoneIcon /> : <ShoppingCartIcon />}
            >
              <Typography variant='body1' fontWeight={700}>
                {isModifiedCartItem ? '確認修改' : '加入購物車'}
              </Typography>
            </BaseButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};
