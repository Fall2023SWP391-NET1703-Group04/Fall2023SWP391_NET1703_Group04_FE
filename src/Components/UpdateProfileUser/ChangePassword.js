import { Password } from "primereact/password";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ChangePassword.css";
import axios from "axios";
import { useState, useEffect } from "react";
import authHeader from "../AuthHeader/AuthHeader";
import { ToastContainer, toast } from "react-toastify";
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.data.userId;
  console.log(userId);
  useEffect(() => {
    // You can add any additional logic or side effects here
  }, []);

  const validateSignupForm = async (e) => {
    e.preventDefault();

    // Validate the new password (add your custom validation logic)
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

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
      // Show success toast message
      toast.success("Password changed successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      // Show error toast message
      toast.error("Error changing password. Please try again.");
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
                <span>Change password</span>
                <span id="loader">
                  {loading && <span id="loader">Loading...</span>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
