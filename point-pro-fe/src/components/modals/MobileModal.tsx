import { FC, ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Modal, { ModalProps } from '@mui/material/Modal';
import { useAppDispatch } from '~/hooks';
import { closeModal } from '~/store/slices';

interface IMobileModalProps extends Omit<ModalProps, 'children'> {
  children?: ReactNode;
  boxProps?: BoxProps;
}

export const MobileModal: FC<IMobileModalProps> = (props) => {
  const { children, open, boxProps = {}, ...restModalProps } = props;
  const { sx, ...restBoxProps } = boxProps;

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <>
      {open && (
        <Modal onClose={handleClose} open={open} {...restModalProps}>
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
              ...sx,
            }}
            {...restBoxProps}
          >
            {open && children}
          </Box>
        </Modal>
      )}
    </>
  );
};
