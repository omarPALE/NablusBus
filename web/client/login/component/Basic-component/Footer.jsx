import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faPhone,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-section">
          <h6 className="footer-title">About Us</h6>
          <p className="footer-text">
            Welcome to our company! We strive to deliver the best products and
            services. Our mission is to bring innovation and quality to your
            doorstep.
          </p>
        </div>

        <div className="footer-section">
          <h6 className="footer-title">Our Services</h6>
          <ul className="footer-list">
            <li>
              <a href="#!" className="footer-link">
                Web Development
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                Mobile Apps
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                E-commerce Solutions
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                SEO Optimization
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h6 className="footer-title">Quick Links</h6>
          <ul className="footer-list">
            <li>
              <a href="#!" className="footer-link">
                About Us
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                Contact
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                FAQs
              </a>
            </li>
            <li>
              <a href="#!" className="footer-link">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h6 className="footer-title">Contact Us</h6>
          <p className="footer-text">
            <FontAwesomeIcon icon={faHome} /> Abdel Moujer Street, Nablus,
            Country
          </p>
          <p className="footer-text">
            <FontAwesomeIcon icon={faEnvelope} /> NablusBus@gmail.com
          </p>
          <p className="footer-text">
            <FontAwesomeIcon icon={faPhone} /> 0593111720
          </p>
          <p className="footer-text">
            <FontAwesomeIcon icon={faPrint} /> 09-2370044
          </p>
        </div>

        <div className="footer-section footer-socials">
          <a href="#!" className="social-link">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="#!" className="social-link">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#!" className="social-link">
            <FontAwesomeIcon icon={faGoogle} />
          </a>
          <a href="#!" className="social-link">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
