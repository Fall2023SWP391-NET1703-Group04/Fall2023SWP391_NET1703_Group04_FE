
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
export default function ManageNews() {

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
    // Rest of your code



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
                    onClick={() => deleteNews(rowData)}
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
    console.log('check add', newNews);
    const handleAddNews = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/new/createNew", newNews, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setNewNews([])
                setIsModalOpen(false);
                setRefresh(true)

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
                console.error('Error fetching user profile:', error);
            });
    };
    console.log('check get news by id', editingNews)
    console.log('check news id', newsId);

    const handleUpdateNews = (newsId) => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/new/updateNew/${newsId}`, editingNews, { headers: authHeader() })
            .then((response) => {
                setEditingNews(false);
                alert('Product updated successfully');
            })
            .catch((error) => {
                console.error('Error updating product:', error);
                alert('Failed to update product');
            });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewNews({
            ...newNews,
            [name]: value
        });
    }
    const handleInputChangeUpdate = (event) => {
        const { name, value } = event.target;
        setEditingNews({
            ...newNews,
            [name]: value
        });
    }
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
                value={editingNews[field] || ''} x
                onChange={handleInputChangeUpdate}

            />
        ) : (
            <span>{editingNews[field] || defaultValue}</span>
        );
    };
    const displayWithDefaultDate = (field, defaultValue = 'Not Provided') => {
        return isEditing ? (
            <Calendar
                id="dateCreated"
                name="dateCreated"
                value={editingNews.dateCreated}
                onChange={handleInputChangeUpdate}
                className='w-full'
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
                onChange={handleInputChangeUpdate}
            />
        ) : (
            <span>{editingNews[field] || defaultValue}</span>
        );
    };

    return (
        <div className="datatable-editing-demo  w-full">
            <Toast ref={toast} />
            <div className="card p-fluid">
                <h5>List News</h5>
                <DataTable value={newsLists} paginator rows={10} header={header3} filters={filters} onFilter={(e) => setFilters(e.filters)}
                    selection={selectedCustomer3} onSelectionChange={e => setSelectedCustomer3(e.value)} selectionMode="single" dataKey="id" responsiveLayout="scroll"
                    stateStorage="custom" customSaveState={onCustomSaveState} customRestoreState={onCustomRestoreState} emptyMessage="No News title name found.">
                    <Column field="newsId" header="ID" style={{ width: '10%' }}></Column>
                    <Column field="title" header="Title" sortable style={{ width: '20%', textAlign: 'center' }}></Column>
                    <Column field="content" header="Content" sortable style={{ width: '25%' }}></Column>
                    <Column field="newsType" header="News Type" sortable style={{ width: '15%' }}></Column>
                    <Column field="createdDate" header="Created   Date" sortable style={{ width: '10%', textAlign: 'center' }}></Column>
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
                    <div class="formgrid grid">
                        <div className="field col-12 ">
                            <label htmlFor="title">Title News</label>
                            <br />
                            {displayWithDefault('title')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="updateContent">Content</label>
                            <br />
                            {displayWithDefaultDescription('content')}
                        </div>

                        <div className="field col-12 ">
                            <label htmlFor="newsType">News Types</label>
                            <br />

                            {displayWithDefault('newsType')}
                        </div>

                        <div className="field col-12">
                            <label htmlFor="dateStart">Date Created News (yyyy-MM-dd)</label>
                            <br />
                            {displayWithDefaultDate('dateStart')}

                        </div>
                        <Button
                            label="Update News"
                            icon="pi pi-pencil"
                            className="p-button-success"
                            onClick={() => handleUpdateNews(newsId)}
                        />
                    </div>
                </Dialog >

            </div>
        </div>
    );
}