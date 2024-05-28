import React, { useState, useEffect } from "react";
import "./Profile.css";
import Swal from "sweetalert2";
import "assets/css/sweetAlertStyle.css";

function Profile() {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
  });

  const fetchUserData = () => {
    const storedUserData = JSON.parse(localStorage.getItem("user"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("Access token not found in localStorage");
      return;
    }

    const userId = userData.id; // Extract user ID from userData

    const requestData = {
      ...userData,
      ...passwords,
    };

    fetch(`http://localhost:8000/api/client/update/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Changes saved successfully!",
          });
        } else {
          throw new Error("Failed to save changes");
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        let errorMessage = "Failed to save changes";

        if (error.response && error.response.data) {
          errorMessage = error.response.data;

          if (errorMessage.includes("Old password does not match")) {
            Swal.fire({
              icon: "error",
              title: "Old Password Mismatch",
              text: errorMessage,
              customClass: {
                container: "custom-swal-container", // Use custom class
              },
            });
            return; // Stop further execution
          }

          // Check if the error response is an object
          if (typeof errorMessage === "object") {
            // Check if error message includes email validation error
            if (errorMessage.email) {
              Swal.fire({
                icon: "error",
                title: "Invalid Email",
                text: errorMessage.email,
                customClass: {
                  container: "custom-swal-container", // Use custom class
                },
              });
              return; // Stop further execution
            }

            // Check if error message includes password validation error
            if (errorMessage.password) {
              Swal.fire({
                icon: "error",
                title: "Invalid Password",
                text: "Password should be at least 8 characters long.",
                customClass: {
                  container: "custom-swal-container", // Use custom class
                },
              });
              return; // Stop further execution
            }
          }
        }

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
          customClass: {
            container: "custom-swal-container", // Use custom class
          },
        });
      });
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={userData.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Old Password:</label>
          <input
            type="password"
            name="old_password"
            value={passwords.old_password}
            onChange={handlePasswordChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="new_password"
            value={passwords.new_password}
            onChange={handlePasswordChange}
            className="form-control"
          />
        </div>
        <button type="button" onClick={handleSaveChanges} className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;
