import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./SideBar.css";
import { Link } from "react-router-dom";
const SideBar = () => {
  return (
    <Sidebar >
      <Menu style={{ position: "fixed", width: "250px" }}>
        <MenuItem> DashBoard</MenuItem>
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
          <MenuItem component={<Link to="manage-diets" />}>
            Manage Diet
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;