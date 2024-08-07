import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { orderManagementSliceActions } from '~/store/slices/admin/orderManagement.slice';
import { paymentSliceActions } from '~/store/slices/admin/payment.slice';
import { reservationManagementSliceActions } from '~/store/slices/admin/reservationManagement.slice';
import { AppButton, Loading } from '~/components';
import { theme } from '~/theme';
import { OrderStatus, OrderType, PaymentType } from '~/types';
import { ROUTE_PATH } from '~/constants';
import { TabletModal } from './TabletModal';

interface ICheckoutOrderListProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

const CheckoutOrderList: FC<ICheckoutOrderListProps> = (props) => {
  const { isLoading, setIsLoading, setErrorMsg } = props;

  const dispatch = useAppDispatch();
  const modalType = useAppSelector((state) => state.payment.paymentModal.modalType);
  const checkOutOrder = useAppSelector((state) => state.orderManagement.checkOutOrder);

  useEffect(() => {
    setIsLoading(true);
    toast
      .promise(async () => {
        const res = await dispatch(getOrdersToCheckout()).unwrap();
        if (res?.msg) setErrorMsg(res.msg);
      }, {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, setErrorMsg, setIsLoading]);

  return (
    <Box overflow='scroll' height='60vh'>
      {isLoading ? (
        <Loading />
      ) : (
        <List>
          {checkOutOrder
            .filter(
              (co) =>
                (co.type === OrderType.DINE_IN && co.status !== OrderStatus.CANCEL) ||
                (co.type === OrderType.TAKE_OUT && co.status !== OrderStatus.CANCEL),
            )
            .map((co) => (
              <ListItem key={co.id} sx={{ display: 'flex', alignItems: 'flex-start', backgroundColor: theme.palette.common.black_20, mb: 1 }}>
                {modalType === 'EDIT' && (
                  <ListItemIcon sx={{ minWidth: 'inherit' }}>
                    <Checkbox checked={co.status === OrderStatus.FINISHED} size='small' sx={{ padding: 0 }} />
                  </ListItemIcon>
                )}

                <List disablePadding sx={{ width: '100%' }}>
                  {co.orderMeals.map((om) => (
                    <ListItem key={om.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pb: 0.5, pt: 0 }}>
                      <Box display='flex' justifyContent='space-between' width='100%'>
                        <Typography fontSize={18}>{om.meals.title}</Typography>
                        <Typography>x {om.amount}</Typography>
                      </Box>
                      <Typography variant='small' color={theme.palette.common.black_80}>
                        {om.orderMealSpecialtyItems.map((osi) => osi.specialtyItems.title).join(', ')}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <ListItemText sx={{ whiteSpace: 'nowrap', ml: 1, mt: 0 }}>{co.totalPrice}元</ListItemText>
              </ListItem>
            ))}
        </List>
      )}
    </Box>
  );
};

const { setPaymentType, closePaymentModal, requestCashPayment, requestLinePay } = paymentSliceActions;
const { getOrdersToCheckout, clearCheckoutOrder } = orderManagementSliceActions;
const { getOrders } = orderManagementSliceActions;
const { getReservations } = reservationManagementSliceActions;

interface IPaymentModalProps {}

export const PaymentModal: FC<IPaymentModalProps> = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { isOpen, modalType, data } = useAppSelector((state) => state.payment.paymentModal);
  const paymentType = useAppSelector((state) => state.payment.paymentType);
  const orderPaymentType = useAppSelector((state) => state.orderManagement.paymentType);
  const checkOutOrder = useAppSelector((state) => state.orderManagement.checkOutOrder);
  const typeTab = useAppSelector((state) => state.orderManagement.typeTab);
  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const totalPrice = checkOutOrder.filter((co) => co.status !== OrderStatus.CANCEL).reduce((acc, co) => acc + co.totalPrice, 0);

  const handleSelectPaymentType = (e: SelectChangeEvent<PaymentType>) => {
    const paymentType = e.target.value;
    dispatch(setPaymentType(paymentType as PaymentType));
  };

  const handleClose = () => {
    setIsLoading(false);
    setErrorMsg('');
    dispatch(closePaymentModal());
    dispatch(clearCheckoutOrder());
  };

  const handleConfirm = () => {
    switch (paymentType) {
      case PaymentType.CASH: {
        setIsLoading(true);
        toast.promise(
          async () => {
            await dispatch(requestCashPayment()).unwrap();
            handleClose();
          },
          {
            pending: '結帳中...',
            success: '結帳成功',
            error: '結帳失敗',
          },
        );
        break;
      }

      case PaymentType.LINE_PAY: {
        toast.promise(
          async () => {
            await dispatch(requestLinePay()).unwrap();
          },
          {
            pending: '結帳中...',
            error: '結帳失敗',
          },
        );
        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (location.pathname.includes(ROUTE_PATH.orderManagement)) {
        dispatch(getOrders({ status: statusTab, type: typeTab }));
      }
      if (location.pathname.includes(ROUTE_PATH.reservationMangement)) {
        dispatch(getReservations(dateFilter));
      }
    }
  }, [dateFilter, dispatch, isOpen, location.pathname, statusTab, typeTab]);

  if (!data) return null;

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{ title: '結帳明細與方式' }}
      cardContentProps={{
        children: (
          <Box display='flex' flexDirection='column' justifyContent='center'>
            <Box display='flex' alignItems='center' justifyContent='space-between' gap={2}>
              {modalType === 'EDIT' && (
                <Select
                  value={paymentType}
                  onChange={handleSelectPaymentType}
                  size='small'
                  sx={{ flexGrow: 1, height: 50 }}
                  disabled={modalType !== 'EDIT'}
                >
                  <MenuItem value={PaymentType.CASH}>
                    <Typography fontSize={20}>現金付款</Typography>
                  </MenuItem>
                  <MenuItem value={PaymentType.LINE_PAY}>
                    <Typography fontSize={20}>Line Pay</Typography>
                  </MenuItem>
                </Select>
              )}
              <Box flexGrow={1} fontSize={theme.typography.h6.fontSize} textAlign='right'>
                總金額：{totalPrice}元
              </Box>
            </Box>
            {modalType === 'EDIT' && data.type === OrderType.DINE_IN && errorMsg && (
              <Alert severity='error' sx={{ my: 1 }}>
                {errorMsg}
              </Alert>
            )}
            <CheckoutOrderList isLoading={isLoading} setIsLoading={setIsLoading} setErrorMsg={setErrorMsg} />
          </Box>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='inherit' fullWidth onClick={handleClose} disabled={isLoading}>
              取消
            </AppButton>
            {modalType === 'EDIT' && (
              <AppButton fullWidth onClick={handleConfirm} disabled={isLoading || Boolean(errorMsg)}>
                確定
              </AppButton>
            )}
          </>
        ),
      }}
    />
  );
};
