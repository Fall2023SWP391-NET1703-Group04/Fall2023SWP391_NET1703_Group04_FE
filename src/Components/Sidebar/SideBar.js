import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./SideBar.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
const SideBar = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("user"))?.data?.role;
  return (

    <Sidebar className="w-full">
      <Menu >

        <MenuItem component={<Link to="/admins" />}> DashBoard</MenuItem>
        <SubMenu label="Task">
          {userRole === 'ROLE_ADMIN' && (
            <>
              <MenuItem component={<Link to="manage-users" />}>
                Manage User
              </MenuItem>
              <MenuItem component={<Link to="manage-roles" />}>
                Manage Roles
              </MenuItem>
            </>
          )}
          <MenuItem component={<Link to="manage-products" />}>
            Manage Product
          </MenuItem>
          <MenuItem component={<Link to="manage-animals" />}>
            Manage Animal
          </MenuItem>
          <MenuItem component={<Link to="manage-foods" />}>
            Manage Food
          </MenuItem>
          <MenuItem component={<Link to="manage-areas" />}>
            Manage Areas
          </MenuItem>
          <MenuItem component={<Link to="manage-cages" />}>
            Manage Cages
          </MenuItem>
          <MenuItem component={<Link to="manage-catalogues" />}>
            Manage Catalogues
          </MenuItem>
          <MenuItem component={<Link to="manage-diets" />}>
            Manage Diet
          </MenuItem>
          <MenuItem component={<Link to="manage-news" />}>Manage News</MenuItem>

        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
