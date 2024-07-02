import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActionsProps } from '@mui/material/DialogActions';
import { DialogContentProps } from '@mui/material/DialogContent';
import { DialogTitleProps } from '@mui/material/DialogTitle';
import { Variant } from '@mui/material/styles/createTypography';

interface IMobileDialogLayoutProps {
  title?: React.ReactNode;
  titleSize?: Variant;
  children?: React.ReactNode;
  isOpen: boolean;
  actionButton?: React.ReactNode;
  dialogProps?: DialogProps;
  dialogTitleProps?: DialogTitleProps;
  dialogContentProps?: DialogContentProps;
  dialogActionProps?: DialogActionsProps;
}

export const MobileDialogLayout: FC<IMobileDialogLayoutProps> = (props) => {
  const {
    title = '',
    titleSize = 'h4',
    children = null,
    isOpen,
    actionButton,
    dialogProps,
    dialogTitleProps,
    dialogContentProps,
    dialogActionProps,
  } = props;

  return (
    <Dialog
      fullScreen
      open={isOpen}
      sx={{ bgcolor: '#E1E1E1', width: '100vw', maxWidth: '768px', margin: '0 auto', userSelect: 'none' }}
      {...dialogProps}
    >
      <DialogTitle {...dialogTitleProps}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant={titleSize} fontWeight={900} sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent {...dialogContentProps}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {actionButton && (
        <DialogActions
          {...dialogActionProps}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            bgcolor: 'common.white',
            '.MuiButtonBase-root': {
              width: '100%',
              margin: 0,
              bgcolor: 'primary.main',
              color: 'common.black',
              fontWeight: 700,
              fontSize: '1.25rem',
            },
            '.MuiButtonBase-root:hover': {
              backgroundColor: 'primary.main',
            },
            '.Mui-disabled': {
              backgroundColor: 'common.black_20',
              color: 'common.black_60',
            },
          }}
        >
          {actionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};
