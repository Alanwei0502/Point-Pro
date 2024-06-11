import { FC } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { IOrderManagementSliceState, orderManagementSliceActions } from '~/store/slices';
import { ORDER_STATUS_TRANSLATE, ORDER_TYPE_TRANSLATE } from '~/utils';
import { BaseTab, BaseTabs } from '~/components';

const { setTypeTab, setStatusTab } = orderManagementSliceActions;

interface IOrderTabsProps {}

export const OrderTabs: FC<IOrderTabsProps> = () => {
  const dispatch = useAppDispatch();

  const typeTab = useAppSelector((state) => state.orderManagement.typeTab);
  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);

  const handleSelectType = (e: React.SyntheticEvent, type: IOrderManagementSliceState['typeTab']) => {
    dispatch(setTypeTab(type));
  };

  const handleSelectStatus = (e: React.SyntheticEvent, status: IOrderManagementSliceState['statusTab']) => {
    dispatch(setStatusTab(status));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <BaseTabs value={statusTab} onChange={handleSelectStatus}>
        {Object.entries(ORDER_STATUS_TRANSLATE).map(([type, title]) => (
          <BaseTab key={type} value={type} label={title} />
        ))}
      </BaseTabs>
      <BaseTabs value={typeTab} onChange={handleSelectType}>
        {Object.entries(ORDER_TYPE_TRANSLATE).map(([type, title]) => (
          <BaseTab key={type} value={type} label={title} />
        ))}
      </BaseTabs>
    </Box>
  );
};
