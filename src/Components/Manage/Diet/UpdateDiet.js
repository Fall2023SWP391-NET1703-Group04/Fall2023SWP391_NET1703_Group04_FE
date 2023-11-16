import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'
import { Card } from 'primereact/card'
import { Fieldset } from 'primereact/fieldset'
import { DataView } from 'primereact/dataview'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputNumber } from 'primereact/inputnumber'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { useParams } from 'react-router-dom'

export default function UpdateDiet() {
    const { dietId } = useParams();
    const [updateDiet, setUpdateDiet] = useState([{
        dietName: "",
        dietFoodRequests: []
    }]);
    const [foodData, setFoodData] = useState([]);
    const [selectedFood, setSelectedFood] = useState([]);
    const [foodAdded, setFoodAdded] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [foodQuantities, setFoodQuantities] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    const defaultImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";


    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-plus" text label='Add' />;

    useEffect(() => {
        axios
            .get(`http://localhost:8080/zoo-server/api/v1/diet/getDietById/${dietId}`, { headers: authHeader() })
            .then((response) => {
                setUpdateDiet(response.data.data);
                // setFoodAdded(response.data.data.dietFoodResponses && response.data.data.dietFoodResponses.map((food) => ({
                //     ...food,
                // })));
            })
        axios
            .get('http://localhost:8080/zoo-server/api/v1/food/getAllFoods', { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoodData(foodsWithDateObjects);
                setRefresh(false)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);


    const imageBody = (rowData) => {
        const imageUrl = `http://localhost:3000/img/${rowData.image}`;
        const fallbackImageUrl = defaultImage;

        return (
            <img
                src={imageUrl || fallbackImageUrl}
                alt="Animal"
                width="50"
                height="50"
                onError={(e) => {
                    e.target.src = fallbackImageUrl;
                }}
            />
        );
    };

    const quantityBody = (data) => {
        const handleQuantityChange = (e) => {
            const newValue = e.value;
            if (data.foodId !== foodAdded.foodId) {
                // If the new value is different from the current quantity, set it.
                setQuantity(newValue);
            } else {
                // If the new value is the same as the current quantity, increment it.
                setQuantity(quantity + 1);
            }
            setFoodQuantities((prevQuantities) => ({
                ...prevQuantities,
                [data.foodId]: newValue,
            }));
        }

        return (
            <InputNumber value={foodQuantities[data.foodId] || 1} onValueChange={handleQuantityChange} min={1} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
                decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
        )
    };
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
                <Button className='ml-auto' type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search by name" />
                </span>
            </div>
        );
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(event.target.name);
        setUpdateDiet({
            ...updateDiet,
            [name]: value
        })
    }


    const handleInputFoodChange = (rowData) => {
        setSelectedFood(rowData);
        const quantity = foodQuantities[rowData.foodId] || 1;

        var foodItem = {
            foodId: rowData.foodId,
            quantity: quantity
        }
        const foodItems = foodAdded ? foodAdded : [];
        foodItems.push(foodItem);
        // Update the quantity for the specific food item using foodId
        setFoodQuantities((prevQuantities) => ({
            ...prevQuantities,
            [rowData.foodId]: quantity,
        }));
        //test show added food
        setFoodAdded(foodItems)
        setUpdateDiet({
            ...updateDiet,
            dietFoodRequests: foodItems,
        });

        console.log(foodItems);
    }

    const handleUpdateDiet = async () => {
        await axios
            .put(`http://localhost:8080/zoo-server/api/v1/diet/updateDiet/${dietId}`, updateDiet, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setRefresh(true);
            })
            .catch((error) => {
                if (updateDiet.dietName === undefined) {
                    show("Please input diet name", 'red');

                }
                else if (updateDiet.dietFoodRequests === undefined) {
                    show("Choose at least 1 food", 'red');
                }
                else
                    show(error.response.data.message, 'red');
                console.error(error);
            });
    };
    //some css
    const animalProfile = (
        <div className="flex align-items-center text-primary" >
            <span className="font-bold text-lg">Update Diet Here</span>
        </div>
    );
    const training = (
        <div className="flex align-items-center text-primary" >
            <span className="font-bold text-lg">Food list</span>
        </div>
    );

    const header = renderHeader();

    const footer = (
        <>
            <Button label="Update" icon="pi pi-pencil" onClick={handleUpdateDiet} />
        </>
    );


    const itemTemplate = (data) => {
        const handleRemoveFood = (foodId) => {
            // Remove the food item with the given foodId
            const updatedFoodItems = foodAdded.filter(item => item.foodId !== foodId);
            setFoodAdded(updatedFoodItems);
            console.log(foodAdded);
            // Update the quantity for the specific food item using foodId
            setFoodQuantities((prevQuantities) => ({
                ...prevQuantities,
                [foodId]: undefined, // Remove the quantity entry for the removed food item
            }));
        };
        return (
            <div className="grid w-full">
                <div className="col-5 text-2xl font-semibold">Food id: {data.foodId}</div>
                <div className="col-5 text-2xl font-semibold">Quantity: {data.quantity}</div>
                <div className="col-2">
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger p-button-rounded"
                        onClick={() => handleRemoveFood(data.foodId)}
                    />
                </div>
            </div>
        );
    };

    //notifications
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card col-4">
                <Toast ref={toast} />
                <Card footer={footer}>
                    <Fieldset legend={animalProfile} >
                        <div className="p-field mb-5">
                            <label htmlFor="dietName">Diet Name</label>
                            <br />
                            <InputText
                                id="dietName"
                                name="dietName"
                                className='w-100'
                                value={updateDiet.dietName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="card">
                            <label htmlFor="Food">Food List Added</label>
                            <br />
                            <DataView value={foodAdded} itemTemplate={itemTemplate} />
                        </div>
                    </Fieldset>
                </Card>
            </div>
            <div className='col-1'></div>
            <div className="col-7">
                <div className='card'>
                    <Fieldset legend={training} toggleable >
                        <div className="card">
                            <DataTable value={foodData} header={header} filters={filters} onFilter={(e) => setFilters(e.filters)} stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                                <Column field="foodName" header="Food Name" />
                                <Column field="nutriment" header="Nutriment" />
                                <Column field="dateStart" header="Date Start" body={(rowData) => rowData.dateStart.toLocaleDateString()} />
                                <Column field="dateEnd" header="Date End" body={(rowData) => rowData.dateEnd.toLocaleDateString()} />
                                <Column field="unit" header="Unit" />
                                <Column field="image" header="image" body={imageBody} />
                                <Column header="Input quantity" body={quantityBody}></Column>
                                <Column header="Action" body={(rowData) => (
                                    <div>
                                        <Button
                                            icon="pi pi-plus-circle"
                                            className="p-button-rounded p-button-info"
                                            onClick={() => handleInputFoodChange(rowData)}
                                        />
                                    </div>
                                )} />
                            </DataTable>
                        </div>
                    </Fieldset>
                </div>

            </div>
        </div>
    )
}
