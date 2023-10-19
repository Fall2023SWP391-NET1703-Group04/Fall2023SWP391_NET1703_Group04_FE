import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let dataLogin = {
    email: email,
    password: password,
  };

  const validate = (dataLogin) => {
    let errors = {};
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(dataLogin.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }

    return errors;
  };

  const onSubmit = (dataLogin, form) => {
    setFormData(dataLogin);
    setShowMessage(true);
    form.restart();
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // Make a POST request when the form is submitted
    axios
      .post("http://localhost:8080/zoo-server/api/v1/auth/signIn", dataLogin)
      .then((response) => {
        console.log("POST request response:", response);
        setTimeout(() => {
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response));
          switch (response.data.role) {
            case "ROLE_ADMIN":
              navigate("/admins");
              break;
            case "ROLE_CUSTOMER":
              navigate("/home");
              break;
            case "ROLE_TRAINER":

              navigate("/trainer");
              break;
          }
        }, 1000);
      })
      .catch((error) => {
        console.error("POST request error:", error);
        // Handle any errors that occur during the POST request
      });
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  return (
    <>
      <div className="wrapper">
        <div className="wrapper-2">
          <div className="form-demo">
            <Dialog
              visible={showMessage}
              onHide={() => setShowMessage(false)}
              position="top"
              footer={dialogFooter}
              showHeader={false}
              breakpoints={{ "960px": "80vw" }}
              style={{ width: "30vw" }}
            >
              <div className="flex align-items-center flex-column pt-6 px-3">
                <i
                  className="pi pi-check-circle"
                  style={{ fontSize: "5rem", color: "var(--green-500)" }}
                ></i>
                <h5>Registration Successful!</h5>
                <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
                  Your account is registered under name <b>{formData.name}</b> ;
                  it'll be valid next 30 days without activation. Please check{" "}
                  <b>{formData.email}</b> for activation instructions.
                </p>
              </div>
            </Dialog>

            <div className="flex justify-content-center">
              <div className="card">
                <h1 className="text-center">Login</h1>
                <Form
                  onSubmit={onSubmit}
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    date: null,
                    country: null,
                    accept: false,
                  }}
                  validate={validate}
                  render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmitLogin} className="p-fluid">
                      <Field
                        name="email"
                        render={({ input, meta }) => (
                          <div className="field">
                            <span className="p-float-label p-input-icon-right">
                              <i className="pi pi-envelope" />
                              <InputText
                                id="email"
                                {...input}
                                className={classNames({
                                  "p-invalid": isFormFieldValid(meta),
                                })}
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <label
                                htmlFor="email"
                                className={classNames({
                                  "p-error": isFormFieldValid(meta),
                                })}
                              >
                                Email*
                              </label>
                            </span>
                            {getFormErrorMessage(meta)}
                          </div>
                        )}
                      />
                      <Field
                        name="password"
                        render={({ input, meta }) => (
                          <div className="field">
                            <span className="p-float-label">
                              <Password
                                id="password"
                                {...input}
                                toggleMask
                                className={classNames({
                                  "p-invalid": isFormFieldValid(meta),
                                })}
                                header={passwordHeader}
                                footer={passwordFooter}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              <label
                                htmlFor="password"
                                className={classNames({
                                  "p-error": isFormFieldValid(meta),
                                })}
                              >
                                Password*
                              </label>
                            </span>
                            {getFormErrorMessage(meta)}
                          </div>
                        )}
                      />
                      <Button type="submit" label="Submit" className="mt-2" />
                      Don't have account?
                      <Link to="/register" className="link-register">
                        Register
                      </Link>
                    </form>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
