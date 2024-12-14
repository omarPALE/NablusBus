import { Card, Button } from "antd";
import PropTypes from "prop-types";

const TripCard = ({ trip, onFinishTrip }) => {
  return (
    <Card
      title={`Trip #${trip.tripId}`}
      bordered={false}
      style={{
        backgroundColor: "#ff6000",
        color: "#fff",
        borderRadius: "8px",
      }}
    >
      <p>
        <strong>Bus Number:</strong> {trip.busNumber}
      </p>
      <p>
        <strong>Status:</strong> {trip.status}
      </p>
      <p>
        <strong>Driver:</strong> {trip.driverName}
      </p>

      <Button
        type="primary"
        style={{ backgroundColor: "#fff", color: "#ff6000" }}
        onClick={() => onFinishTrip(trip.tripId)}
      >
        Finish Trip
      </Button>
    </Card>
  );
};
TripCard.propTypes = {
  trip: PropTypes.object.isRequired,
  onFinishTrip: PropTypes.func.isRequired,
};

export default TripCard;
