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
import AddUserModal from 'components/Modals/AddUserModal';
import UpdateUserModal from 'components/Modals/UpdateUserModal';
// Data
import userTableData from './data/userTableData';
import clientTableData from './data/clientTableData';
import { getAllUsers, updateUser, deleteUser } from 'Api/userApi';
import { getAllClients } from 'Api/userApi';
import { Description } from '@mui/icons-material';



function Users() {
  const [usersRows, setUsersRows] = useState([]);
  const [clientsRows, setClientsRows] = useState([]);
  let { usercolumns, usersrows } = userTableData;
  let { clientcolumns, clientsrows } = clientTableData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchClientQuery, setSearchClientQuery] = useState('');
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
  const handleSearchClientInputChange = (event) => {
    setSearchClientQuery(event.target.value);
  };

  const filteredUserRows = usersrows.filter((row) =>
  row['user Name'].toLowerCase().includes(searchQuery.toLowerCase())
);
const filteredClientRows = clientsrows.filter((row) =>
  row['user Name'].toLowerCase().includes(searchClientQuery.toLowerCase())
);

const updateUsers = async () => {
  try {
    const userData = await getAllUsers();
    setUsersRows(userData);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
const updateClients = async () => {
  try {
    const clientData = await getAllClients();
    setClientsRows(clientData);
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
};

useEffect(() => {
  updateUsers();
}, []);
useEffect(() => {
  updateClients();
}, []);

  const handleUserUpdate = (user) => {
    console.log(user);
    setSelectedUser(user); 
    toggleModal();
  };

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
        const clientsData = await getAllClients();
        const clientColumns = [
          { name: "user Name", align: "left" },
          { name: "email", align: "left" },
          { name: "phone number", align: "center" },
          { name: "address", align: "center" },
          { name: "sign up date", align: "center" },
          { name: "action", align: "center" },
          { name: "gender", align: "center" },
        ];
        clientTableData.clientsrows = clientsData.map(client => ({
          "user Name": client.name,
          email: client.email,
          "phone number": client.phone_number,
          "address": client.address,
          "sign up date": client.created_at.split('.')[0],
          gender: client.gender
        }));
        setClientsRows(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
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
              <AddUserModal isOpen={isModalOpen} toggle={toggleModal} onUserAdded={updateUsers} className="btn btn-primary" />
              
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
              <ArgonTypography variant="h6">Clients</ArgonTypography>
              <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                <FormGroup className="mb-0">
                  <InputGroup className="input-group-alternative" style={{ backgroundColor: 'transparent', borderColor: '#5e72e4', }}>
                      <InputGroupText style={{ color: '#5e72e4' }} >
                        <i className="fas fa-search" />
                      </InputGroupText>
                      <Input type="text" style={{ color: '#5e72e4' }} placeholder="Search" value={searchClientQuery} onChange={handleSearchClientInputChange} />
                  </InputGroup>
                </FormGroup>
              </Form>              
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
              <Table columns={clientcolumns} rows={filteredClientRows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
        
        
      </ArgonBox>
      <Footer />
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <UpdateUserModal isOpen={isModalOpen} toggle={toggleModal} user={selectedUser} />
      </Modal>
    </DashboardLayout>
  );
}

export default Users;
