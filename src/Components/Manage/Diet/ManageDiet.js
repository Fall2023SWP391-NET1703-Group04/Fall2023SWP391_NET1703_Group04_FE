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
    const [selectedFood, setSelectedFood] = useState([]);
    const [newDiet, setNewDiet] = useState([{
        dietName: "",
        foodDTOS: []
    }]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);


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

    //Add diet
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDiet((prevState) => {
            if (name === "dietName") {
                // If the input name is "dietName," update it directly
                return {

                    ...prevState["0"],
                    [name]: value,

                };
            } else {
                // For other input fields, update only the top-level state
                return {
                    ...prevState,
                    [name]: value,
                };
            }
        });
    };

    const handleInputFoodChange = (event) => {
        console.log(event.value);
        setSelectedFood(event.value)
        const foodItems = event.value
        setNewDiet({
            ...newDiet,
            foodDTOS: foodItems,
        });
    }

    const handleAddDiet = async () => {
        await axios
            .post('http://localhost:8080/zoo-server/api/v1/diet/createNewDiet', newDiet, { headers: authHeader() })
            .then(() => {
                setIsAddButtonDisabled(true);
                setDisplayDialog(false);
                setRefresh(true)
                setSelectedFood([])
            })
            .catch((error) => {
                console.error(error);
            });
    };

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
                        field="foodDTOS"
                        body={(rowData) => (
                            <ul>
                                {rowData.foodDTOS.map((food) => (
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
                                    className="p-button-rounded p-button-danger"
                                    onClick={() => handleDeleteDiet(rowData.dietId)}
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-info"
                                    onClick={() => {
                                        openUpdateModal(rowData);
                                    }}
                                />

                            </div>
                        )}
                    />
                </DataTable>
            </div>

            {/* Add dialog */}
            <Dialog
                refresh={false}
                header="Add Diet Dialog"
                visible={displayDialog}
                style={{ width: '500px' }}
                modal
                onHide={() => setDisplayDialog(false)}
            >

                <div className="p-field">
                    <label htmlFor="dietName">Diet Name</label>
                    <br />
                    <InputText
                        id="dietName"
                        name="dietName"
                        className='w-100'
                        value={newDiet.dietName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="foodItems">Food</label>
                    <br />
                    <MultiSelect
                        id="foodItems"
                        optionLabel="foodName"
                        value={selectedFood}
                        options={foodDTOS}
                        className='w-100'
                        onChange={handleInputFoodChange} />
                </div>
                <br />
                <Button
                    label="Add Diet"
                    icon="pi pi-plus"
                    disabled={isAddButtonDisabled}
                    onClick={() => handleAddDiet()}
                    className="p-button-primary"
                />

            </Dialog>
        </div>
    );
};
export default ManageDiet;
