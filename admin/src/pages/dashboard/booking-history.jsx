import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { getBookingHistory } from "@/apiClient/bookingHistory";
import { useQuery } from "react-query";
import { CheckCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { DatePicker, UpdateBookingModal } from "@/components";
import { StatisticsCard } from "@/widgets/cards";
import { statisticsCardsData } from "@/data";
import { getBookingtStatics } from "@/apiClient";
// import IndianDate from "@/utils/date";

export function BookingHistory() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalStatus, setModalStatus] = useState({
    isOpen: false,
    updateId: null,
  });

  useEffect(() => {
    const today = new IndianDate();
    const oneMonthAgo = new IndianDate();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    setStartDate(oneMonthAgo);
    setEndDate(today);
  }, []);

  const { data: BookingHistory } = useQuery(
    ["booked-history", startDate, endDate],
    () => {
      if (startDate && endDate) {
        return getBookingHistory(startDate, endDate);
      }
    }
  );
  const { data: BookingStatics } = useQuery(["booked-statics"], () =>
    getBookingtStatics()
  );

  const handleStartDateSelect = (date) => {
    setStartDate(date);
  };

  const handleEndDateSelect = (date) => {
    setEndDate(date);
  };

  function formatDate(inputDateString) {
    const inputDate = new IndianDate(inputDateString);

    const options = {
      // weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }
  const bookedCount = BookingHistory?.filter(
    (i) => !i.isCanceled.isCanceled && i.paymentStatus === "success"
  ).length;

  useEffect(() => {
    if (BookingStatics) {
      statisticsCardsData[0].value = (
        <span>
          {Math.floor(
            Number(BookingStatics?.currentMonthRevenue?.value) / 1000
          )}
          k
        </span>
      );
      statisticsCardsData[0].footer.value = `${BookingStatics?.currentMonthRevenue?.value}%`;
      statisticsCardsData[1].value = (
        <span>
          {Math.floor(Number(BookingStatics?.currentYearRevenue?.value) / 1000)}
          k
        </span>
      );
      statisticsCardsData[1].footer.value = `${BookingStatics?.currentYearRevenue?.value}%`;
      statisticsCardsData[2].value = (
        <span>&#8377; {BookingStatics?.overallRevenueAfterTax}</span>
      );
      statisticsCardsData[3].value = (
        <span>{BookingStatics?.averageMonthlyBookings}</span>
      );
    }
  }, [BookingStatics]);

  return (
    <div>
      <UpdateBookingModal
        open={modalStatus.isOpen}
        handleOpen={() => {
          setModalStatus({
            ...modalStatus,
            isOpen: !modalStatus.isOpen,
          });
        }}
        defaultData={
          Array.isArray(BookingHistory) &&
          modalStatus?.updateId &&
          BookingHistory.filter((i) => i._id === modalStatus.updateId)[0]
        }
        id={modalStatus?.updateId}
      />
      <div className="mt-7 mb-8 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData?.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              footer && (
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer?.color}>{footer?.value}</strong>
                  &nbsp;{footer?.label}
                </Typography>
              )
            }
          />
        ))}
      </div>
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Booking History
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <CheckCircleIcon
                strokeWidth={3}
                className="h-4 w-4  text-green-700"
              />
              <strong>{bookedCount}</strong> Booked Room
            </Typography>
          </div>
          <div className="flex justify-end mb-4">
            <DatePicker
              label="Select Start Date"
              onDateSelect={handleStartDateSelect}
              className="pr-4"
              selected={startDate}
            />
            <DatePicker
              label="Select End Date"
              onDateSelect={handleEndDateSelect}
              selected={endDate}
            />
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Booking on",
                  "check in",
                  "check out",
                  "booked by",
                  "booking type",
                  "is canceled",
                  "payment status",
                  "Amount",
                  "Actions",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="font-medium uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BookingHistory?.slice(0, itemsPerPage).map((booking, key) => {
                const className = `py-3 px-5 ${
                  key === BookingHistory.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;
                const {
                  _id,
                  createdAt,
                  checkIn,
                  checkOut,
                  bookedBy,
                  isOnline,
                  isCanceled,
                  paymentStatus,
                  total_rent,
                  total_tax,
                } = booking;

                return (
                  <tr key={`${checkIn}-${key}`}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium text-blue-gray-600"
                        >
                          {formatDate(createdAt)}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium text-blue-gray-600"
                        >
                          {formatDate(checkIn)}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-600"
                      >
                        {formatDate(checkOut)}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="w-10/12">
                        <Typography
                          variant="small"
                          className="mb-1 block font-medium text-blue-gray-600"
                        >
                          {bookedBy}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={!isOnline ? "grey" : "blue"}
                        value={isOnline ? "Online" : "Offline"}
                        className="py-0.5 px-2 font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={!isCanceled.isCanceled ? "green" : "red"}
                        value={
                          !isCanceled.isCanceled ? "Not Canceled" : "Canceled"
                        }
                        className="py-0.5 px-2 font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={paymentStatus === "success" ? "green" : "red"}
                        value={paymentStatus ?? "failed"}
                        className="py-0.5 px-2 font-medium w-fit"
                      />
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-semibold text-blue-gray-600"
                      >
                        &#8377;{total_rent + total_tax}
                      </Typography>
                    </td>
                    <td className={`${className} flex justify-end`}>
                      <Tooltip content="View">
                        <IconButton
                          variant="outlined"
                          className="mr-8"
                          onClick={() => {
                            setModalStatus({
                              ...modalStatus,
                              isOpen: !modalStatus.isOpen,
                              updateId: _id,
                            });
                            // setUpdateBookingId(_id)
                          }}
                        >
                          <PencilSquareIcon
                            strokeWidth={5}
                            className="w-5 h-5 text-black"
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {BookingHistory?.length > itemsPerPage && (
              <button
                onClick={() => setItemsPerPage(itemsPerPage + 10)}
                className="mt-2 ml-5 text-blue-500 underline cursor-pointer"
              >
                Show More
              </button>
            )}
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default BookingHistory;
