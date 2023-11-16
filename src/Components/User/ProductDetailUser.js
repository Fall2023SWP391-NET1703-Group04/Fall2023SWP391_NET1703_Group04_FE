import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../AuthHeader/AuthHeader';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { isBuffer } from 'lodash';
import { Link, useNavigate } from "react-router-dom";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
export default function ProductDetailUser() {
    const { productId } = useParams();
    const [editedProduct, setEditedProduct] = useState({});
    const [feedback, setFeedback] = useState([]);
    // const [currentUserId, setCurrentUserId] = useState(null);
    const [cartItem, setCartItem] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.data?.userId;
    const [NewFeedback, setNewFeedback] = useState(
        {
            content: "",
            productId: productId,
            rating: 0,
            title: "",
            userId: currentUserId
        }

    );
    const handleConfirmation = () => {
        navigate("/login");
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


    console.log(currentUserId)

    const toast = useRef(null);

    const [val1, setVal1] = useState(null);
    const [value3, setValue3] = useState(1);
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getProductById/${productId}`;

    useEffect(() => {
        axios
            .get(apiUrl, { headers: authHeader() })
            .then((response) => {
                setEditedProduct(response.data.data);
                setNewFeedback({
                    ...NewFeedback,
                    title: response.data.data.productName
                });
                setRefresh(false)
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            });
    }, [refresh]);

    const handlecreateFeedBack = () => {
        if (JSON.parse(localStorage.getItem("user"))) {
            axios
                .post("http://localhost:8080/zoo-server/api/v1/feedback/createNewFeedback", NewFeedback, { headers: authHeader() })
                .then((response) => {
                    show(response.data.message, 'green');
                    setNewFeedback([])
                    setIsModalOpen(false);
                    setRefresh(true)
                })
                .catch((error) => {
                    show(error.response.data.message, 'red');
                    console.error(error);
                });
        } else {
            showConfirm();
        }
    }
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewFeedback({
            ...NewFeedback,
            [name]: value
        });
    }
    const handleInputQuantityChange = (event) => {
        setValue3(event.value)
    }
    const save = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data Saved' });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/feedback/getFeedbackByProduct${productId}`)
            .then((response) => {
                setFeedback(response.data.data); // Make sure response.data.data is an array
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, [refresh]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const renderHeader = () => {
        return (

            <div class="col">
                <span>
                    <Button
                        label="Feedback Product"
                        icon="pi pi-pencil"
                        onClick={() => setIsModalOpen(true)}
                        className="p-button-primary p-button-sm"
                    />
                </span>
            </div>
        );
    }
    const header3 = renderHeader();


    return (
        <>  <Header />
            <div className="container-xl px-4 mt-4">

                <Toast ref={toastBC} position="bottom-center" />
                <div className="mt-2">
                    <div className="row">
                        <div className="col-6">
                            <div class="flex flex-row flex-wrap">
                                <Button

                                    icon="pi pi-arrow-left"
                                    label="Back to Shop"
                                    onClick={() => navigate('/product')}
                                    className="p-button-success p-button-sm"

                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="d-flex justify-content-end">
                                <Button
                                    icon="pi pi-shopping-cart"
                                    label="View Cart"
                                    onClick={() => navigate('/cart')}
                                    className="p-button-info p-button-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid">

                    <div className="col-12">

                        <div className="row">
                            <div className="card col-5">
                                <div className="card-header">Product Image</div>
                                <div className="card-body text-center">
                                    <div>

                                        <img alt="Card" style={{ width: '200px', height: '200px' }} src={`http://localhost:3000/img/${editedProduct.image}`} onError={(e) => e.target.src = 'https://thumbs.dreamstime.com/z/flat-isolated-vector-eps-illustration-icon-minimal-design-long-shadow-find-product-web-store-118523703.jpg'} />
                                    </div>
                                </div>

                                <div className="small font-italic text-muted mb-4">
                                    {editedProduct.productName ? `${editedProduct.productName} ` : 'Name Not Provided'}
                                </div>
                            </div>
                            <div className="col-1"></div>
                            <div className="card col-6">
                                <div className="card-header">Information Product</div>
                                <div className="card-body">
                                    <div className="field flex align-items-stretch flex-wrap card-container">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputProductName">
                                            Product name:
                                        </label>
                                        <span>{editedProduct.productName || 'Not Provided'}</span>
                                    </div>
                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputDescription">
                                            Description:
                                        </label>
                                        <span>{editedProduct.description || 'Not Provided'}</span>
                                    </div>
                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputPrice">
                                            Price:
                                        </label>
                                        <span>{editedProduct.price || 'Not Provided'}$</span>
                                    </div>

                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputEmailRating">
                                            Rating:
                                        </label>
                                        {/* {editedProduct.rating || '0'} */}
                                        <Rating value={editedProduct.rating} readOnly cancel={false}></Rating>
                                    </div>
                                </div>
                                <div className="flex align-items-center justify-content-between">
                                    <InputNumber inputId="horizontal-buttons" value={value3} onValueChange={(e) => setValue3(e.value)} mode="decimal"
                                        buttonLayout="horizontal" showButtons min={1} max={editedProduct.quantity}
                                        decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                        onChange={handleInputQuantityChange}
                                    />


                                    <Button
                                        icon="pi pi-shopping-cart"
                                        label="Add to Cart"
                                        onClick={() => {
                                            if (JSON.parse(localStorage.getItem("user"))) {
                                                const currentUserId = JSON.parse(localStorage.getItem("user")).data.userId;
                                                let cart = localStorage.getItem(`CART_${currentUserId}`) ? JSON.parse(localStorage.getItem(`CART_${currentUserId}`)) : [];

                                                if (value3 === null || value3 < 1) {
                                                    show('Please enter a valid quantity!', 'red'); // Hiển thị thông báo khi số lượng không hợp lệ
                                                    return;
                                                }

                                                const existingItemIndex = cart.findIndex(item => item.productId === productId);

                                                if (existingItemIndex !== -1) {
                                                    const newQuantity = cart[existingItemIndex].quantity + value3;

                                                    if (newQuantity <= editedProduct.quantity) {
                                                        cart[existingItemIndex].quantity = newQuantity;
                                                        show('Added to cart successfully!', 'green'); // Hiển thị thông báo thành công
                                                    } else {
                                                        show('Quantity exceeds the maximum limit!', 'red'); // Hiển thị thông báo vượt quá giới hạn
                                                    }
                                                } else {
                                                    if (value3 <= editedProduct.quantity) {
                                                        cart.push({
                                                            productId: productId,
                                                            productName: editedProduct.productName,
                                                            image: editedProduct.image,
                                                            price: editedProduct.price,
                                                            maxQuantity: editedProduct.quantity,
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
                                        }}
                                    ></Button>



                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card-body">
                            <div className="datatable-editing-demo">
                                <Toast ref={toast} />
                                <div className="card p-fluid">
                                    <div className="card-header">Feedback Product</div>
                                    <DataTable
                                        value={feedback}
                                        header={header3}
                                        paginator
                                        rows={5}
                                    >
                                        <Column field="fullName" header="Customer Name" style={{ width: '30%' }}></Column>
                                        <Column field="content" header="Content" style={{ width: '50%' }}></Column>
                                        <Column field="rating" header="Rating" style={{ width: '20%' }} body={(rowData) => (
                                            <Rating value={rowData.rating} readOnly cancel={false}></Rating>
                                        )}></Column>

                                    </DataTable>
                                    {/* create feedback */}
                                    <Dialog
                                        header="Feedback Product"
                                        visible={isModalOpen}
                                        style={{ width: '800px' }}
                                        modal
                                        onHide={() => setIsModalOpen(false)}
                                    >
                                        <div class="formgrid grid">



                                            <div className="field col-12  ">
                                                <label htmlFor="content">Content</label>
                                                <br />
                                                <InputTextarea
                                                    id="content"
                                                    name="content"
                                                    value={NewFeedback.content}
                                                    onChange={handleInputChange}
                                                    className='w-full  '

                                                />
                                            </div>
                                            <div className="field col-12 ">
                                                <label htmlFor="productId">Rating Product</label>
                                                <br />
                                                <Rating
                                                    id="rating"
                                                    name="rating"
                                                    value={NewFeedback.rating}
                                                    onChange={(handleInputChange)} />
                                            </div>

                                            <Button
                                                label="Upload Feedback Product"
                                                icon="pi pi-pencil"
                                                onClick={handlecreateFeedBack}
                                                className="p-button-primary  flex align-items-center justify-content-center "
                                            />
                                        </div>
                                    </Dialog >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />

        </>
    );
}
