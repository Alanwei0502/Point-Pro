import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { MobileDialogLayout } from '~/components';
import { MobileBookingDialog } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { confirmPrivacyPolicyDialog } from '~/store/slices';

interface IPrivacyPolicyDialogProps {}

export const PrivacyPolicyDialog: FC<IPrivacyPolicyDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ booking }) => booking.dialog);

  const handleConfirm = () => {
    dispatch(confirmPrivacyPolicyDialog());
  };

  return (
    <MobileDialogLayout
      title={<Box>PointPro 隱私權政策</Box>}
      titleSize='h3'
      isOpen={dialog === MobileBookingDialog.PRIVACY_POLICY}
      isShowCloseIcon={false}
      actionButton={<Button onClick={handleConfirm}>確認同意</Button>}
    >
      <Typography>我們非常尊重您的隱私，因此我們採用各種措施來保護您的個人資料。</Typography>
      <br />
      <Typography>您使用本網站即表示您同意本隱私權政策的條款。如果您不同意本政策，請停止使用本網站。</Typography>
      <br />
      <ul>
        <li>我們收集的信息：我們可能會收集您的姓名、地址、電子郵件地址和其他識別信息，以及您在本網站上的瀏覽和交易歷史記錄。</li>
        <li>
          信息的使用：我們可能會使用您的信息來改進我們的產品和服務，以及向您提供個性化的廣告和促銷信息。此外，我們可能會將您的信息分享給我們的合作夥伴，以便他們向您提供相關的產品和服務。
        </li>
        <li>
          信息的保護：我們會採用各種技術和措施來保護您的信息，以防止未經授權的訪問、使用或泄露。但是，由於互聯網的本質，我們無法保證信息的絕對安全。
        </li>
        <li>
          Cookie和其他技術：我們可能會使用Cookie和其他類似技術來收集關於您的信息。這些技術可以幫助我們了解您的喜好和興趣，以便為您提供更好的產品和服務。您可以隨時通過瀏覽器設置拒絕Cookie，但這可能會影響您使用本網站的某些功能。
        </li>
        <li>兒童隱私：我們不會故意收集未滿13歲的兒童的個人信息。如果我們發現自己收集了未滿13歲的兒童的個人信息，我們將立即刪除這些信息。</li>
      </ul>
      <br />
      <Typography>如果您對本政策有任何疑問或關注，請聯繫我們的客戶服務部門。</Typography>
    </MobileDialogLayout>
  );
};
