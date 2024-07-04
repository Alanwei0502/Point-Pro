import { FC, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { socketSliceActions } from '~/store/slices/socket.slice';
import { ROUTE_PATH } from '~/constants';
import { BaseDraw } from '~/components';

// const menuTitle = {
//   [MenuMessage.CREATE_MEAL]: '新增',
//   [MenuMessage.UPDATE_MEAL]: '更新',
//   [MenuMessage.DELETE_MEAL]: '刪除',
// };

// const orderTitle = {
//   [OrderMessage.CREATE_ORDER]: '新單',
//   [OrderMessage.UPDATE_ORDER]: '出餐',
//   [OrderMessage.CANCEL_ORDER]: '取消',
//   [OrderMessage.PAY_ORDER]: '結帳',
// };

// const reservationTitle1 = {
//   [ReservationMessage.CREATE_RESERVATION]: '新的預約',
//   [ReservationMessage.UPDATE_RESERVATION]: '更新預約資訊',
// };

// const reservationTypeTitle = {
//   [ReservationType.ONLINE]: '線上訂位',
//   [ReservationType.PHONE]: '電話訂位',
// };

const { removeAdminNotification, removeAllAdminNotification } = socketSliceActions;

interface INotificationDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const NotificationDrawer: FC<INotificationDrawerProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.socket.adminNotification);

  const handleClickNotification = (id: number, title: string) => {
    switch (title) {
      case '菜單更新':
        navigate(`/${ROUTE_PATH.admin}/${ROUTE_PATH.menuManagement}`);
        break;
      case '訂單更新':
        navigate(`/${ROUTE_PATH.admin}/${ROUTE_PATH.orderManagement}`);
        break;
      case '預約更新':
        navigate(`/${ROUTE_PATH.admin}/${ROUTE_PATH.reservationMangement}`);
        break;
      default:
        break;
    }
    dispatch(removeAdminNotification(id));
  };

  const handleReadAllNotifications = () => {
    dispatch(removeAllAdminNotification());
  };
  return (
    <BaseDraw title='即時通知' open={open} onClose={() => setOpen(false)} width='300px'>
      {notifications.length > 0 ? (
        <>
          <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
            {notifications.map(({ id, title }) => (
              <Card
                key={id}
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.5) 0px 1px 4px',
                  margin: '.5rem',
                  padding: '.5rem',
                }}
              >
                <CardActionArea disableRipple onClick={() => handleClickNotification(id, title)}>
                  <Typography>{title}</Typography>
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Button sx={{ bgcolor: 'primary.main', color: 'common.black', height: '4rem' }} onClick={handleReadAllNotifications}>
            已讀所有通知
          </Button>
        </>
      ) : (
        <Typography sx={{ margin: 'auto' }}>無通知</Typography>
      )}
    </BaseDraw>
  );
};
