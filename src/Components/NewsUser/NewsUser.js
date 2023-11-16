import axios from "axios";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import React, { useState, useEffect } from "react";
import authHeader from "../AuthHeader/AuthHeader";
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './NewsUser.css';

const NewUser = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = "http://localhost:8080/zoo-server/api/v1/new/getAllNews";

    axios
      .get(apiUrl, { headers: authHeader() })
      .then((response) => {
        setNewsData(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const customizedMarker = (item) => {
    const formattedDate = new Date(item.createdDate).toLocaleDateString();

    return (
      <span className="custom-marker shadow-1" style={{ backgroundColor: item.color }}>



      </span>
    );
  };



  const customizedContent = (item) => {
    return (
      <Card title={item.title} subTitle={item.newsType}>
        <img
          src={`http://localhost:3000/img/${item.image}`}
          onError={(e) => (e.target.src = 'https://cdn-icons-png.flaticon.com/512/4520/4520862.png')}
          alt={item.image}
          style={{ width: '250px', height: '150px', objectFit: 'cover' }}
        />

        <div className="mt-2">   <i className="pi pi-calendar-times">{item.createdDate}</i></div>

        <Button label="Read more" className="p-button-text" onClick={() => window.location.href = `/news-detail/${item.newsId}`}></Button>


      </Card>
    );
  };

  return (
    <>
      <Header />
      <div className="timeline-demo">
        <div className="card container mt-4 ">
          <h5>news The Zoo</h5>
          <Timeline value={newsData} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewUser;
