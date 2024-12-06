import { useState } from "react";
import TicketBenefits from "./Subscription-component/Description-component";
import PricingTable from "./Subscription-component/PricingTable";
import PropType from "prop-types";
export default function Subscription(props) {
  const [qrCodeValue, setQrCodeValue] = useState("");

  return (
    <div>
      <PricingTable
        userState={props.userState}
        qrCode={qrCodeValue}
        setQRcode={setQrCodeValue}
      />
      <TicketBenefits />
    </div>
  );
}

Subscription.propTypes = {
  userState: PropType.object.isRequired,
};
