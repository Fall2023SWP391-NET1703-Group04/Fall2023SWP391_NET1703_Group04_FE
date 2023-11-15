import React, { useState, useEffect } from 'react';
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
import ModalUpdateDiet from './ModalUpdateDiet';

const ManageDiet = () => {
    const [diets, setDiets] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [foodDTOS, setFoodDTOS] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    const [data, setData] = useState({})
    //Search by name
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
                    // onClick={() => setDisplayDialog(true)}
                    onClick={() => window.location.href = `add-diet`}
                />
                <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
                </span>
            </div>
        );
    };

    // Fetch food data
    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/food/getAllFoods', { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoodDTOS(foodsWithDateObjects);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Fetch diet data
    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/diet/getAllDiets', { headers: authHeader() })
            .then((response) => {
                setDiets(response.data.data);
                setRefresh(false)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);

    const handleDeleteDiet = (dietId) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/diet/deleteDiet/${dietId}`, { headers: authHeader() })
            .then(() => {
                setRefresh(true)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleClose = () => {
        setIsUpdateModalOpen(false)
        setRefresh(true)
    }
    const openUpdateModal = (rowData) => {
        setData(rowData)
        setIsUpdateModalOpen(true)

    }

    const header = renderHeader();

    return (

        <div style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            {ModalUpdateDiet(data, isUpdateModalOpen, handleClose)}
            <div style={{ width: "90%", justifySelf: "center" }}>
                <h1>Diet Management</h1>
                <DataTable value={diets} header={header} stripedRows
                    paginator rows={5} rowsPerPageOptions={[5, 10, 20]}
                    filters={filters} onFilter={(e) => setFilters(e.filters)}>
                    <Column field="dietName" header="Diet Name" />
                    <Column
                        header="Food"
                        field="dietFoodResponses"
                        body={(rowData) => (
                            <ul>
                                {rowData.dietFoodResponses.map((food) => (
                                    <p key={food.foodId}>{food.foodName}</p>
                                ))}
                            </ul>
                        )}
                    />
                    <Column
                        header="Actions"
                        body={(rowData) => (
                            <div>
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-danger mr-2"
                                    onClick={() => handleDeleteDiet(rowData.dietId)}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info mr-2"
                                    onClick={() => {
                                        openUpdateModal(rowData);
                                    }}
                                />
                                <Button
                                    icon="pi pi-eye"
                                    className="p-button-rounded p-button-info"
                                // onClick={() => {
                                //     openUpdateModal(rowData);
                                // }}
                                />

                            </div>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};
export default ManageDiet;
