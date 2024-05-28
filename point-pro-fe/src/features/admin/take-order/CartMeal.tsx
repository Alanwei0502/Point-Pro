import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { Column, Row } from '~/components';
import { useAppDispatch } from '~/hooks';
import { deleteCartItem, viewCartItemCustomized } from '~/store/slices';
import { theme } from '~/theme';
import { ICartItem } from '~/types';

interface ICartMealProps {
  idx: number;
  cartItem: ICartItem;
}

export const CartMeal: FC<ICartMealProps> = ({ idx, cartItem }) => {
  const dispatch = useAppDispatch();

  const { title, amount, specialties, price } = cartItem;

  const specialtiesPrice = specialties.reduce(
    (acc, specialty) => (acc += specialty.items.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0)),
    0,
  );
  const totalPrice = (price + specialtiesPrice) * amount;

  const handleEditCartItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(viewCartItemCustomized({ cartItem, idx }));
  };

  const handleDeleteCartItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  return (
    <Column
      sx={{
        flex: 1,
        padding: '.2rem .5rem',
        gap: '.2rem',
        borderBottom: `1px solid ${theme.palette.common.black_20}`,
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        cursor: 'pointer',
      }}
      onClick={handleEditCartItem}
    >
      <Row>
        <Typography variant='h6' fontWeight={700} mb={0.5}>
          {title} x {amount}
        </Typography>
        <IconButton sx={{ marginLeft: 'auto' }} size='large' color='inherit' onClick={handleDeleteCartItem}>
          <DeleteIcon />
        </IconButton>
      </Row>
      <Row sx={{ gap: '0.5rem' }} alignItems='flex-start'>
        <Column>
          <List dense={true} sx={{ padding: 0, margin: 0 }}>
            {specialties.map((specialty) => (
              <ListItem key={specialty.id} sx={{ padding: 0, margin: 0 }}>
                <ListItemText
                  secondary={specialty.items.map((item) => (
                    <Typography component='span' variant='body1' key={item.id} lineHeight={1.2} sx={{ marginRight: '0.5rem' }}>
                      {item.title}
                    </Typography>
                  ))}
                />
              </ListItem>
            ))}
          </List>
        </Column>
      </Row>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Typography variant='body1' sx={{ fontWeight: 900 }}>
          {`${price}${specialtiesPrice ? `(+${specialtiesPrice})` : ''} x ${amount} = ${totalPrice}元`}
        </Typography>
      </Box>
    </Column>
  );
};
