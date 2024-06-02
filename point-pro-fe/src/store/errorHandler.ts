import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const errorHandler = (error: unknown) => {
  if (error instanceof AxiosError) {
    toast.error(error.response?.statusText);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('unknown error');
  }
};
