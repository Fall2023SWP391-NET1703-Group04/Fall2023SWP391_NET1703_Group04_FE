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
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
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

import DashBoard from "./Components/DashBoard/DashBoard";
import Animal from "./Components/AnimalUser/Animal";
import History from "./Components/User/History";
import UpdateProfileUser from "./Components/UpdateProfileUser/UpdateProfileUser";
import Product from "./Components/User/Product";
import ProductDetail from "./Components/Manage/Product/ProductDetail";
import ManageNews from "./Components/Manage/News/ManageNews";
import ProductDetailUser from "./Components/User/ProductDetailUser";
import Cart from "./Components/User/Cart";
function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/animals" element={<Animal />} />
          <Route path="/update-profile-user" element={<UpdateProfileUser />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user-history" element={<History />} />

          <Route path="/products-detail/:productId" element={<ProductDetailUser />} />
          <Route path="/training" element={<Training />} />
          <Route path="/admins" element={<Admin />}>
            <Route index element={<DashBoard />} />
            <Route path="manage-users" element={<ManageUser />} />
            <Route path="manage-products" element={<ManageProduct />} />
            <Route path="manage-animals" element={<ManageAnimal />} />
            <Route path="manage-foods" element={<ManageFood />} />
            <Route path="manage-areas" element={<ManageArea />} />
            <Route path="manage-catalogues" element={<ManageCatalogue />} />
            <Route path="manage-news" element={<ManageNews />} />
            <Route path="manage-diets" element={<ManageDiet />} />
            <Route path="animal-details/:animalId" element={<AnimalDetail />} />
            <Route path="product-details/:productId" element={<ProductDetail />} />

          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
