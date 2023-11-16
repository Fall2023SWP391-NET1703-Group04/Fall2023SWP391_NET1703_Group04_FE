import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import "./Header.scss";
import { Button } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);
  return (
    <>
      <div style={{ backgroundColor: "#fab1a0" }}>
        <Navbar expand="lg" >
          <Container fluid>
            <div className="col-2">
              <Navbar.Brand href="/">
                <img className="logo" alt="Card" style={{ width: '100px', height: '50px' }} src={`http://localhost:3000/img/logo.png`} />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
            </div>
            <div className="col-7"></div>
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="col-3"
                style={{ maxHeight: "100px" }}
                navbarScroll
              >
                <NavLink
                  to={`/`}
                  className="nav-link"
                >
                  Home
                </NavLink>
                <NavLink to={`/animals`} className="nav-link">
                  Animal
                </NavLink>
                <NavLink to={`/product`} className="nav-link">
                  Product
                </NavLink>
                <NavLink to={`/news-user`} className="nav-link">
                  News
                </NavLink>
                {user != null && (
                  <NavDropdown
                    title={
                      <Image
                        src={"http://localhost:3000/img/user-img.png"}
                        style={{ width: "2rem", height: "2rem" }}
                        thumbnail
                      />
                    }
                    id="navbarScrollingDropdown"
                  >
                    <NavDropdown.Item>
                      {user.data.role === "ROLE_TRAINER" ? (
                        <Link to="/trainer" className="nav-link">
                          Profile
                        </Link>
                      ) : (
                        <Link to="/update-profile-user" className="nav-link">
                          Profile
                        </Link>
                      )}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="#action4"
                      onClick={() => {

                        navigate("/cart");
                      }}
                    >
                      Your Cart
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      href="#action4"
                      onClick={() => {

                        navigate("/user-history");
                      }}
                    >
                      Oder History
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
                )}

                {user === null && (
                  <Button>
                    <Link to="/login"> Login</Link>
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default Header;
