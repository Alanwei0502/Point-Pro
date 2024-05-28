import { Box } from '@mui/material';
import { BaseGrid, BaseGridItem, PanelTabs, headerHeight } from '~/components';
import { useAppSelector } from '~/hooks';
import { MealItem } from './MealItem';
import { FC } from 'react';

interface IMealListProps {}

export const MealList: FC<IMealListProps> = () => {
  const menu = useAppSelector(({ takeOrder }) => takeOrder.menu);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);

  return (
    <>
      <Box
        sx={{
          p: 2,
          overflowY: 'auto',
          maxHeight: `calc(100vh - ${headerHeight} - 48px)`,
        }}
      >
        {menu.map(
          (category) =>
            category.id === currentCategory && (
              <PanelTabs key={category.id} value={category.position!} index={category.position!}>
                <BaseGrid columns='5' gap='1rem'>
                  {category.meals.length > 0 &&
                    category.meals.map((meal) => (
                      <BaseGridItem
                        sx={{
                          cursor: 'pointer',
                        }}
                        key={meal.id}
                      >
                        <MealItem meal={meal} />
                      </BaseGridItem>
                    ))}
                </BaseGrid>
              </PanelTabs>
            ),
        )}
      </Box>
    </>
  );
};
