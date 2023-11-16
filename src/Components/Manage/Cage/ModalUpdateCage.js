import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import axios from 'axios'
import authHeader from '../../AuthHeader/AuthHeader'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'

export default function ModalUpdateCage(data, isModalOpen, handleClose) {
    const [areas, setAreas] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedArea, setSelectedArea] = useState(data.areaName);
    const [updateCage, setUpdateCage] = useState([]);
    const cage = {
        cageId: data.animalCageId,
        animalCageName: data.animalCageName,
        areaId: data.areaId,
        areaName: data.areaName,
        maxQuantity: data.maxQuantity,
        description: data.description,
    }

    useEffect(() => {
        axios
            .get('http://localhost:8080/zoo-server/api/v1/area/getAllAreas', { headers: authHeader() })
            .then((response) => {
                setAreas(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [refresh]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateCage({
            ...updateCage,
            [name]: value
        });
        console.log(updateCage);
    };

    const handleSelectedChange = (event) => {
        setSelectedArea(event.value);
        setUpdateCage({
            ...updateCage,
            areaId: event.target.value.areaId
        });
    }

    const handleUpdateCage = () => {
        var requestData = {
            animalCageName: updateCage.animalCageName ? updateCage.animalCageName : data.animalCageName,
            areaId: updateCage.areaId ? updateCage.areaId : data.areaId,
            maxQuantity: updateCage.maxQuantity ? updateCage.maxQuantity : data.maxQuantity,
            description: updateCage.description ? updateCage.description : data.description
        }
        axios
            .put(`http://localhost:8080/zoo-server/api/v1/animalCage/updateAnimalCage/${cage.cageId}`, requestData, { headers: authHeader() })
            .then(() => {
                handleClose();
                setRefresh(true)
            })
            .catch((error) => {
                show(error.response.data.message, 'red');
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
                <Toast ref={toast} />
                <div className="field col-12 ">
                    <label htmlFor="updateDietName">Cage Name</label>
                    <br />
                    <InputText
                        id="animalCageName"
                        className='w-full'
                        name="animalCageName"
                        value={updateCage.animalCageName ? updateCage.animalCageName : cage.animalCageName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="field col-12 ">
                    <label htmlFor="cageName">Area</label>
                    <br />
                    <Dropdown
                        value={selectedArea ? selectedArea : cage.areaName}
                        onChange={handleSelectedChange}
                        options={areas}
                        name='areaId'
                        optionLabel='areaName'
                        placeholder="Select an Area"
                    />
                </div>

                <div className="field col-12 ">
                    <label htmlFor="maxQuantity">Max Quantity</label>
                    <br />
                    <InputText
                        id="maxQuantity"
                        className='w-full'
                        name="maxQuantity"
                        keyfilter="int"
                        value={updateCage.maxQuantity ? updateCage.maxQuantity : cage.maxQuantity}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="field col-12 ">
                    <label htmlFor="description">Description</label>
                    <br />
                    <InputTextarea
                        id="description"
                        className='w-full min-h-full'
                        name="description"
                        value={updateCage.description ? updateCage.description : cage.description}
                        onChange={handleInputChange}
                    />
                </div>

                <Button
                    label="Update Diet"
                    icon="pi pi-pencil"
                    onClick={handleUpdateCage}
                    className="p-button-primary mt-5"
                />
            </Dialog>
        </div >
    )
}
