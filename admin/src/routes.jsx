import {
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
  DocumentTextIcon,
  PhotoIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";
import {
  Profile,
  ContactForms,
  Images,
  BookingHistory,
  Calendar,
} from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <PhotoIcon {...icon} />,
        name: "Images",
        path: "/images",
        element: <Images />,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Calendar",
        path: "/calendar",
        element: <Calendar />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Booking History",
        path: "/booking-history",
        element: <BookingHistory />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "Contact Forms",
        path: "/contact-forms",
        element: <ContactForms />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "log in",
        path: "/log-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
