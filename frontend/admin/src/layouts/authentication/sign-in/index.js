import { useState } from "react";
import axios from "axios";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import { getAllUsers } from "Api/userApi";
import Swal from 'sweetalert2';
import "../../../assets/css/sweetAlertStyle.css";
// Image
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

function Illustration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        formData
      );
      const { user, authorization } = response.data;
      const { access_token } = authorization;
      
  
      // Storing access token in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

  
      // Redirect to dashboard or desired route
      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Invalid username or password.',
        });
      } else {
        console.error("Login failed:", error.response.data);
        // Handle other login errors
      }
    }
  };
  

  
  

  return (
    <IllustrationLayout
      title="Sign In"
      illustration={{
        image: bgImage,
        title: '"Attention is the new currency"',
        description:
          "The more effortless the writing looks, the more effort the writer actually put into the process.",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
        <ArgonBox mb={2}>
          <ArgonInput
            type="email"
            name="email"
            placeholder="Email"
            size="large"
            value={formData.email}
            onChange={handleChange}
          />
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput
            type="password"
            name="password"
            placeholder="Password"
            size="large"
            value={formData.password}
            onChange={handleChange}
          />
        </ArgonBox>
        <ArgonBox mt={4} mb={1}>
          <ArgonButton type="submit" color="info" size="large" fullWidth>
            Sign In
          </ArgonButton>
        </ArgonBox>
      </ArgonBox>
    </IllustrationLayout>
  );
}

export default Illustration;
