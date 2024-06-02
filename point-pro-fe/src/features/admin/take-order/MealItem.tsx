import { Box, Typography } from '@mui/material';
import { FC, SyntheticEvent } from 'react';
import { Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { openDialog, setNotModifiedCartItem, takeOrderSlice } from '~/store/slices';
import { theme } from '~/theme';
import { GetMenuResponseMeal, MobileDialog } from '~/types';
import { MEAL_IMAGE_URL } from '~/utils';

interface MealItemProps {
  meal: GetMenuResponseMeal;
}

export const MealItem: FC<MealItemProps> = (props) => {
  const dispatch = useAppDispatch();

  const { meal } = props;

  const { setUnselectMeal, setSelectMeal, setNotModifiedCartItem } = takeOrderSlice.actions;

  const editingCartItem = useAppSelector((state) => state.takeOrder.editingCartItem);
  const selectMeal = useAppSelector((state) => state.takeOrder.selectMeal);
  const isEdit = editingCartItem !== -1;
  const isSelected = meal.id === selectMeal?.id && !isEdit;

  const clickMealHandler = () => {
    if (isSelected) {
      dispatch(setUnselectMeal());
    } else {
      dispatch(setSelectMeal({ ...meal, amount: 1 }));
    }
    dispatch(setNotModifiedCartItem());
  };

  return (
    <Box
      key={meal.id}
      sx={{
        backgroundColor: isSelected ? 'primary.main' : 'transparent',
        boxShadow: `${theme.palette.common.black_40}  0px 1px 2px 0px, ${theme.palette.common.black_40} 0px 2px 6px 2px`,
      }}
      onClick={clickMealHandler}
    >
      <Typography textAlign='center' sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', padding: '.3rem' }}>
        {meal.title}
      </Typography>
      <Box height='6rem' sx={{ bgcolor: theme.palette.common.black, textAlign: 'center' }}>
        <Box
          component='img'
          src={`${MEAL_IMAGE_URL}${meal.imageId}b.jpg`}
          alt={meal.title}
          sx={{ objectFit: 'fill', height: '100%', maxWidth: '100%' }}
        />
      </Box>
      <Typography textAlign='center'>{meal.price}元</Typography>
      <Row justifyContent='space-between' alignItems='center'></Row>
    </Box>
  );
};
