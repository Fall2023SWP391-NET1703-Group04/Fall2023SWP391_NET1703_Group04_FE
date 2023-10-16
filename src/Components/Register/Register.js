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

const Register = () => {
  return (
    <>
      <div className="wrapper-register">
        <div className="box">
          <span className="borderLine"></span>
          <form>
            <div className="inputBox">
              <input type="text" required="required" />
              <span>FirstName</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="text" required="required" />
              <span>LastName</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="text" required="required" />
              <span>Phone Number</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="email" required="required" />
              <span>Email</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input type="password" required="required" />
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
    </>
  );
};

export default Register;
