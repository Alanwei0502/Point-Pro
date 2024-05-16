import { FC } from "react";
import { Box, Typography } from "@mui/material";

interface IFooterProps {}

export const Footer: FC<IFooterProps> = () => {
  return (
    <Box sx={{ bgcolor: "common.black" }} py={3}>
      <Typography variant="small" color="white" align="center">
        © {new Date().getFullYear()} PointPro. 版權所有。保留一切權利。
      </Typography>
    </Box>
  );
};
