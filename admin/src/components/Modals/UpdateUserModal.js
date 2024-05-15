import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'; // Import axios for making HTTP requests
import Swal from 'sweetalert2';
import "../../assets/css/sweetAlertStyle.css";
 // Import Swal for displaying alerts
import { updateUser } from 'Api/userApi'; // Import updateUser function from userApi.js
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateUserModal(user) {

    const inputStyle = {
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // Border only at the bottom with low opacity
      borderRadius: '5px', // Example border-radius
      borderRight: 'none', // Remove right border
      borderTop: 'none', // Remove top border
      borderLeft: 'none', // Remove left border
      outline: 'none', // Remove outline on focus
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.1)' // Ensure no hover effect
      },
      marginBottom: '20px' // Add bottom margin for spacing between inputs
    };

    // State for managing the visibility of the modal
    const [modal, setModal] = useState(false);
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');


    const getUser = user.user;
      // Function to toggle the modal visibility
      const toggleModal = () => {
        setModal(!modal);
      }

    // Function to handle user update
    const handleUserUpdate = async () => {
        try {
          const userData = { name: name, email }; // Prepare user data
          const userId = getUser.id;
          console.log(userId);
          const response = await updateUser(userId, userData); // Call the updateUser function
          // Handle success response if needed
        } catch (error) {
        }
      }

    return (
      <>
        {/* Button to toggle the modal */}
        <button className="btn-modal btn btn-primary" onClick={toggleModal}>Update User</button>

        {/* Modal */}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Update User</ModalHeader>
          <ModalBody>
            {/* Form for adding a category */}
            <form>
              {/* Category input field */}
              <input type="text" placeholder={getUser.name} style={inputStyle} value={name} onChange={(e) => setname(e.target.value)} />
              <input type="email" placeholder={getUser.email} style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="button" className="btn btn-primary" onClick={handleUserUpdate}>Update</button>
            </form>
          </ModalBody>
          <ModalFooter>
            {/* Submit button */}
          </ModalFooter>
        </Modal>
      </>
    )
}
