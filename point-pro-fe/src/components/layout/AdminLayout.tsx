import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { Header, headerHeight } from "~/components";

export const AdminLayout: FC<PropsWithChildren> = (props) => {
  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: "100vw", height: "100%", maxHeight: "100vh" }}>
      <Header />
      <Box sx={{ height: `calc( 100vh - ${headerHeight} )`, overflow: "auto" }}>{props.children}</Box>
    </Box>
  );
};
