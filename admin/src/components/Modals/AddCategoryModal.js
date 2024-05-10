import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddCategoryModal() {

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

    // State for storing uploaded image
    const [image, setImage] = useState(null);

    // Function to toggle the modal visibility
    const toggleModal = () => {
      setModal(!modal);
    }

    // Function to handle form submission
    const handleSubmit = (event) => {
      // Prevent default form submission behavior
      event.preventDefault();
      // Here you can handle adding the category data
      // For example, you can make an API call to add the category to the database
      // After adding the category, you can close the modal
      toggleModal();
    }

    // Function to handle image upload
    const handleImageChange = (event) => {
      // Get the uploaded file
      const uploadedImage = event.target.files[0];
      // Set the image state to the uploaded file
      setImage(uploadedImage);
    }

    return (
      <>
        {/* Button to toggle the modal */}
        <button className="btn-modal btn btn-primary" onClick={toggleModal}>Add Category</button>

        {/* Modal */}
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Add Category</ModalHeader>
          <ModalBody>
            {/* Form for adding a category */}
            <form onSubmit={handleSubmit}>
              {/* Category input field */}
              <input type="text" placeholder="Category Name" style={inputStyle} />
              <input type="text" placeholder="Description" style={inputStyle} />
              {/* Image upload input field */}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </form>
          </ModalBody>
          <ModalFooter>
            {/* Submit button */}
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add</button>
          </ModalFooter>
        </Modal>
      </>
    )
}