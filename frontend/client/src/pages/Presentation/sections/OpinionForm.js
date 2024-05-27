import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

function OpinionForm({ serviceId, onSubmit }) {
  const [opinion, setOpinion] = useState("");

  const handleInputChange = (event) => {
    setOpinion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientData = JSON.parse(localStorage.getItem("user"));
    if (!clientData) {
      Swal.fire({
        icon: "error",
        title: "Authentication Needed",
        text: "You need to be authenticated to submit an opinion.",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/pages/authentication/sign-in";
      });
      return;
    }

    const clientId = clientData.id;
    const accessToken = localStorage.getItem("access_token");
    const requestData = {
      service_id: serviceId,
      client_id: clientId,
      opinion,
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      await axios.post("http://localhost:8000/api/client/add/opinion", requestData, {
        headers,
      });
      Swal.fire({
        icon: "success",
        title: "Opinion Submitted",
        text: "Your opinion has been submitted successfully!",
        confirmButtonText: "OK",
      });
      setOpinion(""); // Clear the input field
      onSubmit(); // Call the parent component's onSubmit method to refresh opinions
    } catch (error) {
      console.error("Error submitting opinion:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to submit opinion. Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <MKBox component="form" onSubmit={handleSubmit} mb={2}>
      <MKInput
        type="text"
        label="Your Opinion"
        fullWidth
        value={opinion}
        onChange={handleInputChange}
        required
      />
      <MKButton
        variant="gradient"
        color="info"
        type="submit"
        fullWidth
        style={{ marginTop: "10px" }}
      >
        Submit Opinion
      </MKButton>
    </MKBox>
  );
}

OpinionForm.propTypes = {
  serviceId: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default OpinionForm;
