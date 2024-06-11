import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeSpecialtySettingModal } from '~/store/slices';
import { theme } from '~/theme';
import { SpecialtySettingTable } from '../tables/SpecialtySettingTable';

interface ISpecialtyItemsSettingModalProps {}

export const SpecialtySettingModal: FC<ISpecialtyItemsSettingModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.menuManagement.specialtySettingModal.isOpen);

  const handleCloseModal = () => {
    dispatch(closeSpecialtySettingModal());
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='客製化設定' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: 0, minWidth: '60cqw', maxHeight: 500, overflow: 'scroll' }}>
          <SpecialtySettingTable />
        </CardContent>
        <CardActions>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleCloseModal}>
            關閉
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
