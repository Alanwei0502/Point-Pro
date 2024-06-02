import { FC, Fragment, useMemo, useState } from 'react';
import { Box, Divider, List, ListItemButton, Tab, Tabs, ToggleButton, Typography, styled, tabsClasses } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setCurrentCategory } from '~/store/slices';

export const StyledTab = styled(Tab)(({ theme }) => ({
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

  const [isShowDropdown, setIsShowDropdown] = useState(false);

  const categories = useAppSelector((state) => state.menu.categories);
  const meals = useAppSelector((state) => state.menu.meals);
  const showCategories = useMemo(() => categories.filter((c) => meals.some((m) => m.categoryId === c.id)), [categories, meals]);
  const currentCategory = useAppSelector((state) => state.menu.currentCategory);

  const handleClickCategory = (categoryId: string) => {
    setIsShowDropdown(false);
    dispatch(setCurrentCategory(categoryId));
  };

  const handleToggleCategoryDropdown = () => {
    setIsShowDropdown((prev) => !prev);
  };

  return (
    <>
      <Typography variant='h3' sx={{ fontWeight: 900, paddingBottom: '1rem', userSelect: 'none' }}>
        菜單
      </Typography>
      <Box
        sx={{
          position: 'sticky',
          top: '4.5rem',
          zIndex: 2,
          bgcolor: 'background.paper',
          transform: 'translateY(10%)', // sticky jumping when scroll in mobile
          userSelect: 'none',
        }}
        id='category-tabs'
      >
        <Box sx={{ display: 'flex' }}>
          {/* 菜單類別 */}
          <Tabs
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
              marginBottom: '10px',
            }}
          >
            {showCategories.map(({ id, title }) => (
              <StyledTab key={id} value={id} label={title} />
            ))}
          </Tabs>
          {/* 下拉菜單按鈕 */}
          <ToggleButton
            value='check'
            size='small'
            selected={isShowDropdown}
            onChange={handleToggleCategoryDropdown}
            sx={{
              "&.MuiToggleButton-root[value='check']": { outline: 'none', border: 'none', bgcolor: 'transparent' },
            }}
          >
            <ExpandMoreIcon
              sx={{
                rotate: isShowDropdown ? '180deg' : '0deg',
                transition: '.3s',
              }}
            />
          </ToggleButton>
        </Box>
        {/* 下拉式菜單 */}
        <Box
          sx={{
            display: isShowDropdown ? 'block' : 'none',
            maxHeight: '60vh',
            border: '1px solid',
            borderColor: 'common.black_40',
            position: 'absolute',
            overflowY: 'auto',
            zIndex: 2,
            bgcolor: 'common.white',
            width: '100%',
          }}
        >
          <List>
            {showCategories.map(({ id, title }) => (
              <Fragment key={id}>
                <ListItemButton onClick={() => handleClickCategory(id)} sx={{ padding: '1rem' }}>
                  {title}
                </ListItemButton>
                <Divider light />
              </Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};
