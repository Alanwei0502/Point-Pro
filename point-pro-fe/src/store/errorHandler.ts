import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const errorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    toast.error(error.response?.statusText, { autoClose: 2000 });
  } else if (error instanceof Error) {
    toast.error(error.message, { autoClose: 2000 });
  } else {
    toast.error('unknown error', { autoClose: 2000 });
  }
};
