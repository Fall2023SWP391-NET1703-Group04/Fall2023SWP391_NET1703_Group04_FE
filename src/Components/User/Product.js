
import React, { useState, useEffect, useRef } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Link, useNavigate } from "react-router-dom";
import { Rating } from 'primereact/rating';
import './Product.css';
import axios from 'axios';
import authHeader from '../AuthHeader/AuthHeader';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
export default function Product() {

    const [products, setProducts] = useState(null);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortField, setSortField] = useState(null);
    const [selectedCustomer3, setSelectedCustomer3] = useState(null);
    const [value3, setValue3] = useState(1);
    const navigate = useNavigate();
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' },
    ];
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'productName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });

    const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getAllProduct`;

    useEffect(() => {

        axios.get(apiUrl)
            .then(response => {

                setProducts(response.data.data);

            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });

    }, []);

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        }
        else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    }
    const [visible, setVisible] = useState(false);
    const handleConfirmation = () => {
        navigate("/login    ");
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        toastBC.current.clear();
    };

    const toastBC = useRef(null);
    const showConfirm = () => {
        toastBC.current.show({
            severity: 'warn',
            sticky: true,
            content: (
                <div className="flex flex-column" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <h4>You are not logged in</h4>
                        <p>You need to log in to continue. Would you like to log in?</p>
                    </div>
                    <div className="grid p-fluid">
                        <div className="col-6">
                            <Button
                                type="button"
                                label="Yes"
                                className="p-button-success"
                                onClick={handleConfirmation} // removed ()
                            />
                        </div>
                        <div className="col-6">
                            <Button
                                type="button"
                                label="No"
                                className="p-button-secondary"
                                onClick={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            )
        });
    };

    const handleAddProduct = (data) => {
        if (JSON.parse(localStorage.getItem("user"))) {
            const currentUserId = JSON.parse(localStorage.getItem("user")).data.userId;
            let cart = localStorage.getItem(`CART_${currentUserId}`) ? JSON.parse(localStorage.getItem(`CART_${currentUserId}`)) : [];

            const existingItemIndex = cart.findIndex(item => item.productId === data.productId);

            if (existingItemIndex !== -1) {
                const newQuantity = cart[existingItemIndex].quantity + value3;

                if (newQuantity <= data.quantity) {
                    cart[existingItemIndex].quantity = newQuantity;
                    show('Added to cart successfully!', 'green');
                } else {
                    show('Quantity exceeds the maximum limit!', 'red');
                }
            } else {
                if (value3 <= data.quantity) {
                    cart.push({
                        productId: data.productId,
                        productName: data.productName,
                        image: data.image,
                        price: data.price,
                        maxQuantity: data.quantity,
                        quantity: value3
                    });
                    show('Added to cart successfully!', 'green');
                } else {
                    show('Quantity exceeds the maximum limit!', 'red');
                }
            }

            localStorage.setItem(`CART_${currentUserId}`, JSON.stringify(cart));
            setRefresh(true);
        } else {
            showConfirm();

        }

    }



    const renderListItem = (data) => {
        return (
            <div className="col-12">

                <div className="product-list-item">
                    <Link to={`/products-detail/${data.productId}`}>
                        <img src={`http://localhost:3000/img/${data.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                    </Link>
                    <div className="product-list-detail">
                        <div className="product-name">{data.productName}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>

                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => handleAddProduct(data)} />

                        <span className={`product-badge status`}>quantity {data.quantity}</span>
                    </div>
                </div>
            </div>
        );
    }



    const renderGridItem = (data) => {
        return (
            <div className="sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round " style={{ height: "500px" }}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold"></span>
                        </div>
                        <span className={`product-badge quantity`}>Quantity {data.quantity}</span>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Link to={`/products-detail/${data.productId}`}>
                            <img src={`http://localhost:3000/img/${data.image}`}
                                style={{ height: "100px" }}
                                onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                                alt={data.name} />
                        </Link>
                        {/* <div className="text-2xl font-bold"> aa</div> */}
                        <div className="product-name">{data.productName}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => handleAddProduct(data)} />

                    </div>
                </div>
            </div >
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list')
            return renderListItem(product);
        else if (layout === 'grid')
            return renderGridItem(product);
    }

    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        const value = filters['global'] ? filters['global'].value : '';
        return (
            <div className="grid grid-nogutter">
                <div class="col-4">
                    {/* <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Product Name Search" />
                    </span> */}
                </div>
                <div className="col-4" style={{ textAlign: 'left' }}>
                    <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
                </div>
                <div className="col-4" style={{ textAlign: 'right' }}>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </div>
        );
    }
    const filtersMap = {

        'filters': { value: filters, callback: setFilters },
    };



    const onGlobalFilterChange = (event, filtersKey) => {
        const value = event.target.value;
        let filters = { ...filtersMap[filtersKey].value };
        filters['global'].value = value;
        filtersMap[filtersKey].callback(filters);
    }

    const header3 = renderHeader('filters');
    const onCustomSaveState = (state) => {
        sessionStorage.setItem('dt-state-demo-custom', JSON.stringify(state));
    }
    const onCustomRestoreState = () => {
        return JSON.parse(sessionStorage.getItem('dt-state-demo-custom'));
    }


    const header = renderHeader('filters');
    return (
        <>
            <Header />
            <div className="dataview-demo container mt-5">
                <Toast ref={toast} />
                <Toast ref={toastBC} position="bottom-center" />
                <div className="card">
                    <DataView value={products} layout={layout} header={header3} filters={filters} onFilter={(e) => setFilters(e.filters)}
                        itemTemplate={itemTemplate} paginator rows={9}
                        sortOrder={sortOrder} sortField={sortField}
                        selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                        stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No Product name found." />
                </div>
            </div>
            <Footer />
        </>
    );
}
