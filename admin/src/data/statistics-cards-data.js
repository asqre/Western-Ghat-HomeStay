import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Monthly Revenue after tax",
    value: "",
    footer: {
      color: "text-green-500",
      value: "",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Yearly Revenue after tax",
    value: "",
    footer: {
      color: "text-green-500",
      value: "",
      label: "than last year",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Overall Revenue after tax",
    value: "",
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Avg. Monthly Bookings",
    value: "",
  },
];

export default statisticsCardsData;
