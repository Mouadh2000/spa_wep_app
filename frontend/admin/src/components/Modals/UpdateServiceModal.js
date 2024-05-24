import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'; 
import Swal from 'sweetalert2';
import Select from 'react-select';
import "../../assets/css/sweetAlertStyle.css";
 // Import Swal for displaying alerts
import { updateService } from 'Api/serviceApi'; 
import { getAllCategories } from "Api/categoryApi";
import { getAllUsers } from "Api/userApi";
import 'bootstrap/dist/css/bootstrap.min.css';







export default function UpdateServiceModal(service) {

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
    const [name, setname] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const getService = service.service;
      const toggleModal = () => {
        setModal(!modal);
      }

      const handleServiceUpdate = async () => {
        try {
          const serviceData = {
            service_name: name || getService.service_name, 
            description: description || getService.description, 
            price: price || getService.price, 
            category_id: selectedCategory ? selectedCategory.value : getService.category_id, 
            staff_id: selectedUser ? selectedUser.value : getService.staff_id 
          };
      
          const serviceId = getService.id;
          const response = await updateService(serviceId, serviceData);
          toggleModal();
        } catch (error) {
          throw error
        }
      }
      


      useEffect(() => {
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

    return (
      <>
        <button className="btn-modal btn btn-primary" onClick={toggleModal}>Update Service</button>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Update Service</ModalHeader>
          <ModalBody>
            <form>
              <input type="text" placeholder={getService.service_name} style={inputStyle} value={name} onChange={(e) => setname(e.target.value)} />
              <textarea type="text" placeholder={getService.description} style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="text" placeholder={getService.price} style={inputStyle} value={price} onChange={(e) => setPrice(e.target.value)} />
              <Select
              options={categories.map(category => ({ value: category.id, label: category.category_name }))}
              placeholder={categories.find(category => category.id === getService.category_id)?.category_name}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Select
              options={users.map(user => ({ value: user.id, label: user.name }))}
              placeholder={users.find(user => user.id === getService.staff_id)?.name}
              value={selectedUser}
              onChange={setSelectedUser}
              className="mt-3"
            />
            <br></br>
              <button type="button" className="btn btn-primary" onClick={handleServiceUpdate}>Update</button>
            </form>
          </ModalBody>
          <ModalFooter>
            {/* Submit button */}
          </ModalFooter>
        </Modal>
      </>
    )
}
