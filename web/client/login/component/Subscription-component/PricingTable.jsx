import { useState, useEffect, useRef } from "react";
import TicketPopUp from "../pop-ups/Ticket-Popup";
import { useNavigate } from "react-router-dom";
import PropType from "prop-types";
import axios from "axios";
import "./Ticket.css";
const PricingTable = (props) => {
  const [pricingData, setPricingData] = useState([]);
  const ticketRef = useRef(null);
  const pricingRef = useRef(null);
  const navigate = useNavigate();

  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [isMsgPopupOpen, setIsMsgPopupOpen] = useState(false);

  const [ticketData, setTicketData] = useState({
    userName: "",
    user_id: "",
    type: "",
    rides_left: 0,
    qr_code: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleGenerateTicket = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/tickets", {
        ...ticketData,
      });
      setResponseMessage(
        `Ticket created successfully! Ticket ID: ${response.data.id}`
      );
      setIsPopupOpen(false); // Close the popup on success
    } catch (error) {
      console.error("Error generating ticket:", error);
      setResponseMessage("Failed to create ticket. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          user_id: 1,
          plan: "Multi Trip",
          price: 30,
          TicketType: "Half or Full",
          trip_left: 10,
        },
        {
          id: 2,
          plan: "Single Trip",
          price: 3,
          TicketType: "Half or Full",
          trip_left: 1,
        },
        {
          id: 3,
          plan: "Student",
          price: 299.99,
          TicketType: "full",
          trip_left: 100,
        },
      ];
      setPricingData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3, // 50% of the element must be visible to trigger the animation
      rootMargin: "0px 0px -100px 0px", // Adds an offset to delay animation triggering
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    }, observerOptions);

    if (pricingRef.current) observer.observe(pricingRef.current);
    if (ticketRef.current) observer.observe(ticketRef.current);

    return () => {
      if (pricingRef.current) observer.unobserve(pricingRef.current);
      if (ticketRef.current) observer.unobserve(ticketRef.current);
    };
  }, []);

  const handleCreateTicket = () => {
    if (!props.userState.loggedIn) {
      setIsMsgPopupOpen(true);
      setTimeout(() => {
        setIsMsgPopupOpen(false);
        navigate("/login"); // Redirect to the sign-in page after showing the popup
      }, 1500); // Adjust the timeout as needed
    } else {
      // Proceed with creating the ticket
      setIsPopupOpen(true);
    }
  };

  return (
    <div id="generic_price_table">
      <section className="pricing-section" ref={pricingRef}>
        <div className="container">
          <div className="row">
            <div className="price-heading clearfix">
              <h1>Bus Ticket Pricing</h1>
            </div>
            {pricingData.map((plan) => (
              <div key={plan.id} className="col-md-4">
                <div
                  className={`generic_content ${
                    plan.id === 2 ? "active" : ""
                  } clearfix`}
                >
                  <div className="generic_head_price clearfix">
                    <div className="generic_head_content clearfix">
                      <div className="head_bg"></div>
                      <div className="head">
                        <span>{plan.plan}</span>
                      </div>
                    </div>
                    <div className="generic_price_tag clearfix">
                      <span className="price">
                        <span className="sign">NIS</span>
                        <span className="currency">
                          {Math.floor(plan.price)}
                        </span>
                        <span className="cent">
                          .{Math.round((plan.price % 1) * 100)}
                        </span>
                        <span className="month">/Trip</span>
                      </span>
                    </div>
                  </div>
                  <div className="generic_feature_list">
                    <ul>
                      <li>
                        <span>{plan.TicketType}</span> way
                      </li>
                      <li>
                        <span>{plan.trip_left}</span> Trip
                      </li>
                    </ul>
                  </div>
                  <div className="generic_price_btn clearfix">
                    <a href="#" onClick={handleCreateTicket}>
                      Create Ticket
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Render the PopUp component */}
      <TicketPopUp
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        ticketData={ticketData}
        userState={props.userState}
        setTicketData={setTicketData}
        handleGenerateTicket={handleGenerateTicket}
        responseMessage={responseMessage}
      />

      {isMsgPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You need to sign in to create a ticket!</p>
          </div>
        </div>
      )}
    </div>
  );
};

PricingTable.propTypes = {
  userState: PropType.object,
};

export default PricingTable;
