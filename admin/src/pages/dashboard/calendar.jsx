import React, { useEffect, useState } from "react";
import { Button, Tooltip, Typography } from "@material-tailwind/react";
import { getBookingDays } from "@/apiClient";
import { useQuery } from "react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import NewBookingModal from "@/components/newBookingModal";
import { toast } from "sonner";
// import IndianDate from "@/utils/date";

export const Calendar = () => {
  const [modelOpen, setModelOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new IndianDate());
  const [selectDate, setSelectDate] = useState({
    checkIn: null,
    checkOut: null,
  });
  const [allowedDays, setAllowedDays] = useState([]);

  const { data: avilableDays, isLoading: isAvilableDaysLoading } = useQuery(
    [
      "booking-days-availability",
      currentDate.getMonth(),
      currentDate.getFullYear(),
      modelOpen,
    ],
    () =>
      getBookingDays({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      })
  );
  function dayAvailability(selectedDate, dataArray) {
    let res = dataArray.map((item) => {
      if (new IndianDate(item.date) <= new IndianDate(selectedDate)) {
        return false;
      }
      return item;
    });
    const checkInIndex = res.findIndex((item) => item.isCheckIn === true);

    res = res.map((item, index) => {
      if (item === true) return true;
      if (item === false) return false;
      if (checkInIndex === -1) return true;
      if (index <= checkInIndex) {
        return true;
      }
      return false;
    });
    return res;
  }

  useEffect(() => {
    if (selectDate.checkIn && avilableDays) {
      const data = dayAvailability(selectDate.checkIn, avilableDays);
      setAllowedDays(data);
    }
  }, [selectDate.checkIn, avilableDays]);

  useEffect(() => {
    if (avilableDays && selectDate.checkIn && selectDate.checkOut) {
      setModelOpen(true);
    }
  }, [selectDate.checkOut, avilableDays]);

  const handleSelectDate = (
    date,
    isLoading,
    isBooked,
    isCheckInDate,
    isPastDate,
    isCheckInSelected,
    isCheckOutSelected,
    index
  ) => {
    if (isLoading) return;
    if (date === selectDate.checkIn) {
      setSelectDate({ checkIn: null, checkOut: null });
      return;
    }
    if (date === selectDate.checkOut) {
      setSelectDate({ ...selectDate, checkOut: null });
      return;
    }
    if (isPastDate) return;
    if (isCheckInSelected || isCheckOutSelected) return;
    if (isBooked) {
      if (selectDate.checkIn && isCheckInDate) {
        if (
          selectDate.checkIn &&
          !selectDate.checkOut &&
          selectDate.checkIn >= date
        ) {
          return;
        }
        return setSelectDate({ ...selectDate, checkOut: date });
      }
      return;
    }
    if (!selectDate?.checkIn)
      return setSelectDate({ checkIn: date, checkOut: null });
    if (!selectDate?.checkOut) {
      if (selectDate.checkIn && selectDate.checkIn >= date) {
        return;
      }
      if (selectDate.checkIn && !allowedDays?.[index]) {
        return;
      }
      return setSelectDate({ ...selectDate, checkOut: date });
    }
    if (selectDate?.checkIn && selectDate?.checkOut)
      return setSelectDate({ checkIn: date, checkOut: null });
  };

  const daysInMonth = () => {
    const firstDay = new IndianDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const lastDay = new IndianDate(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    function isPastDay(dateString) {
      const inputDate = new IndianDate(dateString);
      const today = new IndianDate();

      // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
      today.setHours(0, 0, 0, 0);

      return inputDate < today;
    }

    function areDatesEqual(d1, d2) {
      const date1 = new IndianDate(d1);
      const date2 = new IndianDate(d2);

      const day1 = date1.getDate();
      const month1 = date1.getMonth();
      const year1 = date1.getFullYear();

      const day2 = date2.getDate();
      const month2 = date2.getMonth();
      const year2 = date2.getFullYear();

      return day1 === day2 && month1 === month2 && year1 === year2;
    }

    const liClass = (
      isLoading,
      date,
      isBooked,
      isCheckInDate,
      isPastDate,
      isCheckInSelected,
      isCheckOutSelected,
      index
    ) => {
      if (isLoading)
        return "bg-[#00000010] text-slate-800 cursor-pointer hover:bg-blue-500 hover:text-white";
      if (isPastDate) return "bg-orange-400 text-slate-100 cursor-not-allowed";
      if (isCheckInSelected || isCheckOutSelected)
        return "bg-blue-500 text-white";

      if (isBooked) {
        if (selectDate.checkIn && isCheckInDate) {
          if (
            (selectDate.checkIn &&
              !selectDate.checkOut &&
              selectDate.checkIn >= date) ||
            !allowedDays?.[index]
          ) {
            return "bg-red-100 text-slate-100 hover:bg-red-500  cursor-not-allowed";
          }
          return "bg-[#00000010] text-slate-800 cursor-pointer hover:bg-blue-500 hover:text-white";
        }
        return "bg-red-100 text-slate-100 hover:bg-red-500 cursor-not-allowed";
      }
      if (!selectDate?.checkIn)
        return "bg-[#00000010] text-slate-800 cursor-pointer hover:bg-blue-500 hover:text-white";
      if (!selectDate?.checkOut) {
        if (selectDate.checkIn && selectDate.checkIn >= date) {
          return "bg-red-100 text-slate-100 hover:bg-red-500  cursor-not-allowed";
        }
        if (selectDate.checkIn && !allowedDays?.[index]) {
          return "bg-red-100 text-slate-100 hover:bg-red-500  cursor-not-allowed";
        }
        return "bg-[#00000010] text-slate-800 cursor-pointer hover:bg-blue-500 hover:text-white";
      }
      if (selectDate?.checkIn && selectDate?.checkOut) return "Select check-in";
      return "bg-[#00000010] text-slate-800 cursor-pointer hover:bg-blue-500 hover:text-white";
    };

    const liTooltip = (
      index,
      isLoading,
      date,
      isBooked,
      isCheckInDate,
      isPastDate,
      isCheckInSelected,
      isCheckOutSelected
    ) => {
      if (isLoading) return "Loading..";
      if (isPastDate) return "Past dates are not allowed to book";
      if (isCheckInSelected || isCheckOutSelected) return "Already selected";
      if (isBooked) {
        if (selectDate.checkIn && isCheckInDate) {
          if (
            selectDate.checkIn &&
            !selectDate.checkOut &&
            selectDate.checkIn >= date
          ) {
            return "Check-out should be greater then check-in";
          }
          if (allowedDays?.[index]) {
            return "Select check-out";
          }
          return "Not allowed";
        }
        return "Already booked";
      }
      if (!selectDate?.checkIn) return "Select check-in";
      if (!selectDate?.checkOut) {
        if (selectDate.checkIn && selectDate.checkIn >= date) {
          return "Check-out should be greater then check-in";
        }
        if (selectDate.checkIn && !allowedDays?.[index]) {
          return "Not allowed";
        }
        return "Select check-out";
      }
      if (selectDate?.checkIn && selectDate?.checkOut) return "Select check-in";
    };

    // Create an array with empty cells before the first day
    const emptyCells = Array.from({ length: firstDay }, (_, i) => null);

    // Create an array with the days of the month
    let monthDays = Array.from({ length: lastDay }, (_, i) => i + 1);
    monthDays = monthDays.map((day, index) => (
      <Tooltip
        content={liTooltip(
          index,
          isAvilableDaysLoading,
          avilableDays?.[index]?.date,
          avilableDays?.[index]?.isBooked,
          avilableDays?.[index]?.isCheckIn,
          isPastDay(avilableDays?.[index]?.date),
          areDatesEqual(avilableDays?.[index]?.date, selectDate.checkIn),
          areDatesEqual(avilableDays?.[index]?.date, selectDate.checkOut)
        )}
      >
        <div
          className={`p-6 pb-8 rounded-md font-semibold ${liClass(
            isAvilableDaysLoading,
            avilableDays?.[index]?.date,
            avilableDays?.[index]?.isBooked,
            avilableDays?.[index]?.isCheckIn,
            isPastDay(avilableDays?.[index]?.date),
            areDatesEqual(avilableDays?.[index]?.date, selectDate.checkIn),
            areDatesEqual(avilableDays?.[index]?.date, selectDate.checkOut),
            index
          )}`}
          onClick={() =>
            handleSelectDate(
              avilableDays?.[index]?.date,
              isAvilableDaysLoading,
              avilableDays?.[index]?.isBooked,
              avilableDays?.[index]?.isCheckIn,
              isPastDay(avilableDays?.[index]?.date),
              areDatesEqual(avilableDays?.[index]?.date, selectDate.checkIn),
              areDatesEqual(avilableDays?.[index]?.date, selectDate.checkOut),
              index
            )
          }
        >
          {day}
        </div>
      </Tooltip>
    ));

    // Concatenate the arrays to include empty cells at the beginning
    return [...emptyCells, ...monthDays];
  };

  const showPrevMonth = () => {
    setCurrentDate(
      new IndianDate(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const showNextMonth = () => {
    setCurrentDate(
      new IndianDate(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleClose = () => {
    setModelOpen(false);
    setSelectDate({
      checkIn: null,
      checkOut: null,
    });
  };
  return (
    <>
      <NewBookingModal
        open={selectDate.checkIn && selectDate.checkOut && modelOpen}
        handleClose={handleClose}
        {...selectDate}
      />
      <div className="flex items-center justify-center flex-col bg-gray-100 mt-10">
        <div className="flex justify-between items-center w-full mb-6">
          <Button
            color="gray-blue"
            className="flex items-center justify-between gap-2"
            onClick={showPrevMonth}
          >
            <ChevronLeftIcon className="w-4 h-4" /> Prev
          </Button>
          <Typography variant="h3" className="text-center">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <Button
            color="gray-blue"
            onClick={showNextMonth}
            className="flex items-center justify-between gap-2"
          >
            Next <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 w-full">
          <div className="col-span-7 grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day, index) => (
                <div key={index} className="text-center font-semibold">
                  {day}
                </div>
              )
            )}
          </div>

          <div className="col-span-7 grid grid-cols-7 gap-3">
            {daysInMonth().map((day, index) => (
              <div key={index} className={`text-center`}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
