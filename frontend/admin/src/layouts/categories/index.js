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
// Data
import categoryTableData from './data/categoryTableData';
import { getAllCategories, deleteCategory } from 'Api/categoryApi';
import { Description } from '@mui/icons-material';



function Categories() {
  const [categoryRows, setCategoryRows] = useState([]);
  let { categorycolumns, categoryrows } = categoryTableData;
  const [isModalOpen, setIsModalOpen] = useState(false);




 

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

 
  

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
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
        
      </ArgonBox>
      <Footer />
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
      </Modal>
    </DashboardLayout>
  );
}

export default Categories;
