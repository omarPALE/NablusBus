import { useEffect, useRef, useState } from "react";

const TicketBenefits = () => {
  const sectionRef = useRef(null); // Reference to the section
  const [isVisible, setIsVisible] = useState(false); // State to track visibility

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Set visible when the section is in view
        } else {
          setIsVisible(false); // Reset visibility when the section is not in view
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current); // Observe the section
    }

    return () => {
     
      if (sectionRef.current) observer.unobserve(sectionRef.current); // Cleanup observer
    };
  }, []);

  return (
    <section
      id="ticket-benefits"
      ref={sectionRef} // Attach the reference
      className={isVisible ? "visible" : ""} // Add 'visible' class when active
    >
      <h2>What You Get with Each Ticket</h2>
      <div className="benefits-container">
        <div className="benefit-card">
          <h3>Multi-Trip Ticket</h3>
          <ul>
            <li>✔ 30 Rides + 2 Free</li>
            <li>✔ Cost-effective for frequent travelers</li>
            <li>✔ Valid for 90 days</li>
            <li>✔ Easy to track remaining rides</li>
          </ul>
        </div>

        <div className="benefit-card">
          <h3>Single Trip Ticket</h3>
          <ul>
            <li>✔ One-time use</li>
            <li>✔ Best for occasional travelers</li>
            <li>✔ Valid for 24 hours from purchase</li>
            <li>✔ Instant QR code generation</li>
          </ul>
        </div>

        <div className="benefit-card">
          <h3>Student Ticket</h3>
          <ul>
            <li>✔ Unlimited rides during the semester</li>
            <li>✔ Ideal for students commuting daily</li>
            <li>✔ 50% discount for verified student accounts</li>
            <li>✔ Full access to bus network</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TicketBenefits;
