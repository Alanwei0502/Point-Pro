import { FC, ReactNode } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardActionsProps,
  CardContent,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
  Modal,
  ModalProps,
} from '@mui/material';
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
