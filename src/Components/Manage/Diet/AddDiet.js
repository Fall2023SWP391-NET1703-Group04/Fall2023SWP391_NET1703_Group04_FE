import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Fieldset } from 'primereact/fieldset'
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import { DataView } from 'primereact/dataview';

export default function AddDiet() {
    const [newDiet, setNewDiet] = useState([{
        dietName: "",
        dietFoodRequests: []
    }]);
    const [foodData, setFoodData] = useState([]);
    // const foodItems = [];
    const [dietFoodRequests, setDietFoodRequests] = useState([]);
    const [selectedFood, setSelectedFood] = useState([]);
    const [foodAdded, setFoodAdded] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const defaultImage = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";


    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-plus" text label='Add' />;

    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/food/getAllFoods', { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoodData(foodsWithDateObjects);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


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
            console.log(data.foodId, "vs", foodAdded.foodId);
            if (data.foodId !== dietFoodRequests.foodId) {
                // If the new value is different from the current quantity, set it.
                setQuantity(newValue);
            } else {
                // If the new value is the same as the current quantity, increment it.
                setQuantity(quantity + 1);
            }
        }

        return (
            <InputNumber value={quantity} onValueChange={handleQuantityChange} min={1} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
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
        // setNewDiet((prevState) => {
        //     return {
        //         ...prevState[0],
        //         [name]: value
        //     }
        // });
        setNewDiet({
            ...newDiet,
            [name]: value
        })
    }


    const handleInputFoodChange = (rowData) => {
        setSelectedFood(rowData);
        var foodItem = {
            foodId: rowData.foodId,
            quantity: quantity
        }
        const foodItems = dietFoodRequests ? dietFoodRequests : [];
        foodItems.push(foodItem);
        setDietFoodRequests(foodItems);
        //test show added food
        setFoodAdded(foodItems)
        setNewDiet({
            ...newDiet,
            dietFoodRequests: foodItems,
        });

        console.log(foodItems);

    }

    const handleAddDiet = async () => {
        await axios
            .post('http://localhost:8080/zoo-server/api/v1/diet/createNewDiet', newDiet, { headers: authHeader() })
            .then(() => { })
            .catch((error) => {
                console.error(error);
            });
    };
    //some css
    const animalProfile = (
        <div className="flex align-items-center text-primary" >
            <span className="font-bold text-lg">New Diet Here</span>
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
            <Button label="Add" icon="pi pi-pencil" onClick={handleAddDiet} />
        </>
    );

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="foodName">"Food id: "{data.foodId}</div>
                <div className="foodName">"Quantity: "{data.quantity}</div>
            </div>
        );
    };
    return (
        <div className='grid ' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <div className="card col-4">
                <Card footer={footer}>
                    <Fieldset legend={animalProfile} >
                        <div className="p-field mb-5">
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
                        {/* <div className="p-field">
                            <label htmlFor="dietName">Food list</label>
                            <br />
                            <InputTextarea
                                id="dietName"
                                name="dietName"
                                className='w-100'
                                value={selectedFood}
                            />
                        </div> */}

                        <div className="p-field">
                            <label htmlFor="Food">Food List Added</label>
                            <br />
                            <DataView value={foodAdded} itemTemplate={itemTemplate} rows={5} inline />
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
                                <Column field="quantity" header="Quantity" />
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
