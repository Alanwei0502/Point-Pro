import { FC, memo, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { TableCircle, TableNormal, Periods } from "./index.styles";
import { headerHeight } from "~/components";
import { useAppDispatch } from "~/hooks";
import { getSeatById, getSeats, getPeriodByDate } from "~/store/slices";
import { PeriodInfo, SeatInfo, SeatDetails, SeatsPayload } from "~/types";
import { appDayjs, convertToDatePayload } from "~/utils";
import { SeatDetail } from "~/features/admin/seat/tab/SeatDetail";

interface ITabTableProps {
  date: appDayjs.Dayjs;
}

const circleSeatList = ["G-1", "G-2", "G-3"];

const normalSeatList = [
  ["A-1", "A-2", "A-3", "A-4", "A-5", "A-6"],
  ["B-1", "B-2", "B-3", "B-4", "B-5", "B-6"],
  ["C-1", "C-2", "C-3", "C-4", "C-5", "C-6"]
];

export const TabTable: FC<ITabTableProps> = ({ date }) => {
  const [seats, setSeats] = useState<{ [no: string]: SeatInfo }>();
  const [periods, setPeriods] = useState<PeriodInfo[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<string>("");
  const [seatDteail, setSeatDetail] = useState<SeatDetails | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatchGetPeriodByDate();
  }, [date]);

  useEffect(() => {
    if (selectedPeriod) {
      dispatchGetSeats(selectedPeriod);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedSeat) {
      dispatchGetSeatById();
    }
  }, [selectedSeat]);

  const dispatchGetSeatById = async () => {
    const { result } = await dispatch(getSeatById({ seatId: selectedSeat, date: convertToDatePayload(date) })).unwrap();
    setSeatDetail(result);
  };

  const dispatchGetSeats = async (periodId?: string) => {
    const payload: SeatsPayload = { date: convertToDatePayload(date) };
    if (periodId) {
      payload.periodId = periodId;
    }
    const { result } = await dispatch(getSeats(payload)).unwrap();
    setSeats(formatSeatResponseToData(result));
  };

  const dispatchGetPeriodByDate = async () => {
    const { result } = await dispatch(getPeriodByDate({ date: convertToDatePayload(date) })).unwrap();

    if (!result) return; // TODO

    const payload = result.periods.filter((e: PeriodInfo) => appDayjs().isBefore(e.periodEndedAt));
    setPeriods(payload);
    if (date.isToday()) {
      let defaultSelect = result.periods.find((e: PeriodInfo) =>
        appDayjs().isBetween(e.periodStartedAt, e.periodEndedAt)
      );
      if (!defaultSelect) {
        defaultSelect = payload[0];
      }
      setSelectedPeriod(defaultSelect.id);
    } else {
      setSelectedPeriod(result.periods[0].id);
    }
  };

  const formatSeatResponseToData = (res: any[] | null) => {
    let data: any = {};
    res &&
      res.forEach((e: any) => {
        data[e.seatNo] = e;
      });
    return data;
  };

  const handlePeriodClick = (periodId: string) => {
    setSelectedPeriod(periodId);
  };

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
  };

  const handleSeatDetailClose = () => {
    setSelectedSeat("");
    setSeatDetail(null);
  };

  return (
    <Stack direction="row" sx={{ p: 0, height: `calc(100vh - ${headerHeight} - 50px - 72px)`, width: "100%" }}>
      <Periods periods={periods} selected={selectedPeriod} handleClick={handlePeriodClick} />
      {seats ? (
        <Stack sx={{ p: 3, width: "calc(100vw - 200px)", overflow: "auto" }}>
          <Stack direction="row" justifyContent="space-around">
            {circleSeatList.map((g) => (
              <TableCircle key={g} state={seats[g]} handleClick={handleSeatSelect} />
            ))}
          </Stack>
          {normalSeatList.map((row, key) => (
            <Stack
              key={`row-${String.fromCharCode(key + 65)}`}
              direction="row"
              sx={{ mt: 3 }}
              justifyContent="space-evenly"
            >
              {row.map((e) => (
                <TableNormal key={e} state={seats[e]} handleClick={handleSeatSelect} />
              ))}
            </Stack>
          ))}
        </Stack>
      ) : null}
      {!!seatDteail && (
        <SeatDetail
          open={!!seatDteail}
          onClose={handleSeatDetailClose}
          state={seatDteail}
          update={dispatchGetSeatById}
          selectedPeriod={selectedPeriod}
        />
      )}
    </Stack>
  );
};
