import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// TODO: delete
export const errorHandler = (error: unknown) => {
  console.error(error);

  if (error instanceof AxiosError) {
    toast.error(error.response?.statusText);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('unknown error');
  }
};
