import PropTypes from "prop-types";
import { Card, Col, Row } from "antd";

const DropdownDetails = ({ show, data, cardStyle, renderTitle }) => {
  return (
    <div className={`details-container ${show ? "fade-in" : "fade-out"}`}>
      {show && data.length > 0 ? (
        <Row gutter={16} style={{ marginTop: "20px" }}>
          {data.map((item, index) => (
            <Col span={6} key={index}>
              <Card style={cardStyle}>
                <h4>{renderTitle(item)}</h4>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Count: {item.count}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        // Fallback message for empty data
        <p style={{ marginTop: "20px", fontSize: "16px", color: "#999" }}>
          No data available.
        </p>
      )}
    </div>
  );
};

DropdownDetails.propTypes = {
  show: PropTypes.bool.isRequired, // Boolean to control visibility
  data: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string, // Example: "multi", "single" (for tickets)
      role: PropTypes.string, // Example: "admin", "passenger" (for users)
      count: PropTypes.number.isRequired, // Count of items
    })
  ).isRequired, // Array of data objects
  cardStyle: PropTypes.object, // Inline styles for the cards
  renderTitle: PropTypes.func.isRequired, // Function to render the title for each item
};

export default DropdownDetails;
