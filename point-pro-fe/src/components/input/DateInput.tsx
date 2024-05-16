import { FC } from "react";
import { ButtonBase, DialogActions } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, PickersActionBarProps, DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { appDayjs } from "~/utils";

export const DateInput: FC<DatePickerProps<appDayjs.Dayjs>> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        defaultValue={appDayjs()}
        slots={{
          actionBar: (props: PickersActionBarProps) => (
            <DialogActions className={props.className} sx={{ padding: ".5rem" }}>
              <ButtonBase
                onClick={props.onAccept}
                sx={{
                  fontSize: "body1.fontSize",
                  bgcolor: "primary.main",
                  padding: ".5rem",
                  borderRadius: ".5rem",
                  width: "100%"
                }}
              >
                確定
              </ButtonBase>
            </DialogActions>
          )
        }}
        slotProps={{
          toolbar: {
            hidden: true
          },
          actionBar: {
            actions: ["accept"]
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};
