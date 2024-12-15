import { Card, Button, Tooltip } from "antd";
import PropTypes from "prop-types";

const TripCard = ({ trip, onFinishTrip }) => {
  return (
    <Card
      title={`Trip #${trip.id}`}
      bordered={false}
      style={{
        backgroundColor: "#ff6000",
        color: "#fff",
        borderRadius: "8px",
      }}
    >
      <p>
        <strong>Route:</strong> {trip.route}
      </p>
      <p>
        <strong>Status:</strong> {trip.status}
      </p>
      <p>
        <strong>Passenger Count:</strong> {trip.passengers_count}
      </p>

      {trip.status !== "Completed" && (
        <Tooltip
          title={trip.status !== "Completed" ? "Click to finish this trip" : ""}
        >
          <Button
            type="primary"
            style={{ backgroundColor: "#fff", color: "#ff6000" }}
            onClick={() => onFinishTrip(trip.id)}
          >
            Finish Trip
          </Button>
        </Tooltip>
      )}
    </Card>
  );
};
TripCard.propTypes = {
  trip: PropTypes.object.isRequired,
  onFinishTrip: PropTypes.func.isRequired,
};

export default TripCard;
