// Libs
import { FC } from "react";
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import Payments from "~/features/payment";

interface IPaymentProps {}

const Payment: FC = (props) => {
  return <Payments.PaymentReturnContainer {...props} />;
};

export default withMobileLayout(Payments.PaymentReturnContainer);
