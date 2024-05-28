import { Tab, Tabs, tabsClasses } from '@mui/material';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, setCurrentCategory } from '~/store/slices';
import { theme } from '~/theme';

interface IMenuTabsProps {}

export const MenuTabs: FC<IMenuTabsProps> = () => {
  const dispatch = useAppDispatch();

  const categories = useAppSelector(({ takeOrder }) => takeOrder.categories);
  const currentCategory = useAppSelector(({ takeOrder }) => takeOrder.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
    dispatch(closeDialog());
  };

  return (
    <Tabs
      variant='scrollable'
      value={currentCategory}
      onChange={(_, value) => handleClickCategory(value)}
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
      {categories.map(({ id, title }) => (
        <Tab key={id} value={id} label={title} sx={{ fontSize: theme.typography.body1.fontSize }} />
      ))}
    </Tabs>
  );
};
