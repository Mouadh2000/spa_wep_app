
// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import Users from "layouts/users";
import Clients from "layouts/clients";
import Services from "layouts/services";
import Categories from "layouts/categories";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import ArgonBox from "components/ArgonBox";
import CustomCalendar from "layouts/Calendar";

const routes = [
  {
    type: "route",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <ArgonBox component="i" color="primary" fontSize="14px" className="ni ni-tv-2" />,
    component: <Dashboard />,
  },
  {
    type: "route",
    name: "Users",
    key: "users",
    route: "/users",
    icon: (
      <ArgonBox component="i" color="yellow" fontSize="14px" className="fa-solid fa-user" />
    ),
    component: <Users />,
  },
  {
    type: "route",
    name: "Clients",
    key: "clients",
    route: "/clients",
    icon: (
      <ArgonBox component="i" color="green" fontSize="14px" className="fa-solid fa-user" />
    ),
    component: <Clients />,
  },
  {
    type: "route",
    name: "Services",
    key: "services",
    route: "/services",
    icon: (
      <ArgonBox component="i" color="blue" fontSize="14px" className="fa-solid fa-list" />
    ),
    component: <Services />,
  },
  {
    type: "route",
    name: "Categories",
    key: "categories",
    route: "/categories",
    icon: (
      <ArgonBox component="i" color="red" fontSize="14px" className="fa-solid fa-layer-group" />
    ),
    component: <Categories />,
  },
  {
    type: "route",
    name: "Calendar",
    key: "Planning",
    route: "/calendar",
    icon: (
      <ArgonBox component="i" color="orange" fontSize="14px" className="fa-regular fa-calendar-days" />
    ),
    component: <CustomCalendar />,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "route",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
  },
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
    ),
    component: <SignIn />,
  },
];

export default routes;
