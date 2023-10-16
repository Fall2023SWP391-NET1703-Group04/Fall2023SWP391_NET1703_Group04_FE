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
import Food from "./Components/Food/Food";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/food" element={<Food />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
