import { FC } from 'react';
import { MobileStepper } from '@mui/material';
import { MobileButton } from '~/components';
import { MobileBookingDialog } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setStep, setDialog, postReservation } from '~/store/slices';
import { toast } from 'react-toastify';
import { emailRegex, phoneRegex } from '~/utils';

interface IBookingStepsProps {
  stepLength: number;
}
export const BookingSteps: FC<IBookingStepsProps> = (props) => {
  const { stepLength } = props;

  const dispatch = useAppDispatch();

  const step = useAppSelector(({ booking }) => booking.step);
  const selectedDate = useAppSelector(({ booking }) => booking.selectedDate);
  const selectedPeriod = useAppSelector(({ booking }) => booking.selectedPeriod);
  const people = useAppSelector(({ booking }) => booking.people);
  const username = useAppSelector(({ booking }) => booking.username);
  const phone = useAppSelector(({ booking }) => booking.phone);
  const email = useAppSelector(({ booking }) => booking.email);
  const isAgreedPrivacyPolicy = useAppSelector(({ booking }) => booking.isAgreedPrivacyPolicy);

  const isNotFirstStep = step !== 0;
  const isNotLastStep = step !== stepLength - 1;

  const isBookingNextStepBtnDisabled = () => {
    switch (step) {
      case 0:
        return !(selectedDate && selectedPeriod && people);
      case 1: {
        if (email) {
          return !(username && phoneRegex.test(phone) && emailRegex.test(email) && isAgreedPrivacyPolicy);
        } else {
          return !(username && phoneRegex.test(phone) && isAgreedPrivacyPolicy);
        }
      }

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

  const handleConfirm = () => {
    toast.promise(
      async () => {
        await dispatch(postReservation()).unwrap();
        dispatch(setDialog(MobileBookingDialog.REMINDER));
      },
      {
        pending: '訂位中...',
        success: '已為您安排訂位',
        error: '訂位失敗',
      },
    );
  };

  return (
    <MobileStepper
      variant='progress'
      steps={stepLength}
      activeStep={step}
      backButton={
        <>
          {isNotFirstStep && <MobileButton onClick={handleGoBack}>回上一步</MobileButton>}
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
