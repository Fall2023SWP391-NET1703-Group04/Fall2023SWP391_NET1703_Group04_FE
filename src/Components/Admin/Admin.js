import { Outlet } from "react-router-dom";
import SideBar from "../Sidebar/SideBar";
import Header from "../Header/Header";
import { Button } from "primereact/button";


export default function Admin() {

  return (
    <>

      <div style={{ display: "flex" }}>
        <SideBar />
        <Outlet />
      </div>

    </>
  );
};
export default Admin;