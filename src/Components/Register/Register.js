import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/zoo-server/api/v1/auth/signIn",
        formData,
        {
          headers: authHeader(),
        }
      );
      console.log(response);

      if (response.status === 200) {
        // Registration successful
        const token = response.data.token;
        // You can save the JWT token in localStorage or a secure storage mechanism
        localStorage.setItem("jwtToken", token);

        setAlertMessage("Registration successful!");
      } else {
        setAlertMessage("Registration failed.");
      }
    } catch (error) {
      setAlertMessage("Registration failed.");
    }
  };
  return (
    <>
      <div className="wrapper-register">
        <div className="box">
          <span className="borderLine"></span>
          <form onSubmit={handleSubmit}>
            <div className="inputBox">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <span>FirstName</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <span>LastName</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <span>Phone Number</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span>Email</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <Link to="/home">Home</Link>
              <a href="/">Sign in</a>
            </div>
            <input type="submit" value="Sing Up" />
          </form>
        </div>
      </div>
      {alertMessage && <div className="alert">{alertMessage}</div>}
    </>
  );
};

export default Register;
