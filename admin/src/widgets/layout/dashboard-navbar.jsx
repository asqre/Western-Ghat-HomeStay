import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Breadcrumbs,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { useMaterialTailwindController } from "@/context";
import { useAuth } from "@/context";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

export function DashboardNavbar() {
  const { logout } = useAuth();
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <Menu>
          <MenuHandler>
            <IconButton variant="outlined" className="rounded-xl">
              <Cog6ToothIcon strokeWidth={2.5} className="h-5 w-5 gray-blue" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
