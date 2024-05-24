import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// @mui/material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Presentation page components

// API function to fetch categories
const getAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/category/views");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return an empty array or handle error as appropriate
  }
};

function Categories() {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllCategories();
      setCategoriesData(categories);
    };

    fetchData();
  }, []);

  const renderData = categoriesData.map(({ id, category_name, description, image_content }) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={id}>
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <MKBox position="sticky" top="100px" pb={{ xs: 2, lg: 6 }}>
              <MKTypography variant="h3" fontWeight="bold" mb={1}>
                {category_name}
              </MKTypography>
              <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                <img
                  src={`data:image/png;base64,${image_content}`}
                  alt={category_name}
                  style={{ width: "100%", height: "auto" }}
                />
              </MKTypography>
              <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                {description}
              </MKTypography>
            </MKBox>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ));

  return (
    <MKBox component="section" my={6} py={6}>
      <Container>
        <Grid
          container
          item
          xs={12}
          lg={6}
          flexDirection="column"
          alignItems="center"
          sx={{ textAlign: "center", my: 6, mx: "auto", px: 0.75 }}
        >
          <MKTypography variant="h2" fontWeight="bold">
            Our Categories
          </MKTypography>
        </Grid>
      </Container>
      <Container sx={{ mt: 6 }}>{renderData}</Container>
    </MKBox>
  );
}

export default Categories;
