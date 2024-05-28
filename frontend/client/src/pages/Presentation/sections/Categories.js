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

  // Chunk categories into rows of three
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const categoryChunks = chunkArray(categoriesData, 3);

  const renderData = categoryChunks.map((categoryRow, rowIndex) => (
    <Grid container spacing={3} sx={{ mb: 10 }} key={`row-${rowIndex}`}>
      {categoryRow.map(({ id, category_name, description, image_content }) => (
        <Grid item xs={12} md={4} key={id}>
          <Card
            onClick={() => handleCardClick(id)}
            sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
          >
            <CardContent sx={{ flex: 1 }}>
              <MKBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <MKTypography variant="h3" fontWeight="bold" mb={1}>
                  {category_name}
                </MKTypography>
                <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                  <img
                    src={`data:image/png;base64,${image_content}`}
                    alt={category_name}
                    style={{ width: "100%", height: "auto", marginBottom: "10px" }}
                  />
                </MKTypography>
                <MKTypography variant="body2" fontWeight="regular" color="secondary" mb={1} pr={2}>
                  {description}
                </MKTypography>
              </MKBox>
            </CardContent>
          </Card>
        </Grid>
      ))}
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
