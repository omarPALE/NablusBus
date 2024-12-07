// components/OverviewMetrics.js
import { Card, Col, Row } from "antd";
import { useEffect } from "react";
import PropTypes from "prop-types";
import "./OverviewMetrics.css";
import axios from "axios";
const OverviewMetrics = (props) => {
  // Fetch data from your API here using axios.get() and store it in a state variable
  useEffect(() => {
    axios
      .get("https://your-api-endpoint.com/users")
      .then((response) => props.setUserState(response.data))

      .catch((error) => console.error(error));
  }, []);
  const metrics = [
    { title: "Total Users", value: 1250 },
    { title: "Active Tickets", value: 850 },
    { title: "Buses on Trip", value: 45 },
    { title: "Revenue (Today)", value: "$4,520" },
  ];

  return (
    <Row gutter={16} style={{ margin: "20px 0" }}>
      {metrics.map((metric, index) => (
        <Col span={6} key={index}>
          <Card>
            <h3>{metric.title}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              {metric.value}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
OverviewMetrics.PropTypes = {
  setUserState: PropTypes.func.isRequired,
  userState: PropTypes.object.isRequired, // Assuming userState is an object with properties like loggedIn, email, username, role
};
export default OverviewMetrics;
