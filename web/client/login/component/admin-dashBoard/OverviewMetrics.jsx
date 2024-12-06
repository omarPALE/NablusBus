// components/OverviewMetrics.js
import { Card, Col, Row } from "antd";
import "./OverviewMetrics.css";
const OverviewMetrics = () => {
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

export default OverviewMetrics;
