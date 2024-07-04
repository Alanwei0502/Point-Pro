import { FC } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { openDialog } from '~/store/slices';
import { MobileDialog, MenuMeal } from '~/types';
import { IMAGE_URL } from '~/constants';

interface IMealsProps {}

export const Meals: FC<IMealsProps> = () => {
  const dispatch = useAppDispatch();

  const meals = useAppSelector((state) => state.menu.meals);
  const currentCategory = useAppSelector((state) => state.menu.currentCategory);
  const cart = useAppSelector((state) => state.menu.cart);

  const showMeals = meals.filter((meal) => meal.categoryId === currentCategory);

  const getItemAmountInCart = (mealId: string) => cart.reduce((acc, cur) => (cur.id === mealId ? acc + cur.amount : acc), 0);

  const handleSelectedMeal = (meal: MenuMeal) => () => {
    dispatch(openDialog({ type: MobileDialog.CUSTOMIZED, data: { ...meal, amount: 1, selectedSpecialtyItems: [] } }));
  };

  return (
    <Box sx={{ padding: '0 .2rem 5rem', userSelect: 'none' }}>
      <List sx={{ width: '100%', zIndex: 0, '& ul': { padding: 0 } }} subheader={<li />} id='meal-list'>
        {showMeals &&
          showMeals.map((meal) => (
            <Box key={meal.id}>
              <ListItem sx={{ padding: '.5rem' }}>
                <ListItemButton sx={{ padding: '0' }} onClick={handleSelectedMeal(meal)}>
                  <Grid container gap={1} alignItems='center' justifyContent='space-between'>
                    <Grid item position='relative'>
                      <Box
                        component='img'
                        src={`${IMAGE_URL}${meal.imageId}s.jpg`}
                        alt={`${meal.title}-img`}
                        sx={{ width: '5rem', verticalAlign: 'middle' }}
                      />
                      {meal.isPopular && (
                        <Box position='absolute' left={0} top={0} bgcolor='primary.main' display='flex' padding='.1rem'>
                          <ThumbUpIcon sx={{ width: '1rem', height: '1rem' }} />
                        </Box>
                      )}
                    </Grid>

                    <Grid item sx={{ flexGrow: 1 }}>
                      <Box fontWeight={700}>{meal.title}</Box>
                      <Box>{meal.price}元</Box>
                    </Grid>

                    {getItemAmountInCart(meal.id) > 0 && (
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        bgcolor='common.black_80'
                        color='common.white'
                        borderRadius='50%'
                        width='1.5rem'
                        height='1.5rem'
                      >
                        {getItemAmountInCart(meal.id)}
                      </Box>
                    )}
                  </Grid>
                </ListItemButton>
              </ListItem>
              <Divider light />
            </Box>
          ))}
      </List>
    </Box>
  );
};
