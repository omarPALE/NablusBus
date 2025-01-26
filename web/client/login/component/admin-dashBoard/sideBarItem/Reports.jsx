import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import TripStatistics from "../TripStatistics/";
import TicketPieChart from "../TicketPieChart";
import TicketRevenueChart from "../TicketRevenueChart";
import "./styles/Report.css"; // Adjusted path for the CSS file

const Reports = ({ showlink1, showlink2, showlink3 }) => {
  return (
    <div>
      <h2>Reports </h2>

      <CSSTransition
        in={showlink1} // Controls the visibility
        timeout={300} // Duration of animation (in ms)
        classNames="fade" // Class name prefix for animation
        unmountOnExit // Removes the component from DOM when hidden
      >
        <TripStatistics />
      </CSSTransition>
      <CSSTransition
        in={showlink2} // Controls the visibility
        timeout={300} // Duration of animation (in ms)
        classNames="fade" // Class name prefix for animation
        unmountOnExit // Removes the component from DOM when hidden
      >
        <TicketPieChart />
      </CSSTransition>

      <CSSTransition
        in={showlink3} // Controls the visibility
        timeout={300} // Duration of animation (in ms)
        classNames="fade" // Class name prefix for animation
        unmountOnExit // Removes the component from DOM when hidden
      >
        <TicketRevenueChart />
      </CSSTransition>
    </div>
  );
};

export default Reports;

Reports.propTypes = {
  showlink1: PropTypes.bool.isRequired,
  showlink2: PropTypes.bool.isRequired,
  showlink3: PropTypes.bool.isRequired,
};
