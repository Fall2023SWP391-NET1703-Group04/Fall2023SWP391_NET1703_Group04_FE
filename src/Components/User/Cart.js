import axios from 'axios';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import authHeader from '../AuthHeader/AuthHeader';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Cart.css';
export default function Cart() {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.data?.userId;
    const [listProduct, setListProduct] = useState([]);
    const [refresh, setRefresh] = useState(false); // Nếu cần refresh lại để lấy sản phẩm mới
    const [cartList, setCartList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const toastBC = useRef(null);

    const clear = () => {
        toastBC.current.clear();
        setVisible(false);
    };

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    //  const [productToDelete, setProductToDelete] = useState(null);




    useEffect(() => {
        const carts = JSON.parse(localStorage.getItem(`CART_${currentUserId}`)) || [];
        let totalPriceOfCart = 0;
        const productInfoArray = [];

        carts.forEach((cart) => {
            const priceEachItem = cart.price * cart.quantity;
            totalPriceOfCart += priceEachItem;
            // Push an object with productId and quantity into productInfoArray
            productInfoArray.push({ productId: cart.productId, quantity: cart.quantity });
        });
        setTotalPrice(totalPriceOfCart);
        setCartList(carts);
        setListProduct(productInfoArray);

    }, [refresh]); // Ensure to include the relevant dependencies for this useEffect

    const handleInputQuantityChange = (value, product) => {
        const updatedCart = cartList.map(item => {
            if (item.productId === product.productId) {
                return { ...item, quantity: value };
            }
            return item;
        });
        setCartList(updatedCart);
        localStorage.setItem(`CART_${currentUserId}`, JSON.stringify(updatedCart));
        setRefresh(!refresh);
    }




    const deleteProduct = (product) => {
        const updatedCart = cartList.filter(item => item !== product);
        setCartList(updatedCart);

        const currentUserId = JSON.parse(localStorage.getItem("user")).data.userId;
        localStorage.setItem(`CART_${currentUserId}`, JSON.stringify(updatedCart));
        setRefresh(true);
    };
    const [productToDelete, setProductToDelete] = useState(null);


    const handleDeleteConfirmation = (product) => {
        setProductToDelete(product);
        setVisible(true);
    };

    const handleCancelDelete = () => {
        setProductToDelete(null);
        setVisible(false);
    };

    const deleteConfirmedProduct = (product) => {
        deleteProduct(product);
        setProductToDelete(null);
        setVisible(false);
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div>

                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={() => deleteProduct(rowData)}
                />

            </div>
        );
    };
    const [selectedPayment, setSelectedPayment] = useState({ name: 'cash', code: 'cash' });
    const cities = [
        { name: 'cash', code: 'cash' },
        { name: 'atm', code: 'atm' },

    ];


    const handleAddOder = () => {
        const newOder = ({
            paymentMethod: selectedPayment.name,
            productList: listProduct,
            userId: currentUserId
        })
        if (newOder.productList.length == 0) {
            return show('No  product to buy', 'red');
        }
        axios
            .post("http://localhost:8080/zoo-server/api/v1/order/createNewBooking", newOder, { headers: authHeader() })
            .then((response) => {
                if (response.data.status === true) {
                    localStorage.removeItem(`CART_${currentUserId}`);
                    setRefresh(true);
                    show('buy success', 'green');
                }

            })
            .catch((error) => {
                show('build failed', 'red');
                console.error(error);
            });


    }


    const itemTemplate = (data) => {
        return (
            <>


                <div className="product-item">


                    <img src={`http://localhost:3000/img/${data.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.image} />
                    <div className="product-detail">

                        <div className="product-name">{data.productName}</div>

                        <div className="product-name">${data.price}</div>

                    </div>

                    <div className="product-action">

                        <InputNumber
                            inputId="horizontal-buttons"
                            value={data.quantity}
                            onValueChange={(e) => {
                                const value = e.value || 1;
                                handleInputQuantityChange(value, data);
                            }}
                            min={1}
                            max={data.maxQuantity}
                            showButtons
                            buttonLayout="vertical"
                            style={{ width: '4rem' }}
                            decrementButtonClassName="p-button-secondary"
                            incrementButtonClassName="p-button-secondary"
                            incrementButtonIcon="pi pi-plus"
                            decrementButtonIcon="pi pi-minus"
                        />

                    </div>
                    <div className='action-body ml-3'>
                        <div className='action-body ml-3'>
                            <i className="pi pi-times" style={{ fontSize: '1.5rem' }}
                                onClick={() => handleDeleteConfirmation(data)}
                            />
                        </div>
                    </div>
                    <Dialog
                        visible={visible}
                        style={{ width: '50vw' }}

                        modal
                        onHide={handleCancelDelete}
                        footer={
                            <div className="flex flex-wrap align-items-center justify-content-center">
                                <Button
                                    label="Yes"
                                    icon="pi pi-check"
                                    onClick={() => deleteConfirmedProduct(productToDelete)}
                                    className="p-button-success button-border"
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <Button
                                    label="No"
                                    icon="pi pi-times"
                                    onClick={handleCancelDelete}
                                    className="p-button-secondary button-border"
                                    style={{ marginLeft: '0.5rem' }}
                                />
                            </div>
                        }
                    >
                        <div className="text-center">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                            <h4>Are you sure to remove product from the cart?</h4>
                            <p>Confirm to proceed</p>
                        </div>
                    </Dialog>
                </div>
            </>

        );
    }

    return (
        <>
            <Header />
            <Toast ref={toast} />
            <Toast ref={toastBC} />
            <div className='container grid' style={{ margin: '20px' }} >

                <div className="datascroller-demo col-8">
                    <div>

                        <div className="card">
                            <div className='header'> your product </div>
                            <DataView value={cartList} itemTemplate={itemTemplate} rows={5} inline />
                        </div>
                    </div>
                </div>
                <div className='col-4'>

                    <div className="card grid">
                        <div className='header'> summary </div>
                        <div className="card flex justify-content-center">
                            <Dropdown
                                value={selectedPayment}
                                onChange={(e) => setSelectedPayment(e.value)}
                                options={cities}
                                optionLabel="name"
                                className="w-full"
                            />
                        </div>

                        <div className='body-content-paymen' >

                            <div className="col-6 col-offset-3" style={{ display: 'flex', flexDirection: 'column' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="product-name">Total:</div>
                                    <div className="product-value">{totalPrice}$</div>
                                </div>
                                <Button label="buy" icon="pi pi-shopping-cart"
                                    iconPos="right"
                                    onClick={handleAddOder}

                                />
                            </div>

                            <div className='address'></div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>

    );
}



