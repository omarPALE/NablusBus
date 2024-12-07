// pages/Dashboard.js
import OverviewMetrics from "./OverviewMetrics";
import PropTypes from "prop-types";
const Dashboard = (props) => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard Overview</h2>
      <OverviewMetrics
        userState={props.userState}
        setUserState={props.setUserState}
      />
    </div>
  );
};

Dashboard.propTypes = {
  userState: PropTypes.object.isRequired,
  setUserState: PropTypes.func.isRequired,
};

export default Dashboard;
