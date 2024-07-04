import { FC, useMemo } from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { theme } from '~/theme';
import { menuSliceActions } from '~/store/slices/customer/menu.slice';

const { setCurrentCategory } = menuSliceActions;

export const StyledTab = styled(Tab)(() => ({
  backgroundColor: theme.palette.common.black_20,
  borderRadius: '5rem',
  margin: '.2rem',
  fontSize: '1rem',
  minHeight: 'auto',
  minWidth: 'auto',
  '&:focus': {
    outline: 'none',
  },
  "&.Mui-selected[aria-selected='true']": {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.primary.main,
  },
}));

interface ICategoryNavbarProps {}

export const CategoryNavbar: FC<ICategoryNavbarProps> = () => {
  const dispatch = useAppDispatch();

  const currentCategory = useAppSelector((state) => state.menu.currentCategory);
  const categories = useAppSelector((state) => state.menu.categories);
  const meals = useAppSelector((state) => state.menu.meals);
  const showCategories = useMemo(() => categories.filter((c) => meals.some((m) => m.categoryId === c.id)), [categories, meals]);

  const handleClickCategory = (categoryId: string) => {
    dispatch(setCurrentCategory(categoryId));
  };

  return (
    <>
      <Typography variant='h6' fontWeight={700} mt={1} sx={{ userSelect: 'none' }}>
        菜單
      </Typography>
      <Box display='flex' bgcolor='background.paper' sx={{ userSelect: 'none' }}>
        {/* 菜單類別 */}
        <Tabs
          visibleScrollbar
          value={currentCategory}
          onChange={(_, value) => handleClickCategory(value)}
          variant='scrollable'
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              display: 'none',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {showCategories.map(({ id, title }) => (
            <StyledTab key={id} value={id} label={title} sx={{ marginBottom: 1 }} />
          ))}
        </Tabs>
      </Box>
    </>
  );
};
