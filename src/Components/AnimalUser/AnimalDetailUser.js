import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
function AnimalDetailUser() {
  const { animalId } = useParams();
  console.log(animalId);
  return (
    <>
      {/* <Header /> */}
      AnimalDetail
      {/* <Footer /> */}
    </>
  );
}

export default AnimalDetailUser;
