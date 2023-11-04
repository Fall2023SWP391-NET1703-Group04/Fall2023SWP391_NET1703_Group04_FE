import axios from "axios";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect } from "react";
import authHeader from "../AuthHeader/AuthHeader";
// import { ProductService } from "./service/ProductService";
const NewUser = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the URL
    const apiUrl = "http://localhost:8080/zoo-server/api/v1/new/getAllNews";

    // Make the Axios GET request
    axios
      .get(apiUrl, { headers: authHeader() })
      .then((response) => {
        setNewsData(response.data.data); // Update the state with the fetched data
        setLoading(false); // Set loading to false
      })
      .catch((err) => {
        setError(err); // Handle any errors
        setLoading(false); // Set loading to false
      });
  }, []);

  console.log(newsData);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Header />
      <div class="container">
        <div class="row">
          {newsData != null &&
            newsData.length > 0 &&
            newsData.map((newData) => {
              return (
                <>
                  <div class="col-6">
                    <div class="card" style={{ width: "18rem;" }}>
                      <div class="card-body">
                        <h5 class="card-title">{newData.title}</h5>
                        <p class="card-text">{newData.content}</p>
                        <p class="card-text">
                          Created Date: {newData.createdDate}
                        </p>
                        <p class="card-text">New Type: {newData.newsType}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewUser;
