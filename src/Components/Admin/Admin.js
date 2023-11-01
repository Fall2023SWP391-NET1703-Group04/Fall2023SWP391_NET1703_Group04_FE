import { Outlet } from "react-router-dom";
import SideBar from "../Sidebar/SideBar";
import Header from "../Header/Header";
import { Button } from "primereact/button";
import DashBoard from "../DashBoard/DashBoard";


export default function Admin() {

  return (
    <>

      <div className=" grid">
        <div className="col-2">

          <SideBar />
        </div>
        <div className="col-10">

          <Outlet />
        </div>
      </div>

    </>
  );
};