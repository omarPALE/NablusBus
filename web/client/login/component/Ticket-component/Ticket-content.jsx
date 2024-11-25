import { useState, useEffect, useRef } from "react";
import "./Ticket.css"; // Ensure the correct path to your CSS file
import TicketSection from "./Ticket-section";
const PricingTable = () => {
  const [pricingData, setPricingData] = useState([]);
  const ticketRef = useRef(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          plan: "Multi-Trip",
          price: 20,
          FareType: "Low",
          storage: "150GB",
          accounts: 12,
          domains: 7,
          support: "24/7",
        },
        {
          id: 2,
          plan: "Single Trip",
          price: 3,
          FareType: "Full",
          storage: "300GB",
          accounts: 24,
          domains: 15,
          support: "24/7",
        },
        {
          id: 3,
          plan: "Student",
          price: 299.99,
          FareType: "Unlimited",
          storage: "Unlimited",
          accounts: "Unlimited",
          domains: "Unlimited",
          support: "24/7",
        },
      ];
      setPricingData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5, // 50% of the element must be visible to trigger the animation
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

  return (
    <div id="generic_price_table">
      <section className="pricing-section" ref={pricingRef}>
        <div className="container">
          <div className="row">
            <div className="price-heading clearfix">
              <h1>Bus Ticket Priceing</h1>
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
                        Fare Type <span>{plan.FareType}</span>
                      </li>
                      <li>
                        <span>{plan.storage}</span> Storage
                      </li>
                      <li>
                        <span>{plan.accounts}</span> Accounts
                      </li>
                      <li>
                        <span>{plan.domains}</span> Host Domain
                      </li>
                      <li>
                        <span>{plan.support}</span> Support
                      </li>
                    </ul>
                  </div>
                  <div className="generic_price_btn clearfix">
                    <a href="">Sign up</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <TicketSection />
    </div>
  );
};

export default PricingTable;
