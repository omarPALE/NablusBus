import TicketSection from "./Subscription-component/Ticket-section";
import TicketBenefits from "./Subscription-component/Description-component";
import PricingTable from "./Subscription-component/PricingTable";
export default function Subscription() {
  return (
    <div>
      <PricingTable />
      <TicketSection />
      <TicketBenefits />
    </div>
  );
}
