/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import Swal from "sweetalert2";
import "assets/css/sweetAlertStyle.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MKButton from "components/MKButton";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Presentation page components

// Data

const getAllServices = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/service/views");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return []; // Return an empty array or handle error as appropriate
  }
};

function Services() {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const services = await getAllServices();
      setServicesData(services);
    };

    fetchData();
  }, []);
  const handleReservation = async (serviceId) => {
    const clientData = JSON.parse(localStorage.getItem("user"));
    const clientId = clientData.id;
    const accessToken = localStorage.getItem("access_token");
    const requestData = {
      service_id: serviceId,
      client_id: clientId,
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      await axios.post("http://localhost:8000/api/client/reservation/add", requestData, {
        headers,
      });
      Swal.fire({
        icon: "success",
        title: "Reservation Successful",
        text: "Your reservation has been made successfully!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error making reservation:", error);
      alert("Failed to make reservation. Please try again later.");
    }
  };
  const renderData = servicesData.map(({ id, service_name, description, price }) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={id}>
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <MKBox position="sticky" top="100px" pb={{ xs: 2, lg: 6 }}>
              <MKTypography variant="h3" fontWeight="bold" mb={1}>
                {service_name}
              </MKTypography>
              <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                description: {description}
              </MKTypography>
              <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                price: {price} DT
              </MKTypography>
              <MKButton
                variant="gradient"
                color="info"
                onClick={() => handleReservation(id)}
                fullWidth
              >
                Make a Reservation
              </MKButton>
            </MKBox>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ));

  return (
    <MKBox component="section" py={6}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          flexDirection="column"
          alignItems="center"
          sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
        >
          <MKTypography variant="h2" fontWeight="bold">
            Our Services
          </MKTypography>
        </Grid>
      </Container>
      <Container sx={{ mt: { xs: 8, lg: 16 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9} sx={{ mt: 3, px: { xs: 0, lg: 8 } }}>
            <Grid container spacing={3}>
              {renderData}
            </Grid>
          </Grid>
          <Grid item xs={12} lg={3}>
            <MKBox position="sticky" top="100px" pb={{ xs: 2, lg: 6 }}></MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Services;
