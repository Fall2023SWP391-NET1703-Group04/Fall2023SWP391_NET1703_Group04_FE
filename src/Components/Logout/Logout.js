import React from "react";
import { useHistory } from "react-router-dom";

const Logout = () => {
  const history = useHistory();

  // Clear local storage
  localStorage.removeItem("user");

  // Redirect to the login page
  history.push("/"); // Replace '/login' with your actual login page route

  return <div>Logging out...</div>;
};

export default Logout;
