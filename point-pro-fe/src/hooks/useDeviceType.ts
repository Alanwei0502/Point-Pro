import { useMediaQuery, useTheme } from "@mui/material";

export const useDeviceType = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  return isTablet ? "tablet" : "mobile";
};
