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
// Data
import clientTableData from './data/clientTableData';
import { getAllClients } from 'Api/userApi';
import { Description } from '@mui/icons-material';


function Clients() {
  const [clientsRows, setClientsRows] = useState([]);
  let { clientcolumns, clientsrows } = clientTableData;
  const [searchClientQuery, setSearchClientQuery] = useState('');

  
const filteredClientRows = clientsrows.filter((row) =>
  row['user Name'].toLowerCase().includes(searchClientQuery.toLowerCase())
);

const handleSearchClientInputChange = (event) => {
    setSearchClientQuery(event.target.value);
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
  updateClients();
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
    </DashboardLayout>
  );
}

export default Clients;
