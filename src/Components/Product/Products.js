import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
// import "./index.css";
import './Products.css';

import ReactDOM from "react-dom";
import axios from "axios";

import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { Rating } from "primereact/rating";

import authHeader from "../AuthHeader/AuthHeader";
export default function Products() {

    const [layout, setLayout] = useState("grid");
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const sortOptions = [
        { label: "Price High to Low", value: "!price" },
        { label: "Price Low to High", value: "price" }
    ];
    const [productList, setProductLits] = useState([]);




    const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getAllProduct`;
    useEffect(() => {
        axios.get(apiUrl, { headers: authHeader() })
            .then(response => {

                setProductLits(response.data.data);
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });

    }, []);


    console.log('chekc data product list', productList);

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf("!") === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const renderListItem = (productList) => {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <img
                        src={`http://localhost:3000/img/${productList.image}`}
                        onError={(e) =>
                        (e.target.src =
                            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                        }
                        alt={productList.productName}
                    />
                    <div className="product-list-detail">
                        <div className="product-name">{productList.productName}</div>
                        <div className="product-description">{productList.description}</div>
                        <Rating value={productList.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${productList.price}</span>
                        <Button
                            icon="pi pi-shopping-cart"
                            label="Add to Cart"
                            disabled={productList.quantity === 0}
                        ></Button>
                        <span
                            className={`product-badge status-${productList.quantity}`}
                        >
                            {productList.quantity}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderGridItem = (productList) => {
        return (
            <div className="col-12 md:col-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                        </div>
                        <span
                            className={`product-badge status-${productList.quantity}`}
                        >
                            {productList.quantity}
                        </span>
                    </div>
                    <div className="product-grid-item-content">
                        <img
                            src={`http://localhost:3000/img/${productList.image}`}
                            onError={(e) =>
                            (e.target.src =
                                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
                            }
                            alt={productList.productName}
                        />
                        <div className="product-name">{productList.productName}</div>
                        <div className="product-description">{productList.description}</div>
                        <Rating value={productList.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">${productList.price}</span>
                        <Button
                            icon="pi pi-shopping-cart"
                            label="Add to Cart"
                            disabled={productList.quantity === 0}
                        ></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === "list") return renderListItem(product);
        else if (layout === "grid") return renderGridItem(product);
    };

    const renderHeader = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col-6" style={{ textAlign: "left" }}>
                    <Dropdown
                        options={sortOptions}
                        value={sortKey}
                        optionLabel="label"
                        placeholder="Sort By Price"
                        onChange={onSortChange}
                    />
                </div>
                <div className="col-6" style={{ textAlign: "right" }}>
                    <DataViewLayoutOptions
                        layout={layout}
                        onChange={(e) => setLayout(e.value)}
                    />
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="dataview-demo">
            <div className="card">
                <DataView
                    value={productList}
                    layout={layout}
                    header={header}
                    itemTemplate={itemTemplate}
                    paginator
                    rows={9}
                    sortOrder={sortOrder}
                    sortField={sortField}
                />
            </div>
        </div>
    );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Products />, rootElement);
