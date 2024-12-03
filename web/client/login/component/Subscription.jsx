import TicketSection from "./Subscription-component/Ticket-section";
import TicketBenefits from "./Subscription-component/Description-component";
import PricingTable from "./Subscription-component/PricingTable";
import PropType from "prop-types";
export default function Subscription(props) {
  return (
    <div>
      <PricingTable userState={props.userState} />
      <TicketSection />
      <TicketBenefits />
    </div>
  );
}

Subscription.propTypes = {
  userState: PropType.object.isRequired,
};
