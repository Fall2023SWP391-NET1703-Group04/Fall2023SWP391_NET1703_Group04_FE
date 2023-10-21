
// import './Users.css';
import axios from "axios";
import '/node_modules/primeflex/primeflex.css';
import authHeader from "../../AuthHeader/AuthHeader";

import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { InputNumber } from 'primereact/inputnumber';
export default function ProductDetail() {

    const { productId } = useParams();
    const [editedProduct, setEditedProduct] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [security, setSecurity] = useState({});



    // img save
    const [isEditingImg, setIsEditingImg] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const defaultImageUrl = "http://localhost:3000/img/default.jpg";

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageName = file.name;
            setEditedProduct({ ...editedProduct, image: imageName });
            setSelectedFile(file);
            setShowSaveButton(true);
        }
    }
    const handleInputChangeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setShowSaveButton(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setEditedProduct({ ...editedProduct, image: imageData });
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setShowSaveButton(false);
        }
    };


    const apiUrl = `http://localhost:8080/zoo-server/api/v1/product/getProductById/${productId}`;
    useEffect(() => {

        axios.get(apiUrl, { headers: authHeader() })
            .then((response) => {
                console.log('check respone data need update', response);
                setEditedProduct(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    const [feedback, setFeedback] = useState({});

    useEffect(() => {

        axios.get(`http://localhost:8080/zoo-server/api/v1/feedback/getFeedbackByProduct${productId}`, { headers: authHeader() })
            .then((response) => {

                setFeedback(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        console.log(editedProduct)
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/product/updateProduct/${productId}`, editedProduct, { headers: authHeader() })
            .then((response) => {
                // const updatedPro = response.data.data;
                // if (updatedPro) {
                //     setEditedProduct(updatedPro);
                // }
                setIsEditing(false);
                alert('Product updated successfully');
            })
            .catch((error) => {
                console.error('Error updating product:', error);
                alert('Failed to update product');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct({
            ...editedProduct,
            [name]: value,
        });
    };



    const onUpload = (event) => {
        setEditedProduct({
            ...editedProduct,
            image: event.target.files[0].name
        });
    }

    const textEditor = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputTextarea
                type="text"
                value={editedProduct[field] || ''}
                onChange={handleInputChange}
            />
        ) : (
            <span>{editedProduct[field] || defaultValue}</span>
        );
    };

    const NumberEditorPrice = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputNumber
                type="text"
                value={editedProduct[field] || ''}
                onValueChange={(e) => {
                    const newValue = e.value;
                    if (isPositiveInteger(newValue)) {
                        handleInputChange({ target: { name: field, value: newValue } });
                    }
                }}
                mode="currency"
                currency="USD"
                locale="en-US"
            />
        ) : (
            <span>{editedProduct[field] || defaultValue}</span>
        );
    };

    const isPositiveInteger = (val) => {
        let n = Math.floor(Number(val));
        return n !== Infinity && String(n) === String(val) && n > 0;
    };




    const NumberEditor = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputNumber
                type="text"
                value={editedProduct[field] || ''}
                onValueChange={(e) => {
                    const newValue = e.value;
                    if (!isNaN(newValue) && newValue >= 0) {
                        handleInputChange({ target: { name: field, value: newValue } });
                    }
                }}
            />
        ) : (
            <span>{editedProduct[field] || defaultValue}</span>
        );
    };




    const displayWithDefault = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <input
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-8"
                name={field}
                type="text"
                placeholder={`Enter your ${field}`}
                value={editedProduct[field] || ''}
                onChange={handleInputChange}
            />
        ) : (
            <span>{editedProduct[field] || defaultValue}</span>
        );
    };


    const displayWithAvatar = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (

            <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                onChange={onUpload}
            />
        ) : (""
        );

    };

    return (


        <div className="container-xl px-4 mt-4">

            <hr className="mt-0 mb-4" />
            <div className="grid">
                <div className="col-6">
                    <div className="w-full">
                        <div className="card ">
                            <div className="card-header">Product Image</div>
                            <div className="card-body text-center">
                                <div>
                                    <img alt="Card" style={{ width: '200px', height: '200px' }} src={`http://localhost:3000/img/${editedProduct.image}`} />
                                    <br />
                                    <label htmlFor="updateAnimalImage">Image</label>
                                    <br />
                                    {displayWithAvatar('image')}
                                </div>

                            </div>

                            <div className="small font-italic text-muted mb-4">
                                {editedProduct.productName ? `${editedProduct.productName} ` : 'Name Not Provided'}
                            </div>
                            <div className="card-header">Information Product</div>
                            <div className="card-body">
                                <form>
                                    <div className="field flex align-items-stretch flex-wrap card-container">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputProductName">
                                            Product name:
                                        </label>
                                        {displayWithDefault('productName')}
                                    </div>
                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputDescription">
                                            Descriptione:
                                        </label>
                                        {displayWithDefault('description')}
                                    </div>
                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputPrice">
                                            Price:
                                        </label>
                                        {NumberEditorPrice('price')}
                                    </div>

                                    <div className="field flex">
                                        <label className="mb-1 mr-2 font-bold" htmlFor="inputQuantity">
                                            Quantity:
                                        </label>
                                        {NumberEditor('quantity')}
                                    </div>

                                    <div className="field flex">
                                        <label
                                            className="mb-1 mr-2 font-bold"
                                            htmlFor="inputEmailRating"
                                        >
                                            Rating:
                                        </label>

                                        {editedProduct.rating || '0'}
                                    </div>



                                    {isEditing ? (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleSaveClick}
                                        >
                                            Save changes
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleEditClick}
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card mb-4">

                    </div>
                    <div className="card-header">Report Product</div>
                    <div className="card-body">

                    </div>

                </div>

            </div >
        </div >
    );
};


