import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import axios from "axios";
const ForGotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  console.log(email);
  async function sendMail(e) {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:8080/zoo-server/api/v1/auth/forgotPassword/${email}`
      );
      // Assuming your API returns a success message
      setSuccessMessage(response.data.message);
      setError("");
    } catch (error) {
      // Handle error, display error message, etc.
      setError("An error occurred while sending the email.");
      setSuccessMessage("");
    }
  }
  return (
    <>
      <div className="container-forgot-password">
        <div className="container-forgot-password-child">
          <form action="#" onSubmit={sendMail}>
            <h2>Forget password</h2>
            <div className="input-text-forgot">
              <input
                type="email-forgot"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Enter your Email</label>
            </div>
            <div className="forget">
              <label for="remember-forgot">
                <input type="checkbox" id="remember" />
                <p>Remember me</p>
              </label>
            </div>
            <button className="submit-forgot">Send Email</button>
            {error != "" && (
              <p className="error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}
            {successMessage && (
              <p className="success-message" style={{ color: "yellow" }}>
                {successMessage}
              </p>
            )}

            <div className="register-forgot">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForGotPassword;
