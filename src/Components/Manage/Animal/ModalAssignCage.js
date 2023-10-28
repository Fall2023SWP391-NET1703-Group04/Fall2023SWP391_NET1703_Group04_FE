import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Calendar } from 'primereact/calendar'
import { InputTextarea } from 'primereact/inputtextarea';
import { useRef } from 'react'
import { Toast } from 'primereact/toast'

export default function ModalAssignCage(animalId, isModalOpen, handleClose) {
    const [cageData, setCageData] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [selectedCage, setSelectedCage] = useState({});
    const toast = useRef(null);
    const [newCage, setNewCage] = useState({
        "animalCageDetailName": "",
        "animalCageId": 0,
        "animalId": animalId,
        "dateEnd": "",
        "dateStart": ""
    })

    useEffect(() => {
        axios.get(`http://localhost:8080/zoo-server/api/v1/animalCage/getAllAnimalCage`, { headers: authHeader() })
            .then(response => setCageData(response.data.data))
            .catch(error => console.error(error));
    }, [refresh]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewCage({
            ...newCage,
            [name]: value
        });
    }

    const handleSelectedChange = (event) => {
        setSelectedCage(event.value);
        setNewCage({
            ...newCage,
            animalCageId: event.target.value.animalCageId
        });
    }

    const handleUpdateInputChange = (event, name) => {
        if (name !== 'dateStart' && name !== 'dateEnd') {
            const { name, value } = event.target;
            console.log(value);

            setNewCage({ ...newCage, [name]: value });
        } else {
            // Convert the selected date to a valid Date object or null
            const dateValue = event ? new Date(event) : null;

            // Use the formatted date value in the state
            setNewCage({ ...newCage, [name]: dateValue });
        }
    };

    const handleAddCage = () => {
        axios
            .post("http://localhost:8080/zoo-server/api/v1/AnimalCageDetail/createNewAnimalCageDetail", newCage, { headers: authHeader() })
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
                header="Add Cage For Animal"
                visible={isModalOpen}
                style={{ width: '800px' }}
                modal
                onHide={() => handleClose()}
            >
                <Toast ref={toast} />
                <div className="formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="animalDietManagementName">Cage</label>
                        <br />
                        <Dropdown
                            value={selectedCage}
                            onChange={handleSelectedChange}
                            options={cageData}
                            name='dietId'
                            optionLabel='animalCageName'
                            placeholder="Select a Cage"
                        />
                    </div>
                    <div className="field col-12">
                        <label htmlFor="dateStart">Date Start</label>
                        <br />
                        <Calendar
                            id="dateStart"
                            className='w-full'
                            name="dateStart"
                            value={newCage.dateStart}
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
                            value={newCage.dateEnd}
                            onChange={(e) => handleUpdateInputChange(e.value, "dateEnd")}
                        />
                    </div>
                    <div className="field col-12 ">
                        <label htmlFor="animalCageDetailName">Description</label>
                        <br />
                        <InputTextarea
                            id="animalCageDetailName"
                            className='w-full min-h-full'
                            name="animalCageDetailName"
                            value={newCage.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        label="Add Diet"
                        icon="pi pi-pencil"
                        onClick={handleAddCage}
                        className="p-button-primary mt-5 "
                    />
                </div>
            </Dialog >
        </div >
    )
}
