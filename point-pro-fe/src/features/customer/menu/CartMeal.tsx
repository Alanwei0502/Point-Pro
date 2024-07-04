import { FC, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '~/hooks';
import { ICartItem, MobileModalType } from '~/types';
import { IMAGE_URL } from '~/constants';
import { menuSliceActions } from '~/store/slices/customer/menu.slice';

const { viewCartItemCustomized, openModal } = menuSliceActions;

interface ICartMealProps {
  cartItem: ICartItem;
  idx: number;
}

export const CartMeal: FC<ICartMealProps> = (props) => {
  const dispatch = useAppDispatch();

  const { cartItem, idx } = props;

  const { title, imageId, price, amount, selectedSpecialtyItems } = cartItem;

  const sepcialtiesItemAdditionalPrice = selectedSpecialtyItems.reduce((acc, item) => (acc += item.price), 0);
  const totalPrice = (price + sepcialtiesItemAdditionalPrice) * amount;

  const handleCustomized = (cartItem: ICartItem, idx: number) => () => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleRemoveCartItem = (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    dispatch(openModal({ type: MobileModalType.REMOVE_CART_CONFIRM, data: props }));
  };

  return (
    <ListItemButton onClick={handleCustomized(cartItem, idx)} sx={{ padding: 0.5, userSelect: 'none' }} disableRipple>
      <Box width='100%'>
        <Grid container justifyContent='space-between' flexWrap='nowrap' my={1}>
          <Grid item position='relative'>
            <Box component='img' src={`${IMAGE_URL}${imageId}s.jpg`} alt={title} width='5rem' sx={{ verticalAlign: 'middle', paddingRight: 1 }} />
            {cartItem.isPopular && (
              <Box position='absolute' left={0} top={0} bgcolor='primary.main' display='flex' padding='.1rem'>
                <ThumbUpIcon sx={{ width: '1rem', height: '1rem' }} />
              </Box>
            )}
          </Grid>
          <Grid item flexGrow={1}>
            <Typography fontWeight={700}>{title}</Typography>
            <Box sx={{ color: 'common.black_80', fontSize: 'small.fontSize' }}>{selectedSpecialtyItems.map((i) => i.title).join('、')}</Box>
          </Grid>
          <Grid item>
            <DeleteIcon onClick={handleRemoveCartItem} color='action' />
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='flex-end' alignItems='center' width='100%'>
          <Typography fontWeight={900}>
            {amount} 份 {totalPrice} 元
          </Typography>
        </Box>
      </Box>
    </ListItemButton>
  );
};
