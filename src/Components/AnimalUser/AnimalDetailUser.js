import axios from "axios";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import authHeader from "../AuthHeader/AuthHeader";
export default function AnimalDetailUser() {
  const [animal, setAnimal] = useState({});
  const { animalId } = useParams();
  console.log(animalId);
  const url = `http://localhost:8080/zoo-server/api/v1/animal/getAnimalById/${animalId}`;
  useEffect(() => {
    axios
      .get(url, { headers: authHeader() })
      .then((response) => {
        // Handle the successful response here
        setAnimal(response.data.data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });
  }, []);
  console.log(animal);
  return (
    <>
      <div class="container">
        <div class="row">
          <div class="col">
            <img src={`http://localhost:3000/img/${animal.image}`} />
          </div>
          <div class="col">
            <h1>{animal.animalName}</h1>
            <p>{animal?.catalogueDTO?.catalogueName}</p>
            <p>{animal?.rale ? "Rare animal" : "Normal animal"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
