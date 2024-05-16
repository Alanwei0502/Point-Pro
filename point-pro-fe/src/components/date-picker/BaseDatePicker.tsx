import { FC } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types";
import { DateValidationError } from "@mui/x-date-pickers";

interface IBaseDatePickerProps {
  label?: React.ReactNode;
  defaultValue?: string | null | undefined;
  value?: string | null | undefined;
  onChange?: ((value: string | null, context: PickerChangeHandlerContext<DateValidationError>) => void) | undefined;
}

export const BaseDatePicker: FC<IBaseDatePickerProps> = ({ label, defaultValue, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={label} defaultValue={defaultValue} value={value} onChange={onChange} />
    </LocalizationProvider>
  );
};
