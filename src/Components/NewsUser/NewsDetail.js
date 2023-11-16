import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Divider } from 'primereact/divider';
export default function NewsDetail() {
    const [news, setNews] = useState({});
    const { newsId } = useParams();
    const apiUrl = `http://localhost:8080/zoo-server/api/v1/new/getNewsById${newsId}`;
    useEffect(() => {

        axios.get(apiUrl)
            .then((response) => {
                console.log('check respone data need update', response);
                setNews(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);
    return (
        <>  <Header />
            <div className="container-xl px-4 mt-4">
                <div className='cart container mt-4'>

                    <div className='mt-8'>
                        <img
                            src={`http://localhost:3000/img/${news.image}`}
                            onError={(e) => (e.target.src = 'https://cdn-icons-png.flaticon.com/512/4520/4520862.png')}
                            alt={newsId.image}
                            style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                        />
                    </div>
                    <div>
                        <h1 style={{ textAlign: 'left' }}>{news.title}</h1>
                        <div className="mt-3" style={{ textAlign: 'left' }} >  <i className="pi pi-calendar-times" style={{ fontSize: '2rem' }}>{news.createdDate}</i></div>
                        <p className='mt-4' style={{ textAlign: 'left', fontSize: '1.5rem' }}>{news.content}</p>
                    </div>
                </div>
            </div >

            <Footer />
        </>
    );

}