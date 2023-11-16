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
      <div className="container-xl px-4 mt-2">
        <div className='cart container mt-1'>
          <div className='mt-4'>
            <img
              src={`http://localhost:3000/img/${animal.image}`}
              onError={(e) => (e.target.src = 'https://cdn4.iconfinder.com/data/icons/solid-part-6/128/image_icon-512.png')}
              alt={animal.image}
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
            />
          </div>
          <div className="col mt-4">
            <h1>{animal.animalName}</h1>
            <p style={{ fontSize: '1.5rem' }}>Species: {animal?.catalogueDTO?.catalogueName}</p>

            {animal.rare && <p style={{ fontSize: '1.5rem' }} >Động vật quý hiếm</p>}

            <p style={{ fontSize: '1.5rem' }}>Gender: {animal?.gender}</p>
            <p style={{ fontSize: '1.5rem' }}>From: {animal?.country}</p>
          </div>
        </div>
      </div>



    </>
  );
}
