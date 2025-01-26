import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TicketRevenueChart = () => {
  const [revenueData, setRevenueData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tickets");
        const tickets = response.data;

        if (!Array.isArray(tickets)) {
          throw new Error("Unexpected response format: Expected an array.");
        }

        const revenueByType = tickets.reduce((acc, ticket) => {
          const ticketRevenue =
            parseInt(ticket.rides_left, 10) * parseFloat(ticket.price || 0);
          acc[ticket.model] = acc[ticket.model] || { revenue: 0, count: 0 };
          acc[ticket.model].revenue += ticketRevenue;
          acc[ticket.model].count += 1;
          return acc;
        }, {});

        setRevenueData({
          labels: ["single", "package", "student"],
          datasets: [
            {
              label: "Revenue (USD)",
              data: [
                revenueByType["single"]?.revenue || 0,
                revenueByType["package"]?.revenue || 0,
                revenueByType["multi"]?.revenue || 0,
              ],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderWidth: 1,
            },
          ],
        });

        setTableData([
          {
            type: "Single",
            revenue: revenueByType["single"]?.revenue || 0,
            count: revenueByType["single"]?.count || 0,
          },
          {
            type: "Package",
            revenue: revenueByType["package"]?.revenue || 0,
            count: revenueByType["package"]?.count || 0,
          },
          {
            type: "Student",
            revenue: revenueByType["multi"]?.revenue || 0,
            count: revenueByType["multi"]?.count || 0,
          },
        ]);

        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to load revenue data. Please try again later.");
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-semibold">{error}</p>
      ) : (
        <div className="w-full max-w-6xl space-y-8">
          {/* Bar Chart */}
          <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
            <Bar
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Revenue (USD)",
                    },
                  },
                },
              }}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-lg">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-6 py-3"> Type </th>
                  <th className="border border-gray-300 px-6 py-3">
                    {" "}
                    Revenue{" "}
                  </th>
                  <th className="border border-gray-300 px-6 py-3"> Count </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      {item.type}
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      ${item.revenue.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketRevenueChart;
