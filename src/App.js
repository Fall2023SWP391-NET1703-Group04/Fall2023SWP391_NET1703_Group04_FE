import logo from "./logo.svg";
import "./App.css";
import Login from "./Components/Login/Login";
import {
  BrowserRouter,
  Route,
  Routes,
  Switch,
  useLocation,
} from "react-router-dom";
import HomePage from "./Components/Homepage/Homepage";
import Register from "./Components/Register/Register";
import Admin from "./Components/Admin/Admin";
import ManageUser from "./Components/Manage/User/ManageUser";
import ManageProduct from "./Components/Manage/Product/ManageProduct";
import ManageAnimal from "./Components/Manage/Animal/ManageAnimal";
import ManageFood from "./Components/Manage/Food/ManageFood";
import ManageCatalogue from "./Components/Manage/Catalogue/ManageCatalogue";
import ManageArea from "./Components/Manage/Area/ManageArea";
import ManageDiet from "./Components/Manage/Diet/ManageDiet";
import { PrimeReactProvider } from "primereact/api";
import AnimalDetail from "./Components/Manage/Animal/AnimalDetail";
import Trainer from "./Components/Trainer/Trainer";
import User from "./Components/Trainer/User";
import Training from "./Components/Trainer/Training";
import Products from "./Components/Product/Products";
function App() {
  const value = {
    zIndex: {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100,  // tooltip
      toast: 1200     // toast
    },
    autoZIndex: true,
    refresh: false,
  };
  return (
    <div className="App">

      <PrimeReactProvider value={value} >
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/trainer" element={<Trainer />} />
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/training" element={<Training />} />
            <Route path="/admins" element={<Admin />}>
              <Route path="manage-users" element={<ManageUser />} />
              <Route path="manage-products" element={<ManageProduct />} />
              <Route path="manage-animals" element={<ManageAnimal />} />
              <Route path="manage-foods" element={<ManageFood />} />
              <Route path="manage-diets" element={<ManageDiet />} />
              <Route path="animal-details/:animalId" element={<AnimalDetail />} />
              {/* <Route path="products" element={<Products />} /> */}

            </Route>
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>

    </div>
  );
}

export default App;
