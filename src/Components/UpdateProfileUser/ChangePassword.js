import { Password } from "primereact/password";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ChangePassword.css";
import axios from "axios";
import { useState, useEffect } from "react";
import authHeader from "../AuthHeader/AuthHeader";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.data.userId;
  console.log(newPassword);
  useEffect(() => {
    // You can add any additional logic or side effects here
  }, []);

  const validateSignupForm = async (e) => {
    e.preventDefault();

    // You may want to perform additional validation before making the API call

    setLoading(true);

    try {
      const apiUrl = `http://localhost:8080/zoo-server/api/v1/user/changePassword/${userId}`;
      const response = await axios.put(
        apiUrl,
        {
          currentPassword,
          newPassword,
        },
        { headers: authHeader() }
      );

      // Handle the response as needed
      console.log("Response:", response.data);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div class="mainDiv">
        <div class="cardStyle">
          <form
            action=""
            method="post"
            name="signupForm"
            id="signupForm"
            onSubmit={validateSignupForm}
          >
            <img src="" id="signupLogo" />

            <div class="inputDiv">
              <label class="inputLabel" for="password">
                Current Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div class="inputDiv">
              <label class="inputLabel" for="confirmPassword">
                New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div class="buttonWrapper">
              <button
                type="submit"
                id="submitButton"
                onclick="validateSignupForm()"
                class="submitButton pure-button pure-button-primary"
              >
                <span>Continue</span>
                <span id="loader"></span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
