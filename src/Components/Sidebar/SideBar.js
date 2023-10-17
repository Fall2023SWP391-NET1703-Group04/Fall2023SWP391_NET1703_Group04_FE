import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./SideBar.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
const SideBar = () => {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <Menu>
        <MenuItem>DashBoard</MenuItem>
        <SubMenu label="Task">
          <MenuItem component={<Link to="manage-users" />}>
            Manage User
          </MenuItem>
          <MenuItem component={<Link to="manage-products" />}>
            Manage Product
          </MenuItem>
          <MenuItem component={<Link to="manage-animals" />}>
            Manage Animal
          </MenuItem>
          <MenuItem component={<Link to="manage-foods" />}>
            Manage Food
          </MenuItem>
        </SubMenu>
        <MenuItem>
          <Button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
