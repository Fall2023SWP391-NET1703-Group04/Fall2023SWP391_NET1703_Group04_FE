import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect } from "react";

const Animal = () => {
  return (
    <>
      <Header />
      <AnimalDetail />
      <Footer />
    </>
  );
};

const AnimalDetail = () => {
  return (
    <>
      <div class="container">
        {Array.from({ length: 5 }, (_, index) => index + 1).map(() => {
          return (
            <div
              class="row"
              style={{ marginTop: "2rem", marginBottom: "2rem" }}
            >
              <div class="col">
                <div class="card" style={{ width: "18rem" }}>
                  <img
                    class="card-img-top"
                    src="img/bg-1.jpg"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="#" class="btn btn-primary">
                      Go Detail Here
                    </a>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card" style={{ width: "18rem" }}>
                  <img
                    class="card-img-top"
                    src="img/bg-1.jpg"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="#" class="btn btn-primary">
                      Go Detail Here
                    </a>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card" style={{ width: "18rem" }}>
                  <img
                    class="card-img-top"
                    src="img/bg-1.jpg"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="#" class="btn btn-primary">
                      Go Detail Here
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Animal;
