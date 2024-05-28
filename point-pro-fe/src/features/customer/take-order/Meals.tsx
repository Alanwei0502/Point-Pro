import { FC, useCallback, useEffect } from 'react';
import { Box, Divider, Grid, List, ListItem, ListItemButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { usePrevious, useAppDispatch, useAppSelector } from '~/hooks';
import { openDialog } from '~/store/slices';
import { MobileDialog, GetMenuResponseMeal } from '~/types';

interface IMealsProps {}

export const Meals: FC<IMealsProps> = () => {
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(({ takeOrder }) => takeOrder.userInfo);
  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);
  const prevCategory = usePrevious(currentCategory);
  const showMeals = meals.filter((meal) => meal.categoryId === currentCategory);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);

  const getItemAmountInCart = useCallback(
    (mealId: string) => cart.reduce((acc, cur) => (cur.id === mealId ? acc + cur.amount : acc), 0),
    [cart],
  );

  const handleSelectedMeal = (meal: GetMenuResponseMeal) => () => {
    dispatch(openDialog({ type: MobileDialog.CUSTOMIZED, data: { ...meal, amount: 1, selectedSpecialtyItems: [] } }));
  };

  useEffect(() => {
    // Don't scroll when it's the first-mounted.
    if (prevCategory && currentCategory && prevCategory !== currentCategory) {
      window.scroll({ top: userInfo ? 252 : 0, behavior: 'smooth' });
    }
  }, [prevCategory, currentCategory, userInfo]);

  return (
    <Box sx={{ padding: '0 .2rem 5rem', userSelect: 'none' }}>
      <List sx={{ width: '100%', zIndex: 0, '& ul': { padding: 0 } }} subheader={<li />} id='meal-list'>
        {showMeals &&
          showMeals.map((meal, idx) => (
            <Box key={`${meal.id}-${idx}`}>
              <ListItem sx={{ padding: '.5rem' }}>
                <ListItemButton sx={{ padding: '0' }} onClick={handleSelectedMeal(meal)}>
                  <Grid container gap={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid item sx={{ position: 'relative' }}>
                      <Box
                        component='img'
                        src={meal.coverUrl.split('.jpeg')[0] + 's' + '.jpeg'}
                        alt={`${meal.title}-img`}
                        sx={{ width: '5rem', verticalAlign: 'middle' }}
                      />
                      {meal.isPopular && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            padding: '.1rem',
                          }}
                        >
                          <ThumbUpIcon sx={{ width: '1rem', height: '1rem' }} />
                        </Box>
                      )}
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }}>
                      <Box sx={{ fontWeight: '700' }}>{meal.title}</Box>
                      <Box>{meal.price}元</Box>
                    </Grid>

                    {getItemAmountInCart(meal.id) > 0 && (
                      <Grid item>
                        <Box
                          sx={{
                            bgcolor: 'common.black',
                            color: 'common.white',
                            borderRadius: '50%',
                            width: '2rem',
                            height: '2rem',
                            textAlign: 'center',
                          }}
                        >
                          {getItemAmountInCart(meal.id)}
                        </Box>
                      </Grid>
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
