import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { confirmPopup } from 'primereact/confirmpopup';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import authHeader from "../AuthHeader/AuthHeader";
import 'primeicons/primeicons.css';

const Diet = () => {
    const [diets, setDiets] = useState([]);
    const [foodDTOS, setFoodDTOS] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [newDiet, setNewDiet] = useState({
        dietName: '',
        foodDTOS: [],
    });
    const [displayDialog, setDisplayDialog] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateDiet, setUpdateDiet] = useState({
        dietId: null,
        dietName: '',
        foodDTOS: [],
    });

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
            .then((response) => setDiets(response.data.data))
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleAddDiet = () => {
        axios
            .post('http://localhost:8080/zoo-server/api/v1/diet/createNewDiet', newDiet, { headers: authHeader() })
            .then((response) => {
                setDiets((prevDiets) => [...prevDiets, response.data]);
                setNewDiet({ dietName: '', foodDTOS: [] });
                setDisplayDialog(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeleteDiet = (dietId) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/diet/deleteDiet/${dietId}`, { headers: authHeader() })
            .then(() => {
                setDiets(diets.filter((diet) => diet.dietId !== dietId));
                // console.log("delete success");
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleOpenUpdateModal = (diet) => {
        setUpdateDiet({
            dietId: diet.dietId,
            dietName: diet.dietName,
            foodDTOS: diet.foodDTOS,
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateDiet = () => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/diet/updateDiet/${updateDiet.dietId}`, updateDiet, { headers: authHeader() })
            .then((response) => {
                const updatedDiets = diets.map((diet) =>
                    diet.dietId === response.data.dietId ? response.data : diet
                );
                setDiets(updatedDiets);
                setIsUpdateModalOpen(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const header = (
        <div>
            <h1>Diet Management</h1>
            <Button
                label="Add"
                icon="pi pi-plus"
                className="p-button-primary"
                onClick={() => setDisplayDialog(true)}
            />
        </div>
    );

    return (
        <div>
            <div className="p-fluid">
                <DataTable
                    value={diets}
                    header={header}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                >
                    <Column field="dietName" header="Diet Name" />
                    <Column
                        field="foodDTOS"
                        header="Food"
                        body={(rowData) => (
                            <ul>
                                {rowData.foodDTOS.map((food) => (
                                    <li key={food.foodId}>{food.foodName}</li>
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
                                    onClick={() => handleOpenUpdateModal(rowData)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </div>

            <Dialog
                header="Add Diet"
                visible={displayDialog}
                style={{ width: '500px' }}
                modal
                onHide={() => setDisplayDialog(false)}
            >
                <form>
                    <div className="p-field">
                        <label htmlFor="dietName">Diet Name</label>
                        <InputText
                            id="dietName"
                            name="dietName"
                            value={newDiet.dietName}
                            onChange={(e) => setNewDiet({ ...newDiet, dietName: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="foodItems">Food</label>
                        <MultiSelect
                            id="foodItems"
                            optionLabel="foodName"
                            optionValue="foodName"
                            value={newDiet.foodDTOS}
                            options={foodDTOS}
                            onChange={(e) => setNewDiet({ ...newDiet, foodDTOS: e.value })}
                        />
                    </div>
                    <Button
                        label="Add Diet"
                        icon="pi pi-plus"
                        onClick={handleAddDiet}
                        className="p-button-primary"
                    />
                </form>
            </Dialog>

            <Dialog
                header="Update Diet"
                visible={isUpdateModalOpen}
                style={{ width: '500px' }}
                modal
                onHide={() => setIsUpdateModalOpen(false)}
            >
                <form>
                    <div className="p-field">
                        <label htmlFor="updateDietName">Diet Name</label>
                        <InputText
                            id="updateDietName"
                            name="updateDietName"
                            value={updateDiet.dietName}
                            onChange={(e) => setUpdateDiet({ ...updateDiet, dietName: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="updateFoodItems">Food</label>
                        <MultiSelect
                            id="updateFoodItems"
                            optionLabel="foodName"
                            optionValue="foodName"
                            value={updateDiet.foodDTOS}
                            options={foodDTOS}
                            onChange={(e) => setUpdateDiet({ ...updateDiet, foodDTOS: e.value })}
                        />
                    </div>
                    <Button
                        label="Update Diet"
                        icon="pi pi-pencil"
                        onClick={handleUpdateDiet}
                        className="p-button-primary"
                    />
                </form>
            </Dialog>
        </div>
    );
};

export default Diet;
