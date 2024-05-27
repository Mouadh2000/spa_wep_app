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
import AddServiceModal from 'components/Modals/AddServieceModal';
import UpdateServiceModal from 'components/Modals/UpdateServiceModal';
// Data
import serviceTableData from "layouts/services/data/serviceTableData";
import { getAllServices, deleteService, updateService } from 'Api/serviceApi';
import { getAllUsers } from 'Api/userApi';
import { getAllCategories } from 'Api/categoryApi';
import { Description } from '@mui/icons-material';



function Services() {
  const [serviceRows, setServiceRows] = useState([]);
  let { servicecolumns, servicerows } = serviceTableData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState([]); 

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const handleServiceUpdate = (service) => {
    console.log(service);
    setSelectedService(service); 
    toggleModal(); 
  }
 

  
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
                onClick={() => handleServiceDelete(service.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </span>
            </td>
          ),
        }));  
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
      </ArgonBox>
      <Footer />
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <UpdateServiceModal isOpen={isModalOpen} toggle={toggleModal} service={selectedService} />
      </Modal>
    </DashboardLayout>
  );
}

export default Services;
