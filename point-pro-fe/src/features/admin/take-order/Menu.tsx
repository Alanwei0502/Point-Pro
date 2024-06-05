import { FC, useMemo } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { BaseGrid, BaseGridItem, BaseTab, BaseTabs, TabPanel, headerHeight } from '~/components';
import { takeOrderSliceActions } from '~/store/slices';
import { MealItem } from './MealItem';

interface IMenuProps {}

export const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.takeOrder.categories);
  const selectCategory = useAppSelector((state) => state.takeOrder.selectCategory);
  const meals = useAppSelector((state) => state.takeOrder.meals);
  const showCategories = useMemo(() => categories.filter((category) => meals.some((meal) => meal.categoryId === category.id)), [categories, meals]);

  const handleSelectCategory = (e: React.SyntheticEvent, categoryId: string) => {
    dispatch(takeOrderSliceActions.setSelectCategory(categoryId));
  };

  return (
    <>
      <BaseTabs value={selectCategory} onChange={handleSelectCategory}>
        {showCategories.map(({ id, title }) => (
          <BaseTab key={id} value={id} label={title} />
        ))}
      </BaseTabs>
      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: `calc(100vh - ${headerHeight} - 48px)`,
          padding: 2,
        }}
      >
        {showCategories.map((c) => (
          <TabPanel key={c.id} index={c.id} value={selectCategory}>
            <BaseGrid columns='5' gap='1rem'>
              {meals
                .filter((m) => m.categoryId === c.id)
                .map((m) => (
                  <BaseGridItem sx={{ cursor: 'pointer' }} key={m.id}>
                    <MealItem meal={m} />
                  </BaseGridItem>
                ))}
            </BaseGrid>
          </TabPanel>
        ))}
      </Box>
    </>
  );
};
