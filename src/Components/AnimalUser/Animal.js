import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../AuthHeader/AuthHeader";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Animal = () => {
  return (
    <>
      <Header />
      <AnimalDetail />
      <Footer />
    </>
  );
};

const AnimalDetail = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/zoo-server/api/v1/animal/getAllAnimal",
          {
            headers: authHeader(),
          }
        );

        // Assuming the API returns an array of animals
        setAnimals(response.data.data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAnimals();
  }, []);
  console.log(animals);
  return (
    <>
      <div class="container">
        <div class="row" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          {animals.map((animal) => (
            <div class="col">
              <div class="card" style={{ width: "18rem" }}>
                <img class="card-img-top" src="img/bg-1.jpg" alt="Card" />
                <div class="card-body">
                  <h5 class="card-title">{animal.animalName}</h5>
                  <p class="card-text">{animal.catalogueDTO.catalogueName}</p>
                  <button
                    onClick={() =>
                      (window.location.href = `animals-detail-user/${animal.animalId}`)
                    }
                    className="btn btn-primary"
                  >
                    Go Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Animal;
