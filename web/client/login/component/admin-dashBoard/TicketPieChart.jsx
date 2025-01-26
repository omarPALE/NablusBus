import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TicketPieChart = () => {
  const [ticketData, setTicketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/tickets"
        );
        const { tickets } = response.data;

        if (!Array.isArray(tickets)) {
          throw new Error(
            "Unexpected response format: Expected an array in the tickets field."
          );
        }

        // Group tickets by the 'model' column
        const modelCounts = tickets.reduce((acc, ticket) => {
          acc[ticket.model] =
            (acc[ticket.model] || 0) + parseInt(ticket.count, 10);
          return acc;
        }, {});

        // Prepare data for the pie chart
        setTicketData({
          labels: Object.keys(modelCounts),
          datasets: [
            {
              data: Object.values(modelCounts),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderWidth: 1,
              borderColor: "#fff",
            },
          ],
        });
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError("Failed to load ticket data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-semibold">{error}</p>
      ) : (
        <div className="w-1/32 md:w-1/32 lg:w-1/32">
          <Pie
            data={ticketData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TicketPieChart;
