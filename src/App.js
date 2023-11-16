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
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
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
import AnimalDetailUser from "./Components/AnimalUser/AnimalDetailUser";

import UpdateProfileUser from "./Components/UpdateProfileUser/UpdateProfileUser";

import ProductDetail from "./Components/Manage/Product/ProductDetail";
import ManageNews from "./Components/Manage/News/ManageNews";
import ProductDetailUser from "./Components/User/ProductDetailUser";
import Cart from "./Components/User/Cart";
import NewUser from "./Components/NewsUser/NewsUser";
import AnimalListUser from "./Components/AnimalUser/AnimalListUser";
import ManageRole from "./Components/Manage/Role/ManageRole";
import ManageCage from "./Components/Manage/Cage/ManageCage";
import CageDetail from "./Components/Manage/Area/CageDetail";
import Product from "./Components/User/Product";
import PageNotFound from "./PageNotFound/PageNotFound";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/news-user" element={<NewUser />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notfound" element={<PageNotFound />} />
          <Route path="managediet" element={<ManageDiet />} />
          <Route index element={<HomePage />} />

          <Route path="/animals" element={<Animal />}>
            <Route index element={<AnimalListUser />} />
            <Route
              path="animals-detail-user/:animalId"
              element={<AnimalDetailUser />}
            />
          </Route>

          <Route path="/update-profile-user" element={<UpdateProfileUser />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user-history" element={<History />} />

          <Route path="/products-detail/:productId" element={<ProductDetailUser />} />
          <Route path="/training-animal" element={<Training />} />
          <Route path="/admins" element={<Admin />}>
            <Route index element={<DashBoard />} />
            <Route path="manage-users" element={<ManageUser />} />
            <Route path="manage-products" element={<ManageProduct />} />
            <Route path="manage-animals" element={<ManageAnimal />} />
            <Route path="manage-roles" element={<ManageRole />} />
            <Route path="manage-foods" element={<ManageFood />} />
            <Route path="manage-areas" element={<ManageArea />} />
            <Route path="manage-catalogues" element={<ManageCatalogue />} />
            <Route path="manage-news" element={<ManageNews />} />
            <Route path="manage-diets" element={<ManageDiet />} />
            <Route path="manage-roles" element={<ManageRole />} />
            <Route path="manage-cages" element={<ManageCage />} />
            <Route path="animal-details/:animalId" element={<AnimalDetail />} />
            <Route path="cage-details/:areaId" element={<CageDetail />} />
            <Route
              path="product-details/:productId"
              element={<ProductDetail />}
            />
            {/* <Route path="products" element={<Products />} /> */}

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
