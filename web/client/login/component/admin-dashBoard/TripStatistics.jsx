import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TripStatistics = () => {
  const [processedData, setProcessedData] = useState({
    labels: [],
    counts: [],
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/trips/alltrips/"
        );
        if (response.status === 200) {
          // Ensure route names are unique and count trips for each route
          const routeCounts = response.data.reduce((acc, trip) => {
            acc[trip.route] = (acc[trip.route] || 0) + 1; // Count each trip occurrence
            return acc;
          }, {});

          setProcessedData({
            labels: Object.keys(routeCounts), // Unique route names
            counts: Object.values(routeCounts), // Count of trips for each route
          });
        } else {
          console.error("Failed to fetch trips.");
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const data = {
    labels: processedData.labels, // Unique routes
    datasets: [
      {
        label: "Number of Trips",
        data: processedData.counts, // Total trips for each route
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: "Routes" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Trips" },
        ticks: {
          stepSize: 1, // Ensure steps of 1 for trip counts
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <h3>Trip Statistics</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TripStatistics;
