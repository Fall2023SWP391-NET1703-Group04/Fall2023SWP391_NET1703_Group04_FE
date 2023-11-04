import React, { useEffect, useRef, useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Toast } from "primereact/toast";
const Register = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
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
        "http://localhost:8080/zoo-server/api/v1/auth/registerNewUser",
        formData,
        {
          headers: authHeader(),
        }
      );
      console.log(response);

      if (response.status === 200) {
        show(response.data.message, 'green');
        // Registration successful
        const token = response.data.token;
        // You can save the JWT token in localStorage or a secure storage mechanism
        localStorage.setItem("jwtToken", token);

        setAlertMessage("Registration successful!");
        navigate("/login");
      } else {
        setAlertMessage("Registration failed.");
      }
    } catch (error) {
      setAlertMessage("Registration failed.");
    }
  };

  const show = (message, color) => {
    toast.current.show({
      summary: 'Notifications', detail: message, life: 3000,
      style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
    });
  };

  return (
    <>
      <div className="wrapper-register">
        <Toast ref={toast} />
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
