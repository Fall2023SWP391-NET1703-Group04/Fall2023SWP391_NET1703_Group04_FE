import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { RiFacebookBoxFill } from "react-icons/ri";
import { RiGoogleFill } from "react-icons/ri";
import { RiTwitterFill } from "react-icons/ri";
import { RiMailLine } from "react-icons/ri";
import { Divider } from "primereact/divider";


import "./Footer";
const Footer = () => {
  return (

    <Container>
      <Divider />
      <div style={{ height: '40px', width: '100%', backgroundColor: 'green' }}></div>
      <Row className="mt-4">
        <Col sm={8}>
          <h5>About Zoo Management System</h5>
          <p>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text. All the Lorem Ipsum generators on the Internet tend
            to repeat predefined chunks as necessary, making this the first true
            generator on the Internet.
          </p>
        </Col>
        <Col sm={4}>
          <h5>Our Location</h5>
          <h6>Zoo Management System</h6>
          <div className="content-location">
            <p>13/25 The Canyon Zoo</p>
            <p>3485 Sardis Start</p>
            <p>Mobile + 22 444 333 4444</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={8}>
          <Row>
            <Col sm={4}>
              <h6>Popular Animals</h6>
              <div>
                <p>Mamals</p>
                <p>Reptiles & Amphibians</p>
                <p>Birds</p>
              </div>
            </Col>
            <Col sm={4}>
              <h6>Connect with us</h6>
              <div>
                <i>
                  <RiFacebookBoxFill />
                </i>
                <i>
                  <RiGoogleFill />
                </i>
                <i>
                  <RiTwitterFill />
                </i>
                <i>
                  <RiMailLine />
                </i>
              </div>
            </Col>
          </Row>
        </Col>
        <Col sm={4}>
          <h6>Contact Us</h6>
          <p>You can contact us using the form in Contact Us Page</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
