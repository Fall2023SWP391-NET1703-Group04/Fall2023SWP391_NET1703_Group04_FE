import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Animal = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Animal;
