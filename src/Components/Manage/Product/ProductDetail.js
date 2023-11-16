
// import './Users.css';
import axios from "axios";
import '/node_modules/primeflex/primeflex.css';
import authHeader from "../../AuthHeader/AuthHeader";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
export default function ProductDetail() {
    const navigate = useNavigate();

    if (!JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("user"))?.data?.role !== 'ROLE_ADMIN') {
        navigate("/notfound");
    }


    const { productId } = useParams();
    const [editedProduct, setEditedProduct] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [security, setSecurity] = useState({});



    // img save
    const [isEditingImg, setIsEditingImg] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedCustomer3, setSelectedCustomer3] = useState(null);

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

    const [feedback, setFeedback] = useState([]);
    const toast = useRef(null);
    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/feedback/getFeedbackByProduct${productId}`, { headers: authHeader() })
            .then((response) => {
                setFeedback(response.data.data); // Make sure response.data.data is an array
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);



    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        if (editedProduct.quantity !== null && !isNaN(editedProduct.quantity) && editedProduct.quantity >= 0) {
            axios
                .put(`http://localhost:8080/zoo-server/api/v1/product/updateProduct/${productId}`, editedProduct, { headers: authHeader() })
                .then((response) => {
                    setIsEditing(false);
                    alert('Product updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating product:', error);
                    alert('Failed to update product');
                });
        } else {
            alert('Please provide a valid quantity (should be a number greater than or equal to 0)');
        }
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
            <span>{editedProduct[field] || defaultValue}$</span>
        );
    };

    const isPositiveInteger = (val) => {
        let n = Math.floor(Number(val));
        return n !== Infinity && String(n) === String(val) && n > 0;
    };

    const deleteFeedback = (feedbacks) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/feedback/deleteFeedback/${feedbacks.feedbackId}`, { headers: authHeader() })
            .then((response) => {
                // Xóa thành công, cập nhật danh sách sản phẩm ở phía client
                console.log('check feedback id', feedback.feedbackId);
                const updatedFeedback = feedback.filter((item) => item.feedbackId !== feedbacks.feedbackId);
                setFeedback(updatedFeedback);

                alert(response.data.message);
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm:', error);
            });
    };
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };



    const NumberEditor = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputNumber
                type="text"
                value={editedProduct[field] !== null ? editedProduct[field] : ''}
                onValueChange={(e) => {
                    const newValue = e.value;
                    if (newValue !== null && !isNaN(newValue) && newValue >= 0) {
                        handleInputChange({ target: { name: field, value: newValue } });
                    }
                }}
            />
        ) : (
            <span>{editedProduct[field] !== null ? editedProduct[field] : defaultValue} </span>
        );
    };


    const displayWithDefaultDescription = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputTextarea
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
    const actionBodyTemplate = (rowData) => {
        return (
            <div>

                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={() => deleteFeedback(rowData)}
                />
                <Button
                    icon="pi pi-eye"
                    className="p-button-info"
                    onClick={() => window.location.href = `user-details/${rowData.userId}`}
                />
            </div>
        );
    };




    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div class="grid">
                <div class="col-3">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="Feedback Search" />
                    </span>
                </div>


            </div>
        );
    }
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'content': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });


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

    return (


        <div className="container-xl px-4 mt-4">
            <div className="grid">
                <div className="col-12">
                    <div className="row">
                        <div className="card col-5">
                            <div className="card-header">Product Image</div>
                            <div className="card-body text-center">
                                <div>
                                    <img alt="Card" style={{ width: '200px', height: '200px' }} src={`http://localhost:3000/img/${editedProduct.image}`} />

                                    {displayWithAvatar('image')}
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
                                        {displayWithDefaultDescription('description')}
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
                <div className="col-12">



                    <div className="card-body">
                        <div className="datatable-editing-demo">
                            <Toast ref={toast} />
                            <div className="card p-fluid">
                                <div className="card-header">Feedback Product</div>

                                <DataTable value={feedback} paginator rows={5} header={header3} filters={filters} onFilter={(e) => setFilters(e.filters)}
                                    selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                                    stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="Not found.">
                                    <Column field="feedbackId" header="ID" style={{ width: '10%' }}></Column>
                                    <Column field="fullName" header="Customer Name" sortable style={{ width: '20%', textAlign: 'center' }}></Column>
                                    <Column field="content" header="Content" sortable style={{ width: '30%' }}></Column>
                                    {/* <Column field="productName" header="Product Name" sortable style={{ width: '15%' }}></Column> */}
                                    <Column field="rating" header="Rating" sortable style={{ width: '20%' }}></Column>
                                    <Column field="Actions" header="Actions" style={{ width: '15%' }} body={actionBodyTemplate}></Column>
                                </DataTable>
                            </div>
                        </div>

                    </div>

                </div>
            </div >
        </div >
    );
};


