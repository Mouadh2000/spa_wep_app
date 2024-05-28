import React, { useEffect, useState } from "react";
import axios from "axios";

// @mui/material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Argon Dashboard 2 MUI example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DetailedStatisticsCard from "examples/Cards/StatisticsCards/DetailedStatisticsCard";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Argon Dashboard 2 MUI base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import Slider from "layouts/dashboard/components/Slider";

// Data
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";

function Default() {
  const { size } = typography;

  const [clientCount, setClientCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [profitSum, setProfitSum] = useState(0);
  const [chartData, setChartData] = useState(gradientLineChartData);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchClientCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/client/count", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClientCount(response.data.client_count);
      } catch (error) {
        console.error("Error fetching client count:", error);
      }
    };

    const fetchServiceCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/service/count", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setServiceCount(response.data.service_count);
      } catch (error) {
        console.error("Error fetching service count:", error);
      }
    };
    
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/count", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserCount(response.data.user_count);
      } catch (error) {
        console.error("Error fetching users count:", error);
      }
    };
    const fetchProfit = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/reservations/total-price", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfitSum(response.data.total_price);
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };

    const fetchMonthlyReservations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/reservations/monthly", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = response.data;
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const reservationsData = new Array(12).fill(0);

        data.forEach(item => {
          reservationsData[item.month - 1] = item.count;  // Adjust for 0-based index
        });

        setChartData({
          labels: labels,
          datasets: [{
            label: "Reservations",
            color: "info",
            data: reservationsData,
          }],
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,  // Set the y-axis increment to 1
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching reservation data:", error);
      }
    };

    fetchClientCount();
    fetchServiceCount();
    fetchUserCount();
    fetchProfit();
    fetchMonthlyReservations();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4} lg={3}>
            <DetailedStatisticsCard
              title="Total users"
              count={userCount}
              icon={{ color: "error", component: <i className="ni ni-world" /> }}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DetailedStatisticsCard
              title="Total clients"
              count={clientCount}
              icon={{ color: "success", component: <i className="ni ni-paper-diploma" /> }}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DetailedStatisticsCard
              title="Total services"
              count={serviceCount}
              icon={{ color: "info", component: <i className="ni ni-settings" /> }}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <DetailedStatisticsCard
              title="Total Profits"
              count={profitSum + " DT"}
              icon={{ color: "warning", component: <i className="ni ni-cart" /> }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title="Reservation Overview"
              description={
                <ArgonBox display="flex" alignItems="center">
                  <ArgonBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{ fontWeight: "bold" }}>arrow_upward</Icon>
                  </ArgonBox>
                </ArgonBox>
              }
              chart={chartData}
            />
          </Grid>
          <Grid item xs={12} lg={5}>
            <Slider />
          </Grid>
        </Grid>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Default;
