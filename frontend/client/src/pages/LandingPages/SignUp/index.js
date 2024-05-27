// @mui material components
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// @mui icons

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Material Kit 2 React example components

// Material Kit 2 React page layout routes
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpg";
import "assets/css/sweetAlertStyle.css";

function SignUpBasic() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    gender: "",
  });
  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/client/register", formData);
      console.log("Sign up successful", response.data);
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        password: "",
        gender: "",
      });
      Swal.fire({
        title: "Success!",
        text: "You have successfully signed up.",
        icon: "success",
        button: "OK",
      }).then(() => {
        // Redirect to sign-in page after successful registration
        window.location.href = "/pages/authentication/sign-in";
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;

        if (errors.email) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errors.email.join(", "),
            customClass: {
              container: "custom-swal-container", // Use custom class
            },
          });
        } else if (errors.password) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errors.password.join(", "),
            customClass: {
              container: "custom-swal-container", // Use custom class
            },
          });
        } else {
          let errorMessage = "";
          for (const key in errors) {
            errorMessage += `${errors[key].join(", ")}\n`;
          }
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            customClass: {
              container: "custom-swal-container", // Use custom class
            },
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the user",
          customClass: {
            container: "custom-swal-container", // Use custom class
          },
        });
      }
      console.error("Sign up failed", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  return (
    <>
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={8} lg={4} xl={3}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={0}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Sign Up
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form">
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="email"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Phone number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="password"
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Gender</FormLabel>
                      <MKBox>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="gender"
                              value="male"
                              checked={formData.gender === "male"}
                              onChange={handleChange}
                            />
                          }
                          label="Male"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="gender"
                              value="female"
                              checked={formData.gender === "female"}
                              onChange={handleChange}
                            />
                          }
                          label="Female"
                        />
                      </MKBox>
                    </FormControl>
                  </MKBox>
                  <MKBox mt={3} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth onClick={handleSignUp}>
                      sign up
                    </MKButton>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default SignUpBasic;
