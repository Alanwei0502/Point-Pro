import styled from "@emotion/styled";
import { BaseButton } from "~/components";

export const MobileButton = styled(BaseButton)(({ theme }) => ({
  width: "100%",
  margin: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.black,
  fontWeight: 700,
  fontSize: "1.25rem",
  "&:hover": {
    backgroundColor: theme.palette.primary.main
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.common.black_20,
    color: theme.palette.common.black_60
  }
}));
