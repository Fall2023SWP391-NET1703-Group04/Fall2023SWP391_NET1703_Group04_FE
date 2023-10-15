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
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;