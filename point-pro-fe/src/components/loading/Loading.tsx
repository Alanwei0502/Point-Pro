import { FC } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface ILoadingProps {
  open: boolean;
}

const Loading: FC<ILoadingProps> = (props) => {
  const { open } = props;
  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
