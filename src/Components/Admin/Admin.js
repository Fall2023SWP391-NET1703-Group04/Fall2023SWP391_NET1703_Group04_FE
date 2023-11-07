import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../Sidebar/SideBar";
import Header from "../Header/Header";
import { Button } from "primereact/button";
import DashBoard from "../DashBoard/DashBoard";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <>
      <div className=" grid">
        <div className="col-2">
          <div className="col-5">
            <SideBar />
          </div>
          <div className="col-5">
            <Button
              className="absolute bottom-0 center"
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>
    </>
  );
}
