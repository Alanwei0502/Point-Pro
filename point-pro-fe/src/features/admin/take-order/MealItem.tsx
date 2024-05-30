import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { openDialog, setNotModifiedCartItem } from '~/store/slices';
import { theme } from '~/theme';
import { IMeal, MobileDialog } from '~/types';

interface MealItemProps {
  meal: IMeal;
}

export const MealItem: FC<MealItemProps> = (props) => {
  const dispatch = useAppDispatch();

  const { meal } = props;

  const isModifiedCartItem = useAppSelector(({ takeOrder }) => takeOrder.isModifiedCartItem);
  const customized = useAppSelector(({ takeOrder }) => takeOrder.customized);
  const isSelected = meal.id === customized?.id && !isModifiedCartItem;

  const handleSelectedMeal = () => {
    dispatch(openDialog({ type: MobileDialog.CUSTOMIZED, data: { ...meal, amount: 1, specialties: [] } }));
    dispatch(setNotModifiedCartItem());
  };

  return (
    <Box
      key={meal.id}
      sx={{
        backgroundColor: isSelected ? 'primary.main' : 'transparent',
        boxShadow: `${theme.palette.common.black_40} 0px 1px 4px`,
        border: `1px solid ${theme.palette.common.black_20}`,
      }}
      onClick={handleSelectedMeal}
    >
      <Typography fontWeight={600} textAlign='center' sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', padding: '.3rem' }}>
        {meal.title}
      </Typography>
      <Box height='6rem' sx={{ bgcolor: theme.palette.common.black, textAlign: 'center' }}>
        <Box
          component='img'
          src={`https://i.imgur.com/${meal.imageId}b.jpg`}
          alt={meal.title}
          sx={{ objectFit: 'fill', height: '100%', maxWidth: '100%' }}
        />
      </Box>
      <Typography textAlign='center'>{meal.price}元</Typography>
      <Row justifyContent='space-between' alignItems='center'></Row>
    </Box>
  );
};
