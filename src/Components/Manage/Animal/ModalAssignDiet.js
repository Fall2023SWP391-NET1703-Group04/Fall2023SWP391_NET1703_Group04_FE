import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputSwitch } from 'primereact/inputswitch'
import { InputText } from 'primereact/inputtext'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea';
import { useRef } from 'react'
import { Toast } from 'primereact/toast'

export default function ModalAssignDiet(animalId, isModalOpen, handleClose) {
    const [dietData, setNewDietData] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [SelectedDiet, setSelectedDiet] = useState({});
    const toast = useRef(null);
    const [newDiet, setNewDiet] = useState({
        "animalDietManagementName": "",
        "animalId": animalId,
        "dateEnd": "",
        "dateStart": "",
        "dietId": 0
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/diet/getAllDiets`, { headers: authHeader() })
            .then(response => setNewDietData(response.data.data))
            .catch(error => console.error(error));
    }, [refresh]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewDiet({
            ...newDiet,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedDiet(event.value);
        setNewDiet({
            ...newDiet,
            dietId: event.target.value.dietId
        });
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            console.log(value);

            setNewDiet({ ...newDiet, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;

            // Use the formatted date value in the state
            setNewDiet({ ...newDiet, [name]: dateValue });
        }
    };

    const handleAddDiet = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/animal-diet-management/createAnimalDietManagement", newDiet, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setTimeout(handleClose, 2000);
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
                console.error(error);
            });
    }


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
                            value={SelectedDiet}
                            onChange={handleSelectedChange}
                            options={dietData}
                            name='dietId'
                            optionLabel='dietName'
                            placeholder="Select a Diet"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
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
                            name="animalDietManagementName"
                            value={newDiet.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        label="Add Diet"
                        icon="pi pi-pencil"
                        onClick={handleAddDiet}
                        className="p-button-primary"
                    />
                </div>
            </Dialog >
        </div >
    )
}
