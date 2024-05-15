/**
=========================================================
* Argon Dashboard 2 MUI - v3.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/sweetAlertStyle.css";
import Swal from 'sweetalert2';

import React, { useState, useEffect } from 'react';

import Card from "@mui/material/Card";
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import { Button } from 'react-bootstrap';

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import AddCategoryModal from 'components/Modals/AddCategoryModal';
import AddServiceModal from 'components/Modals/AddServieceModal';
import AddUserModal from 'components/Modals/AddUserModal';
import UpdateUserModal from 'components/Modals/UpdateUserModal';
import UpdateServiceModal from 'components/Modals/UpdateServiceModal';
// Data
import serviceTableData from "layouts/tables/data/serviceTableData";
import categoryTableData from './data/categoryTableData';
import userTableData from './data/userTableData';
import { getAllUsers, updateUser, deleteUser } from 'Api/userApi';
import { getAllCategories, deleteCategory } from 'Api/categoryApi';
import { getAllServices, deleteService, updateService } from 'Api/serviceApi';
import { Description } from '@mui/icons-material';



function Tables() {
  const [usersRows, setUsersRows] = useState([]);
  const [categoryRows, setCategoryRows] = useState([]);
  const [serviceRows, setServiceRows] = useState([]);
  let { categorycolumns, categoryrows } = categoryTableData;
  let { usercolumns, usersrows } = userTableData;
  let { servicecolumns, servicerows } = serviceTableData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]); 
  const [selectedService, setSelectedService] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');




  const formatPermissionLevel = (permissionLevel) => {
    switch (permissionLevel) {
      case 'Editor':
        return 'Create, Update, Delete';
      case 'Refine':
        return 'Create, Update';
      case 'Edit':
        return 'Create, Delete';
      case 'Emend':
        return 'Update, Delete';
      case 'Create':
        return 'Create';
      case 'Modify':
        return 'Update';
      case 'Delete':
        return 'Delete';
      case 'Viewer':
        return 'Viewer';
      default:
        return 'Admin';
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUserRows = usersrows.filter((row) =>
  row['user Name'].toLowerCase().includes(searchQuery.toLowerCase())
);




  const handleUserUpdate = (user) => {
    console.log(user);
    setSelectedUser(user); 
    toggleModal();
  };
  const handleServiceUpdate = (service) => {
    console.log(service);
    setSelectedService(service); 
    toggleModal(); 
  }
  const handleUserDelete = async (userId) => {
    try {
      const response = await deleteUser(userId);
      if (response === '') 
          {Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `User with ID ${userId} deleted successfully`,
          customClass: {
            container: 'custom-swal-container'
          }
        });
        setUsersRows((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response === '') 
          {Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Category with ID ${categoryId} deleted successfully`,
          customClass: {
            container: 'custom-swal-container'
          }
        });
        setCategoryRows((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
      }
    } catch (error) {
      console.error(`Error deleting category with ID ${categoryId}:`, error);
    }
  };
  const handleServiceDelete = async (serviceId) => {
    try {
      const response = await deleteService(serviceId);
      if (response === '') 
          {Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Service with ID ${serviceId} deleted successfully`,
          customClass: {
            container: 'custom-swal-container'
          }
        });
        setServiceRows((prevServices) => prevServices.filter((service) => service.id !== serviceId));
      }
    } catch (error) {
      console.error(`Error deleting service with ID ${serviceId}:`, error);
    }
  };





  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        const userColumns = [
          { name: "user Name", align: "left" },
          { name: "email", align: "left" },
          { name: "role", align: "center" },
          { name: "sign up date", align: "center" },
          { name: "action", align: "center" },
        ];
        userTableData.usersrows = usersData.map(user => ({
          "user Name": user.name,
          email: user.email,
          role: user.is_admin ? "admin" : (user.is_staff ? "staff" : "user"),
          "sign up date": user.created_at.split('.')[0],
          permission_level: formatPermissionLevel(user.permission_level),
          action: (
            <td>
              <span
                onClick={() => handleUserUpdate(user)}
                style={{ cursor: "pointer", color: "green", }}
              >
                <i className="fas fa-edit"></i>
              </span>
              <span style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => handleUserDelete(user.id)}>
                <i className="fas fa-trash-alt"></i>
              </span>{" "}
            </td>
          ),
        }));
        setUsersRows(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getAllCategories();
        categoryTableData.categoryrows = categoryData.map(category => ({
          categoryName: category.category_name,
          Description: category.description,
          Image: <img src={`data:image/png;base64,${category.image_content}`} alt={category.category_name} style={{ width: '90px' }} />,
          action: (
            <td>
              <span style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => handleCategoryDelete(category.id)}>
                <i className="fas fa-trash-alt"></i>
              </span>{" "}
            </td>
          ),
        }));
        setCategoryRows(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        const categoryData = await getAllCategories();
        const serviceData = await getAllServices();
  
        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = user.name;
          return acc;
        }, {});
  
        const categoryMap = categoryData.reduce((acc, category) => {
          acc[category.id] = category.category_name;
          return acc;
        }, {});
  
        serviceTableData.servicerows = serviceData.map(service => ({
          "Service Name": service.service_name,
          Description: service.description,
          Price: service.price + ' DT',
          "Assigned Staff": userMap[service.staff_id] || "Unknown",
          "Category Name": categoryMap[service.category_id] || "Unknown",
          action: (
            <td>
              <span
                onClick={() => handleServiceUpdate(service)}
                style={{ cursor: "pointer", color: "green" }}
              >
                <i className="fas fa-edit"></i>
              </span>
              <span
                style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                onClick={() => handleServiceDelete(category.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </span>{" "}
            </td>
          ),
        }));
  
        setUsersRows(usersData);
        setCategoryRows(categoryData);
        setServiceRows(serviceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Users</ArgonTypography>
              <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                <FormGroup className="mb-0">
                  <InputGroup className="input-group-alternative" style={{ backgroundColor: 'transparent', borderColor: '#5e72e4', }}>
                      <InputGroupText style={{ color: '#5e72e4' }} >
                        <i className="fas fa-search" />
                      </InputGroupText>
                      <Input type="text" style={{ color: '#5e72e4' }} placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} />
                  </InputGroup>
                </FormGroup>
              </Form>
              <AddUserModal isOpen={isModalOpen} toggle={toggleModal} className="btn btn-primary" />
              
            </ArgonBox>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={usercolumns} rows={filteredUserRows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Services</ArgonTypography>
              <AddServiceModal isOpen={isModalOpen} toggle={toggleModal} className="btn btn-primary" />

            </ArgonBox>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={servicecolumns} rows={servicerows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
        <Card>
          <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <ArgonTypography variant="h6">Categories</ArgonTypography>
            <AddCategoryModal isOpen={isModalOpen} toggle={toggleModal} className="btn btn-primary" />
          </ArgonBox>
          <ArgonBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <Table columns={categorycolumns} rows={categoryrows} />
          </ArgonBox>
        </Card>
        
      </ArgonBox>
      <Footer />
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <UpdateUserModal isOpen={isModalOpen} toggle={toggleModal} user={selectedUser} />
        <UpdateServiceModal isOpen={isModalOpen} toggle={toggleModal} service={selectedService} />
      </Modal>
    </DashboardLayout>
  );
}

export default Tables;
