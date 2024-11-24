import { useState, useEffect } from "react";
import "./Ticket.css"; // Ensure the correct path to your CSS file

const PricingTable = () => {
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          plan: "Basic",
          price: 99.99,
          bandwidth: "2GB",
          storage: "150GB",
          accounts: 12,
          domains: 7,
          support: "24/7",
        },
        {
          id: 2,
          plan: "Standard",
          price: 199.99,
          bandwidth: "4GB",
          storage: "300GB",
          accounts: 24,
          domains: 15,
          support: "24/7",
        },
        {
          id: 3,
          plan: "Unlimited",
          price: 299.99,
          bandwidth: "Unlimited",
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

  return (
    <div id="generic_price_table">
      <section>
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
                        <span className="sign">$</span>
                        <span className="currency">
                          {Math.floor(plan.price)}
                        </span>
                        <span className="cent">
                          .{Math.round((plan.price % 1) * 100)}
                        </span>
                        <span className="month">/MON</span>
                      </span>
                    </div>
                  </div>
                  <div className="generic_feature_list">
                    <ul>
                      <li>
                        <span>{plan.bandwidth}</span> Bandwidth
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
    </div>
  );
};

export default PricingTable;
