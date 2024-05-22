import { FC, useEffect } from 'react';
import { useAppSelector } from '~/hooks';

interface IEcPayFormModalProps {}

export const EcPayFormModal: FC<IEcPayFormModalProps> = () => {
  const ecPayResponse = useAppSelector(({ payment }) => payment.ecPayResponse);

  useEffect(() => {
    if (ecPayResponse && ecPayResponse.result) {
      const parser = new DOMParser();
      // const doc = parser.parseFromString(ecPayResponse.result, "text/html");
      const doc = parser.parseFromString('', 'text/html'); // TODO
      const form = doc.querySelector('form');
      if (form) {
        document.body.appendChild(form);
        form.submit();
      }
    }
  }, [ecPayResponse]);

  if (!ecPayResponse || !ecPayResponse.result) {
    return null;
  }

  return null;
};
