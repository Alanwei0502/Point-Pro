import { FC } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Column, Row } from '~/components';
import { useAppDispatch } from '~/hooks';
import { ITakeOrderSliceState, takeOrderSliceActions } from '~/store/slices';
import { theme } from '~/theme';

const { editCartItem, deleteCartItem } = takeOrderSliceActions;

interface ICartMealProps {
  idx: number;
  cartItem: ITakeOrderSliceState['cart'][0];
}

export const CartMeal: FC<ICartMealProps> = ({ idx, cartItem }) => {
  const dispatch = useAppDispatch();

  const { title, amount, price, selectSpecialtyItems } = cartItem;

  const specialtiesPrice = selectSpecialtyItems.reduce((acc, specialtyItem) => (acc += specialtyItem.price), 0);
  const totalPrice = (price + specialtiesPrice) * amount;

  const handleEditCartItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(editCartItem(idx));
  };

  const handleDeleteCartItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deleteCartItem(idx));
  };

  return (
    <Column
      sx={{
        flex: 1,
        padding: '0 .5rem',
        borderBottom: `1px solid ${theme.palette.common.black_20}`,
        boxShadow: `${theme.palette.common.black_40}  0px 1px 2px 0px, ${theme.palette.common.black_40} 0px 2px 6px 2px`,
        cursor: 'pointer',
      }}
      onClick={handleEditCartItem}
    >
      <Row>
        <Typography fontWeight={700}>
          {title} x {amount}
        </Typography>
        <IconButton sx={{ marginLeft: 'auto' }} size='small' onClick={handleDeleteCartItem}>
          <DeleteIcon />
        </IconButton>
      </Row>
      <Row alignItems='flex-start'>
        <Column>
          <List dense sx={{ padding: 0, margin: 0 }}>
            {selectSpecialtyItems.map((si) => (
              <Chip key={si.id} label={si.title} variant='filled' size='small' sx={{ margin: '1px', fontSize: 12 }} />
            ))}
          </List>
        </Column>
      </Row>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700 }}>
          {`${price}${specialtiesPrice ? `(+${specialtiesPrice})` : ''} x ${amount} = ${totalPrice}元`}
        </Typography>
      </Box>
    </Column>
  );
};
