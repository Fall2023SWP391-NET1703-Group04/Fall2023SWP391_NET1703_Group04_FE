import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import authHeader from "../../AuthHeader/AuthHeader";
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import ModalUpdateCage from './ModalUpdateCage';
import { useNavigate } from 'react-router-dom';

const ManageCage = () => {
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
    const [cages, setCages] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState([]);
    const [newCage, setNewCage] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({})
    const toast = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    //Search by animals name
    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'animalName': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

    });

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            animalName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },

        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button
                    label="Add"
                    icon="pi pi-plus"
                    className="p-button-primary absolute"
                    onClick={() => setDisplayDialog(true)}
                />
                <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
                </span>
            </div>
        );
    };


    // Fetch diet data
    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/animalCage/getAllAnimalCage', { headers: authHeader() })
            .then((response) => {
                setCages(response.data.data);
                setRefresh(false)
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get('http://localhost:8080/zoo-server/api/v1/area/getAllAreas', { headers: authHeader() })
            .then((response) => {
                setAreas(response.data);
                setRefresh(false)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);

    //Add Cage
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewCage({
            ...newCage,
            [name]: value
        });
    }

    const handleSelectedChange = (event, name) => {
        console.log(event, name);
        setSelectedArea(event.value);
        setNewCage({
            ...newCage,
            areaId: event.target.value.areaId
        });
    }

    const handleAddCage = async () => {
        await axios
            .post('http://localhost:8080/zoo-server/api/v1/animalCage/createNewAnimalCage', newCage, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setDisplayDialog(false);
                setRefresh(true)
                setSelectedArea([])
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //delete
    const handleDeleteCage = (cageId) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/animalCage/deleteAnimalCage/${cageId}`, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setRefresh(true)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const header = renderHeader();

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };

    //update cage
    const handleClose = () => {
        setIsUpdateModalOpen(false)
        setRefresh(true)
    }
    const openUpdateModal = (rowData) => {
        setData(rowData)
        setIsUpdateModalOpen(true)

    }
    return (
        <div style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />
            {ModalUpdateCage(data, isUpdateModalOpen, handleClose)}
            <div style={{ width: "90%", justifySelf: "center" }}>
                <h1>Cage Management</h1>
                <DataTable value={cages} stripedRows
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} header={header} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="animalCageName" header="Cage Name" />
                    <Column field="areaName" header="Area" />
                    <Column field="description" header="Description" />
                    <Column field="maxQuantity" header="Max Quantity" />
                    <Column
                        style={{ width: '25%' }}
                        header="Actions"
                        body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger"
                                    onClick={() => handleDeleteCage(rowData.animalCageId)}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info"
                                    onClick={() => openUpdateModal(rowData)}
                                />
                            </div>
                        )} />

                </DataTable>
            </div>

            {/* Add Cage */}
            <Dialog
                header="Add Cage"
                visible={displayDialog}
                style={{ width: '800px' }}
                modal
                onHide={() => setDisplayDialog(false)}
            >
                <div class="formgrid grid">
                    <div className="field col-12 ">
                        <label htmlFor="animalCageName">Cage Name</label>
                        <br />
                        <InputText
                            id="animalCageName"
                            className='w-full'
                            name="animalCageName"
                            value={newCage.animalCageName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="updateCatalogue">Area</label>
                        <br />
                        <Dropdown
                            value={selectedArea}
                            onChange={(e) => handleSelectedChange(e, 'areaId')}
                            options={areas}
                            name='areaId'
                            optionLabel='areaName'
                            placeholder="Select a Area"
                        />
                    </div>

                    <div className="field col-12 ">
                        <label htmlFor="maxQuantity">Max Quantity</label>
                        <br />
                        <InputText
                            id="maxQuantity"
                            className='w-full'
                            name="maxQuantity"
                            keyfilter="int"
                            value={newCage.maxQuantity}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field col-12 ">
                        <label htmlFor="description">Description</label>
                        <br />
                        <InputTextarea
                            id="description"
                            className='w-full min-h-full'
                            name="description"
                            value={newCage.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Button
                        label="Add Cage"
                        icon="pi pi-pencil"
                        onClick={handleAddCage}
                        className="p-button-primary mt-5"
                    />
                </div>
            </Dialog >

        </div >
    );
};
export default ManageCage;
