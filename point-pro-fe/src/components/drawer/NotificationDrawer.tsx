import { FC, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { clearNotifications, removeNotification } from '~/store/slices';
import { ReservationType, OrderType, SocketTopic, MenuMessage, OrderMessage, ReservationMessage } from '~/types';
import { appDayjs, GENDER_TRANSLATE } from '~/utils';
import { BaseDraw } from '~/components';

interface INotificationDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const menuTitle = {
  [MenuMessage.CREATE_MEAL]: '新增',
  [MenuMessage.UPDATE_MEAL]: '更新',
  [MenuMessage.DELETE_MEAL]: '刪除',
};

const orderTitle = {
  [OrderMessage.CREATE_ORDER]: '新單',
  [OrderMessage.UPDATE_ORDER]: '出餐',
  [OrderMessage.CANCEL_ORDER]: '取消',
  [OrderMessage.PAY_ORDER]: '結帳',
};

const reservationTitle1 = {
  [ReservationMessage.CREATE_RESERVATION]: '新的預約',
  [ReservationMessage.UPDATE_RESERVATION]: '更新預約資訊',
};

const reservationTypeTitle = {
  [ReservationType.ONLINE]: '線上訂位',
  [ReservationType.PHONE]: '電話訂位',
};

export const NotificationDrawer: FC<INotificationDrawerProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const notifications = useAppSelector(({ socket }) => socket.notifications);

  const handleClickNotification = (notiType: SocketTopic, idx: number) => {
    switch (notiType) {
      case SocketTopic.MENU:
        navigate('/admin/meal/list');
        break;
      case SocketTopic.ORDER:
        navigate('/admin/orders');
        break;
      case SocketTopic.RESERVATION:
        navigate('/admin/seat');
        break;
      default:
        break;
    }
    dispatch(removeNotification(idx));
  };

  const handleReadAllNotifications = () => {
    dispatch(clearNotifications());
  };
  return (
    <BaseDraw title='即時通知' open={open} onClose={() => setOpen(false)} width='300px'>
      {notifications.length > 0 ? (
        <>
          <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
            {notifications.map(({ message, result, notiType }, idx) => (
              <Card
                key={message}
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.5) 0px 1px 4px',
                  margin: '.5rem',
                  padding: '.5rem',
                }}
              >
                <CardActionArea disableRipple onClick={() => handleClickNotification(notiType, idx)}>
                  {/* MENU */}
                  {notiType === SocketTopic.MENU && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
                        <Typography fontWeight={700}>菜單 ({menuTitle[message]})</Typography>
                        {/* <Typography variant='small'>{appDayjs(result?.updatedAt).format('HH:mm')}</Typography> */}
                      </Box>
                      {/* <Box>{result?.title}</Box> */}
                    </Box>
                  )}

                  {/* ORDER */}
                  {notiType === SocketTopic.ORDER &&
                    (result.type === OrderType.DINE_IN ? (
                      // DINE IN
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
                          <Typography fontWeight={700}>內用訂單 ({orderTitle[message]})</Typography>
                          {/* <Typography variant='small'>{appDayjs(result.updatedAt).format('HH:mm')}</Typography> */}
                        </Box>
                        {/* <Typography variant='small'>
                          桌號：
                          {message === OrderMessage.PAY_ORDER
                            ? result.seats?.join(', ')
                            : result?.reservationsLogs?.bookedSeats?.map(({ seat }) => `${seat.prefix}-${seat.no}`).join(',')}
                        </Typography> */}
                      </Box>
                    ) : (
                      // TAKE OUT
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
                          <Typography fontWeight={700}>外帶訂單 ({orderTitle[message]})</Typography>
                          {/* <Typography variant='small'>{appDayjs(result.updatedAt).format('HH:mm')}</Typography> */}
                        </Box>
                        {/* <Typography variant='small'>訂單編號：{result.id.slice(-5)}</Typography> */}
                      </Box>
                    ))}

                  {/* RESERVATION */}
                  {notiType === SocketTopic.RESERVATION && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '1rem' }}>
                        {/* <Typography fontWeight={700}>{`${reservationTitle1[message]} ${reservationTypeTitle[result.type] ?? ''}`}</Typography> */}
                        {/* <Typography variant='small'>{appDayjs(result.reservedAt).format('HH:mm')}</Typography> */}
                      </Box>
                      {/* <Typography variant='small'>
                        姓名：{result.options.name} {GENDER_TRANSLATE[result.options.gender]}
                      </Typography> */}
                      {/* <Typography variant='small'>日期：{appDayjs(result.startTime).format('MM/DD HH:mm')}</Typography> */}
                      {/* <Typography variant='small'>人數：{result.options.adults}</Typography> */}
                    </Box>
                  )}
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
