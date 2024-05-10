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
// Data
import serviceTableData from "layouts/tables/data/serviceTableData";
import categoryTableData from './data/categoryTableData';
import userTableData from './data/userTableData';
import { getAllUsers } from 'Api/userApi';


function Tables() {
  const [usersRows, setUsersRows] = useState([]);
  const { columns, rows } = serviceTableData;
  const { columns: prCols, rows: prRows } = categoryTableData;
  let { usercolumns, usersrows } = userTableData;




  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
          role: user.is_admin ? "admin" : "user",
          "sign up date": user.created_at.split('.')[0],
          action: (
            <td>
              <span
                onClick={() => handleUpdate()}
                style={{ cursor: "pointer", color: "green", }}
              >
                <i className="fas fa-edit"></i>
              </span>
              <span style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => handleDelete()}>
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

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Users</ArgonTypography>
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
              <Table columns={usercolumns} rows={usersrows} />
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
              <Table columns={columns} rows={rows} />
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
            <Table columns={prCols} rows={prRows} />
          </ArgonBox>
        </Card>
        
      </ArgonBox>
      <Footer />

    </DashboardLayout>
  );
}

export default Tables;
