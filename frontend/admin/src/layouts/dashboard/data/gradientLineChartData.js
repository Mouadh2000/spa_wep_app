const gradientLineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Reservations",
      color: "info",
      data: new Array(12).fill(0),  // Initialize with 0 for each month
    },
  ],
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
};

export default gradientLineChartData;
