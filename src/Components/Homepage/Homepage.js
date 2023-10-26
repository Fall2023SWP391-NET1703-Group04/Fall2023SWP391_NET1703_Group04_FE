import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Homepage.scss";
import ScrollToTop from "react-scroll-to-top";
import { Link } from "react-router-dom";
import Footer from "../Footer/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
const HomePage = () => {
  return (
    <>
      <Header />
      {/* <ScrollToTop smooth color="#6f00ff" /> */}
      <WelcomeHomePage />
      <OurSponsors />
      <FeatureAnimal />
      <MapOfZoo />
      <Footer />
    </>
  );
};

const VideoZoo = () => { };

const WelcomeHomePage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h3>Wel Come to Zoo Management System</h3>
          <p>
            On the other hand, we denounce with righteous indignation and
            dislike men who are so beguiled and demoralized by the charms of
            pleasure of the moment, so blinded by desire, that they cannot
            foresee the pain and trouble that are bound to ensue; and equal
            blame belongs to those who fail in their duty through weakness of
            will, which is the same as saying through shrinking from toil and
            pain. These cases are perfectly simple and easy to distinguish.
          </p>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio
          </p>
          <Button variant="success" size="lg" active>
            VIEW GALLERY
          </Button>
        </Col>
        <Col>
          <Row>
            <Col>
              <img src="img/animal-lg-1.jpg" />
              <h5>squirrel monkey</h5>
              <p>
                Squirrel monkeys are known for their captivating appearance and
                social behaviors, making them a popular subject of study and
                admiration in the field of primatology and among animal
                enthusiasts.
              </p>
            </Col>
            <Col>
              <img src="img/animal-lg-2.jpg" />
              <h5>Persian Cat</h5>
              <p>
                Persian cats make wonderful companions for individuals and
                families who can provide them with the care and attention they
                need, particularly in terms of grooming. Their sweet and placid
                nature makes them great indoor pets.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const OurSponsors = () => {
  return (
    <div className="sponsors-content">
      <Container fluid>
        <Row>
          <h1>Our Sponsors</h1>
          <Row>
            <Col>
              <img src="img/sponsor.png" />
              <h5>Merry Stand</h5>
              <p>This is just a demo testimonial</p>
            </Col>
            <Col>
              <img src="img/sponsor.png" />
              <h5>Axis Group</h5>
              <p>This is second demo testimonial</p>
            </Col>
            <Col>
              <img src="img/sponsor.png" />
              <h5>Axis Group</h5>
              <p>This is a demo testimonial</p>
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
  );
};

const FeatureAnimal = () => {
  return (
    <Container style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <Row>
        <Col>
          <h4>
            This week's featured <p style={{ color: "#eabb4e" }}> Animal 🙌</p>
          </h4>
          <img src="img/myna-bird.jpg" />
        </Col>
        <Col>
          <h1>Myna Bird</h1>
          <p>
            <span>Species name:</span> Common myna
          </p>
          <p>
            <span>Date of birth:</span>2023-10-07
          </p>
          <p>
            <span>Gender:</span>Male
          </p>
          <p>
            <span>Description:</span> This is a group of passerine birds which
            are native to southern Asia.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

const MapOfZoo = () => {
  return (
    <>
      <Container fluid="md">
        <h4>Map Of Zoo</h4>
        <img src="img/map-of-zoo.jpg" />
      </Container>
    </>
  );
};

export default HomePage;
