import { FC } from 'react';
import { Box } from '@mui/material';
import { BaseModal } from '~/components';
import { useAppDispatch } from '~/hooks';
import { closeModal } from '~/store/slices/takeOrder.slice';

interface IMobileModalLayoutProps {
  children: React.ReactNode;
  open: boolean;
}

export const MobileModalLayout: FC<IMobileModalLayoutProps> = (props) => {
  const { children, open } = props;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <BaseModal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          width: '80%',
          bgcolor: 'common.white',
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '1rem',
        }}
      >
        {open && children}
      </Box>
    </BaseModal>
  );
};
