import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

const getAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/category/views");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

function Categories({ onCategoryClick }) {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllCategories();
      setCategoriesData(categories);
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    onCategoryClick(id);
  };

  const renderData = categoriesData.map(({ id, category_name, description, image_content }) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={id}>
      <Grid item xs={12} lg={4}>
        <Card onClick={() => handleCardClick(id)} sx={{ cursor: "pointer" }}>
          {" "}
          {/* Add cursor style here */}
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

// Add propTypes for prop validation
Categories.propTypes = {
  onCategoryClick: PropTypes.func.isRequired,
};

export default Categories;
