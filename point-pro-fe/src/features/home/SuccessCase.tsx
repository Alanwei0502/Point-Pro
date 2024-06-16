import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { AppButton, Section, Title } from '~/components';
import { theme } from '~/theme';
import { useResponsiveStyles } from '~/hooks';
import { ROUTE_PATH } from '~/utils';

interface ISuccessCaseProps {}

export const SuccessCase: FC<ISuccessCaseProps> = () => {
  const { isTablet } = useResponsiveStyles();

  const navigate = useNavigate();

  return (
    <Section id='success-case'>
      <Title title='成功案例 - 港都熱炒' subtitle='老闆、員工、客人都開心，體驗 PointPro 更簡單、更有效率的餐飲體驗' />
      <Box display='flex' flexGrow={1} gap={2} flexDirection={isTablet ? 'row' : 'column'} mt={3}>
        <AppButton
          endIcon={<InsertInvitationIcon />}
          sx={{
            color: theme.palette.common.black,
            width: '100%',
            borderRadius: '2rem',
            fontSize: theme.typography.h6.fontSize,
            margin: 1,
          }}
          onClick={() => {
            navigate(`/${ROUTE_PATH.booking}`);
          }}
        >
          我要預約
        </AppButton>
        <AppButton
          endIcon={<ManageAccountsIcon />}
          sx={{
            color: theme.palette.common.black,
            width: '100%',
            borderRadius: '2rem',
            fontSize: theme.typography.h6.fontSize,
            margin: 1,
          }}
          onClick={() => {
            navigate(`/${ROUTE_PATH.admin}`);
          }}
        >
          後台管理
        </AppButton>
      </Box>
    </Section>
  );
};
