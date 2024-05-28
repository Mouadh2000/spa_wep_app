import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/sweetAlertStyle.css";
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Card } from "@mui/material";

const localizer = momentLocalizer(moment);

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'No access token found. Please log in.',
        });
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/reservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedReservations = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        let startHour = 3;
        const reservations = sortedReservations.map((reservation, index) => {
          const startDate = moment(reservation.date).set('hour', startHour).toDate();
          const endDate = moment(startDate).add(1, 'hour').toDate();
          startHour++; 
          return {
            id: reservation.id,
            title: `${reservation.service.service_name} - ${reservation.client.name}`,
            start: startDate,
            end: endDate,
            client: reservation.client,
            staff: reservation.service.staff_id,
          };
        });
        setEvents(reservations);
      } catch (error) {
        console.error('There was an error fetching the reservations!', error);
      }
    };
    fetchReservations();
  }, []);

  const handleEventClick = (event) => {
    Swal.fire({
      title: 'Reservation Details',
      html: `
        <p><strong>Client Name:</strong> ${event.client.name}</p>
        <p><strong>Client Address:</strong> ${event.client.address}</p>
        <p><strong>Staff id:</strong> ${event.staff}</p>
      `,
      confirmButtonText: 'Close'
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Reservations Calendar</ArgonTypography>
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
              <div style={{ height: '500px' }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  views={['week', 'day']}
                  defaultView="week"
                  toolbar={true}
                  min={new Date(1970, 1, 1, 8, 0)}  // 8:00 AM
                  max={new Date(1970, 1, 1, 18, 0)} // 6:00 PM
                  onSelectEvent={handleEventClick} // Call handleEventClick function when event is clicked
                />
              </div>
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
};

export default CustomCalendar;
