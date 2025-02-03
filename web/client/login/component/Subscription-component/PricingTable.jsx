import { useState, useEffect, useRef } from "react";
import TicketPopUp from "../pop-ups/Ticket-Popup";
import { useNavigate } from "react-router-dom";
import PropType from "prop-types";
import "./Ticket.css";
const PricingTable = (props) => {
  const [pricingData, setPricingData] = useState([]);
  const ticketRef = useRef(null);
  const pricingRef = useRef(null);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMsgPopupOpen, setIsMsgPopupOpen] = useState(false);

  const [ticketData, setTicketData] = useState({
    userName: props.userState.username,
    ticketType: "",
    model: "",
    rides_left: 0,
    qr_code: "123",
    price: 3,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          qr_code: "1234567890",
          title: "Multi Trip",
          model: "multi",
          price: 30,
          TicketType: "Half or Full",
          rides_left: 10 + 2,
          touched: false,
        },
        {
          id: 2,
          qr_code: "1234567890",
          title: "Single Trip",
          model: "single",
          price: 3,
          TicketType: "Half or Full",
          rides_left: 1,
          touched: false,
        },
        {
          id: 3,
          qr_code: "",
          title: "Student",
          model: "package",
          price: 299.99,
          TicketType: "full",
          rides_left: 200 + 10,
          touched: false,
        },
      ];
      // Update price based on ticket type
      const updatedData = data.map((ticket) => ({
        ...ticket,
        price:
          ticket.TicketType.toLowerCase() === "half"
            ? ticket.rides_left * 2.5
            : ticket.rides_left * 3,
      }));
      setPricingData(updatedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.4,
      rootMargin: "0px 0px -100px 0px",
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

  const handleCreateTicket = (id) => {
    if (!props.userState.loggedIn) {
      setIsMsgPopupOpen(true);
      setTimeout(() => {
        setIsMsgPopupOpen(false);
        navigate("/login");
      }, 1500);
    } else {
      setPricingData((prevData) =>
        prevData.map((ticket) =>
          ticket.id === id
            ? { ...ticket, touched: true }
            : { ...ticket, touched: false }
        )
      );
      setIsPopupOpen(true);
    }
  };

  const handleTicketTypeChange = (id, value) => {
    setPricingData((prevData) =>
      prevData.map((ticket) => {
        if (ticket.id === id) {
          const updatedPrice =
            value === "half"
              ? ticket.model === "multi"
                ? (ticket.rides_left - 2) * 2.5
                : ticket.model === "package"
                ? (ticket.rides_left - 10) * 2.5
                : ticket.rides_left * 2.5
              : ticket.model === "package"
              ? (ticket.rides_left - 10) * 3
              : ticket.model === "multi"
              ? (ticket.rides_left - 2) * 3
              : ticket.rides_left * 3;
          return { ...ticket, ticketType: value, price: updatedPrice };
        }
        return ticket;
      })
    );
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
                        <span>{plan.title}</span>
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
                        <div className="type-container">
                          <div className="type-title">
                            <strong>Type:</strong>
                          </div>
                          <div className="radio-group">
                            <label>
                              <input
                                type="radio"
                                name={`ticketType-${plan.id}`}
                                value="half"
                                checked={plan.ticketType === "half"}
                                onChange={(e) =>
                                  handleTicketTypeChange(
                                    plan.id,
                                    e.target.value
                                  )
                                }
                              />
                              Half
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`ticketType-${plan.id}`}
                                value="full"
                                checked={plan.ticketType === "full"}
                                onChange={(e) =>
                                  handleTicketTypeChange(
                                    plan.id,
                                    e.target.value
                                  )
                                }
                              />
                              Full
                            </label>
                          </div>
                        </div>
                      </li>
                      <li>
                        <span>{plan.rides_left}</span> Trip
                      </li>
                    </ul>
                  </div>
                  <div className="generic_price_btn clearfix">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCreateTicket(plan.id);
                      }}
                    >
                      Create Ticket
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isPopupOpen && (
        <TicketPopUp
          setIsPopupOpen={setIsPopupOpen}
          ticketData={ticketData}
          userState={props.userState}
          setTicketData={setTicketData}
          pricingData={pricingData}
          qr_code={props.qrCode}
          setQRcode={props.setQRcode}
        />
      )}

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
  qrCode: PropType.string,
  setQRcode: PropType.func,
};

export default PricingTable;
