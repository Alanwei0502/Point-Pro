import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { takeOrderSliceActions } from '~/store/slices';
import { theme } from '~/theme';
import { MenuMeal } from '~/types';
import { IMAGE_URL } from '~/utils';

interface MealItemProps {
  meal: MenuMeal;
}

export const MealItem: FC<MealItemProps> = (props) => {
  const dispatch = useAppDispatch();

  const { meal } = props;

  const editingCartItem = useAppSelector((state) => state.takeOrder.editingCartItem);
  const selectMeal = useAppSelector((state) => state.takeOrder.selectMeal);
  const isEdit = editingCartItem !== -1;
  const isSelected = meal.id === selectMeal?.id && !isEdit;

  const clickMealHandler = () => {
    if (isSelected) {
      dispatch(takeOrderSliceActions.setUnselectMeal());
    } else {
      dispatch(takeOrderSliceActions.setSelectMeal({ ...meal, amount: 1 }));
    }
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
      <Typography textAlign='center' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' p='.3rem'>
        {meal.title}
      </Typography>
      <Box height='6rem' bgcolor={theme.palette.common.black} textAlign='center'>
        <Box component='img' src={`${IMAGE_URL}${meal.imageId}b.jpg`} alt={meal.title} height='100%' maxWidth='100%' />
      </Box>
      <Typography textAlign='center'>{meal.price}元</Typography>
      <Row justifyContent='space-between' alignItems='center'></Row>
    </Box>
  );
};
