import { FC } from 'react';
import { MobileStepper } from '@mui/material';
import { MobileButton } from '~/components';
import { CustomerBookingDialog } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setStep, setDialog, postReservation } from '~/store/slices';

interface IBookingStepsProps {
  stepLength: number;
}
export const BookingSteps: FC<IBookingStepsProps> = (props) => {
  const { stepLength } = props;

  const dispatch = useAppDispatch();

  const step = useAppSelector(({ customerReservation }) => customerReservation.step);
  const reservedAt = useAppSelector(({ customerReservation }) => customerReservation.reservationParams.reservedAt);
  const { name, phone, email, adults } = useAppSelector(
    ({ customerReservation }) => customerReservation.reservationParams.user,
  );
  const isAgreedPrivacyPolicy = useAppSelector(({ customerReservation }) => customerReservation.isAgreedPrivacyPolicy);

  const isNotFirstStep = step !== 0;
  const isNotLastStep = step !== stepLength - 1;

  const isBookingNextStepBtnDisabled = () => {
    switch (step) {
      case 0:
        return !(reservedAt && adults);
      case 1:
        return !(name && phone && email && isAgreedPrivacyPolicy);
      case 2:
        return false;
      default:
        return true;
    }
  };

  const handleGoBack = () => {
    dispatch(setStep(step - 1));
  };

  const handleGoNext = () => {
    dispatch(setStep(step + 1));
  };

  const handleConfirm = async () => {
    // TODO: post reservation
    // await dispatch(postReservation());
    dispatch(setDialog(CustomerBookingDialog.REMINDER));
  };

  return (
    <MobileStepper
      variant='progress'
      steps={stepLength}
      activeStep={step}
      backButton={
        <>
          {isNotFirstStep && (
            <MobileButton
              onClick={handleGoBack}
              sx={{
                bgcolor: 'common.white',
                border: '.5px solid',
                '&:hover': { backgroundColor: 'common.white' },
              }}
            >
              回上一步
            </MobileButton>
          )}
          {!isNotLastStep && <MobileButton onClick={handleConfirm}>確認預定</MobileButton>}
        </>
      }
      nextButton={
        isNotLastStep && (
          <MobileButton onClick={handleGoNext} disabled={isBookingNextStepBtnDisabled()}>
            下一步
          </MobileButton>
        )
      }
      sx={{
        display: 'flex',
        gap: '1rem',
        width: '100vw',
        maxWidth: '768px',
        margin: '0 auto',
        paddingBottom: '1.5rem',
        '.MuiLinearProgress-root': { display: 'none' },
      }}
    />
  );
};
