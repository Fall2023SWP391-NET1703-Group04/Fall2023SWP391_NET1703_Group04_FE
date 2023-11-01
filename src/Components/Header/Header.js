import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import "./Header.scss";

function Header() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#">
            <h1>LOGO</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <NavLink
                style={{ marginLeft: "35rem" }}
                to={`/home`}
                className="nav-link"
              >
                Home
              </NavLink>
              <NavLink to={`/animals`} className="nav-link">
                Animal
              </NavLink>
              <NavLink to={`/products`} className="nav-link">
                Product
              </NavLink>
              <NavLink to={`/news-user`} className="nav-link">
                News
              </NavLink>
              <NavDropdown
                title={
                  <Image
                    src="img/user-img.png"
                    style={{ width: "2rem", height: "2rem" }}
                    thumbnail
                  />
                }
                id="navbarScrollingDropdown"
              >
                <NavDropdown.Item>
                  <Link to={`/update-profile-user`} className="nav-link">
                    Update Profile
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#action4"
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                >
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
