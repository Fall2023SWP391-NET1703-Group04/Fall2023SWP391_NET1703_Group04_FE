import { Outlet } from "react-router-dom";
import SideBar from "../Sidebar/SideBar";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Chart } from "primereact/chart";

export default function Admin() {

  return (
    <>

      <div style={{ display: "flex" }}>
        <SideBar />
        <Outlet />


      </div>

    </>
  );
}
