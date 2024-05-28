import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MKButton from "components/MKButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import OpinionForm from "./OpinionForm"; // Import the OpinionForm component
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import { isSunday } from "date-fns";

// Fetch client opinions from the API
const getClientsOpinion = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/clients/opinions");
    return response.data;
  } catch (error) {
    console.error("Error fetching client opinions:", error);
    return {}; // Return an empty object or handle error as appropriate
  }
};

function Services({ categoryId }) {
  const [servicesData, setServicesData] = useState([]);
  const [clientsOpinions, setClientsOpinions] = useState({});
  const [showDetails, setShowDetails] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [showDatePicker, setShowDatePicker] = useState({});

  const fetchClientsOpinions = async () => {
    try {
      // Fetch client opinions
      const opinions = await getClientsOpinion();
      setClientsOpinions(opinions);
    } catch (error) {
      console.error("Error fetching client opinions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const response = await axios.get("http://localhost:8000/api/service/views");
        const services = response.data;
        const filteredServices = services.filter((service) => service.category_id === categoryId);
        setServicesData(filteredServices);
        // Set initial state for showDetails
        const initialDetailsState = {};
        const initialDatePickerState = {};
        filteredServices.forEach(({ id }) => {
          initialDetailsState[id] = false;
          initialDatePickerState[id] = false;
        });
        setShowDetails(initialDetailsState);
        setShowDatePicker(initialDatePickerState);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (categoryId) {
      fetchData();
      fetchClientsOpinions();
    }
  }, [categoryId]);

  const handleReservation = async (serviceId) => {
    const clientData = JSON.parse(localStorage.getItem("user"));

    if (!clientData) {
      Swal.fire({
        icon: "error",
        title: "Authentication Needed",
        text: "You need to be authenticated to make a reservation.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/pages/authentication/sign-in";
      });
      return;
    }

    if (!selectedDate[serviceId]) {
      Swal.fire({
        icon: "error",
        title: "Date Needed",
        text: "Please select a date for your reservation.",
        confirmButtonText: "OK",
      });
      return;
    }

    const clientId = clientData.id;
    const accessToken = localStorage.getItem("access_token");
    const requestData = {
      service_id: serviceId,
      client_id: clientId,
      reservation_date: selectedDate[serviceId].toISOString(),
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await axios.post("http://localhost:8000/api/client/reservation/add", requestData, {
        headers,
      });
      console.log(requestData);
      Swal.fire({
        icon: "success",
        title: "Reservation Successful",
        text: "Your reservation has been made successfully!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error making reservation:", error);
      Swal.fire({
        icon: "error",
        title: "Reservation Failed",
        text: "Failed to make reservation. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const toggleDetails = (id) => {
    setShowDetails((prevDetails) => ({
      ...prevDetails,
      [id]: !prevDetails[id],
    }));
  };

  const toggleDatePicker = (id) => {
    setShowDatePicker((prevShowDatePicker) => ({
      ...prevShowDatePicker,
      [id]: !prevShowDatePicker[id],
    }));
  };

  const handleDateChange = (date, serviceId) => {
    setSelectedDate((prevDates) => ({
      ...prevDates,
      [serviceId]: date,
    }));
  };

  // Chunk services into rows of three
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const serviceChunks = chunkArray(servicesData, 3);

  const renderData = serviceChunks.map((serviceRow, rowIndex) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={`row-${rowIndex}`}>
      {serviceRow.map(({ id, service_name, description, price }) => (
        <Grid item xs={12} md={6} key={id}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardContent sx={{ flex: 1 }}>
              <MKBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <MKTypography variant="h3" fontWeight="bold" mb={1}>
                  {service_name}
                </MKTypography>
                {showDetails[id] && (
                  <>
                    <MKTypography
                      variant="body2"
                      fontWeight="regular"
                      color="secondary"
                      mb={1}
                      pr={2}
                    >
                      Description: {description}
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      fontWeight="regular"
                      color="secondary"
                      mb={1}
                      pr={2}
                    >
                      Price: {price} DT
                    </MKTypography>
                    <MKTypography
                      variant="body2"
                      fontWeight="regular"
                      color="secondary"
                      mb={1}
                      pr={2}
                    >
                      Clients Opinion: {clientsOpinions[id]}
                    </MKTypography>
                    <OpinionForm serviceId={id} onSubmit={fetchClientsOpinions} />{" "}
                    {/* Add the OpinionForm */}
                  </>
                )}
                <MKButton
                  variant="outlined"
                  color="info"
                  onClick={() => toggleDetails(id)}
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  {showDetails[id] ? "Hide Details" : "Details"}
                </MKButton>
                <MKButton
                  variant="outlined"
                  color="info"
                  onClick={() => toggleDatePicker(id)}
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  {showDatePicker[id] ? "Cancel Date" : "Select Date"}
                </MKButton>
                {showDatePicker[id] && (
                  <DatePicker
                    selected={selectedDate[id]}
                    onChange={(date) => handleDateChange(date, id)}
                    filterDate={(date) => !isSunday(date)}
                    minDate={new Date()}
                    placeholderText="Select a reservation date"
                    inline
                  />
                )}
                <MKButton
                  variant="gradient"
                  color="info"
                  onClick={() => handleReservation(id)}
                  fullWidth
                  style={{ marginTop: "10px" }}
                >
                  Make a Reservation
                </MKButton>
              </MKBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
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

// Add propTypes for prop validation
Services.propTypes = {
  categoryId: PropTypes.number.isRequired,
};

export default Services;
