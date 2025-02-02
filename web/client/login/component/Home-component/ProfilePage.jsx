import { useState } from "react";
import "./ProfilePage.css";

const ProfilePage = ({ userState, setUserState }) => {
  const [paymentMethod, setPaymentMethod] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field is cardNumber, auto-format with dashes.
    if (name === "cardNumber") {
      // Remove all non-digit characters
      let digits = value.replace(/\D/g, "");
      // Limit to 16 digits
      digits = digits.substring(0, 16);
      // Insert a dash every 4 digits.
      // The regex inserts a dash after any group of 4 digits that is followed by another digit.
      const formattedValue = digits.replace(/(\d{4})(?=\d)/g, "$1-");
      setPaymentMethod((prevMethod) => ({
        ...prevMethod,
        [name]: formattedValue,
      }));
    } else {
      setPaymentMethod((prevMethod) => ({
        ...prevMethod,
        [name]: value,
      }));
    }
  };

  // Validate all fields in the payment form.
  const validatePaymentMethod = () => {
    const errors = {};

    // Validate card holder name (must not be empty)
    if (!paymentMethod.cardHolderName.trim()) {
      errors.cardHolderName = "Card Holder Name is required.";
    }

    // Validate card number: must be in the format XXXX-XXXX-XXXX-XXXX
    const cardNumberRegex = /^(\d{4}-){3}\d{4}$/;
    if (!cardNumberRegex.test(paymentMethod.cardNumber)) {
      errors.cardNumber =
        "Card number must be in the format XXXX-XXXX-XXXX-XXXX.";
    }

    // Validate expiry date: must be in MM/YY format and not in the past.
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(paymentMethod.expiry)) {
      errors.expiry = "Expiry date must be in MM/YY format.";
    } else {
      const [monthStr, yearStr] = paymentMethod.expiry.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
      const currentYear = today.getFullYear() % 100; // Get last two digits

      if (year < currentYear) {
        errors.expiry = "Expiry year must be the current year or later.";
      } else if (year === currentYear && month < currentMonth) {
        errors.expiry = "Expiry month cannot be after the current month.";
      }
    }

    // Validate CVV: must be 3 or 4 digits
    const cvvRegex = /^\d{3,4}$/;
    if (!cvvRegex.test(paymentMethod.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits.";
    }

    return errors;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validatePaymentMethod();

    // If any errors exist, set them in state and do not proceed.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Payment Method Added:", paymentMethod);

    // Save the payment info to userState.
    setUserState((prevState) => ({
      ...prevState,
      paymentMethods: prevState.paymentMethods
        ? [...prevState.paymentMethods, paymentMethod]
        : [paymentMethod],
    }));

    // Reset the form fields and errors, then hide the form.
    setPaymentMethod({
      cardHolderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });
    setErrors({});
    setShowPaymentForm(false);
  };

  return (
    <div className="profile-page">
      <h1>Nablus Bus Profile</h1>

      {/* Profile Information Section */}
      <div className="profile-info">
        <div className="profile-picture">
          {/* Replace with the actual profile picture URL */}
          <img src="/path/to/default/profile.jpg" alt="Profile" />
        </div>
        <div className="user-details">
          <h2>{userState.username}</h2>
          <h4>Email: {userState.email}</h4>
          <h4>Role: {userState.role}</h4>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="payment-section">
        <h2>Payment Methods</h2>
        <button onClick={() => setShowPaymentForm((prev) => !prev)}>
          {showPaymentForm ? "Cancel" : "Add Payment Method"}
        </button>

        {showPaymentForm && (
          <form className="payment-form" onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label htmlFor="cardHolderName">Card Holder Name:</label>
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                value={paymentMethod.cardHolderName}
                onChange={handleInputChange}
                required
              />
              {errors.cardHolderName && (
                <p className="error-message">{errors.cardHolderName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234-5678-9012-3456"
                value={paymentMethod.cardNumber}
                onChange={handleInputChange}
                required
              />
              {errors.cardNumber && (
                <p className="error-message">{errors.cardNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="expiry">Expiry Date (MM/YY):</label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentMethod.expiry}
                onChange={handleInputChange}
                required
              />
              {errors.expiry && (
                <p className="error-message">{errors.expiry}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                value={paymentMethod.cvv}
                onChange={handleInputChange}
                required
                maxLength="4"
              />
              {errors.cvv && <p className="error-message">{errors.cvv}</p>}
            </div>

            <button type="submit">Save Payment Method</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
