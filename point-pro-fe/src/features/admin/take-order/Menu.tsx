import { FC, useMemo } from 'react';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { takeOrderSlice } from '~/store/slices';
import { theme } from '~/theme';
import { BaseGrid, BaseGridItem, TabPanel, headerHeight } from '~/components';
import { MealItem } from './MealItem';

interface IMenuProps {}

export const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  const { setSelectCategory } = takeOrderSlice.actions;

  const categories = useAppSelector((state) => state.takeOrder.categories);
  const selectCategory = useAppSelector((state) => state.takeOrder.selectCategory);
  const meals = useAppSelector((state) => state.takeOrder.meals);
  const showCategories = useMemo(() => categories.filter((category) => meals.some((meal) => meal.categoryId === category.id)), [categories, meals]);

  const clickCategoryTabHandler = (e: React.SyntheticEvent<Element, Event>, categoryId: string) => {
    dispatch(setSelectCategory(categoryId));
    // TODO: delete?
    // dispatch(closeDialog());
  };

  return (
    <>
      <Tabs
        variant='scrollable'
        value={selectCategory}
        onChange={clickCategoryTabHandler}
        sx={{
          position: 'sticky',
          top: '0',
          zIndex: '2',
          backgroundColor: theme.palette.background.paper,
          height: '48px',
          [`& .${tabsClasses.scrollButtons}.Mui-disabled`]: {
            opacity: 0.2,
          },
        }}
      >
        {showCategories.map(({ id, title }) => (
          <Tab key={id} value={id} label={title} sx={{ fontSize: theme.typography.body1.fontSize }} />
        ))}
      </Tabs>
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
