// @mui material components
import Icon from "@mui/material/Icon";

// @mui icons

// Pages
import SignIn from "layouts/pages/authentication/sign-in";
import SignUp from "layouts/pages/authentication/sign-up";

const routes = [
  {
    name: "sign in",
    icon: <Icon>login</Icon>,
    route: "/pages/authentication/sign-in",
    component: <SignIn />,
  },
  {
    name: "sign up",
    icon: <Icon>person_add</Icon>,
    route: "/pages/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
