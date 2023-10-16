import { Link } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
const Header = () => {
  return (
    <>
      <header>
        <Link to="#" className="logo">
          Logo
        </Link>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/animal">Animal</Link>
          </li>
          <li>
            <Link to="/product">Product</Link>
          </li>
          <li>
            <Link to="/feedback">Feedback</Link>
          </li>
          <li>
            <Link to="/food">Food</Link>
          </li>
          <li>
            <Link to="/diet">Diet</Link>
          </li>
        </ul>
        <div>
          <Button label="Login" />
        </div>
      </header>
    </>
  );
};

export default Header;
