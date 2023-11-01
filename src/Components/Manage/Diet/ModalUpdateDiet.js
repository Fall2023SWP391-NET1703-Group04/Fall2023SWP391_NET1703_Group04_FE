import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'

export default function ModalUpdateDiet(data, isModalOpen, handleClose) {
    const [foodDTOS, setFoodDTOS] = useState([])
    const [diets, setDiets] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedFood, setSelectedFood] = useState([]);
    // const [selectedDiet, setSelectedDiet] = useState(null);
    const [newDiet, setNewDiet] = useState([{
        dietName: "",
        foodDTOS: []
    }]);
    // const dietId = data.dietId;
    // const dietName = data.dietName;
    // const foods = data.foodDTOS;

    const [updateDiet, setUpdateDiet] = useState([{
        // dietId: dietId,
        // dietName: dietName,
        // foodDTOS: foods,
    }]);

    const diet = {
        dietId: data.dietId,
        dietName: data.dietName,
        foods: data.foodDTOS,
    }

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
    }, [refresh]);

    // console.log("??", updateDiet);
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


    const handleInputFoodUpdateChange = (event) => {
        setSelectedFood(event.value)
        const foodItems = event.value
        setUpdateDiet({
            ...updateDiet,
            foodDTOS: foodItems,
        });
    }


    const handleUpdateDiet = () => {
        var requestData = {
            dietName: updateDiet.dietName ? updateDiet.dietName : diet.dietName,
            foodDTOS: updateDiet.foodDTOS ? updateDiet.foodDTOS : diet.foodDTOS
        }
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/diet/updateDiet/${diet.dietId}`, requestData, { headers: authHeader() })
            .then(() => {
                handleClose()
                setRefresh(true)
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const toast = useRef(null);

    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div>
            <Dialog
                header="Update Diet"
                visible={isModalOpen}
                style={{ width: '500px' }}
                modal
                onHide={() => handleClose()}
            >
                <div className="p-field">
                    <label htmlFor="updateDietName">Diet Name</label>
                    <br />
                    <InputText
                        id="dietName"
                        className='w-full'
                        name="dietName"
                        value={updateDiet.dietName ? updateDiet.dietName : diet.dietName}
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
                    onClick={handleUpdateDiet}
                    className="p-button-primary mt-5"
                />
            </Dialog>
        </div >
    )
}
