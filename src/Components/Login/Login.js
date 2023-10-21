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
import { useRef } from "react";

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

  // //Get data
  // useEffect(() => {
  //   // Fetch the list of diets from your API endpoint
  //   axios.get('http://localhost:8080/zoo-server/api/v1/animal/getAllAnimal', { headers: authHeader() })
  //     .then(response => {
  //       setAnimals(response.data.data)
  //       setRefresh(false)
  //     })
  //     .catch(error => console.error(error));

  //   axios.get(`http://localhost:8080/zoo-server/api/v1/catalogue/getAllCatalogues`, { headers: authHeader() })
  //     .then(response => setCatalogues(response.data))
  //     .catch(error => console.error(error));
  // }, [refresh]);
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    // Make a POST request when the form is submitted
    axios
      .post("http://localhost:8080/zoo-server/api/v1/auth/signIn", dataLogin)
      .then((response) => {
        console.log("POST request response:", response);
        setTimeout(() => {
          show(response.data.message, 'green');
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
            default:
              navigate("/home");

          }
        }, 1000);
      })
      .catch((error) => {
        show(error.response.data.message, 'red');
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

  const toast = useRef(null);
  const show = (message, color) => {
    toast.current.show({
      summary: 'Notifications', detail: message, life: 3000,
      style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
    });
  };

  return (
    <>
      <Toast ref={toast} />
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

                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <label
                                htmlFor="email"

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
