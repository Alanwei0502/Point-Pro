import { FC, useState } from 'react';
import { TabPanel } from '~/components';
import { SeatTabs } from './SeatTabs';
import { SeatSearchBar } from './SeatSearchBar';
import { TabTable, TabList } from './tab';
import { appDayjs } from '~/utils';

interface SeatContainerProps {}

export const AdminSeat: FC<SeatContainerProps> = () => {
  const [view, setView] = useState(0);
  const [date, setSelectedDate] = useState<appDayjs.Dayjs>(appDayjs());
  const [search, setSearch] = useState<string>('');

  const handleDateChange = (value: appDayjs.Dayjs | null) => {
    setSelectedDate(value ?? appDayjs());
  };
  const handleSearchChange = (value: string) => {
    setSearch(value ?? '');
  };

  return (
    <>
      <SeatTabs view={view} setView={setView} />
      <SeatSearchBar view={view} date={date} handleDateChange={handleDateChange} handleSearchChange={handleSearchChange} />
      <TabPanel value={view} index={0}>
        <TabTable date={date} />
      </TabPanel>
      <TabPanel value={view} index={1}>
        <TabList date={date} search={search} />
      </TabPanel>
      {/* <BookingQRCodeDialog /> */}
    </>
  );
};
