import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { InputTextarea } from 'primereact/inputtextarea';

export default function ModalAssignTrainer(animalId, isModalOpen, handleClose) {
    const [newTraining, setNewTraining] = useState({
        "animalId": animalId,
        "dateEnd": null,
        "dateStart": null,
        "description": "",
        "userId": null
    })
    const [trainerData, setTrainerData] = useState([])
    const [selectedTrainer, setSelectedTrainer] = useState({});


    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/user/getAllTrainers`, { headers: authHeader() })
            .then(response => setTrainerData(response.data.data))
            .catch(error => console.error(error));
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTraining({
            ...newTraining,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedTrainer(event.value);
        setNewTraining({
            ...newTraining,
            userId: event.target.value.userId
        });
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            console.log(value);

            setNewTraining({ ...newTraining, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;

            // Use the formatted date value in the state
            setNewTraining({ ...newTraining, [name]: dateValue });
        }
    };

    const handleAddTraining = async () => {
        await axios
            .post("http://localhost:8080/zoo-server/api/v1/animal-management/createAnimalManagement", newTraining, { headers: authHeader() })
            .then((response) => {
                show(response.data.message, 'green');
                setTimeout(handleClose, 2000);

            })
            .catch((error) => {
                if (newTraining.userId === null) {
                    show("Please, choose trainer", 'red');
                }
                else if (newTraining.dateStart === null) {
                    show("Please, choose date start", 'red');
                }
                else {
                    show(error.response.data.message, 'red');
                }
                // show(error.response.data.message, 'red');
            });
    }

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
                header="Add Training"
                visible={isModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => handleClose()}
            >
                <Toast ref={toast} />
                <div class="formgrid grid">

                    <div className="field col-12">
                        <label htmlFor="updateCatalogue">Trainer</label>
                        <br />
                        <Dropdown
                            value={selectedTrainer}
                            onChange={handleSelectedChange}
                            options={trainerData}
                            name='userId'
                            optionLabel='fullName'
                            placeholder="Select a Trainer"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
                            className='w-full'
                            name="dateStart"
                            value={newTraining.dateStart}
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
                            value={newTraining.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="description">Description</label>
                        <br />
                        <InputTextarea
                            id="description"
                            className='w-full min-h-full'
                            name="description"
                            value={newTraining.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        className="p-button-primary mt-5 "
                        label="Add training"
                        icon="pi pi-pencil"
                        onClick={handleAddTraining}
                    />
                </div>
            </Dialog >
        </div >
    )
}
