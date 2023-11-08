import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useRef } from 'react'
import { Toast } from 'primereact/toast'

export default function ModalAssignDiet(animalId, isModalOpen, handleClose, data) {
    const [dietData, setNewDietData] = useState([])

    const [refresh, setRefresh] = useState(false);

    const [updateDiet, setUpdateDiet] = useState([{}]);

    const diet = {
        dietId: data?.dietId,
        dietName: data?.dietName,
        foods: data?.foodDTOS,
    }
    const [selectedDiet, setSelectedDiet] = useState({});
    const toast = useRef(null);
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [newAnimalDiet, setNewAnimalDiet] = useState({
        "animalDietManagementName": "",
        "animalId": animalId,
        "dateEnd": "",
        "dateStart": "",
        "dietId": 0,
    })
    //add diet
    const [newDiet, setNewDiet] = useState({
        dietName: "",
        foodDTOS: []
    })
    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedFood, setSelectedFood] = useState([]);
    const [foodDTOS, setFoodDTOS] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/diet/getAllDiets`, { headers: authHeader() })
            .then(response => {
                setNewDietData(response.data.data)
                setRefresh(false)
            })
            .catch(error => console.error(error));

        axios
            .get('http://localhost:8080/zoo-server/api/v1/food/getAllFoods', { headers: authHeader() })
            .then((response) => {
                const foodsWithDateObjects = response.data.data.map((food) => ({
                    ...food,
                    dateStart: new Date(food.dateStart),
                    dateEnd: new Date(food.dateEnd),
                }));
                setFoodDTOS(foodsWithDateObjects);
                setRefresh(false)
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAnimalDiet({
            ...newAnimalDiet,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedDiet(event.value);
        setNewAnimalDiet({
            ...newAnimalDiet,
            dietId: event.target.value.dietId
        });
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            console.log(value);

            setNewAnimalDiet({ ...newAnimalDiet, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;

            // Use the formatted date value in the state
            setNewAnimalDiet({ ...newAnimalDiet, [name]: dateValue });
        }
    };

    const handleAssignDiet = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/animal-diet-management/createAnimalDietManagement", newAnimalDiet, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setTimeout(handleClose, 2000);
                setRefresh(true)
            })
            .catch((error) => {
                if (newAnimalDiet.dateStart === "") {
                    show("Please, choose date start", 'red');
                }
                else {
                    show(error.response.data.message, 'red');
                }
            });
    }


    //create new diet
    const handleInputChangeDiet = (e) => {
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
                show(error.response.data.message, 'red');
                console.error(error);
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
        setIsAddButtonDisabled(true);
        await axios
            .post('http://localhost:8080/zoo-server/api/v1/diet/createNewDiet', newDiet, { headers: authHeader() })
            .then(() => {
                setDisplayDialog(false);
                setRefresh(true)
                setSelectedFood([])
            })
            .catch((error) => {
                console.error(error);
            });
    };

    //Notifications
    const show = (message, color) => {
        toast.current.show({
            summary: 'Notifications', detail: message, life: 3000,
            style: { backgroundColor: color, color: 'white', border: '2px solid yellow' },
        });
    };
    return (
        <div>
            <Dialog
                header="Add Diet"
                visible={isModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => handleClose()}
            >
                <Toast ref={toast} />
                <div className="formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="animalDietManagementName">Diet</label>
                        <br />
                        <Dropdown
                            className="field col-9 mr-2"
                            value={selectedDiet}
                            onChange={handleSelectedChange}
                            options={dietData}
                            name='dietId'
                            optionLabel='dietName'
                            placeholder="Select a Diet"
                        />
                        <Button
                            className="justify-content-center field col-2 h-3rem"
                            onClick={() => setDisplayDialog(true)}
                        >
                            Create new
                        </Button>
                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
                            className='w-full'
                            name="dateStart"
                            value={newDiet.dateStart}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateStart")}
                        />

                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateEnd">Date End</label>
                        <br />
                        <Calendar
                            id="dateEnd"
                            className='w-full'
                            name="dateEnd"
                            value={newDiet.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="animalDietManagementName">Description</label>
                        <br />
                        <InputTextarea
                            id="animalDietManagementName"
                            className='w-full min-h-full'
                            name="animalDietManagementName"
                            value={newDiet.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        label="Assign Diet"
                        icon="pi pi-pencil"
                        onClick={handleAssignDiet}
                        className="p-button-primary mt-5 "
                    />
                </div>
            </Dialog >

            {/* Add diet dialog */}
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
                        onChange={handleInputChangeDiet}
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
                    onClick={() => handleAddDiet()}
                    className="p-button-primary"
                />

            </Dialog>

        </div >
    )
}
