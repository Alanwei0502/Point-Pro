import { FC, useState } from "react";
import { AdminLayout, BookingQRCodeDialog, PanelTabs } from "~/components";
import { SeatTabs } from "./SeatTabs";
import { SeatSearchBar } from "./SeatSearchBar";
import { TabTable, TabList } from "./tab";
import { appDayjs } from "~/utils";

interface SeatContainerProps {}

export const AdminSeat: FC<SeatContainerProps> = () => {
  const [view, setView] = useState(0);
  const [date, setDate] = useState<appDayjs.Dayjs>(appDayjs());
  const [search, setSearch] = useState<string>("");

  const handleDateChange = (value: appDayjs.Dayjs | null) => {
    setDate(value ?? appDayjs());
  };
  const handleSearchChange = (value: string) => {
    setSearch(value ?? "");
  };

  return (
    <AdminLayout>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar
        view={view}
        date={date}
        handleDateChange={handleDateChange}
        handleSearchChange={handleSearchChange}
      />
      <PanelTabs value={view} index={0}>
        <TabTable date={date} />
      </PanelTabs>
      <PanelTabs value={view} index={1}>
        <TabList date={date} search={search} />
      </PanelTabs>
      <BookingQRCodeDialog />
    </AdminLayout>
  );
};
