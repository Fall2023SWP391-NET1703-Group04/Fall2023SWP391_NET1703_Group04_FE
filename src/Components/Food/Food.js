import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import dayjs from "dayjs";
import authHeader from "../AuthHeader/AuthHeader";
function Food() {
    const [foods, setFoods] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const toast = useRef(null);
    const menu = useRef(null);

    // Alert
    const showMessage = (severity, summary, detail) => {
        toast.current.show({
            severity,
            summary,
            detail,
        });
    };

    const dateTemplate = (rowData, column) => {
        const dateValue = rowData[column.field];
        return dateValue ? dayjs(dateValue).format("MM/DD/YYYY") : "";
    };

    const statusTemplate = (rowData, column) => {
        const status = rowData[column.field];
        return status ? "Active" : "Inactive";
    };

    const actionTemplate = (rowData) => (
        <>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => handleOpenUpdateModal(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => handleDeleteFood(rowData.foodId)}
            />
        </>
    );

    useEffect(() => {
        // Make an Axios GET request to fetch the data
        axios
            .get("http://localhost:8080/zoo-server/api/v1/food/getAllFoods", { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoods(foodsWithDateObjects);
                showMessage("success", "Update success", "");
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Add DATA
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const [newFood, setNewFood] = useState({
        foodName: "",
        dateStart: null, // Use null as the initial value
        dateEnd: null,
        nutriment: "",
        quantity: 1,
        unit: 1,
        status: false,
    });

    const handleInputChange = (event, name) => {
        // For non-date inputs, use the standard input handling
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            setNewFood({ ...newFood, [name]: value });
        } else {
            // For date inputs, use the selected date value
            setNewFood({ ...newFood, [name]: event });
        }
    };

    const handleAddFood = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/food", newFood)
            .then((response) => {
                axios
                    .get("http://localhost:8080/zoo-server/api/v1/foods")
                    .then((response) => {
                        const foodsWithDateObjects = response.data.map((food) => ({
                            ...food,
                            dateStart: new Date(food.dateStart),
                            dateEnd: new Date(food.dateEnd),
                        }));
                        setFoods(foodsWithDateObjects);
                        showMessage("success", "Add Successfully", "");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                setIsModalOpen(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Delete
    const handleDeleteFood = (foodId) => {
        axios
            .delete(`http://localhost:8080/zoo-server/api/v1/deleteFood/${foodId}`)
            .then((response) => {
                axios
                    .get("http://localhost:8080/zoo-server/api/v1/foods")
                    .then((response) => {
                        const foodsWithDateObjects = response.data.map((food) => ({
                            ...food,
                            dateStart: new Date(food.dateStart),
                            dateEnd: new Date(food.dateEnd),
                        }));
                        setFoods(foodsWithDateObjects);
                        showMessage("success", "Delete Successfully", "");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // Update
    const [updateFood, setUpdateFood] = useState({
        foodId: null,
        foodName: "",
        dateStart: null,
        dateEnd: null,
        nutriment: "",
        quantity: 0,
        unit: 0,
        status: false,
    });

    const handleOpenUpdateModal = (food) => {
        setUpdateFood({
            foodId: food.foodId,
            foodName: food.foodName,
            dateStart: food.dateStart,
            dateEnd: food.dateEnd,
            nutriment: food.nutriment,
            quantity: food.quantity,
            unit: food.unit,
        });
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleUpdateInputChange = (value, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            setUpdateFood({ ...updateFood, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = value ? new Date(value) : null;

            // Use the formatted date value in the state
            setUpdateFood({ ...updateFood, [name]: dateValue });
        }
    };

    const handleUpdateFood = () => {
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/food/${updateFood.foodId}`, updateFood)
            .then((response) => {
                axios
                    .get("http://localhost:8080/zoo-server/api/v1/foods")
                    .then((response) => {
                        const foodsWithDateObjects = response.data.map((food) => ({
                            ...food,
                            dateStart: new Date(food.dateStart),
                            dateEnd: new Date(food.dateEnd),
                        }));
                        setFoods(foodsWithDateObjects);
                        showMessage("success", "Update Successfully", "");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                handleCloseUpdateModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <h2>Food List</h2>
            <Button label="Add" icon="pi pi-plus" onClick={handleOpenModal} />

            <DataTable value={foods} className="p-datatable-striped">
                <Column field="foodName" header="Food Name" />
                <Column field="dateStart" header="Date Start" body={dateTemplate} />
                <Column field="dateEnd" header="Date End" body={dateTemplate} />
                <Column field="nutriment" header="Nutrition" />
                <Column field="quantity" header="Quantity" />
                <Column field="unit" header="Unit (g)" />
                <Column field="status" header="Status" body={statusTemplate} />
                <Column header="Interact" body={actionTemplate} />
            </DataTable>

            {/* Add Food Modal */}
            <Dialog header="Add Food" visible={isModalOpen} onHide={handleCloseModal}>
                <form>
                    <div className="p-field">
                        <label htmlFor="foodName">Food Name</label>
                        <InputText
                            id="foodName"
                            name="foodName"
                            value={newFood.foodName}
                            onChange={(e) => handleInputChange(e, "foodName")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="dateStart">Date Start</label>
                        <Calendar
                            id="dateStart"
                            name="dateStart"
                            value={newFood.dateStart}
                            onChange={(e) => handleInputChange(e.value, "dateStart")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="dateEnd">Date End</label>
                        <Calendar
                            id="dateEnd"
                            name="dateEnd"
                            value={newFood.dateEnd}
                            onChange={(e) => handleInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="nutriment">Nutrition</label>
                        <InputText
                            id="nutriment"
                            name="nutriment"
                            value={newFood.nutriment}
                            onChange={(e) => handleInputChange(e, "nutriment")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="quantity">Quantity</label>
                        <InputText
                            id="quantity"
                            name="quantity"
                            value={newFood.quantity}
                            onChange={(e) => handleInputChange(e, "quantity")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="unit">Unit (g)</label>
                        <InputText
                            id="unit"
                            name="unit"
                            value={newFood.unit}
                            onChange={(e) => handleInputChange(e, "unit")}
                        />
                    </div>
                    <Button label="Add Food" icon="pi pi-check" onClick={handleAddFood} />
                </form>
            </Dialog>

            {/* Update Food Modal */}
            <Dialog
                header="Update Food"
                visible={isUpdateModalOpen}
                onHide={handleCloseUpdateModal}
            >
                <form>
                    <div className="p-field">
                        <label htmlFor="foodName">Food Name</label>
                        <InputText
                            id="foodName"
                            name="foodName"
                            value={updateFood.foodName}
                            onChange={(e) => handleUpdateInputChange(e, "foodName")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="dateStart">Date Start</label>
                        <Calendar
                            id="dateStart"
                            name="dateStart"
                            value={updateFood.dateStart}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateStart")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="dateEnd">Date End</label>
                        <Calendar
                            id="dateEnd"
                            name="dateEnd"
                            value={updateFood.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="nutriment">Nutrition</label>
                        <InputText
                            id="nutriment"
                            name="nutriment"
                            value={updateFood.nutriment}
                            onChange={(e) => handleUpdateInputChange(e, "nutriment")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="quantity">Quantity</label>
                        <InputText
                            id="quantity"
                            name="quantity"
                            value={updateFood.quantity}
                            onChange={(e) => handleUpdateInputChange(e, "quantity")}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="unit">Unit (g)</label>
                        <InputText
                            id="unit"
                            name="unit"
                            value={updateFood.unit}
                            onChange={(e) => handleUpdateInputChange(e, "unit")}
                        />
                    </div>
                    <Button
                        label="Update Food"
                        icon="pi pi-check"
                        onClick={handleUpdateFood}
                    />
                </form>
            </Dialog>

            <Toast ref={toast} />
        </div>
    );
}

export default Food;
