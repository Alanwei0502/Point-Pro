import { FC, Dispatch, SetStateAction } from "react";
import { Tab, Tabs } from "@mui/material";

interface ISeatViewProps {
  view: number;
  setView: Dispatch<SetStateAction<number>>;
}

enum View {
  SEAT_VIEW = "SEAT_VIEW",
  TABLE_VIEW = "TABLE_VIEW"
}
const tabs = [
  { value: View.SEAT_VIEW, title: "座位表", id: View.SEAT_VIEW },
  { value: View.TABLE_VIEW, title: "列表", id: View.TABLE_VIEW }
];

export const SeatTabs: FC<ISeatViewProps> = (props) => {
  const { view, setView } = props;

  return (
    <Tabs
      sx={{ position: "sticky", top: "0", zIndex: "10", backgroundColor: "background.paper", height: "50px" }}
      onChange={(_, value) => setView(value)}
      value={view}
    >
      {tabs.map((tab) => (
        <Tab label={tab.title} id={tab.id} key={`${tab.id}-${tab.title}`} />
      ))}
    </Tabs>
  );
};
