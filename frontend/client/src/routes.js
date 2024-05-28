// routes.js
import React from "react";
import Icon from "@mui/material/Icon";
import SignIn from "layouts/pages/authentication/sign-in";
import SignUp from "layouts/pages/authentication/sign-up";
import SignOut from "pages/LandingPages/SignOut";
import Profile from "pages/LandingPages/Profile";

const accessToken = localStorage.getItem("access_token");

const routes = [
  accessToken
    ? {
        name: "user",
        icon: <Icon>person</Icon>,
        collapse: [
          {
            name: "profile",
            route: "/profile",
            component: <Profile />, // Ensure this renders the menu appropriately
          },
          {
            name: "sign out",
            route: "/pages/authentication/sign-out",
            component: <SignOut />,
          },
        ],
      }
    : {
        name: "sign in",
        icon: <Icon>login</Icon>,
        route: "/pages/authentication/sign-in",
        component: <SignIn />,
      },
  accessToken
    ? {
        name: "about us",
        icon: <Icon>info</Icon>, // You can use any suitable icon here
        route: "/pages/about-us",
        component: null,
      }
    : {
        name: "sign up",
        icon: <Icon>person_add</Icon>,
        route: "/pages/authentication/sign-up",
        component: <SignUp />,
      },
];

export default routes;
