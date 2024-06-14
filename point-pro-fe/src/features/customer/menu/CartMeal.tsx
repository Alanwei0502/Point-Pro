import { FC, Fragment, SyntheticEvent } from 'react';
import { Box, Divider, Grid, ListItemButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '~/hooks';
import { viewCartItemCustomized, openModal } from '~/store/slices';
import { ICartItem, MobileModalType } from '~/types';
import { IMAGE_URL } from '~/utils';

interface ICartMealProps {
  cartItem: ICartItem;
  idx: number;
}

export const CartMeal: FC<ICartMealProps> = (props) => {
  const dispatch = useAppDispatch();

  const { cartItem, idx } = props;

  const { id, title, imageId, price, amount, selectedSpecialtyItems } = cartItem;

  const sepcialtiesItemAdditionalPrice = selectedSpecialtyItems.reduce((acc, item) => (acc += item.price), 0);
  const totalPrice = (price + sepcialtiesItemAdditionalPrice) * amount;

  const handleCustomized = (cartItem: ICartItem, idx: number) => () => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleRemoveCartItem = (idx: number) => (e: SyntheticEvent<Element, Event>) => {
    e.stopPropagation();
    dispatch(openModal({ type: MobileModalType.REMOVE_CART_CONFIRM, data: props }));
  };

  return (
    <Fragment key={`${id}-${idx}`}>
      <ListItemButton onClick={handleCustomized(cartItem, idx)} sx={{ padding: '.5rem', userSelect: 'none' }} disableRipple>
        <Box sx={{ width: '100%' }}>
          <Grid container gap={1} sx={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Grid item sx={{ position: 'relative' }} xs={3}>
              <Box component='img' src={`${IMAGE_URL}${imageId}s.jpg`} alt={`${title}-img`} sx={{ width: '5rem', verticalAlign: 'middle' }} />
              {cartItem.isPopular && (
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
            <Grid item xs={7}>
              <Typography fontWeight={700}>
                {title} x {amount}
              </Typography>
              <Box sx={{ color: 'common.black_80', fontSize: 'small.fontSize' }}>{selectedSpecialtyItems.map((i) => i.title).join('、')}</Box>
            </Grid>
            <Grid item xs={1}>
              <DeleteIcon onClick={handleRemoveCartItem(idx)} />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant='h6' fontWeight={900}>
              {`${price}${sepcialtiesItemAdditionalPrice ? `(+${sepcialtiesItemAdditionalPrice})` : ''} x ${amount} = ${totalPrice}元`}
            </Typography>
          </Box>
        </Box>
      </ListItemButton>
      <Divider light />
    </Fragment>
  );
};
