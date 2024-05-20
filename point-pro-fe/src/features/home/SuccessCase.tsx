import { FC } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Column, Row } from "~/components";
import { Title } from "./index.styles";
import { theme } from "~/theme";
import { useDeviceType } from "~/hooks";

export const SuccessCase: FC = () => {
  const deviceType = useDeviceType();

  return (
    <Box pt={20} pb={10}>
      <Container>
        <Typography variant="h3">成功案例</Typography>
        <Column
          sx={{
            margin: "1rem 0"
          }}
        >
          <Row sx={{ gap: deviceType === "tablet" ? "6.5rem" : "2.5rem" }}>
            <Title title="港都熱炒" subtitle="老闆、員工、客人都開心，體驗 PointPro 更簡單、更有效率的餐飲體驗" />
          </Row>
        </Column>
        <Box sx={{ display: "flex", width: "100%", flexDirection: deviceType === "tablet" ? "row" : "column" }}>
          <Box sx={{ flexGrow: "1", margin: "1rem" }}>
            <Button
              endIcon={<InsertInvitationIcon />}
              sx={{
                border: `.2rem solid ${theme.palette.primary.main}`,
                color: theme.palette.common.black,
                width: "100%",
                borderRadius: "2rem"
              }}
              onClick={() => {
                window.location.href = `${window.location.origin}/booking`;
              }}
            >
              我要預約
            </Button>
          </Box>
          <Box sx={{ flexGrow: "1", margin: "1rem" }}>
            <Button
              endIcon={<RestaurantMenuIcon />}
              sx={{
                border: `.2rem solid ${theme.palette.primary.main}`,
                color: theme.palette.common.black,
                width: "100%",
                borderRadius: "2rem"
              }}
              onClick={() => {
                window.location.href = `${window.location.origin}/orders`;
              }}
            >
              我要點餐
            </Button>
          </Box>
          <Box sx={{ flexGrow: "1", margin: "1rem" }}>
            <Button
              endIcon={<ManageAccountsIcon />}
              sx={{
                border: `.2rem solid ${theme.palette.primary.main}`,
                color: theme.palette.common.black,
                width: "100%",
                borderRadius: "2rem"
              }}
              onClick={() => {
                window.location.href = `${window.location.origin}/admin`;
              }}
            >
              後台管理
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
