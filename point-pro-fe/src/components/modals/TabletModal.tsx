import { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card, { type CardProps } from '@mui/material/Card';
import CardActions, { type CardActionsProps } from '@mui/material/CardActions';
import CardContent, { type CardContentProps } from '@mui/material/CardContent';
import CardHeader, { type CardHeaderProps } from '@mui/material/CardHeader';
import Modal, { type ModalProps } from '@mui/material/Modal';
import { theme } from '~/theme';

interface ITabletModalProps extends Omit<ModalProps, 'children'> {
  children?: ReactNode;
  cardProps?: CardProps;
  cardHeaderProps?: CardHeaderProps;
  cardContentProps?: CardContentProps;
  cardActionsProps?: CardActionsProps;
}

export const TabletModal: FC<ITabletModalProps> = (props) => {
  const { open, children, cardProps = {}, cardHeaderProps = {}, cardActionsProps = {}, cardContentProps = {}, ...restModalProps } = props;
  const { sx: cardHeaderSx, ...restCardHeaderProps } = cardHeaderProps;
  const { children: cardContentChildren, sx: cardContentSx, ...restCardContentProps } = cardContentProps;
  const { children: cardActionsChildren, ...restCardActionsProps } = cardActionsProps;
  return open ? (
    <Modal open={open} {...restModalProps}>
      {children ? (
        <>{children}</>
      ) : (
        <Box display='grid' sx={{ placeContent: 'center' }} height='100%'>
          <Card {...cardProps}>
            <CardHeader sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center', ...cardHeaderSx }} {...restCardHeaderProps} />
            <CardContent sx={{ padding: '1rem', minWidth: '50cqw', ...cardContentSx }} {...restCardContentProps}>
              {cardContentChildren}
            </CardContent>
            <CardActions {...restCardActionsProps}>{cardActionsChildren}</CardActions>
          </Card>
        </Box>
      )}
    </Modal>
  ) : null;
};
