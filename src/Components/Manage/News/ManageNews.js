
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import authHeader from '../../AuthHeader/AuthHeader';

import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
export default function ManageNews() {
    const navigate = useNavigate();

    if (
        !JSON.parse(localStorage.getItem("user")) ||
        (
            JSON.parse(localStorage.getItem("user"))?.data?.role !== 'ROLE_ADMIN' &&
            JSON.parse(localStorage.getItem("user"))?.data?.role !== 'ROLE_STAFF'
        )
    ) {
        navigate("/notfound");
    }

    const [news4, SetNews4] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNews, setEditingNews] = useState([]);
    const [first, setFirst] = useState(0); // Số thứ tự hàng đầu tiên của trang
    const [rows, setRows] = useState(10); // Số hàng trên mỗi trangxxxxxxxxxxxxxx
    const [newNews, setNewNews] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [newsId, setNewsId] = useState(null);


    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [selectedCustomer3, setSelectedCustomer3] = useState(null);
    const [refresh, setRefresh] = useState(false);




    const toast = useRef(null);


    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'title': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });



    const [newsLists, setNewsLists] = useState([]);
    const apiUrl = `http://localhost:8080/zoo-server/api/v1/new/getAllNews`;
    useEffect(() => {

        axios.get(apiUrl, { headers: authHeader() })
            .then(response => {

                setNewsLists(response.data.data);
                SetNews4(response.data.data);
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
            });

    }, [!refresh]);



    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={() => showConfirm(rowData)}
                />

                <Button
                    icon="pi pi-pencil"
                    className="p-button-pencil"
                    onClick={() => {
                        setIsModalOpen1(true);
                        setIsEditing(true);
                        getNewsByID(rowData.newsId);
                        setNewsId(rowData.newsId);
                    }}
                />

            </div>
        );
    };





    const renderHeader = (filtersKey) => {
        const filters = filtersMap[`${filtersKey}`].value;
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div class="grid">
                <div class="col-4">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e, filtersKey)} placeholder="News Title Search" />
                    </span>
                </div>
                <div className='col-6'></div>
                <div class="col">
                    <span>
                        <Button
                            label="Add News"
                            icon="pi pi-pencil"
                            onClick={() => setIsModalOpen(true)}
                            className="p-button-primary p-button-sm"
                        />
                    </span>
                </div>
            </div>
        );
    }

    const deleteNews = (news) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/new/deleteNew/${news.newsId}`, { headers: authHeader() })
            .then((response) => {
                // Xóa thành công, cập nhật danh sách sản phẩm ở phía client
                const updatedNewsList = newsLists.filter((item) => item.newsId !== news.newsId);
                setNewsLists(updatedNewsList);

                show('delete news successfully!', 'green');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm:', error);
            });
    };
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 2000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };


    const handleAddNews = () => {
        // Check if any required field is empty
        if (!newNews.title || !newNews.content || !newNews.newsType || !newNews.dateCreated) {
            show('Please fill in all required fields.', 'red');
            return;
        }

        axios
            .post("http://localhost:8080/zoo-server/api/v1/new/createNew", newNews, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setNewNews([]);
                setIsModalOpen(false);
                setTimeout(() => {
                    setRefresh(true);
                }, 3000);
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }


    const getNewsByID = (id) => {

        axios.get(`http://localhost:8080/zoo-server/api/v1/new/getNewsById${id}`, { headers: authHeader() })
            .then((response) => {
                setEditingNews(response.data.data); // Make sure response.data.data is an array
            })
            .catch((error) => {
                console.error('Error fetching ', error);
            });
    };


    const handleUpdateNews = (newsId) => {
        if (!editingNews.title || !editingNews.content || !editingNews.newsType || !editingNews.dateCreated) {
            show('Please fill in all required fields.', 'red');
            return;
        }
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/new/updateNew/${newsId}`, editingNews, { headers: authHeader() })
            .then(() => {

                show(' updated successfully', 'green');
                setNewNews([])
                setIsModalOpen1(false);

                setRefresh(true);

            })
            .catch((error) => {
                console.error('Error updating:', error);
                show(error.response.data.message, 'red');
            });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewNews({
            ...newNews,
            [name]: value
        });
    }
    const handleInputChangeUpdate = (field, value) => {

        setEditingNews(prevState => ({
            ...prevState,
            [field]: value
        }));
    };
    const onUpload = (event) => {
        const name = event.target.name;
        setNewNews({
            ...newNews,
            [name]: event.target.files[0].name
        });
    }

    const handleInputChangequantity = (event) => {
        const { name, value } = event.target;

        // Ensure that the input is a positive integer
        const newValue = value.replace(/\D/g, ''); // Remove non-digit characters
        setNewNews({
            ...newNews,
            [name]: newValue,
        });
    };



    const filtersMap = {

        'filters': { value: filters, callback: setFilters },
    };

    const [visible, setVisible] = useState(false);
    const handleDeleteConfirmation = (rowData) => {
        deleteNews(rowData);
        handleCancel();
    };

    const handleConfirmation = (rowData) => {
        showConfirm(rowData);
    };

    const handleCancel = () => {
        setVisible(false);
        toastBC.current.clear();
    };

    const toastBC = useRef(null);
    const showConfirm = (rowData) => {
        toastBC.current.show({
            severity: 'warn',
            sticky: true,
            content: (
                <div className="flex flex-column" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <h4>You want to delete this news?</h4>
                    </div>
                    <div className="grid p-fluid">
                        <div className="col-6">
                            <Button
                                type="button"
                                label="Yes"
                                className="p-button-success"
                                onClick={() => handleDeleteConfirmation(rowData)}
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

    const displayWithDefault = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <input
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                name={field}
                type="text"
                placeholder={`Enter your ${field}`}
                value={editingNews[field] || ''}
                onChange={(e) => handleInputChangeUpdate(field, e.target.value)}
            />
        ) : (
            <span>{editingNews[field] || defaultValue}</span>
        );
    };

    const displayWithDefaultDate = (field, defaultValue = 'Not Provided') => {
        console.log('date view', editingNews[field])
        return isEditing ? (
            <Calendar
                id={field}
                name={field}
                value={editingNews[field] || ''}
                onChange={(e) => handleInputChangeUpdate(field, e.target.value)}
                className="w-full"
            />
        ) : (
            <span>{editingNews[field] || defaultValue}</span>
        );
    };

    const displayWithDefaultDescription = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <InputTextarea
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                id={field}
                name={field}
                type="text"
                placeholder={`Enter ${field}`}
                value={editingNews[field] || ''}
                onChange={(e) => handleInputChangeUpdate(field, e.target.value)}
            />
        ) : (
            <span>{editingNews[field] || defaultValue}</span>
        );
    };

    const onUploadUpdate = (event) => {
        const selectedImage = event.target.files[0];
        setEditingNews({
            ...editingNews,
            image: selectedImage ? selectedImage.name : '',
        });
    };
    const displayImage = (field, defaultValue = "Not Provided") => {
        return isEditing ? (
            <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                onChange={onUploadUpdate}
            />
        ) : (
            ""
        );
    };



    return (
        <div className="datatable-editing-demo  w-full">
            <Toast ref={toast} />
            <Toast ref={toastBC} position="bottom-center" />
            <div className="card container">
                <h5>List News</h5>
                <DataTable value={newsLists} paginator rows={10} header={header3} filters={filters} onFilter={(e) => setFilters(e.filters)}
                    selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                    stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No News title name found.">
                    <Column field="newsId" header="ID" sortable style={{ width: '5%' }}></Column>
                    <Column
                        field="image"
                        header="Image"
                        body={(rowData) => (
                            <img
                                src={`http://localhost:3000/img/${rowData.image}`}
                                onError={(e) => (e.target.src = 'https://cdn-icons-png.flaticon.com/512/4520/4520862.png')}
                                alt={rowData.image}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        )}
                        style={{ width: '10%' }}
                    ></Column>
                    <Column field="title" header="Title" sortable style={{ width: '20%' }}></Column>
                    <Column field="content" header="Content" sortable style={{ width: '20%' }}></Column>
                    <Column field="newsType" header="News Type" sortable style={{ width: '15%' }}></Column>
                    <Column field="createdDate" header="Created Date" sortable style={{ width: '10%', textAlign: 'center' }}></Column>
                    <Column field="Actions" header="Actions" style={{ width: '15%' }} body={actionBodyTemplate}></Column>
                </DataTable>



                <Dialog
                    header="Add News"
                    visible={isModalOpen}
                    style={{ width: '800px' }}
                    modal
                    onHide={() => setIsModalOpen(false)}
                >
                    <div class="formgrid grid">
                        <div className="field col-12 ">
                            <label htmlFor="title">Title News</label>
                            <br />
                            <InputText
                                id="title"
                                name="title"
                                value={newNews.title}
                                onChange={handleInputChange}
                                className='w-full'
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="updateContent">Content</label>
                            <br />
                            <InputTextarea
                                id="content"
                                name="content"
                                value={newNews.content}
                                onChange={handleInputChange}
                                className='w-full'
                            />
                        </div>
                        <div className="field col-12 ">
                            <label htmlFor="newsType">News Types</label>
                            <br />
                            <InputText
                                id="newsType"
                                name="newsType"
                                value={newNews.newsType}
                                onChange={handleInputChange}
                                className='w-full'
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="dateStart">Date Created News </label>
                            <br />
                            <Calendar
                                id="dateCreated"
                                name="dateCreated"
                                value={newNews.dateCreated}
                                onChange={handleInputChange}
                                className='w-full'
                            />
                            <br />

                        </div>
                        <div className="field col-12 ">
                            <div className="field col-12">
                                <label htmlFor="image">News Image</label>
                                <br />
                                <input
                                    className="w-full"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    id="image"
                                    onChange={onUpload}
                                />
                                {/* <FileUpload mode="basic" name="image" accept="image/*" maxFileSize={1000000} onUpload={onUpload} /> */}
                            </div>
                        </div>
                        <Button
                            label="Add News"
                            icon="pi pi-pencil"
                            onClick={handleAddNews}
                            className="p-button-primary"

                        />
                    </div>
                </Dialog >
                {/* update news */}
                <Dialog
                    header="Update News"
                    visible={isModalOpen1}
                    style={{ width: '800px' }}
                    modal
                    onHide={() => setIsModalOpen1(false)}
                >
                    <div className="formgrid grid">
                        <div className="field col-12">
                            <label htmlFor="title">Title News</label>
                            <br />
                            {displayWithDefault('title')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="updateContent">Content</label>
                            <br />
                            {displayWithDefaultDescription('content')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="newsType">News Types</label>
                            <br />
                            {displayWithDefault('newsType')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="dateCreated ">Date Created News (yyyy-MM-dd)</label>
                            <br />
                            {displayWithDefaultDate('dateCreated')}
                        </div>
                        <div className="field col-12">
                            <label htmlFor="image">Image</label>
                            <br />
                            {displayImage('image')}
                        </div>

                        <Button
                            label="Update News"
                            icon="pi pi-pencil"
                            className="p-button-success"
                            onClick={() => handleUpdateNews(newsId)}
                        />
                    </div>
                </Dialog>

            </div>
        </div>
    );
}