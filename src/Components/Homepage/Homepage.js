import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Homepage.css";
import ScrollToTop from "react-scroll-to-top";
const HomePage = () => {
  const [isShowBackToTop, setIsShowBackToTop] = useState(false);

  return (
    <>
      <ScrollToTop smooth color="#6f00ff" />
      <Header />
    </>
  );
};

export default HomePage;
