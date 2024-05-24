import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAllCategories } from "Api/categoryApi";
import { getAllUsers } from "Api/userApi";
import { createService } from "Api/serviceApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

export default function AddServiceModal() {
  const inputStyle = {
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    borderRight: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    outline: 'none',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    marginBottom: '20px'
  };

  const [modal, setModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    // Fetch categories when the component mounts
    async function fetchCategories() {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);
  useEffect(() => {
    // Fetch categories when the component mounts
    async function fetchUsers() {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  }

const handleSubmit = async () => {
  try {
    const requestData = {
      service_name: serviceName,
      description: description,
      price: price,
      category_id: selectedCategory ? selectedCategory.value : null,
      staff_id: selectedUser ? selectedUser.value : null
    };

    console.log(requestData);

    await createService(requestData);

    setServiceName("");
    setDescription("");
    setPrice("");
    setSelectedCategory(null);
    setSelectedUser(null);

    toggleModal();
  } catch (error) {
    console.error("Error adding service:", error);
  }
};

  
  

  return (
    <>
      <button className="btn-modal btn btn-primary" onClick={toggleModal}>Add Service</button>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add Service</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
          <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="Service Name" style={inputStyle} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" style={inputStyle} />
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" style={inputStyle} />

            <Select
              options={categories.map(category => ({ value: category.id, label: category.category_name }))}
              placeholder="Select Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Select
              options={users.map(user => ({ value: user.id, label: user.name }))}
              placeholder="Select Staff"
              value={selectedUser}
              onChange={setSelectedUser}
              className="mt-3"
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add</button>
        </ModalFooter>
      </Modal>
    </>
  )
}
