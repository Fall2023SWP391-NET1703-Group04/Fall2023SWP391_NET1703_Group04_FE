import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import authHeader from '../../AuthHeader/AuthHeader';
import ModalAssignDiet from './ModalAssignDiet';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'

export default function AnimalDietHistory(animalId) {
    const [dietData, setDietData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedFood, setSelectedFood] = useState([]);
    const [foodDTOS, setFoodDTOS] = useState([]);



    const [updateDiet, setUpdateDiet] = useState([{}]);



    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" onClick={() => setIsModalOpen(true)} icon="pi pi-plus" text label='Add' />;
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);



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
    //create new diet




    const toast = useRef(null);


    //Get data
    useEffect(() => {
        // Fetch the list of diets from your API endpoint
        axios.get(`http://localhost:8080/zoo-server/api/v1/animal-diet-management/getAllByAnimalId/${animalId}`, { headers: authHeader() })
            .then(response => {
                setDietData(response.data.data);
                setRefresh(false)
            })
            .catch(error => console.error(error));
    }, [refresh, animalId]);
    const actionBodyTemplate = (rowData) => {
        console.log('check diet  huhu', rowData)
        const diet = {
            dietId: rowData?.dietId,
            dietName: rowData?.dietName,
            foods: rowData?.foodDTOS,
        };
        return (
            <div>

                <Button
                    icon="pi pi-pencil"
                    className="p-button-pencil"
                    onClick={() => {
                        setIsModalOpenUpdate(true);
                        // handleUpdateDiet(diet);
                    }}
                />

            </div>
        );
    };
    const handleInputFoodUpdateChange = (event) => {
        setSelectedFood(event.value)
        const foodItems = event.value
        setUpdateDiet({
            ...updateDiet,
            foodDTOS: foodItems,
        });
    }
    // update diet
    const handleInputUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateDiet((prevState) => {
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
    const handleUpdateDiet = (diet) => {

        var requestData = {
            dietName: updateDiet.dietName ? updateDiet.dietName : diet.dietName,
            foodDTOS: updateDiet.foodDTOS ? updateDiet.foodDTOS : diet.foodDTOS
        }
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/diet/updateDiet/${diet.dietId}`, requestData, { headers: authHeader() })
            .then(() => {
                setIsModalOpenUpdate(false);
                setRefresh(true)

            })
            .catch((error) => {
                // show(error.response.data.message, 'red');
                console.error(error);
            });
    };


    const handleClose = () => {
        setIsModalOpen(false)
        setRefresh(true)
    }

    return (
        <div className='container' style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center" }}>
            <Toast ref={toast} />
            <div className="card">
                {ModalAssignDiet(animalId, isModalOpen, handleClose)}
                <DataTable value={dietData} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                    <Column field="dietName" header="Diet Name" style={{ width: '16%' }}></Column>
                    <Column field="animalName" header="Animal" style={{ width: '16%' }}></Column>
                    <Column field="dateStart" header="Date Start" style={{ width: '16%' }}></Column>
                    <Column field="dateEnd" header="Date End" style={{ width: '16%' }}></Column>
                    <Column field="animalDietManagementName" header="Description" style={{ width: '16%' }}></Column>
                    <Column field="Actions" header="Actions" style={{ width: '15%' }} body={actionBodyTemplate}></Column>
                </DataTable>
                {/*  update diet */}

                <Dialog
                    header="Update Diet"
                    visible={isModalOpenUpdate}
                    style={{ width: '500px' }}
                    modal
                    onHide={() => setIsModalOpenUpdate(false)}
                >

                    <div className="p-field">
                        <label htmlFor="updateDietName">Diet Name</label>
                        <br />
                        <InputText
                            id="dietName"
                            className='w-full'
                            name="dietName"
                            value={updateDiet.dietName}
                            //  ? updateDiet.dietName : diet.dietName
                            onChange={handleInputUpdateChange}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="updateFoodItems">Food</label>
                        <br />
                        <MultiSelect
                            id="updateFoodItems"
                            className='w-full'
                            optionLabel="foodName"
                            value={selectedFood}
                            options={foodDTOS}
                            onChange={handleInputFoodUpdateChange}
                        />
                    </div>
                    <Button
                        label="Update Diet"
                        icon="pi pi-pencil"
                        // disabled={isAddButtonDisabled}
                        onClick={handleUpdateDiet}
                        className="p-button-primary mt-5"
                    />
                </Dialog>
            </div>
        </div>
    )
}
